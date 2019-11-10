const songPlayer = require('../utils/songPlayer')

module.exports = {
  name: 'clear',
  description: 'Removes all the songs from the queue',
  execute(message, args) {
    if (!songPlayer.checkPrerequisites(message)) {
      return
    }
    songPlayer.clearQueue()
    message.channel.send('Song queue cleared!')
  },
}