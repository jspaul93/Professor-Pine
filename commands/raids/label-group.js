"use strict";

const log = require('loglevel').getLogger('LabelGroupCommand'),
  Commando = require('discord.js-commando'),
  {CommandGroup} = require('../../app/constants'),
  Helper = require('../../app/helper'),
  Raid = require('../../app/raid'),
  settings = require('../../data/settings');

class LabelGroupCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'label',
      group: CommandGroup.BASIC_RAID,
      memberName: 'label',
      aliases: ['label-group'],
      description: 'Sets a label for a raid group.',
      details: 'Use this command to set a label on your active raid group.',
      examples: ['\t!label Instinct', '\t!label Only if ttar'],
      args: [
        {
          key: 'label',
          label: 'label',
          prompt: 'What do you wish to label your raid group with?',
          type: 'string'
        }
      ],
      argsPromptLimit: 3,
      guildOnly: true
    });

    client.dispatcher.addInhibitor(message => {
      if (!!message.command && message.command.name === 'label' &&
        !Raid.validRaid(message.channel.id)) {
        return ['invalid-channel', message.reply('Set a label for a raid group from its raid channel!')];
      }
      return false;
    });
  }

  async run(message, args) {
    const label = args['label'],
      info = Raid.setGroupLabel(message.channel.id, message.member.id, label);

    if (!info.error) {
      message.react(Helper.getEmoji(settings.emoji.thumbs_up) || '👍')
        .catch(err => log.error(err));

      Raid.refreshStatusMessages(info.raid);
    } else {
      message.reply(info.error)
        .catch(err => log.error(err));
    }
  }
}

module.exports = LabelGroupCommand;
