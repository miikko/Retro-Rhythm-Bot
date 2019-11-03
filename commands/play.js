const ytUtil = require('../utils/youtubeUtil')
const songPlayer = require('../utils/songPlayer')
const queue = require('../utils/queue')

module.exports = {
  name: 'play',
  description: 'Adds the song to the queue and plays it if the queue is empty',
  usage: '<song url or youtube name>',
  args: true,
  cooldown: 3,
  async execute(message, args) {
    if (!songPlayer.checkPrerequisites(message)) {
      return
    }
    const url = await ytUtil.parseUrlFromArgs(message, args)
    if (!url) {
      return
    }
    message.reply(`song added, ${queue.enqueue(url)} song(s) in queue`)
    await songPlayer.connectTo(message)
    songPlayer.play(message.channel)
  },
}