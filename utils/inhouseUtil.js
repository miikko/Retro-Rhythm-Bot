const moveToChannel = async (guild, channelName, user) => {
  const channels = guild.channels
  const rightChannel = channels.find(channel =>
    channel.name === channelName
  )
  return user.setVoiceChannel(rightChannel)
}

const lobbyChannelName = 'team_shuffler.bat'
const team1Name = 'Team J'
const team2Name = 'Team P'

module.exports = {
  moveToChannel, lobbyChannelName, team1Name, team2Name,
}