const ytdl = require('ytdl-core')
const puppeteer = require('puppeteer')

const getAudioStreamFromUrl = (url) => {
  return ytdl(url)
}

const getVideoUrlFromName = async (name) => {
  const encodedName = encodeURIComponent(name)
  const resultsUrl = `https://www.youtube.com/results?search_query=${encodedName}`
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  })
  const page = await browser.newPage()
  await page.goto(resultsUrl)
  let videoUrl = 'https://www.youtube.com'
  try {
    videoUrl += await page.evaluate(() => {
      const thumbnails = document.querySelectorAll('a#thumbnail')
      if (thumbnails.length == 0) {
        throw new Error('No thumbnails found!')
      }
      return thumbnails[0].getAttribute('href')
    })
    await browser.close()
    return videoUrl
  } catch (exception) {
    await browser.close()
    throw exception
  }
}

const isPlaylist = (url) => {
  const searchParams = new URL(url).searchParams
  return searchParams.get('list') !== null
}

const getNextPlaylistVideoUrl = async (url) => {
  const videoIndex = new URL(url).searchParams.get('index') || 1
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  })
  const page = await browser.newPage()
  await page.goto(url)
  await page.waitForSelector('ytd-playlist-panel-video-renderer')
  let videoUrl = 'https://www.youtube.com'
  try {
    videoUrl += await page.evaluate((index) => {
      const listItemContainers = document.querySelectorAll('ytd-playlist-panel-video-renderer')
      return listItemContainers[index].querySelector('#wc-endpoint').getAttribute('href')
    }, videoIndex)
  } catch (exception) {
    await browser.close()
    throw exception
  }
  await browser.close()
  return videoUrl
}

const getUrlsFromPlaylist = async (numOfUrls, playlistUrl) => {
  let startIndex = new URL(playlistUrl).searchParams.get('index')
  if (startIndex) {
    startIndex--
  } else {
    startIndex = 0
  }
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  })
  const page = await browser.newPage()
  await page.goto(playlistUrl)
  await page.waitForSelector('ytd-playlist-panel-video-renderer')
  try {
    // eslint-disable-next-line no-shadow
    const results = await page.evaluate(({ startIndex, numOfUrls }) => {
      const playListItems = document.querySelectorAll('ytd-playlist-panel-video-renderer')
      const urlEndings = []
      for (let i = startIndex; urlEndings.length < numOfUrls && i < playListItems.length; i++) {
        const urlEnding = playListItems[i]
          .querySelector('#wc-endpoint')
          .getAttribute('href')
        urlEndings.push(urlEnding)
      }
      return urlEndings
    }, { startIndex, numOfUrls })
    await browser.close()
    const baseUrl = 'https://www.youtube.com'
    return results.map(result => baseUrl.concat(result))
  } catch (exception) {
    await browser.close()
    throw exception
  }
}

const parseUrlFromArgs = async (message, args) => {
  //ADD URL VALIDATION
  if (args[0].startsWith('https://www.youtube.com/')) {
    try {
      const url = args[0]
      //Validation
      getAudioStreamFromUrl(url)
      return url
    } catch (exception) {
      console.log(exception)
      message.reply('the URL you gave does not match any youtube video')
    }
  } else {
    try {
      const url = await getVideoUrlFromName(args.join(' '))
      return url
    } catch (exception) {
      console.log(exception)
      message.reply('the name you gave does not give any results!')
    }
  }
}

module.exports = {
  getAudioStreamFromUrl,
  isPlaylist,
  getUrlsFromPlaylist,
  parseUrlFromArgs,
}