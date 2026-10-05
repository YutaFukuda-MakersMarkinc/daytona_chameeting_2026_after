"use strict";

function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// Add target and rel to external links
var domain = document.domain;
var regexp = new RegExp(domain);
var links = document.getElementsByTagName('a');
var _iterator = _createForOfIteratorHelper(links),
  _step;
try {
  for (_iterator.s(); !(_step = _iterator.n()).done;) {
    var link = _step.value;
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
} catch (err) {
  _iterator.e(err);
} finally {
  _iterator.f();
}
var gnav = document.getElementById('js-global-menu');
var body = document.querySelector('body');
var menuBack = document.querySelector('.l-header__menu_back');
var scrollValue;

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
var menus = document.querySelectorAll('.global__menu > ul > li > a');
menus.forEach(function (menu) {
  menu.addEventListener('click', function () {
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
menuBack.addEventListener('click', function () {
  if (body.classList.contains('open')) {
    //menuBtn.classList.remove('open');
    body.classList.remove('open');
    gnav.classList.remove('open');
    menuBack.classList.remove('open');
    body.style.removeProperty('top');
    window.scrollTo(0, scrollValue);
  }
});
window.addEventListener('resize', function () {
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
window.onload = function () {
  if (window.location.hash == "") {
    return;
  }
  document.getElementById(window.location.hash.slice(1)).scrollIntoView(true);
};
document.addEventListener("DOMContentLoaded", function () {
  var picts = document.querySelectorAll(".pict");
  var timers = new Map();
  var startAnimation = function startAnimation(pict) {
    var images = pict.querySelectorAll("img");
    if (images.length < 2) return;
    if (timers.has(pict)) return;
    var currentIndex = 0;
    images.forEach(function (image) {
      return image.classList.remove("is-active");
    });
    images[currentIndex].classList.add("is-active");
    var interval = Number(pict.dataset.interval) || 700;
    var timerId = setInterval(function () {
      images[currentIndex].classList.remove("is-active");
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add("is-active");
    }, interval);
    timers.set(pict, timerId);
  };
  var stopAnimation = function stopAnimation(pict) {
    var timerId = timers.get(pict);
    if (!timerId) return;
    clearInterval(timerId);
    timers.delete(pict);
  };
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var pict = entry.target;
      if (entry.isIntersecting) {
        startAnimation(pict);
      } else {
        stopAnimation(pict);
      }
    });
  }, {
    threshold: 0.1
  });
  picts.forEach(function (pict) {
    observer.observe(pict);
  });
});

/* ハンバーガーメニュー動作 */
var menuToggle = document.querySelector('#js-menu-toggle');
var globalMenu = document.querySelector('#js-global-menu');
menuToggle.addEventListener('click', function () {
  menuToggle.classList.toggle('open');
  globalMenu.classList.toggle('open');
});

// メニュー内のリンクをクリックしたら閉じる
globalMenu.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    menuToggle.classList.remove('open');
    globalMenu.classList.remove('open');
  });
});