"use strict";

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
//ヘッダー：スクロール時の処理
document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.l-header');
  var menu = document.querySelector('.global__menu');
  var hmbg = document.querySelector('.hamburger__menu');
  if (!header) return;
  var toggleHeaderScrollClass = function toggleHeaderScrollClass() {
    if (window.scrollY > 0) {
      header.classList.add('is-scroll');
      menu.classList.add('is-scroll');
      hmbg.classList.add('is-scroll');
    } else {
      header.classList.remove('is-scroll');
      menu.classList.remove('is-scroll');
      hmbg.classList.remove('is-scroll');
    }
  };
  window.addEventListener('scroll', toggleHeaderScrollClass);
  toggleHeaderScrollClass();
});

// モーダル
document.addEventListener('DOMContentLoaded', function () {
  var modal = document.querySelector('.l-modal');
  if (!modal) return;
  var sessionKey = 'modalClosed';

  // このセッションでまだ閉じていなければ表示
  if (!sessionStorage.getItem(sessionKey)) {
    modal.classList.add('is-open');
    document.body.classList.add('open');
  }

  // 背景・閉じるボタン
  modal.querySelectorAll('.back, .c-button__close').forEach(function (button) {
    button.addEventListener('click', closeModal);
  });
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('open');

    // 閉じたタイミングで記録
    sessionStorage.setItem(sessionKey, 'true');

    // モーダルが閉じたことを通知
    document.dispatchEvent(new Event('modalClosed'));
  }
});
document.addEventListener("DOMContentLoaded", function () {
  var svg = document.querySelector("#headline\\.svg");
  if (!svg) return;
  var images = Array.from(svg.querySelectorAll("#back image, #front image"));
  if (!images.length) return;
  var shuffledImages = images.map(function (image) {
    return {
      image: image,
      random: Math.random()
    };
  }).sort(function (a, b) {
    return a.random - b.random;
  }).map(function (_ref) {
    var image = _ref.image;
    return image;
  });
  shuffledImages.forEach(function (image, index) {
    image.style.opacity = "0";
    image.style.transformBox = "fill-box";
    image.style.transformOrigin = "center";
    image.style.transform = "scale(0.9)";
    image.style.transition = "\n      opacity 0.9s ease ".concat(index * 0.07, "s,\n      transform 0.9s ease ").concat(index * 0.07, "s\n    ");
  });
  var showImages = function showImages() {
    shuffledImages.forEach(function (image) {
      image.style.opacity = "1";
      image.style.transform = "scale(1)";
    });
  };
  var observer;
  var startObserver = function startObserver() {
    if (observer) return; // 二重登録防止

    observer = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      if (!entry.isIntersecting) return;
      showImages();
      observer.disconnect();
    }, {
      threshold: 0.2
    });
    observer.observe(svg);
  };
  var modal = document.querySelector(".l-modal");

  // モーダルが表示されていないならすぐ開始
  if (!modal || !modal.classList.contains("is-open")) {
    startObserver();
  }

  // モーダルを閉じたら開始
  if (modal) {
    var closeButtons = modal.querySelectorAll(".back, .c-button__close");
    closeButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        startObserver();
      });
    });
  }
});

//吹き出しの文字が一文字づつ表示される演出
document.addEventListener("DOMContentLoaded", function () {
  var textElements = document.querySelectorAll(".pict_item p");
  textElements.forEach(function (textElement) {
    var text = textElement.textContent;
    textElement.textContent = "";
    _toConsumableArray(text).forEach(function (char) {
      var span = document.createElement("span");
      span.className = "char";
      span.textContent = char === " " ? "\xA0" : char;
      textElement.appendChild(span);
    });
  });
  var typeTextLoop = function typeTextLoop(textElement) {
    var chars = textElement.querySelectorAll(".char");
    var type = function type() {
      var delay = 0;
      textElement.classList.add("is-typing");
      chars.forEach(function (char, index) {
        delay += 35 + Math.random() * 70;
        setTimeout(function () {
          char.classList.add("is-show");
          if (index === chars.length - 1) {
            setTimeout(function () {
              chars.forEach(function (char) {
                char.classList.remove("is-show");
              });
              type();
            }, 1600);
          }
        }, delay);
      });
    };
    type();
  };
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      typeTextLoop(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.3
  });
  textElements.forEach(function (textElement) {
    observer.observe(textElement);
  });
});

// 導入文を一行づつ表示
document.addEventListener("DOMContentLoaded", function () {
  var textBlocks = document.querySelectorAll(".text p");
  textBlocks.forEach(function (textBlock) {
    var nodes = Array.from(textBlock.childNodes);
    var lines = [];
    var currentLine = [];
    nodes.forEach(function (node) {
      if (node.nodeName === "BR") {
        lines.push(currentLine);
        currentLine = [];
      } else {
        currentLine.push(node);
      }
    });
    if (currentLine.length) {
      lines.push(currentLine);
    }
    textBlock.textContent = "";
    lines.forEach(function (lineNodes) {
      var line = document.createElement("span");
      line.className = "line";
      lineNodes.forEach(function (node) {
        line.appendChild(node);
      });
      textBlock.appendChild(line);
    });
  });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var lines = entry.target.querySelectorAll(".line");
      lines.forEach(function (line, index) {
        setTimeout(function () {
          line.classList.add("is-show");
        }, index * 220);
      });
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.3
  });
  textBlocks.forEach(function (textBlock) {
    observer.observe(textBlock);
  });
});

//ステージイベントのMC二人がふわっと表示される。
document.addEventListener("DOMContentLoaded", function () {
  var stageItems = document.querySelectorAll(".pg-index__stage .stage_item");
  if (!stageItems.length) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      stageItems.forEach(function (item, index) {
        setTimeout(function () {
          item.classList.add("is-show");
        }, index * 260);
      });
      observer.disconnect();
    });
  }, {
    threshold: 0.3
  });
  observer.observe(document.querySelector(".pg-index__stage .col2"));
});