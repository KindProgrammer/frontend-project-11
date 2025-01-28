import axios from 'axios';

const DOM_PARSER = new DOMParser();

const parseRss = (data) => {
  const dom = DOM_PARSER.parseFromString(data, 'text/xml');

  if (dom.querySelector('parsererror')) {
    throw new Error('error.no_valid_rss');
  }

  const rss = dom.querySelector('rss');
  if (!rss) return null;

  const channel = rss.querySelector('channel');
  if (!channel) return null;

  const channelTitle = channel.querySelector('title').textContent;
  const channelDescription = channel.querySelector('description').textContent;

  const items = Array.from(channel.getElementsByTagName('item')).map((item) => {
    const itemGuid = item.querySelector('guid').textContent;
    const itemTitle = item.querySelector('title').textContent;
    const itemDescription = item.querySelector('description').textContent;
    const itemLink = item.querySelector('link').textContent;
    const pubDate = Date.parse(item.querySelector('pubDate').textContent);

    return {
      guid: itemGuid,
      title: itemTitle,
      description: itemDescription,
      link: itemLink,
      pubDate,
    };
  });

  return {
    title: channelTitle,
    description: channelDescription,
    items,
  };
};

const getRss = (url) => axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .catch((err) => {
    console.error(err);
    throw new Error('error.network_error');
  })
  .then((response) => parseRss(response.data.contents));

export default getRss;
