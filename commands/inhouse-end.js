const {
  moveToChannel, lobbyChannelName,
  team1Name, team2Name
} = require('../utils/inhouseUtil')

module.exports = {
  name: 'donezo',
  description: 'Returns players to lobby',
  async execute(message, args) {
    const voiceChannel = message.member.voiceChannel
    if (!voiceChannel || (voiceChannel.name !== team1Name && voiceChannel.name !== team2Name)) {
      return message.reply('you need be in a inhouse team voice-channel to use this command')
    }
    const channels = message.guild.channels
    const teamChannels = channels.filter(channel =>
      channel.name === team1Name || channel.name === team2Name
    )
    teamChannels.map(channel => {
      const members = [...channel.members.values()]
      members.map(member => {
        moveToChannel(message.guild, lobbyChannelName, member)
      })
    })
    message.channel.send('GG')
  },
}