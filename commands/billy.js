const songPlayer = require('../utils/songPlayer')
const queue = require('../utils/queue')

module.exports = {
  name: 'billy',
  description: 'Blind Peakers, good show',
  async execute(message, args) {
    if (!songPlayer.checkPrerequisites(message)) {
      return
    }
    const path = `https://www.youtube.com/watch?v=lKeILpp0x_c`
    queue.enqueue({ path, type: 'url' })
    await songPlayer.connectTo(message)
    songPlayer.play(message)
  },
}