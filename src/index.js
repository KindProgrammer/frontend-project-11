import { object, string, setLocale } from 'yup';
import './scss/styles.scss'
import * as bootstrap from 'bootstrap'
import { formState } from './state.js';
import i18next from 'i18next';
import lang from "./assets/lang.json"

const feedList = [];

i18next.init({
    lng: 'en',
    debug: true,
    resources: lang
});

const schema = object().shape({
    link: string()
        .url('invalid_url')
        .test('is-unique', (d) => 'rss_already_added', (value) => !feedList.includes(value))
});

const applyRss = (event) => {
  event.preventDefault();
  const inputData = document.getElementById('rssLinkInput').value;

  schema.validate({ link: inputData })
    .then((result) => {
      formState.error = '';
      feedList.push(result.link);

      console.log(feedList);
    })
    .catch((error) => { formState.error = error.message; });

  return false;
};

const form = document.getElementById('add_rss_form');
form.addEventListener('submit', applyRss);
