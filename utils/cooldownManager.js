const Discord = require('discord.js')
const defaultCooldownSec = 3
const cooldowns = new Discord.Collection()

const authorOnCooldown = (message, command) => {
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection())
  }
  const now = Date.now()
  const timestamps = cooldowns.get(command.name)
  const cooldownAmount = (command.cooldown || defaultCooldownSec) * 1000
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the '${command.name}' command`)
      return true
    }
  }
  timestamps.set(message.author.id, now)
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
  return false
}

module.exports = { authorOnCooldown }