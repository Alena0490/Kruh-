
  /***Přepnutí na Light/Dark mode */
  document.addEventListener("DOMContentLoaded", () => {
    const toggleInput = document.querySelector(".theme-toggle input");
    const userTheme = localStorage.getItem("theme");
  
    const setTheme = (isLight) => {
      document.documentElement.classList.toggle("dark", !isLight);
      toggleInput.checked = isLight;
    };
  
    // Výchozí: tmavý, pokud není výslovně "light"
    if (userTheme === "light") {
      setTheme(true);
    } else {
      setTheme(false);
    }
  
    toggleInput.addEventListener("change", () => {
      const isLight = toggleInput.checked;
      setTheme(isLight);
      localStorage.setItem("theme", isLight ? "light" : "dark");
    });
  });
  
/***Scrolování na stránce - z headeru */
document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.querySelector('.scroll-start');
  const endTarget = document.querySelector('.scroll-end');

  if (startButton && endTarget) {
      startButton.addEventListener('click', function (e) {
          e.preventDefault();

          const offset = 100; // o kolik pixelů níž než začátek cílového elementu
          const top = endTarget.getBoundingClientRect().top + window.scrollY - offset;

          window.scrollTo({
              top: top,
              behavior: 'smooth'
          });

          history.replaceState(null, null, ' ');
      });
  }
});

// Při opětovném načtení stránky skoč nahoru
window.addEventListener("beforeunload", function () {
  window.scrollTo(0, 0);
});

window.addEventListener("load", function () {
  setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, 0);
});

  /***Scrolování k formuláři*/
document.addEventListener('DOMContentLoaded', function () {
    const scrollLinks = document.querySelectorAll('.jq--scroll-form');
    const target = document.getElementById('contact-form');
  
    if (scrollLinks.length && target) {
      scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
          e.preventDefault();
  
          const yOffset = -90;
          const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
  
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        });
      });
    }
  });
  
  /*Scrolování k adrese*/
  document.addEventListener("DOMContentLoaded", () => {
    // Počkej pár milisekund po načtení DOM, aby byl obsah opravdu připraven
    setTimeout(() => {
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          const offset = -90; // posun kvůli fixnímu headeru
          const top = target.getBoundingClientRect().top + window.pageYOffset + offset;
  
          window.scrollTo({
            top: top,
            behavior: "smooth"
          });
        }
      }
    }, 200); // delay = klíčová část!
  });
  

/*** Change Hamburger to Cross vice versa */
document.addEventListener("DOMContentLoaded", function () {
    const burgerIcon = document.querySelector('.jq--nav-icon');
    const navItems = document.querySelectorAll('.first');
    const navBackground = document.querySelector('.mobile-nav-back');
  
    if (burgerIcon) {
      burgerIcon.addEventListener('click', function (event) {
        event.preventDefault();
  
        // Přepni obrázek
        const currentSrc = burgerIcon.getAttribute('src');
        const isBurger = currentSrc.includes('burger-barw.png');
  
        burgerIcon.setAttribute('src', isBurger ? 'img/closew.png' : 'img/burger-barw.png');
  
        // Přepnutí viditelnosti mobilního menu (fade efekt)
        navItems.forEach(el => {
          el.style.transition = 'opacity 0.5s';
          el.style.opacity = el.style.opacity === '1' ? '0' : '1';
          el.style.display = el.style.opacity === '0' ? 'none' : 'block';
        });
  
        if (navBackground) {
          navBackground.style.transition = 'opacity 0.5s';
          const isVisible = navBackground.style.display === 'block';
          navBackground.style.opacity = isVisible ? '0' : '1';
          navBackground.style.display = isVisible ? 'none' : 'block';
        }
      });
    }
  });


  /****Slider animace */
  document.addEventListener("DOMContentLoaded", () => {
    const radios = document.querySelectorAll('input[name="r"]');
    const bars = document.querySelectorAll('.bar');
    let current = [...radios].findIndex(r => r.checked);
    const total = radios.length;
    let autoplay = true;

    const updateSlider = (index) => {
      radios[index].checked = true;
      bars.forEach(bar => bar.classList.remove('active'));
      if (bars[index]) bars[index].classList.add('active');
      current = index;
    };

    // Autoplay
    let interval = setInterval(() => {
      if (!autoplay) return;
      const next = (current + 1) % total;
      updateSlider(next);
    }, 5000); // přepíná každých 5 sekund

    // Klikání na radio tlačítka (přeruší autoplay na 15s)
    radios.forEach((radio, index) => {
      radio.addEventListener("change", () => {
        updateSlider(index);
        autoplay = false;
        clearTimeout(autoResume);
        autoResume = setTimeout(() => autoplay = true, 15000); // obnoví autoplay za 15s
      });
    });

    // Spuštění na začátku
    updateSlider(current === -1 ? 0 : current);

    let autoResume; // pro odložený návrat autoplay
  });


/**Zobrazení galerie*/
  $(function() {
    $(".slider-wrapper").hide().fadeIn(3000);
});

  $(function() {
    $(".album").hide().fadeIn(4000);
});
  $(function() {
    $("iframe").hide().fadeIn(4000);
});

/***Cookies*/
document.addEventListener("DOMContentLoaded", function() {
    // Zkontrolujeme, zda uživatel už cookies přijal
    if (!localStorage.getItem("cookiesAccepted")) {
        // Zobrazíme banner, pokud ještě nejsou cookies přijaty
        document.getElementById("cookie-banner").style.display = "block";
    }

    // Přidáme posluchač události na tlačítko
    document.getElementById("accept-cookies").addEventListener("click", function() {
        // Uložíme souhlas do localStorage
        localStorage.setItem("cookiesAccepted", "true");
        // Skryjeme banner
        document.getElementById("cookie-banner").style.display = "none";
    });
});

/**Parallax*/
// Zkontroluj, jestli uživatel povolil pohyb
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!motionQuery.matches) {
  // Jen pokud není omezený pohyb, přidej efekt
  window.addEventListener("scroll", function () {
    const parallaxElements = document.querySelectorAll(".parallax");
    const offset = window.pageYOffset;

    parallaxElements.forEach((parallaxImage) => {
      parallaxImage.style.transform = `translateY(${offset * -0.017}px)`;
    });
  });
}


/*** Automatický text***/
const heading = document.querySelector(".introduction")
const text ="Získej energii, sebevědomí a sílu! Přijď si vyzkoušet kondiční cvičení na vlastní kůži!     "
let idLetter = 1
let delay = 100

function printText(){
  heading.innerText = text.slice(0,idLetter)
  idLetter++ //idLetter = idLetter + 1
  
  // spustí funkci printText se zpožděním delay
  setTimeout(printText, delay)

  if (idLetter>text.length) {
    idLetter = 1
  }
}

printText()
