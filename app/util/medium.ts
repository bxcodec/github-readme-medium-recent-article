import axios from 'axios';
import moment from 'moment';
import { feedToJSON } from './feedtojson';
import { getRandomUserAgent } from './useragent';
import { parse } from 'node-html-parser';

// Convert cdn-images-1.medium.com URL to miro.medium.com format
// Example: https://cdn-images-1.medium.com/max/1024/0*abc.png -> https://miro.medium.com/v2/resize:fit:150/0*abc.png
function convertToMiroUrl(cdnUrl: string): string {
  const match = cdnUrl.match(/cdn-images-\d\.medium\.com\/max\/\d+\/(.+)$/);
  if (match) {
    // Use smaller size (150px) for thumbnail to reduce payload
    return `https://miro.medium.com/v2/resize:fit:800/${match[1]}`;
  }
  return cdnUrl;
}

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

  // Medium placeholder SVG as fallback
  const placeholderSvg = `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"><rect fill="#12100E" width="150" height="150"/><path fill="#fff" d="M40 45h10l22 35 22-35h10v60h-10V65L75 95h-2L55 65v40H40V45z"/></svg>`).toString('base64')}`;

  let convertedThumbnail = placeholderSvg;

  try {
    // Use miro.medium.com which doesn't have Cloudflare bot protection
    const miroUrl = convertToMiroUrl(thumbnail.src);

    const responseThumbnail = await axios(miroUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': getRandomUserAgent(),
      }
    });
    const base64Img = Buffer.from(responseThumbnail.data, 'binary').toString('base64');

    // miro.medium.com returns JPEG images
    convertedThumbnail = `data:image/jpeg;base64,${base64Img}`;
  } catch (error) {
    console.log('Failed to fetch thumbnail, using placeholder:', error instanceof Error ? error.message : 'Unknown error');
  }

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
  const root = parse(text);
  const textContent = root.textContent || '';
  return textContent.replace(/\s+/g, ' ').trim();
}


// Define a type for the image data
type ImageData = {
  src: string;
  alt: string;
  caption?: string;
};

function extractFirstImageFromHTML(html: string): ImageData | null {
  const root = parse(html);

  // Try different strategies to find the first image
  const imageSelectors = [
    'figure img',          // Case 1: Image inside figure
    '.medium-feed-image img',  // Case 2: Medium feed specific
    'img'                  // Case 3: Any image as fallback
  ];

  for (const selector of imageSelectors) {
    const img = root.querySelector(selector);
    if (img) {
      const src = img.getAttribute('src');
      if (src) {
        return {
          src: src,
          alt: img.getAttribute('alt') || '',
        };
      }
    }
  }

  return null; // Return null if no images are found
}
