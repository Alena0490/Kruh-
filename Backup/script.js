/*** Light/Dark Mode Toggle */
document.addEventListener("DOMContentLoaded", () => {
  const toggleInput = document.querySelector(".theme-toggle input");
  const userTheme = localStorage.getItem("theme");

  const setTheme = (isLight) => {
    document.documentElement.classList.toggle("dark", !isLight);
    toggleInput.checked = isLight;
  };

  // Default: dark mode unless explicitly set to "light"
  setTheme(userTheme === "light");

  toggleInput.addEventListener("change", () => {
    const isLight = toggleInput.checked;
    setTheme(isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
});

/*** Smooth Scrolling */
document.addEventListener('DOMContentLoaded', function () {
  // Scroll from header to target
  const scrollToTarget = (buttonSelector, targetSelector, offset) => {
    const button = document.querySelector(buttonSelector);
    const target = document.querySelector(targetSelector);

    if (button && target) {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'smooth' });
        history.replaceState(null, null, ' ');
      });
    }
  };

  // Scroll to multiple form links
  const scrollToForm = () => {
    const links = document.querySelectorAll('.jq--scroll-form');
    const target = document.getElementById('contact-form');

    if (links.length && target) {
      links.forEach(link => {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top, behavior: 'smooth' });
        });
      });
    }
  };

  // Scroll to hash on page load
  const scrollToHash = () => {
    setTimeout(() => {
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          const top = target.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }, 50);
  };

  // Initialize all scroll functions
  scrollToTarget('.scroll-start', '.scroll-end', -100);
  scrollToForm();
  scrollToHash();
});

/*** Scroll to Top on Page Reload */
window.addEventListener("beforeunload", () => {
  // If there is no hash (reloadwithout formu)
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
});

window.addEventListener("load", () => {
  // If there is no hash - scroll up
  if (!window.location.hash) {
    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }), 0);
  }
});

/*** Hamburger Menu Toggle with Inert */
document.addEventListener("DOMContentLoaded", function () {
  const burgerIcon = document.querySelector('.jq--nav-icon');
  const navItems = document.querySelectorAll('.first');
  const navBackground = document.querySelector('.mobile-nav-back');
  const nav = document.querySelector('nav'); // NOVÉ

  if (!burgerIcon) return;

  burgerIcon.addEventListener('click', function (e) {
    e.preventDefault();

    // Toggle icon image
    const currentSrc = burgerIcon.getAttribute('src');
    const isBurger = currentSrc.includes('burger-barw.png');
    burgerIcon.setAttribute('src', isBurger ? 'img/closew.png' : 'img/burger-barw.png');

    // Toggle class na nav
    if (nav) {
      nav.classList.toggle('menu-open');
    }

    // Toggle mobile menu visibility with fade effect
    navItems.forEach(el => {
      el.style.transition = 'opacity 0.5s';
      const isVisible = el.style.opacity === '1';
      
      // Toggle display and opacity
      el.style.opacity = isVisible ? '0' : '1';
      el.style.display = isVisible ? 'none' : 'block';
      
      // Toggle inert attribute
      if (isVisible) {
        // CLOSING - add inert after animation
        setTimeout(() => {
          el.setAttribute('inert', '');
        }, 500);
      } else {
        // OPENING - remove inert immediately
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

/*** Slider Animation */
document.addEventListener("DOMContentLoaded", () => {
  const radios = document.querySelectorAll('input[name="r"]');
  if (!radios.length) return; // No slider on this page

  const bars = document.querySelectorAll('.bar');
  let current = [...radios].findIndex(r => r.checked);
  if (current === -1) current = 0;
  
  const total = radios.length;
  let autoplay = true;
  let autoResume;

  const updateSlider = (index) => {
    radios[index].checked = true;
    bars.forEach(bar => bar.classList.remove('active'));
    if (bars[index]) bars[index].classList.add('active');
    current = index;
  };

  // Auto-advance slider
  setInterval(() => {
    if (!autoplay) return;
    updateSlider((current + 1) % total);
  }, 5000);

  // Manual control
  radios.forEach((radio, index) => {
    radio.addEventListener("change", () => {
      updateSlider(index);
      autoplay = false;
      clearTimeout(autoResume);
      autoResume = setTimeout(() => autoplay = true, 15000);
    });
  });

  updateSlider(current);
});

/*** Gallery Display - Vanilla JS */
document.addEventListener('DOMContentLoaded', function() {
  // Helper function for fade-in effect
  const fadeIn = (element, duration) => {
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
      }
    };
    
    requestAnimationFrame(animate);
  };

  // Fade in gallery elements
  const sliderWrapper = document.querySelector('.slider-wrapper');
  const albums = document.querySelectorAll('.album');
  const iframes = document.querySelectorAll('iframe');

  if (sliderWrapper) fadeIn(sliderWrapper, 3000);
  albums.forEach(album => fadeIn(album, 4000));
  iframes.forEach(iframe => fadeIn(iframe, 4000));
});

/*** Cookie Banner */
document.addEventListener("DOMContentLoaded", function() {
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");
  
  if (!banner || !acceptBtn) return;

  // Show banner if cookies not yet accepted
  if (!localStorage.getItem("cookiesAccepted")) {
    banner.style.display = "flex";
  }

  // Accept button handler
  acceptBtn.addEventListener("click", function() {
    localStorage.setItem("cookiesAccepted", "true");
    banner.style.display = "none";
  });
});

/*** Parallax Effect */
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!motionQuery.matches) {
  window.addEventListener("scroll", function () {
    const parallaxElements = document.querySelectorAll(".parallax");
    const offset = window.pageYOffset;

    parallaxElements.forEach((el) => {
      el.style.transform = `translateY(${offset * -0.017}px)`;
    });
  });
}

/*** Animated Typing Text */
if (window.matchMedia("(min-width: 351px)").matches) {
  const heading = document.querySelector(".introduction");
  
  if (heading) {
    const text = "Získej energii, sebevědomí a sílu! Přijď si vyzkoušet kondiční cvičení na vlastní kůži!";
    let charIndex = 0;
    const delay = 100;

    function typeText() {
      heading.innerText = text.slice(0, charIndex);
      charIndex = charIndex >= text.length ? 1 : charIndex + 1;
      setTimeout(typeText, delay);
    }

    typeText();
  }
}

/*** Email Obfuscation */
const link = document.getElementById("email-link");
const text = document.getElementById("email-text");

if (link && text) {
  const user = "najman.donap";
  const domain = "seznam.cz";
  const address = `${user}@${domain}`;

  link.href = `mailto:${address}`;
  text.textContent = "Tomáš Najman";
}
