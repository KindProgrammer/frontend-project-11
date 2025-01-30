import { object, string } from 'yup';

const getValidation = (alreadyAddedRss) => object().shape({
  link: string()
    .url('error.invalid_url')
    .test('is-unique', () => 'error.rss_already_added', (value) => !alreadyAddedRss[value]),
});

export default getValidation;
