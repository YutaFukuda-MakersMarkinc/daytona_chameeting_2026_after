"use strict";

var exhibitorCategories = ['local', 'bike', 'food', 'exhibition', 'exhibition02', 'media', 'youtuber'];
function createExhibitorItem(exhibitor) {
  var item = document.createElement('li');
  var imageArea = document.createElement('div');
  var image = document.createElement('img');
  var name = document.createElement('h3');
  item.id = exhibitor.id;
  imageArea.className = 'img';
  image.src = exhibitor.img;
  image.alt = exhibitor.name.replace(/<[^>]*>/g, '');
  name.innerHTML = exhibitor.name;
  if (exhibitor.url) {
    var link = document.createElement('a');
    link.href = exhibitor.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.appendChild(image);
    imageArea.appendChild(link);
  } else {
    imageArea.appendChild(image);
  }
  item.appendChild(imageArea);
  item.appendChild(name);
  return item;
}
function renderExhibitors(exhibitors) {
  exhibitorCategories.forEach(function (category) {
    var list = document.getElementById("exhibitor_".concat(category));
    if (!list) return;
    var fragment = document.createDocumentFragment();
    exhibitors.filter(function (exhibitor) {
      return exhibitor.category === category;
    }).forEach(function (exhibitor) {
      fragment.appendChild(createExhibitorItem(exhibitor));
    });
    list.innerHTML = '';
    list.appendChild(fragment);

    // 「順不同」を一覧の後に追加
    var meta = document.createElement('p');
    meta.className = 'meta';
    meta.textContent = '順不同';
    list.insertAdjacentElement('afterend', meta);
  });
}
function loadExhibitors() {
  var request = new XMLHttpRequest();
  request.open('GET', '../json/exhibitors.json');
  request.onreadystatechange = function () {
    if (request.readyState !== XMLHttpRequest.DONE) return;
    if (request.status >= 200 && request.status < 300) {
      try {
        renderExhibitors(JSON.parse(request.responseText));
      } catch (error) {
        console.error('出展者JSONの解析に失敗しました。', error);
      }
    } else {
      console.error("\u51FA\u5C55\u8005JSON\u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\uFF08".concat(request.status, "\uFF09"));
    }
  };
  request.send();
}
loadExhibitors();