import axios from 'axios';
import moment from 'moment';
import { feedToJSON } from './feedtojson';
import { JSDOM } from 'jsdom';
import { getRandomUserAgent } from './useragent';

export const getArticle = async (index: string, username: string) => {
  const rssUrl = `https://medium.com/feed/${username}`
  const res = await feedToJSON(rssUrl);
  let fixItem: any[] = []

  // @ts-ignore
  res?.items.forEach(element => {
    const thumbnail = extractFirstImageFromHTML(element.content || element.description)
    if (thumbnail) {
      element.thumbnail = thumbnail
      fixItem.push(element)
    }
  });

  const { title, published: pubDate, link: url, thumbnail, content: content, description: desc } = fixItem[
    // @ts-ignore
    index || 0
  ];

  const description = content || desc;
  const responseThumbnail = await axios(thumbnail.src, {
    responseType: 'arraybuffer',
    headers: {
      'User-Agent': getRandomUserAgent(),
    }
  });
  const base64Img = Buffer.from(responseThumbnail.data, 'binary').toString('base64');

  const imgTypeArr = thumbnail.src.split('.');
  const imgType = imgTypeArr[imgTypeArr.length - 1];

  const convertedThumbnail = `data:image/${imgType};base64,${base64Img}`;


  const cleanedDescription = stripHTML(description);
  return {
    title: title.length > 80 ? title.substring(0, 80) + ' ...' : title,
    thumbnail: convertedThumbnail,
    url,
    date: moment(pubDate).format('DD MMM YYYY, HH:mm'),
    description:
      cleanedDescription
        .substring(0, 60) + '...',
  };
};


function stripHTML(text: string) {
  const dom = new JSDOM(text);
  const textContent = dom.window.document.body.textContent || '';
  const cleanText = textContent.trim();
  return cleanText;
}


// Define a type for the image data
type ImageData = {
  src: string;
  alt: string;
  caption?: string;
};

function extractFirstImageFromHTML(html: string): ImageData | null {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Try different strategies to find the first image
  const imageSelectors = [
    'figure img',          // Case 1: Image inside figure
    '.medium-feed-image img',  // Case 2: Medium feed specific
    'img'                  // Case 3: Any image as fallback
  ];

  for (const selector of imageSelectors) {
    const img = document.querySelector(selector) as HTMLImageElement;
    if (img) {
      return {
        src: img.src,
        alt: img.alt || '', // Use empty string if alt is not present
      };
    }
  }

  return null; // Return null if no images are found
}
