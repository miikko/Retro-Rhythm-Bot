module.exports = {
  name: 'help',
  description: 'List all available commands with descriptions',
  cooldown: 5,
  // eslint-disable-next-line no-unused-vars
  execute(message, args) {
    const data = []
    const { commands } = message.client
    data.push('Here is a list of all my commands:')
    data.push(commands.map(command => `!${command.name}${command.usage ? ` ${command.usage}` : ''}: ${command.description}`).join('\n\n'))
    return message.channel.send(data, { split: true })
  },
}