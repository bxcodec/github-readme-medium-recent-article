import axios from 'axios';
import moment from 'moment';

export const getArticle = async (index, username) => {
  
  const rssUrl =  new String("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/").concat(username);
  const {
    data: { items },
  } = await axios.get(rssUrl);

  let  fixItem: any[] = []

  items.forEach(element => {
  const { thumbnail } = element
    if (thumbnail.includes("cdn")) {
        fixItem.push(element)
    }
  });
 
  const { title, pubDate, link: url, thumbnail, description } = fixItem[
    // @ts-ignore
    index || 0
  ];

  const { data: thumbnailRaw } = await axios.get(thumbnail, {
    responseType: 'arraybuffer',
  });

  const base64Img = Buffer.from(thumbnailRaw).toString('base64');
  const imgTypeArr = thumbnail.split('.');
  const imgType = imgTypeArr[imgTypeArr.length - 1];
  const convertedThumbnail = `data:image/${imgType};base64,${base64Img}`;
  return {
    title: title.length > 80 ? title.substring(0, 80) + ' ...' : title,
    thumbnail: convertedThumbnail,
    url,
    date: moment(pubDate).format('DD MMM YYYY, HH:mm'),
    description:
      description
        .replace(/<h3>.*<\/h3>|<figcaption>.*<\/figcaption>|<[^>]*>/gm, '')
        .substring(0, 60) + '...',
  };
};
