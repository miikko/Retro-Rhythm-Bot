const songPlayer = require('../utils/songPlayer')
const queue = require('../utils/queue')

module.exports = {
  name: 'mikä',
  description: 'Se juttu..',
  async execute(message, args) {
    if (!songPlayer.checkPrerequisites(message)) {
      return
    }
    // eslint-disable-next-line no-undef
    const path = `${rootPath}/resources/MikaTaaOn.mp3`
    queue.enqueue({ path, type: 'file' })
    await songPlayer.connectTo(message)
    songPlayer.play(message)
  },
}