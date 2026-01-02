/*** Light/Dark Mode Toggle */
document.addEventListener("DOMContentLoaded", () => {
  const toggleInput = document.querySelector(".theme-toggle input");
  const userTheme = localStorage.getItem("theme");

  const setTheme = (isLight) => {
    document.documentElement.classList.toggle("dark", !isLight);
    toggleInput.checked = isLight;
  };

  setTheme(userTheme === "light");

  toggleInput.addEventListener("change", () => {
    const isLight = toggleInput.checked;
    setTheme(isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
});

/*** Smooth Scrolling from Header */
document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.querySelector('.scroll-start');
    const endTarget = document.querySelector('.scroll-end');

    if (startButton && endTarget) {
        startButton.addEventListener('click', function (e) {
            e.preventDefault();
            const offset = 100;
            const top = endTarget.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
            history.replaceState(null, null, ' ');
        });
    }
});

/*** Scroll to Top on Page Reload */
window.addEventListener("beforeunload", function () {
    window.scrollTo(0, 0);
});

window.addEventListener("load", function () {
    setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 0);
});
 
/*** Hamburger Menu Toggle with Inert */
document.addEventListener("DOMContentLoaded", function () {
  const burgerIcon = document.querySelector('.jq--nav-icon');
  const navItems = document.querySelectorAll('.first');
  const navBackground = document.querySelector('.mobile-nav-back');
  const nav = document.querySelector('nav');

  if (!burgerIcon) return;

  burgerIcon.addEventListener('click', function (e) {
    e.preventDefault();
    const currentSrc = burgerIcon.getAttribute('src');
    const isBurger = currentSrc.includes('burger-barw.png');
    burgerIcon.setAttribute('src', isBurger ? 'img/closew.png' : 'img/burger-barw.png');

    if (nav) {
      nav.classList.toggle('menu-open');
    }

    navItems.forEach(el => {
      el.style.transition = 'opacity 0.5s';
      const isVisible = el.style.opacity === '1';
      el.style.opacity = isVisible ? '0' : '1';
      el.style.display = isVisible ? 'none' : 'block';
      
      if (isVisible) {
        setTimeout(() => el.setAttribute('inert', ''), 500);
      } else {
        el.removeAttribute('inert');
      }
    });

    if (navBackground) {
      navBackground.style.transition = 'opacity 0.5s';
      const isVisible = navBackground.style.display === 'block';
      navBackground.style.opacity = isVisible ? '0' : '1';
      navBackground.style.display = isVisible ? 'none' : 'block';
    }
  });
});

/*** Cookie Banner */
document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem("cookiesAccepted")) {
        document.getElementById("cookie-banner").style.display = "flex";
    }
    document.getElementById("accept-cookies").addEventListener("click", function() {
        localStorage.setItem("cookiesAccepted", "true");
        document.getElementById("cookie-banner").style.display = "none";
    });
});

/*** Parallax Effect */
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motionQuery.matches) {
  window.addEventListener("scroll", function () {
    const parallaxElements = document.querySelectorAll(".parallax");
    const offset = window.pageYOffset;
    parallaxElements.forEach((parallaxImage) => {
      parallaxImage.style.transform = `translateY(${offset * -0.017}px)`;
    });
  });
}

/*** Gallery Display - Vanilla JS fade-in animations */
document.addEventListener('DOMContentLoaded', function() {
  document.body.classList.remove('lb-disable-scrolling');

  const fadeIn = (element, duration) => {
    if (!element) return;
    element.style.opacity = '0';
    element.style.display = 'block';
    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      element.style.opacity = Math.min(progress / duration, 1);
      if (progress < duration) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  const sliderWrapper = document.querySelector('.slider-wrapper');
  const album = document.querySelector('.album');
  const iframe = document.querySelector('iframe');
  
  if (sliderWrapper) fadeIn(sliderWrapper, 3000);
  if (album) fadeIn(album, 4000);
  if (iframe) fadeIn(iframe, 4000);
});

/*** Gallery Swipe Gestures */
document.addEventListener("DOMContentLoaded", function () {
    let touchstartX = 0;
    let touchendX = 0;
  
    document.body.addEventListener('touchstart', function (e) {
      if (!document.querySelector('.lightbox')) return;
      touchstartX = e.changedTouches[0].screenX;
    });
  
    document.body.addEventListener('touchend', function (e) {
      if (!document.querySelector('.lightbox')) return;
      touchendX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    });
  
    function handleSwipeGesture() {
      if (touchendX < touchstartX - 40) {
        document.querySelector('.lb-next')?.click();
      }
      if (touchendX > touchstartX + 40) {
        document.querySelector('.lb-prev')?.click();
      }
    }
});

/*** Gallery Resize on Device Rotation */
window.addEventListener("resize", function () {
    if (window.lightbox && typeof window.lightbox.sizeOverlay === "function") {
      window.lightbox.sizeOverlay();
    }
});

/**
 * Vanilla JS Lightbox - Complete Version with Proper Focus Management
 */
(function() {
    'use strict';

    class Lightbox {
        constructor(options = {}) {
            this.options = {
                albumLabel: 'Image %1 of %2',
                fadeDuration: 600,
                imageFadeDuration: 600,
                resizeDuration: 700,
                showImageNumberLabel: true,
                wrapAround: true,
                disableScrolling: false,
                positionFromTop: 50,
                ...options
            };

            this.album = [];
            this.currentImageIndex = null;
            this.isLoading = false;
            this.keyboardHandler = null;
            this.resizeHandler = null;
            this.focusTrapHandler = null;
            this.$pageContent = null;
            this.init();
        }

        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.build();
                    this.enable();
                });
            } else {
                this.build();
                this.enable();
            }
        }

        enable() {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[data-lightbox], area[data-lightbox]');
                if (link) {
                    e.preventDefault();
                    this.start(link);
                }
            });
        }

        build() {
            if (document.getElementById('lightbox')) return;

            const html = `
                <div id="lightboxOverlay" tabindex="-1" class="lightboxOverlay"></div>
                <div id="lightbox" tabindex="-1" class="lightbox">
                    <div class="lb-outerContainer">
                        <div class="lb-container">
                            <img class="lb-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt=""/>
                            <div class="lb-nav">
                                <a class="lb-prev" role="button" tabindex="0" aria-label="Previous image" href="#"></a>
                                <a class="lb-next" role="button" tabindex="0" aria-label="Next image" href="#"></a>
                            </div>
                            <div class="lb-loader">
                                <a class="lb-cancel" role="button" tabindex="0" aria-label="Zrušit načítání"></a>
                            </div>
                        </div>
                    </div>
                    <div class="lb-dataContainer">
                        <div class="lb-data">
                            <div class="lb-details">
                                <span class="lb-caption"></span>
                                <span class="lb-number"></span>
                            </div>
                            <div class="lb-closeContainer">
                                <a class="lb-close" role="button" tabindex="0" aria-label="Zavřít lightbox"></a>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', html);

            this.$lightbox = document.getElementById('lightbox');
            this.$overlay = document.getElementById('lightboxOverlay');
            this.$outerContainer = this.$lightbox.querySelector('.lb-outerContainer');
            this.$container = this.$lightbox.querySelector('.lb-container');
            this.$image = this.$lightbox.querySelector('.lb-image');
            this.$nav = this.$lightbox.querySelector('.lb-nav');
            this.$loader = this.$lightbox.querySelector('.lb-loader');
            this.$caption = this.$lightbox.querySelector('.lb-caption');
            this.$number = this.$lightbox.querySelector('.lb-number');
            this.$dataContainer = this.$lightbox.querySelector('.lb-dataContainer');

            const containerStyle = getComputedStyle(this.$container);
            this.containerPadding = {
                top: parseInt(containerStyle.paddingTop, 10) || 0,
                right: parseInt(containerStyle.paddingRight, 10) || 0,
                bottom: parseInt(containerStyle.paddingBottom, 10) || 0,
                left: parseInt(containerStyle.paddingLeft, 10) || 0
            };

            const imageStyle = getComputedStyle(this.$image);
            this.imageBorderWidth = {
                top: parseInt(imageStyle.borderTopWidth, 10) || 0,
                right: parseInt(imageStyle.borderRightWidth, 10) || 0,
                bottom: parseInt(imageStyle.borderBottomWidth, 10) || 0,
                left: parseInt(imageStyle.borderLeftWidth, 10) || 0
            };

            this.bindEvents();
        }

        bindEvents() {
            this.$overlay.addEventListener('click', () => this.end());

            this.$lightbox.addEventListener('click', (e) => {
                if (e.target.id === 'lightbox') this.end();
            });

            const closeBtn = this.$lightbox.querySelector('.lb-close');
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.end();
            });

            closeBtn.addEventListener('keyup', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.end();
                }
            });

            const prevBtn = this.$lightbox.querySelector('.lb-prev');
            const nextBtn = this.$lightbox.querySelector('.lb-next');

            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.currentImageIndex !== 0) {
                    this.changeImage(this.currentImageIndex - 1);
                } else if (this.options.wrapAround && this.album.length > 1) {
                    this.changeImage(this.album.length - 1);
                }
            });

            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.currentImageIndex !== this.album.length - 1) {
                    this.changeImage(this.currentImageIndex + 1);
                } else if (this.options.wrapAround && this.album.length > 1) {
                    this.changeImage(0);
                }
            });

            const cancelBtn = this.$loader.querySelector('.lb-cancel');
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.end();
            });

            cancelBtn.addEventListener('keyup', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.end();
                }
            });
        }

        setPageInert(inert) {
            // Najít všechny top-level elementy kromě lightboxu
            const pageElements = document.body.children;
            for (let el of pageElements) {
                if (el.id !== 'lightbox' && el.id !== 'lightboxOverlay') {
                    if (inert) {
                        el.setAttribute('inert', '');
                    } else {
                        el.removeAttribute('inert');
                    }
                }
            }
        }

        start(link) {
            console.log('Starting lightbox for:', link.getAttribute('href'));
            this.sizeOverlay();
            this.album = [];

            const dataLightboxValue = link.getAttribute('data-lightbox');
            let imageNumber = 0;

            if (dataLightboxValue) {
                const links = document.querySelectorAll(`a[data-lightbox="${dataLightboxValue}"], area[data-lightbox="${dataLightboxValue}"]`);
                links.forEach((el, index) => {
                    this.album.push({
                        link: el.getAttribute('href'),
                        title: el.getAttribute('data-title') || el.getAttribute('title') || '',
                        alt: el.getAttribute('data-alt') || ''
                    });
                    if (el === link) imageNumber = index;
                });
            } else {
                this.album.push({
                    link: link.getAttribute('href'),
                    title: link.getAttribute('data-title') || link.getAttribute('title') || '',
                    alt: link.getAttribute('data-alt') || ''
                });
            }

            console.log('Album:', this.album);
            console.log('Starting image number:', imageNumber);

            this.$lightbox.style.top = this.options.positionFromTop + 'px';
            this.$lightbox.style.left = '0';

            this.fadeIn(this.$overlay, this.options.fadeDuration);
            this.fadeIn(this.$lightbox, this.options.fadeDuration);

            if (this.options.disableScrolling) {
                document.body.classList.add('lb-disable-scrolling');
            }

            // Nastavit inert na zbytek stránky
            this.setPageInert(true);

            // Aktivovat focus trap OKAMŽITĚ
            this.enableFocusTrap();

            this.changeImage(imageNumber);
        }

        changeImage(imageNumber) {
            if (this.isLoading) {
                console.log('Already loading, skipping...');
                return;
            }
            this.isLoading = true;
            
            this.disableKeyboardNav();
            
            const imageLink = this.album[imageNumber].link;
            console.log('Loading image:', imageLink);

            // Hide elements
            this.$image.style.display = 'none';
            this.$nav.style.display = 'none';
            this.$lightbox.querySelector('.lb-prev').style.display = 'none';
            this.$lightbox.querySelector('.lb-next').style.display = 'none';
            this.$dataContainer.style.display = 'none';
            this.$number.style.display = 'none';
            this.$caption.style.display = 'none';

            this.$outerContainer.classList.add('animating');

            // Show loader explicitly
            this.$loader.style.display = 'block';
            this.$loader.style.opacity = '1';

            const preloader = new Image();
            
            const loadTimeout = setTimeout(() => {
                console.warn('Image load timeout for:', imageLink);
                this.isLoading = false;
                this.$loader.style.display = 'none';
                this.$loader.style.opacity = '0';
                this.enableKeyboardNav();
            }, 10000);
            
            preloader.onload = () => {
                clearTimeout(loadTimeout);
                console.log('Image loaded successfully:', imageLink, 'Size:', preloader.width, 'x', preloader.height);
                this.$image.src = imageLink;
                this.$image.alt = this.album[imageNumber].alt || '';
                
                this.sizeContainer(preloader.width, preloader.height);
                this.currentImageIndex = imageNumber;
                this.isLoading = false;
            };
            
            preloader.onerror = () => {
                clearTimeout(loadTimeout);
                console.error('Failed to load image:', imageLink);
                this.isLoading = false;
                this.$loader.style.display = 'none';
                this.$loader.style.opacity = '0';
                this.enableKeyboardNav();
                alert('Nepodařilo se načíst obrázek: ' + imageLink);
            };

            preloader.src = imageLink;
        }

        sizeContainer(imageWidth, imageHeight) {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            const maxImageWidth = windowWidth - this.containerPadding.left - 
                this.containerPadding.right - this.imageBorderWidth.left - 
                this.imageBorderWidth.right - 20;
            
            const maxImageHeight = windowHeight - this.containerPadding.top - 
                this.containerPadding.bottom - this.imageBorderWidth.top - 
                this.imageBorderWidth.bottom - this.options.positionFromTop - 70;

            let newWidth = imageWidth;
            let newHeight = imageHeight;

            if (imageWidth > maxImageWidth || imageHeight > maxImageHeight) {
                if ((imageWidth / maxImageWidth) > (imageHeight / maxImageHeight)) {
                    newWidth = maxImageWidth;
                    newHeight = parseInt(imageHeight / (imageWidth / newWidth), 10);
                } else {
                    newHeight = maxImageHeight;
                    newWidth = parseInt(imageWidth / (imageHeight / newHeight), 10);
                }
            }

            this.$image.style.width = newWidth + 'px';
            this.$image.style.height = newHeight + 'px';

            const containerWidth = newWidth + this.containerPadding.left + 
                this.containerPadding.right + this.imageBorderWidth.left + 
                this.imageBorderWidth.right;
            
            const containerHeight = newHeight + this.containerPadding.top + 
                this.containerPadding.bottom + this.imageBorderWidth.top + 
                this.imageBorderWidth.bottom;

            this.animate(this.$outerContainer, {
                width: containerWidth,
                height: containerHeight
            }, this.options.resizeDuration, () => {
                this.$dataContainer.style.width = containerWidth + 'px';
                this.showImage();
            });
        }

        showImage() {
            console.log('Showing image...');
            // Skrýt loader
            this.$loader.style.display = 'none';
            this.$loader.style.opacity = '0';
            
            // Zobrazit obrázek
            this.fadeIn(this.$image, this.options.imageFadeDuration);
            
            this.updateNav();
            this.updateDetails();
            this.preloadNeighboringImages();
            this.enableKeyboardNav();

            // Focus na první tlačítko
            setTimeout(() => {
                const prevBtn = this.$lightbox.querySelector('.lb-prev');
                if (prevBtn && prevBtn.style.display !== 'none') {
                    prevBtn.focus();
                } else {
                    const nextBtn = this.$lightbox.querySelector('.lb-next');
                    const closeBtn = this.$lightbox.querySelector('.lb-close');
                    if (nextBtn && nextBtn.style.display !== 'none') {
                        nextBtn.focus();
                    } else if (closeBtn) {
                        closeBtn.focus();
                    }
                }
            }, 100);
        }

        updateNav() {
            this.$nav.style.display = 'block';

            if (this.album.length > 1) {
                if (this.options.wrapAround) {
                    this.$lightbox.querySelector('.lb-prev').style.display = 'block';
                    this.$lightbox.querySelector('.lb-next').style.display = 'block';
                } else {
                    if (this.currentImageIndex > 0) {
                        this.$lightbox.querySelector('.lb-prev').style.display = 'block';
                    }
                    if (this.currentImageIndex < this.album.length - 1) {
                        this.$lightbox.querySelector('.lb-next').style.display = 'block';
                    }
                }
            }
        }

        updateDetails() {
            if (this.album[this.currentImageIndex].title !== '') {
                this.$caption.innerHTML = this.album[this.currentImageIndex].title;
                this.fadeIn(this.$caption, 'fast');
            }

            if (this.album.length > 1 && this.options.showImageNumberLabel) {
                const labelText = this.options.albumLabel
                    .replace(/%1/g, this.currentImageIndex + 1)
                    .replace(/%2/g, this.album.length);
                this.$number.textContent = labelText;
                this.fadeIn(this.$number, 'fast');
            } else {
                this.$number.style.display = 'none';
            }

            this.$outerContainer.classList.remove('animating');

            this.fadeIn(this.$dataContainer, this.options.resizeDuration, () => {
                this.sizeOverlay();
            });
        }

        preloadNeighboringImages() {
            if (this.album.length > this.currentImageIndex + 1) {
                const preloadNext = new Image();
                preloadNext.src = this.album[this.currentImageIndex + 1].link;
            }
            if (this.currentImageIndex > 0) {
                const preloadPrev = new Image();
                preloadPrev.src = this.album[this.currentImageIndex - 1].link;
            }
        }

        enableFocusTrap() {
            if (this.focusTrapHandler) return;

            this.focusTrapHandler = (e) => {
                if (e.key !== 'Tab') return;

                const focusableElements = this.$lightbox.querySelectorAll(
                    'a[href]:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );
                const visibleFocusable = Array.from(focusableElements).filter(el => {
                    return el.offsetParent !== null && el.style.display !== 'none';
                });

                if (visibleFocusable.length === 0) return;

                const firstElement = visibleFocusable[0];
                const lastElement = visibleFocusable[visibleFocusable.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            };

            document.addEventListener('keydown', this.focusTrapHandler, true);
        }

        disableFocusTrap() {
            if (this.focusTrapHandler) {
                document.removeEventListener('keydown', this.focusTrapHandler, true);
                this.focusTrapHandler = null;
            }
        }

        enableKeyboardNav() {
            if (!this.keyboardHandler) {
                this.keyboardHandler = (e) => this.keyboardAction(e);
            }
            document.addEventListener('keyup', this.keyboardHandler);
            
            if (!this.resizeHandler) {
                this.resizeHandler = () => this.sizeOverlay();
            }
            window.addEventListener('resize', this.resizeHandler);
        }

        disableKeyboardNav() {
            if (this.keyboardHandler) {
                document.removeEventListener('keyup', this.keyboardHandler);
            }
        }

        keyboardAction(e) {
            if (e.key === 'Escape') {
                e.stopPropagation();
                this.end();
            } else if (e.key === 'ArrowLeft') {
                if (this.currentImageIndex !== 0) {
                    this.changeImage(this.currentImageIndex - 1);
                } else if (this.options.wrapAround && this.album.length > 1) {
                    this.changeImage(this.album.length - 1);
                }
            } else if (e.key === 'ArrowRight') {
                if (this.currentImageIndex !== this.album.length - 1) {
                    this.changeImage(this.currentImageIndex + 1);
                } else if (this.options.wrapAround && this.album.length > 1) {
                    this.changeImage(0);
                }
            }
        }

        end() {
            this.disableKeyboardNav();
            this.disableFocusTrap();
            
            if (this.resizeHandler) {
                window.removeEventListener('resize', this.resizeHandler);
            }
            
            this.fadeOut(this.$lightbox, this.options.fadeDuration);
            this.fadeOut(this.$overlay, this.options.fadeDuration);

            if (this.options.disableScrolling) {
                document.body.classList.remove('lb-disable-scrolling');
            }

            // Odstranit inert ze stránky
            this.setPageInert(false);
        }

        sizeOverlay() {
            this.$overlay.style.width = Math.max(
                document.body.scrollWidth,
                document.documentElement.scrollWidth,
                document.body.offsetWidth,
                document.documentElement.offsetWidth,
                document.documentElement.clientWidth
            ) + 'px';
            
            this.$overlay.style.height = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight,
                document.documentElement.clientHeight
            ) + 'px';
        }

        fadeIn(element, duration, callback) {
            if (typeof duration === 'string') {
                duration = duration === 'fast' ? 200 : duration === 'slow' ? 600 : 400;
            }
            
            element.style.opacity = '0';
            element.style.display = 'block';
            
            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const opacity = Math.min(progress / duration, 1);
                
                element.style.opacity = opacity;
                
                if (progress < duration) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.opacity = '1';
                    if (callback) callback();
                }
            };
            
            requestAnimationFrame(animate);
        }

        fadeOut(element, duration) {
            if (typeof duration === 'string') {
                duration = duration === 'fast' ? 200 : duration === 'slow' ? 600 : 400;
            }
            duration = duration || 400;
            
            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const opacity = Math.max(1 - (progress / duration), 0);
                
                element.style.opacity = opacity;
                
                if (progress < duration) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.opacity = '0';
                    element.style.display = 'none';
                }
            };
            
            requestAnimationFrame(animate);
        }

        animate(element, properties, duration, callback) {
            const start = {};
            const end = {};
            
            for (let prop in properties) {
                const currentValue = parseInt(getComputedStyle(element)[prop], 10) || 0;
                start[prop] = currentValue;
                end[prop] = properties[prop];
            }
            
            let startTime = null;
            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                const percent = Math.min(progress / duration, 1);
                
                const eased = 0.5 - Math.cos(percent * Math.PI) / 2;
                
                for (let prop in properties) {
                    const value = start[prop] + (end[prop] - start[prop]) * eased;
                    element.style[prop] = value + 'px';
                }
                
                if (progress < duration) {
                    requestAnimationFrame(step);
                } else {
                    for (let prop in properties) {
                        element.style[prop] = end[prop] + 'px';
                    }
                    if (callback) callback();
                }
            };
            
            requestAnimationFrame(step);
        }
    }

    window.lightbox = new Lightbox();

})();
