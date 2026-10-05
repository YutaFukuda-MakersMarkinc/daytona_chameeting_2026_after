// Add target and rel to external links
const domain = document.domain;
const regexp = new RegExp(domain);
const links = document.getElementsByTagName('a');
for (let link of links) {
    if (!regexp.test(link.href)) {
        if (link.href.match(/^https:\/\//) || link.href.match(/^http:\/\//)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener');
        }
    } else if (link.href.match(/\.pdf/)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener');
    }
}

// Open global menu
//    const menuBtn = document.getElementById('js-menu-toggle');
const gnav = document.getElementById('js-global-menu');
const body = document.querySelector('body');
const menuBack = document.querySelector('.l-header__menu_back');

let scrollValue;

//    menuBtn.addEventListener('click', () => {
//        menuBtn.classList.toggle('open');
//        gnav.classList.toggle('open');
//        body.classList.toggle('open');
//        menuBack.classList.toggle('open');
//        if (body.classList.contains('open')) {
//            scrollValue = window.pageYOffset;
//            body.style.top = -scrollValue + 'px';
//        } else {
//            body.style.removeProperty('top');
//            window.scrollTo(0, scrollValue);
//        }
//    });

// Internal link
const menus = document.querySelectorAll('.global__menu > ul > li > a');

menus.forEach(menu => {
    menu.addEventListener('click', () => {

        if (body.classList.contains('open')) {

            // open関連を全部外す
            // menuBtn.classList.remove('open');
            body.classList.remove('open');
            gnav.classList.remove('open');
            menuBack.classList.remove('open');

            // スクロール固定解除
            body.style.removeProperty('top');
            window.scrollTo(0, scrollValue);

        }

    });
});

// Close menu when clicking on menu back
menuBack.addEventListener('click', () => {
    if (body.classList.contains('open')) {
        //menuBtn.classList.remove('open');
        body.classList.remove('open');
        gnav.classList.remove('open');
        menuBack.classList.remove('open');

        body.style.removeProperty('top');
        window.scrollTo(0, scrollValue);
    }
});

window.addEventListener('resize', () => {

    // PC幅になったら強制的に閉じる
    if (window.innerWidth >= 869) {

        //menuBtn.classList.remove('open');
        body.classList.remove('open');
        gnav.classList.remove('open');
        menuBack.classList.remove('open');

        body.style.removeProperty('top');

        if (scrollValue !== undefined) {
            window.scrollTo(0, scrollValue);
        }

    }

});


// Adjust link position
window.onload = () => {
    if (window.location.hash == "") {
        return;
    }
    document.getElementById(window.location.hash.slice(1)).scrollIntoView(true);
}




document.addEventListener("DOMContentLoaded", () => {
  const picts = document.querySelectorAll(".pict");

  const timers = new Map();

  const startAnimation = (pict) => {
    const images = pict.querySelectorAll("img");
    if (images.length < 2) return;
    if (timers.has(pict)) return;

    let currentIndex = 0;

    images.forEach((image) => image.classList.remove("is-active"));
    images[currentIndex].classList.add("is-active");

    const interval = Number(pict.dataset.interval) || 700;

    const timerId = setInterval(() => {
      images[currentIndex].classList.remove("is-active");

      currentIndex = (currentIndex + 1) % images.length;

      images[currentIndex].classList.add("is-active");
    }, interval);

    timers.set(pict, timerId);
  };

  const stopAnimation = (pict) => {
    const timerId = timers.get(pict);

    if (!timerId) return;

    clearInterval(timerId);
    timers.delete(pict);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const pict = entry.target;

      if (entry.isIntersecting) {
        startAnimation(pict);
      } else {
        stopAnimation(pict);
      }
    });
  }, {
    threshold: 0.1
  });

  picts.forEach((pict) => {
    observer.observe(pict);
  });
});


/* ハンバーガーメニュー動作 */
const menuToggle = document.querySelector('#js-menu-toggle');
const globalMenu = document.querySelector('#js-global-menu');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  globalMenu.classList.toggle('open');
});

// メニュー内のリンクをクリックしたら閉じる
globalMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('open');
    globalMenu.classList.remove('open');
  });
});
