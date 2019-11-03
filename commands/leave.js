const songPlayer = require('../utils/songPlayer')

module.exports = {
  name: 'leave',
  description: 'Leaves the current voice channel',
  execute(message, args) {
    songPlayer.leave(message)
  }
}