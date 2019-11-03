module.exports = {
  name: 'ping',
  description: 'Command to test that the bot is working',
  // eslint-disable-next-line no-unused-vars
  execute(message, args) {
    message.channel.send('Pong.')
  },
}