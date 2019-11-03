const songPlayer = require('../utils/songPlayer')

module.exports = {
  name: 'skip',
  description: 'Skips the next song or the current song if ' +
  'one is currently playing.\nUp to 10 songs can be skipped with ' +
  'one command.',
  usage: '(<number of songs to remove, default 1>)',
  cooldown: 1,
  execute(message, args) {
    let songsSkipped
    if (args.length > 0) {
      const songsToSkip = parseInt(args[0])
      if (!songsToSkip || songsToSkip > 10 || songsToSkip < 0) {
        return message.reply('you provided an invalid !skip argument')
      }
      songsSkipped = songPlayer.skip(songsToSkip)
    } else {
      songsSkipped = songPlayer.skip(1)
    }
    message.channel.send(`${songsSkipped} song(s) were skipped.`)
  },
}