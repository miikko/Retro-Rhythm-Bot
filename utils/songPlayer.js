const queue = require('./queue')
const ytUtil = require('./youtubeUtil')
const fs = require('fs')

let currAudio

const checkPrerequisites = (message) => {
  if (message.channel.type !== 'text') {
    message.reply('you need to use this command in a text channel!')
    return false
  }
  const callerChannel = message.member.voiceChannel
  const botConnection = message.guild.voiceConnection
  if (botConnection && botConnection.channel !== callerChannel) {
    message.reply('you need to be in the same voice channel with the bot to use this command')
    return false
  }
  if (!message.member.voiceChannel) {
    message.reply('please join a voice channel first!')
    return false
  }
  return true
}

const play = async (message) => {
  const voiceConnection = message.guild.voiceConnection
  if (!voiceConnection) {
    return message.reply(
      'the bot attempted to play songs before joining a voice channel')
  } else if (voiceConnection.dispatcher) {
    return
  }
  if (queue.getLength() === 0) {
    return message.reply(
      'The song queue is empty, add songs to play them.')
  }
  while (queue.getLength() > 0 && message.guild.voiceConnection) {
    const audio = queue.dequeue()
    const url = audio.path
    let stream
    if (audio.type === 'url') {
      try {
        stream = ytUtil.getAudioStreamFromUrl(url)
      } catch (exception) {
        console.log(`Unable to get audiostream for url: ${url}`)
        message.channel.send("Unable to play next song, skipping...")
        continue
      }
    } else if (audio.type === 'file') {
      stream = fs.createReadStream(url)
    }
    const playPromise = new Promise((resolve, reject) => {
      //channel.send(`Now playing ${url}!`)
      const dispatcher = voiceConnection.playStream(stream)
      currAudio = audio
      dispatcher.on('end', () => {
        resolve()
      })
    })
    const result = await playPromise
  }
  currAudio = null
  voiceConnection.channel.leave()
}

const skip = (howMany, message) => {
  const botConnection = message.guild.voiceConnection
  if (!botConnection || !botConnection.dispatcher) {
    return 0
  }
  const dispatcher = botConnection.dispatcher
  let i = 0
  let songsSkipped = howMany > queue.getLength() ? queue.getLength() : howMany
  if (currAudio) {
    dispatcher.pause()
    i++
    if (howMany > queue.getLength()) {
      songsSkipped++
    }
  }
  for (; i < howMany; i++) {
    queue.dequeue()
  }
  if (currAudio) {
    dispatcher.end()
  }
  return songsSkipped
}

const clearQueue = () => {
  while (queue.getLength() > 0) {
    queue.dequeue()
  }
}

const repeat = (message, times) => {
  const botConnection = message.guild.voiceConnection
  if (!botConnection) {
    return message.reply('canont repeat any songs since bot is not in a voice channel!')
  }
  if (!currAudio && queue.getLength() === 0) {
    return message.reply('cannot repeat song since there are no songs playing or in queue.')
  }
  let audioToRepeat = currAudio
  if (!audioToRepeat) {
    audioToRepeat = queue.peek()
  }
  for (let i = 0; i < times; i++) {
    queue.pushToFront(audioToRepeat)
  }
}

const leave = (message) => {
  const botConnection = message.guild.voiceConnection
  const dispatcher = botConnection.dispatcher
  if (!botConnection) {
    return message.reply('this bot is not in a channel that it can leave from.')
  }
  if (dispatcher) {
    clearQueue()
    dispatcher.end()
  }
  botConnection.channel.leave()
}

const connectTo = async (message) => {
  if (currAudio) {
    return
  }
  const callerChannel = message.member.voiceChannel
  const botConnection = message.guild.voiceConnection
  if (botConnection) {
    const botChannel = botConnection.channel
    if (callerChannel === botChannel) {
      return
    }
    message.guild.voiceConnection.dispatcher.end()
    botChannel.leave()
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