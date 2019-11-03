const fs = require('fs')
const Discord = require('discord.js')
const { token } = require('./utils/config')
const { authorOnCooldown } = require('./utils/cooldownManager')

const client = new Discord.Client()
client.commands = new Discord.Collection()
fs.readdirSync('./commands')
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
  })


client.once('ready', () => {
  console.log('Ready!')
})

client.on('message', message => {
  if (!message.content.startsWith('!') || message.author.bot) {
    return
  }
  const args = message.content.slice(1).split(/ +/)
  const commandName = args.shift().toLowerCase()
  if (client.commands.has(commandName)) {
    const command = client.commands.get(commandName)
    if (command.args && !args.length) {
      let reply = "you didn't provide any arguments"
      if (command.usage) {
        reply += `\nThe proper usage would be: !${commandName} ${command.usage}`
      }
      return message.reply(reply)
    }
    if (authorOnCooldown(message, command)) {
      return
    }
    command.execute(message, args)
  } else {
    message.channel.send(`Invalid command: !${commandName}`)
  }
})

client.login(token)
