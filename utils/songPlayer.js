const queue = require('./queue')
const ytUtil = require('./youtubeUtil')

let isPlaying = false
let dispatcher
let currUrl

const checkPrerequisites = (message) => {
  if (message.channel.type !== 'text') {
    message.reply('you need to use this command in a text channel!')
    return false
  }
  if (!message.member.voiceChannel) {
    message.reply('please join a voice channel first!')
    return false
  }
  return true
}

const play = async (message) => {
  if (queue.getLength() === 0) {
    return message.reply(
      'The song queue is empty, add songs to play them.')
  }
  const voiceConnection = message.guild.voiceConnection
  if (!voiceConnection) {
    return message.reply(
      'the bot attempted to play songs before joining a voice channel')
  }
  isPlaying = true
  while (queue.getLength() > 0 && isPlaying) {
    const url = queue.dequeue()
    currUrl = url
    const stream = ytUtil.getAudioStreamFromUrl(url)
    const playPromise = new Promise((resolve, reject) => {
      //channel.send(`Now playing ${url}!`)
      dispatcher = voiceConnection.playStream(stream)
      dispatcher.on('end', () => {
        resolve()
      })
    })
    const result = await playPromise
  }
  isPlaying = false
  currUrl = null
  dispatcher = null
}

const skip = (howMany) => {
  let i = 0
  let songsSkipped = howMany > queue.getLength() ? queue.getLength() : howMany
  if (dispatcher && isPlaying) {
    dispatcher.pause()
    i++
    if (howMany > queue.getLength()) {
      songsSkipped++
    }
  }
  for (; i < howMany; i++) {
    queue.dequeue()
  }
  if (dispatcher) {
    dispatcher.end()
  }
  return songsSkipped
}

const clearQueue = () => {
  while (queue.getLength() > 0) {
    queue.dequeue()
  }
}

const repeat = (times) => {
  if (!isPlaying && queue.getLength() === 0) {
    throw new Error('cannot repeat song since there are no songs playing or in queue.')
  }
  let songUrlToRepeat = queue.peek()
  if (dispatcher && isPlaying) {
    songUrlToRepeat = currUrl
  }
  for (let i = 0; i < times; i++) {
    queue.pushToFront(songUrlToRepeat)
  }
}

const leave = (message) => {
  const botConnection = message.guild.voiceConnection
  if (!botConnection) {
    return message.reply('this bot is not in a channel that it can leave from.')
  }
  isPlaying = false
  if (dispatcher) {
    dispatcher.end()
  }
  botConnection.channel.leave()
}

const connectTo = async (message) => {
  const callerChannel = message.member.voiceChannel
  const botConnection = message.guild.voiceConnection
  if (botConnection) {
    const botChannel = botConnection.channel
    if (callerChannel === botChannel) {
      return
    }
    if (isPlaying) {
      isPlaying = false
      dispatcher.end()
      botChannel.leave()
    }
  }
  await callerChannel.join()
}

module.exports = {
  checkPrerequisites,
  play,
  skip,
  clearQueue,
  repeat,
  leave,
  connectTo,
}