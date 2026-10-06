document.addEventListener("DOMContentLoaded", async () => {
  const galleryContainer = document.querySelector(
    ".pg-index_photogallery_slide_container"
  );

  const modal = document.querySelector("#js-photogallery-modal");
  const modalImg = document.querySelector("#js-photogallery-modal-img");
  const modalDesc = document.querySelector("#js-photogallery-modal-desc");

  const closeButton = modal?.querySelector("[data-gallery-close]");
  const prevButton = modal?.querySelector("[data-gallery-prev]");
  const nextButton = modal?.querySelector("[data-gallery-next]");

  if (!galleryContainer || !modal) return;

  let galleryData = [];
  let currentIndex = 0;
  let lastFocusedElement = null;

  // ==============================
  // JSON読み込み
  // ==============================

  try {
    const response = await fetch("./json/gallery.json");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    galleryData = await response.json();

    renderGallery();
    initGalleryReveal();
  } catch (error) {
    console.error("ギャラリーの読み込みに失敗しました。", error);
  }

  // ==============================
  // idから表示サイズを固定決定
  // ==============================

function getGallerySize(id) {
  const largeItems = [
    "gallery_02",
    "gallery_04",
    "gallery_06",
    "gallery_08",
    "gallery_14",
    "gallery_17",
    "gallery_21",
    "gallery_24",
    "gallery_27",
    "gallery_30",
    "gallery_31",
    "gallery_33",
    "gallery_35",
    "gallery_39",
    "gallery_40",
    "gallery_41",
    "gallery_44",
  ];

  const fullItems = [
    "gallery_50"
  ];

  // fullを最優先
  if (fullItems.includes(id)) {
    return "is-full";
  }

  // 次にlarge
  if (largeItems.includes(id)) {
    return "is-large";
  }

  // どちらにも該当しなければsmall
  return "is-small";
}

  //function getGallerySize(id) {
  //  let hash = 0;
  //
  //  for (let i = 0; i < id.length; i++) {
  //    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  //  }
  //
  //  /*
  //   * 約30%をlargeにする
  //   *
  //   * 20 → 約20%
  //   * 30 → 約30%
  //   * 40 → 約40%
  //   */
  //  return Math.abs(hash) % 100 < 30
  //    ? "is-large"
  //    : "is-small";
  //}

  function initGalleryReveal() {
  const items = document.querySelectorAll(
    ".pg-index_photogallery_slide_item"
  );

  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        // 一度表示したら監視解除
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.15,
      rootMargin: "0px 0px -5% 0px",
    }
  );

  items.forEach((item) => {
    observer.observe(item);
  });
}

  // ==============================
  // 一覧生成
  // ==============================

  function renderGallery() {
    const fragment = document.createDocumentFragment();

    galleryData.forEach((item, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "pg-index_photogallery_slide_item";

      // ランダムっぽく見えるが、
      // 同じidなら毎回同じサイズになる
      button.classList.add(getGallerySize(item.id));

      // 少しずつ出現タイミングをずらす
      button.style.transitionDelay = `${(index % 6) * 0.08}s`;

      button.dataset.galleryIndex = index;

      button.setAttribute(
        "aria-label",
        item.desc
          ? `${item.desc}を拡大表示`
          : `写真 ${index + 1} を拡大表示`
      );

      const img = document.createElement("img");

      img.src = item.img;
      img.alt = item.desc || "";
      img.loading = "lazy";
      img.decoding = "async";

      button.appendChild(img);

      button.addEventListener("click", () => {
        openModal(index);
      });

      fragment.appendChild(button);
    });

    galleryContainer.appendChild(fragment);
  }

  // ==============================
  // モーダルを開く
  // ==============================

  function openModal(index) {
    if (!galleryData[index]) return;

    lastFocusedElement = document.activeElement;

    currentIndex = index;

    updateModal();

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("is-gallery-open");

    closeButton?.focus();
  }

  // ==============================
  // モーダル更新
  // ==============================

  function updateModal() {
    const item = galleryData[currentIndex];

    if (!item) return;

    modalImg.src = item.img;
    modalImg.alt = item.desc || "";

    modalDesc.textContent = item.desc || "";

    // descが空なら説明欄を非表示
    if (item.desc) {
      modalDesc.hidden = false;
    } else {
      modalDesc.hidden = true;
    }
  }

  // ==============================
  // 次の写真
  // ==============================

  function showNext() {
    currentIndex++;

    if (currentIndex >= galleryData.length) {
      currentIndex = 0;
    }

    updateModal();
  }

  // ==============================
  // 前の写真
  // ==============================

  function showPrev() {
    currentIndex--;

    if (currentIndex < 0) {
      currentIndex = galleryData.length - 1;
    }

    updateModal();
  }

  // ==============================
  // モーダルを閉じる
  // ==============================

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("is-gallery-open");

    modalImg.src = "";

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  // ==============================
  // ボタン操作
  // ==============================

  closeButton?.addEventListener("click", closeModal);

  nextButton?.addEventListener("click", showNext);

  prevButton?.addEventListener("click", showPrev);

  // ==============================
  // 背景クリック
  // ==============================

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // ==============================
  // キーボード操作
  // ==============================

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) return;

    switch (event.key) {
      case "Escape":
        closeModal();
        break;

      case "ArrowRight":
        showNext();
        break;

      case "ArrowLeft":
        showPrev();
        break;
    }
  });

  // ==============================
  // スワイプ
  // ==============================

  let touchStartX = 0;
  let touchEndX = 0;

  const swipeThreshold = 50;

  modal.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  modal.addEventListener(
    "touchend",
    (event) => {
      touchEndX = event.changedTouches[0].clientX;

      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const distance = touchStartX - touchEndX;

    // 左へスワイプ → 次へ
    if (distance > swipeThreshold) {
      showNext();
    }

    // 右へスワイプ → 前へ
    if (distance < -swipeThreshold) {
      showPrev();
    }
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".pg-index_photogallery_slide");
  const list = slider?.querySelector("ul");

  if (!slider || !list) return;

  // 元の要素を複製
  const originalItems = [...list.children];

  originalItems.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");

    list.appendChild(clone);
  });

  let position = 0;
  let lastTime = performance.now();

  // 1秒間に移動するpx数
  const speed = 25;

  function animate(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // 左から右へ移動
    position += speed * deltaTime;

    /*
     * 複製前の半分の位置まで移動したら
     * 同じ見た目の位置へ戻す
     */
    const halfWidth = list.scrollWidth / 2;

    if (position >= halfWidth) {
      position -= halfWidth;
    }

    list.style.transform = `translate3d(${
      position - halfWidth
    }px, 0, 0)`;

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});