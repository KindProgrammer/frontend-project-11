import i18next from 'i18next';

import ru from './lang/ru.js';
import getRss from './api/getRss.js';
import view from './view/index.js';

const launchUpdatingRss = (newsState) => {
  const updateAfterDelay = (promiseChain) => {
    let newPromiseChain = promiseChain;

    setTimeout(() => {
      Object.keys(newsState).forEach((feedUrl) => {
        newPromiseChain = newPromiseChain.then(() => getRss(feedUrl).then((newFeed) => {
          const currItems = newsState[feedUrl].items;
          const newItems = newFeed.items;

          newItems.forEach((newItem) => {
            if (!currItems.some((currItem) => currItem.guid === newItem.guid)) {
              currItems.push(newItem);
            }
          });
        }))
          .catch((e) => console.error(e));
      });

      newPromiseChain.then(() => updateAfterDelay(newPromiseChain));
    }, 5000);
  };

  updateAfterDelay(Promise.resolve());
};

const app = () => {
  const initialState = {
    form: {
      message: {},
      isLoading: '',
    },
    news: {},
  };

  const selectors = {
    formId: 'add_rss_form',
    newsBlockId: 'news',
  };

  i18next.init({
    lng: 'ru',
    resources: {
      ru: {
        translation: ru,
      },
    },
  }).then(() => {
    const { news } = view(initialState, selectors);
    launchUpdatingRss(news);
  });
};

export default app;
