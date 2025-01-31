const DOM_PARSER = new DOMParser();

const parseRss = (data) => {
  const dom = DOM_PARSER.parseFromString(data, 'text/xml');

  const parseError = dom.querySelector('parsererror');
  if (parseError) {
    throw new Error(parseError.textContent);
  }

  const rss = dom.querySelector('rss');
  const channel = rss.querySelector('channel');

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

export default parseRss;
