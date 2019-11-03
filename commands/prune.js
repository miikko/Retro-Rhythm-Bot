module.exports = {
  name: 'prune',
  description: 'Clears up to 100 latest messages',
  args: true,
  cooldown: 3,
  usage: '<amount of messages to clear>',
  execute(message, args) {
    const amount = parseInt(args[0]) + 1
    if (isNaN(amount)) {
      return message.reply("that doesn't seem to be a valid number.")
    } else if (amount < 2 || amount > 100) {
      return message.reply(
        'you need to input a number between 1 and 99.')
    }
    try {
      message.channel.bulkDelete(amount, true)
    } catch (exception) {
      console.error(exception)
      message.channel.send(
        'There was an error trying to prune messages in this channel!\nThe message are probably too old to be removed.')
    }
  },
}