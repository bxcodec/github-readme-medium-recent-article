import { parse } from 'rss-to-json'

export const feedToJSON = async (rssUrl: string) => {
    try {
        const feed = await parse(rssUrl)
        return feed
    } catch (error) {
        console.error(error)
        return null
    }
}