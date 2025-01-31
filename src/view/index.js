import getRss from '../api.js';
import parseRss from '../parse.js';
import getValidation from '../validation.js';
import initializeForm from './formView.js';
import initializeNewsBlock from './newsBlockView.js';

export default (initialState, selectors) => {
  const form = document.getElementById(selectors.formId);
  const formState = initializeForm(form, initialState.form);

  const news = document.getElementById(selectors.newsBlockId);
  const newsState = initializeNewsBlock(news, initialState.news);

  const validation = getValidation(newsState);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputField = event.target[0];
    formState.isLoading = true;

    validation.validate({ link: inputField.value })
      .then((result) => getRss(result.link)
        .then((rawRss) => {
          try {
            newsState[result.link] = parseRss(rawRss);
          } catch (e) {
            console.error(e);
            throw new Error('error.no_valid_rss');
          }
        }))
      .then(() => {
        formState.message = { isError: false, textId: 'success' };
        inputField.value = '';
      })
      .catch((error) => {
        formState.message = { isError: true, textId: error.message };
      })
      .finally(() => {
        formState.isLoading = false;
      });

    return false;
  });

  return { form: formState, news: newsState };
};
