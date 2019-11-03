const songPlayer = require('../utils/songPlayer')

module.exports = {
  name: 'repeat',
  description: 'Adds the current song or the first song to the ' +
  'beginning of the queue',
  usage: '(<num of times to repeat the song, default 1, max 5>)',
  cooldown: 5,
  execute(message, args) {
    if (!songPlayer.checkPrerequisites(message)) {
      return
    }
    let repeatTimes = 1
    if (args.length > 0) {
      repeatTimes = parseInt(args[0])
      if (!repeatTimes || repeatTimes > 5 || repeatTimes < 0) {
        return message.reply('you provided an invalid !repeat argument')
      }
    } try {
      songPlayer.repeat(repeatTimes)
    } catch (exception) {
      message.reply(exception.message)
    }
  },
}