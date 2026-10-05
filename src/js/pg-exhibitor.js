const exhibitorCategories = [
    'local',
    'bike',
    'food',
    'exhibition',
    'exhibition02',
    'media',
    'youtuber'
];

function createExhibitorItem(exhibitor) {
    const item = document.createElement('li');
    const imageArea = document.createElement('div');
    const image = document.createElement('img');
    const name = document.createElement('h3');

    item.id = exhibitor.id;
    imageArea.className = 'img';
    image.src = exhibitor.img;
    image.alt = exhibitor.name.replace(/<[^>]*>/g, '');
    name.innerHTML = exhibitor.name;

    if (exhibitor.url) {
        const link = document.createElement('a');
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
    exhibitorCategories.forEach((category) => {
        const list = document.getElementById(`exhibitor_${category}`);

        if (!list) return;

        const fragment = document.createDocumentFragment();

        exhibitors
            .filter((exhibitor) => exhibitor.category === category)
            .forEach((exhibitor) => {
                fragment.appendChild(createExhibitorItem(exhibitor));
            });

        list.innerHTML = '';
        list.appendChild(fragment);

        // 「順不同」を一覧の後に追加
        const meta = document.createElement('p');
        meta.className = 'meta';
        meta.textContent = '順不同';

        list.insertAdjacentElement('afterend', meta);
    });
}

function loadExhibitors() {
    const request = new XMLHttpRequest();

    request.open('GET', '../json/exhibitors.json');
    request.onreadystatechange = () => {
        if (request.readyState !== XMLHttpRequest.DONE) return;

        if (request.status >= 200 && request.status < 300) {
            try {
                renderExhibitors(JSON.parse(request.responseText));
            } catch (error) {
                console.error('出展者JSONの解析に失敗しました。', error);
            }
        } else {
            console.error(`出展者JSONの読み込みに失敗しました。（${request.status}）`);
        }
    };
    request.send();
}

loadExhibitors();
