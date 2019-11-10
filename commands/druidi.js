const songPlayer = require('../utils/songPlayer')
const queue = require('../utils/queue')

module.exports = {
  name: 'druidi',
  description: 'Servun paras?',
  async execute(message, args) {
    if (!songPlayer.checkPrerequisites(message)) {
      return
    }
    // eslint-disable-next-line no-undef
    const path = `${rootPath}/resources/Druidi.mp3`
    queue.enqueue({ path, type: 'file' })
    await songPlayer.connectTo(message)
    songPlayer.play(message)
  },
}