import { object, string, setLocale } from 'yup';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import './scss/styles.scss'
import * as bootstrap from 'bootstrap'
import { formState } from './state.js';

import en from "./assets/lang/en.json"
import ru from "./assets/lang/ru.json"

const feedList = [];

const app = () => {
  i18next.use(LanguageDetector).init({
    supportedLngs: ['ru', 'en'],
    fallbackLng: 'en',
    debug: true,
    resources: {
      en: {
        translation: en
      },
      ru: {
        translation: ru
      }
    }
  });

  setLocale({
    string: {
      url: () => 'invalid_url'
    }
  });

  const schema = object().shape({
      link: string()
          .url()
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
}

app();