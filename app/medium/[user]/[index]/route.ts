import { getArticle } from '../../../util/medium';
import medium from '../../../assets/medium';

export async function GET(req: Request) {
  const reqURL = new URL(req.url);
  const headers = req.headers;
  var pathName = reqURL.pathname.split('/');
  const idx = pathName.pop(); // Get the last segment of the path
  const username = pathName.pop(); // Get the username
  // @ts-ignore
  const { title, thumbnail, url, date, description } = await getArticle(idx, username);
  const dest = headers.get('sec-fetch-dest') || headers.get('Sec-Fetch-Dest');
  const accept = headers.get('accept');
  // @ts-ignore
  const isImage = dest ? dest === 'image' : !/text\/html/.test(accept);

  if (isImage) {
    // Generate the SVG content
    const svgContent = medium({
      title,
      thumbnail,
      url,
      date,
      description,
    });

    return new Response(svgContent, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        'Content-Type': 'image/svg+xml',
      },
    });
  }

  // Redirect to the URL if not an image request
  return Response.redirect(url, 301);
}
