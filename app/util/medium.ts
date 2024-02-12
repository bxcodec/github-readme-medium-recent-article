import axios from 'axios';
import moment from 'moment';


import { JSDOM } from 'jsdom';

export const getArticle = async (index: string, username: string) => {
  const rssUrl = new String("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/").concat(username);
  const {
    data: { items },
  } = await axios.get(rssUrl);

  let fixItem: any[] = []

  // @ts-ignore
  items.forEach(element => {
    const thumbnail = extractFirstImageFromHTML(element.description)
    if (thumbnail) {
      element.thumbnail = thumbnail
      fixItem.push(element)
    }
  });

  const { title, pubDate, link: url, thumbnail, description } = fixItem[
    // @ts-ignore
    index || 0
  ];


  const responseThumbnail = await axios(thumbnail.src, { responseType: 'arraybuffer' });
  const base64Img = Buffer.from(responseThumbnail.data, 'binary').toString('base64');


  const imgTypeArr = thumbnail.src.split('.');
  const imgType = imgTypeArr[imgTypeArr.length - 1];
  console.log("IMG TYPE ", imgType)

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




// Define a type for the image data
type ImageData = {
  src: string;
  alt: string;
  caption?: string;
};

function extractFirstImageFromHTML(html: string): ImageData | null {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Select the first figure that contains an image
  const figure = document.querySelector('figure img');
  if (figure) {
    const img = figure as HTMLImageElement; // Ensure it's treated as an image element
    const figcaption = figure.parentElement ? figure.parentElement.querySelector('figcaption') : null;
    return {
      src: img.src,
      alt: img.alt || '', // Use an empty string if alt is not present 
    };
  }

  return null; // Return null if no images are found
}
