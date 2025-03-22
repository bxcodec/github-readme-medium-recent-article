import { parse } from 'rss-to-json'
import { getRandomUserAgent } from './useragent'

export const feedToJSON = async (rssUrl: string) => {
    try {
        const feed = await parse(rssUrl, {
            headers: {
                'User-Agent': getRandomUserAgent(),
            }
        })
        return feed
    } catch (error) {
        console.error('error parsing RSS', error)
        return null
    }
}