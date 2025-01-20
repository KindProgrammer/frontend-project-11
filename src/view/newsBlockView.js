import onChange from 'on-change';

const createFeedElement = (id, title, description) => {
  const feedElement = document.createElement('div');
  feedElement.id = id;
  feedElement.classList.add('container', 'py-4', 'px-3', 'mx-auto');

  feedElement.innerHTML = `
    <div class="row">
      <h4>${title}</h4>
      <p class="fw-light fst-italic">${description}</p>
      <div class="items"></div>
    </div>
  `;

  return feedElement;
};

const createFeedItemElement = (item) => {
  const itemElement = document.createElement('div');
  itemElement.id = item.guid;

  itemElement.innerHTML = `
    <a target="_blank" rel="noopener noreferrer" class="fw-bold" href="${item.link}">${item.title}</a>
    <p class="fw-lighter fst-italic">${item.description}</p>
  `;

  return itemElement;
};

const updateFeedItems = (feedItems, feedElement) => {
  // Сортируем массив новостей по возрастанию даты публикации (т.е. сначала старые)
  const compareItems = (a, b) => {
    if (a.pubDate > b.pubDate) return 1;
    if (a.pubDate < b.pubDate) return -1;
    return 0;
  };

  const sortedItems = [...feedItems].sort(compareItems);

  // И рендерим в начало родительского блока,
  // таким образом старые сползут в конец и в начале будут новые
  sortedItems.forEach((item) => {
    if (!document.getElementById(item.guid)) {
      const itemElement = createFeedItemElement(item);
      feedElement.getElementsByClassName('items')[0].prepend(itemElement);
    }
  });
};

const updateFeed = (feedUrl, feed, newsBlock) => {
  let feedElement = document.getElementById(feedUrl);
  if (!feedElement) {
    feedElement = createFeedElement(feedUrl, feed.title, feed.description);
    newsBlock.appendChild(feedElement);
  }

  updateFeedItems(feed.items, feedElement);
};

export const initializeNewsBlock = (newsBlock) => {
  const initialState = {};

  return onChange(initialState, (path, value) => {
    if (path.endsWith('items')) {
      const feedUrl = path.replace('.items', '');
      const feedElement = document.getElementById(feedUrl);

      updateFeedItems(value, feedElement);
    } else {
      updateFeed(path, value, newsBlock);
    }
  });
};
