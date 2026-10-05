//ヘッダー：スクロール時の処理
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.l-header');
  const menu = document.querySelector('.global__menu');
  const hmbg = document.querySelector('.hamburger__menu');

  if (!header) return;

  const toggleHeaderScrollClass = () => {
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
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.l-modal');

    if (!modal) return;

    const sessionKey = 'modalClosed';

    // このセッションでまだ閉じていなければ表示
    if (!sessionStorage.getItem(sessionKey)) {
        modal.classList.add('is-open');
        document.body.classList.add('open');
    }

    // 背景・閉じるボタン
    modal.querySelectorAll('.back, .c-button__close').forEach((button) => {
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

document.addEventListener("DOMContentLoaded", () => {
  const svg = document.querySelector("#headline\\.svg");
  if (!svg) return;

  const images = Array.from(svg.querySelectorAll("#back image, #front image"));
  if (!images.length) return;

  const shuffledImages = images
    .map((image) => ({ image, random: Math.random() }))
    .sort((a, b) => a.random - b.random)
    .map(({ image }) => image);

  shuffledImages.forEach((image, index) => {
    image.style.opacity = "0";
    image.style.transformBox = "fill-box";
    image.style.transformOrigin = "center";
    image.style.transform = "scale(0.9)";
    image.style.transition = `
      opacity 0.9s ease ${index * 0.07}s,
      transform 0.9s ease ${index * 0.07}s
    `;
  });

  const showImages = () => {
    shuffledImages.forEach((image) => {
      image.style.opacity = "1";
      image.style.transform = "scale(1)";
    });
  };

  let observer;

  const startObserver = () => {
    if (observer) return; // 二重登録防止

    observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (!entry.isIntersecting) return;

      showImages();
      observer.disconnect();
    }, {
      threshold: 0.2
    });

    observer.observe(svg);
  };

  const modal = document.querySelector(".l-modal");

  // モーダルが表示されていないならすぐ開始
  if (!modal || !modal.classList.contains("is-open")) {
    startObserver();
  }

  // モーダルを閉じたら開始
  if (modal) {
    const closeButtons = modal.querySelectorAll(".back, .c-button__close");

    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        startObserver();
      });
    });
  }
});

//吹き出しの文字が一文字づつ表示される演出
document.addEventListener("DOMContentLoaded", () => {
  const textElements = document.querySelectorAll(".pict_item p");

  textElements.forEach((textElement) => {
    const text = textElement.textContent;
    textElement.textContent = "";

    [...text].forEach((char) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = char === " " ? "\u00A0" : char;
      textElement.appendChild(span);
    });
  });

  const typeTextLoop = (textElement) => {
    const chars = textElement.querySelectorAll(".char");

    const type = () => {
      let delay = 0;

      textElement.classList.add("is-typing");

      chars.forEach((char, index) => {
        delay += 35 + Math.random() * 70;

        setTimeout(() => {
          char.classList.add("is-show");

          if (index === chars.length - 1) {
            setTimeout(() => {
              chars.forEach((char) => {
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      typeTextLoop(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.3
  });

  textElements.forEach((textElement) => {
    observer.observe(textElement);
  });
});

// 導入文を一行づつ表示
document.addEventListener("DOMContentLoaded", () => {
  const textBlocks = document.querySelectorAll(".text p");

  textBlocks.forEach((textBlock) => {
    const nodes = Array.from(textBlock.childNodes);
    const lines = [];
    let currentLine = [];

    nodes.forEach((node) => {
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

    lines.forEach((lineNodes) => {
      const line = document.createElement("span");
      line.className = "line";

      lineNodes.forEach((node) => {
        line.appendChild(node);
      });

      textBlock.appendChild(line);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const lines = entry.target.querySelectorAll(".line");

      lines.forEach((line, index) => {
        setTimeout(() => {
          line.classList.add("is-show");
        }, index * 220);
      });

      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.3
  });

  textBlocks.forEach((textBlock) => {
    observer.observe(textBlock);
  });
});

//ステージイベントのMC二人がふわっと表示される。
document.addEventListener("DOMContentLoaded", () => {
  const stageItems = document.querySelectorAll(".pg-index__stage .stage_item");

  if (!stageItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      stageItems.forEach((item, index) => {
        setTimeout(() => {
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