
/* Change Hamburger to Cross vice versa */
$(document).ready(function () {
    $('.jq--nav-icon').click(function (event) {
        // Zabraň výchozímu chování odkazu
        event.preventDefault();

        // Zkontroluj aktuální hodnotu src atributu obrázku
        if ($('.jq--nav-icon').attr('src') === 'img/burger-barw.png') {
    $('.jq--nav-icon').attr('src', 'img/closew.png'); // Absolutní cesta
} else {
    $('.jq--nav-icon').attr('src', 'img/burger-barw.png'); // Absolutní cesta
}
        // Zobrazí/skryje mobilní pozadí a navigaci
        $('.mobile-nav-back').fadeToggle(500);
        $('.first').fadeToggle(500);
    });
});

/*Zobrazení galerie*/
  $(function() {
    $(".slider-wrapper").hide().fadeIn(3000);
});

  $(function() {
    $(".album").hide().fadeIn(4000);
});
  $(function() {
    $("iframe").hide().fadeIn(4000);
});

//FAQ
document.addEventListener("DOMContentLoaded", function() {
    const accordions = document.querySelectorAll(".accordion");

    accordions.forEach(button => {
        button.addEventListener("click", () => {
            // Přepne aktivní třídu pro vizuální efekt
            button.classList.toggle("active");

            // Najde sousední panel
            const panel = button.nextElementSibling;

            // Přepne zobrazení panelu
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    });
});


//Cookies
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

  /***Přepnutí na Light/Dark mode */
  const toggle = document.getElementById('modeToggle');
  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark');
  });
  
  

