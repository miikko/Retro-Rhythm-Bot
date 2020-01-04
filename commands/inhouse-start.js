const {
  moveToChannel, lobbyChannelName,
  team1Name, team2Name
} = require('../utils/inhouseUtil')

module.exports = {
  name: 'inhouse',
  description: 'Divides players into evenly sized teams',
  async execute(message, args) {
    const voiceChannel = message.member.voiceChannel
    if (!voiceChannel || voiceChannel.name !== lobbyChannelName) {
      return message.reply(`you need be in "${lobbyChannelName}" voice-channel to use this command`)
    }
    const players = [...voiceChannel.members.values()]
    const teamSize = Math.ceil(players.length / 2)
    const team1 = []
    const team2 = []
    players.map(player => {
      if (team1.length === teamSize) {
        team2.push(player)
      } else if (team2.length === teamSize) {
        team1.push(player)
      } else {
        const randInt = Math.round(Math.random())
        randInt === 0 ? team1.push(player) : team2.push(player)
      }
    })
    let reply = `**${team1Name}**:\n`
    team1.map(teamMember => {
      reply += `${teamMember.user.username}\n`
      moveToChannel(message.guild, team1Name, teamMember)
    })
    reply += `\n**${team2Name}**:\n`
    team2.map(teamMember => {
      reply += `${teamMember.user.username}\n`
      moveToChannel(message.guild, team2Name, teamMember)
    })
    message.channel.send(reply)
  },
}