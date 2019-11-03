const ytUtil = require('../utils/youtubeUtil')
const songPlayer = require('../utils/songPlayer')
const queue = require('../utils/queue')

module.exports = {
  name: 'playlist',
  description: 'Adds 10 songs from the given playlist to the ' +
  'song queue and starts playing if the queue is empty',
  usage: '<playlist url or name>',
  args: true,
  async execute(message, args) {
    if (!songPlayer.checkPrerequisites(message)) {
      return
    }
    const playlistUrl = await ytUtil.parseUrlFromArgs(message, args)
    if (!playlistUrl) {
      return
    }
    const urls = await ytUtil.getUrlsFromPlaylist(10, playlistUrl)
    urls.map(url => queue.enqueue(url))
    message.reply(`${urls.length} songs added, ${queue.getLength()} song(s) in queue`)
    await songPlayer.connectTo(message.member.voiceChannel)
    songPlayer.play(message.channel)
  },
}