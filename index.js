const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const prefix = '$';
const db = require("quick.db")
const generator = require('generate-password');
const server = require("./server.js")();
const { registerFont } = require('canvas')
registerFont('Lobster-Regular.ttf', { family: "Lobster" });

client.on('ready', () => {
console.log(`Logged In : ${client.user.tag}`)
})

client.on('ready', () => {
  client.user.setActivity(`${prefix}help| ${client.guilds.cache.size} Server`, { type: "STREAMING", url: 'https://www.twitch.tv/exa4real' });


});
//help
client.on("message", Message => {
  if (!Message.guild || Message.author.bot) return;
  if (Message.content.startsWith(prefix + "help")) {
    var gen = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle(`✉️ General Commands`)
      .setThumbnail(Message.author.avatarURL({ dynamic: true }))
      .setDescription(`$avatar , $ping , $user , $server , $top ,  $toptext , $topvoice , $bot , $dev , $link , $embedpic , $encrypt , $decrypt`)
      .setFooter(Message.author.tag, Message.author.avatarURL({ dynamic: true }))
    var admin = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle(`🤖 Admin Commands`)
      .setThumbnail(Message.author.avatarURL({ dynamic: true }))
      .setDescription(`$clear , $ban , $kick , $emsay , $role , $warn , $lock , $unlock , $hide , $show , $addemoji , $setline , $line , $setautorole , $enable autorole , $disable autorole`)
      .setFooter(Message.author.tag, Message.author.avatarURL({ dynamic: true }))

    var Embed1 = new Discord.MessageEmbed().setColor("RANDOM").setTitle(`Help Commands`).setDescription(`Click :lock: to see protection commands\nClick 🤖 to see admin Commands.\nClick ✉️ to see General commands
    To Visit The Bot Wibsite : https://wine-bot-website.w7.repl.co`)
      .setThumbnail(Message.author.avatarURL({ dynamic: true }))
      .setFooter(Message.author.tag, Message.author.avatarURL({ dynamic: true }))
    Message.channel.send(Embed1).then(async (Msg) => {
      Msg.react("🔒").then(() => {
        Msg.react("🤖").then(() => { })
        Msg.react("✉️").then(() => { })
        let xFilter = (reaction, user) => {
          return reaction.emoji.name === "🤖" && user.id === Message.author.id;
        };
        let proFilter = (reaction, user) => {
          return reaction.emoji.name === "🔒" && user.id === Message.author.id;
        };
        let gene = (reaction, user) => {
          return reaction.emoji.name === "✉️" && user.id === Message.author.id;
        };

        let xCollect = Msg.createReactionCollector(xFilter, {
          time: 1000 * 64
        });
        let proCollect = Msg.createReactionCollector(proFilter, {
          time: 1000 * 64
        });
        let gene1 = Msg.createReactionCollector(gene, {
          time: 1000 * 64
        });

        xCollect.on("collect", () => {
          Msg.edit(admin);
        });
        proCollect.on("collect", () => {
          var proEmbed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`Protection Commands`)
            .setDescription(`$antisw on , antisw off , صيانه`)
            .setThumbnail(Message.author.avatarURL({ dynamic: true }))
            .setFooter(Message.author.tag, Message.author.avatarURL({ dynamic: true }))
          Msg.edit(proEmbed);
        })
        gene1.on("collect", () => {
          Msg.edit(gen)
        })
      })
    })
  }
})
//log 
const log = JSON.parse(fs.readFileSync("./log.json", "utf8"));
 
 
client.on("message", message => {
  if (!message.channel.guild) return;
  let room = message.content.split(" ").slice(1);
  let findroom = message.guild.channels.cache.find(r => r.name == room);
  if (message.content.startsWith(prefix + "setlog")) {
    if (!message.channel.guild)
      return message.reply("**This Command Only For Servers**");
    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.channel.send(
        "**Sorry But You Dont Have Permission** `MANAGE_GUILD`"
      );
    if (!room) return message.channel.send("Please Type The Channel Name");
    if (!findroom)
      return message.channel.send("Please Type The Log Channel Name");
    let embed = new Discord.MessageEmbed()
      .setTitle("**Done The Log Code Has Been Setup**")
      .addField("Channel:", `${room}`)
      .addField("Requested By:", `${message.author}`)
      .setThumbnail(message.author.avatarURL())
      .setFooter(`${client.user.username}`);
    message.channel.send(embed);
    log[message.guild.id] = {
      channel: room,
      onoff: "On"
    };
    fs.writeFile("./log.json", JSON.stringify(log), err => {
      if (err) console.error(err);
    });
  }
});
client.on("message", message => {
  if (message.content.startsWith(prefix + "toggle-log")) {
    if (!message.channel.guild)
      return message.reply("**This Command Only For Servers**");
    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.channel.send(
        "**Sorry But You Dont Have Permission** `MANAGE_GUILD`"
      );
    if (!log[message.guild.id])
      log[message.guild.id] = {
        onoff: "Off"
      };
    if (log[message.guild.id].onoff === "Off")
      return [
        message.channel.send(`**The log Is __𝐎𝐍__ !**`),
        (log[message.guild.id].onoff = "On")
      ];
    if (log[message.guild.id].onoff === "On")
      return [
        message.channel.send(`**The log Is __𝐎𝐅𝐅__ !**`),
        (log[message.guild.id].onoff = "Off")
      ];
    fs.writeFile("./log.json", JSON.stringify(log), err => {
      if (err)
        console.error(err).catch(err => {
          console.error(err);
        });
    });
  }
});
 
client.on("messageDelete", message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (!message.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES"))
    return;
  if (!log[message.guild.id])
    log[message.guild.id] = {
      onoff: "Off"
    };
  if (log[message.guild.id].onoff === "Off") return;
  var logChannel = message.guild.channels.cache.find(
    c => c.name === `${log[message.guild.id].channel}`
  );
  if (!logChannel) return;
 
  let messageDelete = new Discord.MessageEmbed()
    .setTitle("**[MESSAGE DELETE]**")
    .setColor("RED")
    .setThumbnail(message.author.avatarURL())
    .setDescription(
      `**\n**:wastebasket: Successfully \`\`DELETE\`\` **MESSAGE** In ${message.channel}\n\n**Channel:** \`\`${message.channel.name}\`\` (ID: ${message.channel.id})\n**Message ID:** ${message.id}\n**Sent By:** <@${message.author.id}> (ID: ${message.author.id})\n**Message:**\n\`\`\`${message}\`\`\``
    )
    .setTimestamp()
    .setFooter(message.guild.name, message.guild.iconURL());
 
  logChannel.send(messageDelete);
});
client.on("messageUpdate", (oldMessage, newMessage) => {
  if (oldMessage.author.bot) return;
  if (!oldMessage.channel.type === "dm") return;
  if (!oldMessage.guild.member(client.user).hasPermission("EMBED_LINKS"))
    return;
  if (!oldMessage.guild.member(client.user).hasPermission("MANAGE_MESSAGES"))
    return;
  if (!log[oldMessage.guild.id])
    log[oldMessage.guild.id] = {
      onoff: "Off"
    };
  if (log[oldMessage.guild.id].onoff === "Off") return;
  var logChannel = oldMessage.guild.channels.cache.find(
    c => c.name === `${log[oldMessage.guild.id].channel}`
  );
  if (!logChannel) return;
 
  if (oldMessage.content.startsWith("https://")) return;
 
  let messageUpdate = new Discord.MessageEmbed()
    .setTitle("**[MESSAGE EDIT]**")
    .setThumbnail(oldMessage.author.avatarURL())
    .setColor("BLUE")
    .setDescription(
      `**\n**:wrench: Successfully \`\`EDIT\`\` **MESSAGE** In ${oldMessage.channel}\n\n**Channel:** \`\`${oldMessage.channel.name}\`\` (ID: ${oldMessage.channel.id})\n**Message ID:** ${oldMessage.id}\n**Sent By:** <@${oldMessage.author.id}> (ID: ${oldMessage.author.id})\n\n**Old Message:**\`\`\`${oldMessage}\`\`\`\n**New Message:**\`\`\`${newMessage}\`\`\``
    )
    .setTimestamp()
    .setFooter(oldMessage.guild.name, oldMessage.guild.iconURL());
 
  logChannel.send(messageUpdate);
});
 
client.on("roleCreate", role => {
  if (!role.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!role.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG")) return;
  if (!log[role.guild.id])
    log[role.guild.id] = {
      onoff: "Off"
    };
  if (log[role.guild.id].onoff === "Off") return;
  var logChannel = role.guild.channels.cache.find(
    c => c.name === `${log[role.guild.id].channel}`
  );
  if (!logChannel) return;
 
  role.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();
 
    let roleCreate = new Discord.MessageEmbed()
      .setTitle("**[ROLE CREATE]**")
      .setThumbnail(userAvatar)
      .setDescription(
        `**\n**:white_check_mark: Successfully \`\`CREATE\`\` Role.\n\n**Role Name:** \`\`${role.name}\`\` (ID: ${role.id})\n**By:** <@${userID}> (ID: ${userID})`
      )
      .setColor("GREEN")
      .setTimestamp()
      .setFooter(role.guild.name, role.guild.iconURL());
 
    logChannel.send(roleCreate);
  });
});
 
client.on("roleDelete", role => {
  if (!role.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!role.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG")) return;
  if (!log[role.guild.id])
    log[role.guild.id] = {
      onoff: "Off"
    };
  if (log[role.guild.id].onoff === "Off") return;
  var logChannel = role.guild.channels.cache.find(
    c => c.name === `${log[role.guild.id].channel}`
  );
  if (!logChannel) return;
 
  role.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();
 
    let roleDelete = new Discord.MessageEmbed()
      .setTitle("**[ROLE DELETE]**")
      .setThumbnail(userAvatar)
      .setDescription(
        `**\n**:white_check_mark: Successfully \`\`DELETE\`\` Role.\n\n**Role Name:** \`\`${role.name}\`\` (ID: ${role.id})\n**By:** <@${userID}> (ID: ${userID})`
      )
      .setColor("RED")
      .setTimestamp()
      .setFooter(role.guild.name, role.guild.iconURL());
 
    logChannel.send(roleDelete);
  });
});
 
client.on("roleUpdate", (oldRole, newRole) => {
  if (!oldRole.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!oldRole.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG"))
    return;
  if (!log[oldRole.guild.id])
    log[oldRole.guild.id] = {
      onoff: "Off"
    };
  if (log[oldRole.guild.id].onoff === "Off") return;
  var logChannel = oldRole.guild.channels.cache.find(
    c => c.name === `${log[oldRole.guild.id].channel}`
  );
  if (!logChannel) return;
 
  oldRole.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();
 
    if (oldRole.name !== newRole.name) {
      if (log[oldRole.guild.id].onoff === "Off") return;
      let roleUpdateName = new Discord.MessageEmbed()
        .setTitle("**[ROLE NAME UPDATE]**")
        .setThumbnail(userAvatar)
        .setColor("BLUE")
        .setDescription(
          `**\n**:white_check_mark: Successfully \`\`EDITED\`\` Role Name.\n\n**Old Name:** \`\`${oldRole.name}\`\`\n**New Name:** \`\`${newRole.name}\`\`\n**Role ID:** ${oldRole.id}\n**By:** <@${userID}> (ID: ${userID})`
        )
        .setTimestamp()
        .setFooter(oldRole.guild.name, oldRole.guild.iconURL());
 
      logChannel.send(roleUpdateName);
    }
    if (oldRole.hexColor !== newRole.hexColor) {
      if (oldRole.hexColor === "#000000") {
        var oldColor = "`Default`";
      } else {
        var oldColor = oldRole.hexColor;
      }
      if (newRole.hexColor === "#000000") {
        var newColor = "`Default`";
      } else {
        var newColor = newRole.hexColor;
      }
      if (log[oldRole.guild.id].onoff === "Off") return;
      let roleUpdateColor = new Discord.MessageEmbed()
        .setTitle("**[ROLE COLOR UPDATE]**")
        .setThumbnail(userAvatar)
        .setColor("BLUE")
        .setDescription(
          `**\n**:white_check_mark: Successfully \`\`EDITED\`\` **${oldRole.name}** Role Color.\n\n**Old Color:** ${oldColor}\n**New Color:** ${newColor}\n**Role ID:** ${oldRole.id}\n**By:** <@${userID}> (ID: ${userID})`
        )
        .setTimestamp()
        .setFooter(oldRole.guild.name, oldRole.guild.iconURL());
 
      logChannel.send(roleUpdateColor);
    }
  });
});
 
client.on("channelCreate", channel => {
  if (!channel.guild) return;
  if (!channel.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!channel.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG"))
    return;
  if (!log[channel.guild.id])
    log[channel.guild.id] = {
      onoff: "Off"
    };
  if (log[channel.guild.id].onoff === "Off") return;
  var logChannel = channel.guild.channels.cache.find(
    c => c.name === `${log[channel.guild.id].channel}`
  );
  if (!logChannel) return;
 
  if (channel.type === "text") {
    var roomType = "Text";
  } else if (channel.type === "voice") {
    var roomType = "Voice";
  } else if (channel.type === "category") {
    var roomType = "Category";
  }
 
  channel.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();
 
    let channelCreate = new Discord.MessageEmbed()
      .setTitle("**[CHANNEL CREATE]**")
      .setThumbnail(userAvatar)
      .setDescription(
        `**\n**:white_check_mark: Successfully \`\`CREATE\`\` **${roomType}** channel.\n\n**Channel Name:** \`\`${channel.name}\`\` (ID: ${channel.id})\n**By:** <@${userID}> (ID: ${userID})`
      )
      .setColor("GREEN")
      .setTimestamp()
      .setFooter(channel.guild.name, channel.guild.iconURL());
 
    logChannel.send(channelCreate);
  });
});
 
client.on("channelDelete", channel => {
  if (!channel.guild) return;
  if (!channel.guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!channel.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG"))
    return;
  if (!log[channel.guild.id])
    log[channel.guild.id] = {
      onoff: "Off"
    };
  if (log[channel.guild.id].onoff === "Off") return;
  var logChannel = channel.guild.channels.cache.find(
    c => c.name === `${log[channel.guild.id].channel}`
  );
  if (!logChannel) return;
 
  if (channel.type === "text") {
    var roomType = "Text";
  } else if (channel.type === "voice") {
    var roomType = "Voice";
  } else if (channel.type === "category") {
    var roomType = "Category";
  }
 
  channel.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();
 
    let channelDelete = new Discord.MessageEmbed()
      .setTitle("**[CHANNEL DELETE]**")
      .setThumbnail(userAvatar)
      .setDescription(
        `**\n**:white_check_mark: Successfully \`\`DELETE\`\` **${roomType}** channel.\n\n**Channel Name:** \`\`${channel.name}\`\` (ID: ${channel.id})\n**By:** <@${userID}> (ID: ${userID})`
      )
      .setColor("RED")
      .setTimestamp()
      .setFooter(channel.guild.name, channel.guild.iconURL());
 
    logChannel.send(channelDelete);
  });
});
 
client.on("channelUpdate", (oldChannel, newChannel) => {
  if (!oldChannel.guild) return;
  if (!log[oldChannel.guild.id])
    log[oldChannel.guild.id] = {
      onoff: "Off"
    };
  if (log[oldChannel.guild.id].onoff === "Off") return;
  var logChannel = oldChannel.guild.channels.cache.find(
    c => c.name === `${log[oldChannel.guild.id].channel}`
  );
  if (!logChannel) return;
 
  if (oldChannel.type === "text") {
    var channelType = "Text";
  } else if (oldChannel.type === "voice") {
    var channelType = "Voice";
  } else if (oldChannel.type === "category") {
    var channelType = "Category";
  }
 
  oldChannel.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();
 
    if (oldChannel.name !== newChannel.name) {
      let newName = new Discord.MessageEmbed()
        .setTitle("**[CHANNEL EDIT]**")
        .setThumbnail(userAvatar)
        .setColor("BLUE")
        .setDescription(
          `**\n**:wrench: Successfully Edited **${channelType}** Channel Name\n\n**Old Name:** \`\`${oldChannel.name}\`\`\n**New Name:** \`\`${newChannel.name}\`\`\n**Channel ID:** ${oldChannel.id}\n**By:** <@${userID}> (ID: ${userID})`
        )
        .setTimestamp()
        .setFooter(oldChannel.guild.name, oldChannel.guild.iconURL());
 
      logChannel.send(newName);
    }
    if (oldChannel.topic !== newChannel.topic) {
      if (log[oldChannel.guild.id].onoff === "Off") return;
      let newTopic = new Discord.MessageEmbed()
        .setTitle("**[CHANNEL EDIT]**")
        .setThumbnail(userAvatar)
        .setColor("BLUE")
        .setDescription(
          `**\n**:wrench: Successfully Edited **${channelType}** Channel Topic\n\n**Old Topic:**\n\`\`\`${oldChannel.topic ||
            "NULL"}\`\`\`\n**New Topic:**\n\`\`\`${newChannel.topic ||
            "NULL"}\`\`\`\n**Channel:** ${oldChannel} (ID: ${
            oldChannel.id
          })\n**By:** <@${userID}> (ID: ${userID})`
        )
        .setTimestamp()
        .setFooter(oldChannel.guild.name, oldChannel.guild.iconURL());
 
      logChannel.send(newTopic);
    }
  });
});
 
client.on("guildBanAdd", (guild, user) => {
  if (!guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!guild.member(client.user).hasPermission("VIEW_AUDIT_LOG")) return;
  if (!log[guild.id])
    log[guild.id] = {
      onoff: "Off"
    };
  if (log[guild.id].onoff === "Off") return;
  var logChannel = guild.channels.cache.find(
    c => c.name === `${log[guild.id].channel}`
  );
  if (!logChannel) return;
 
  guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();
 
    if (userID === client.user.id) return;
 
    let banInfo = new Discord.MessageEmbed()
      .setTitle("**[BANNED]**")
      .setThumbnail(userAvatar)
      .setColor("DARK_RED")
      .setDescription(
        `**\n**:airplane: Successfully \`\`BANNED\`\` **${user.username}** From the server!\n\n**User:** <@${user.id}> (ID: ${user.id})\n**By:** <@${userID}> (ID: ${userID})`
      )
      .setTimestamp()
      .setFooter(guild.name, guild.iconURL());
 
    logChannel.send(banInfo);
  });
});
 
client.on("guildBanRemove", (guild, user) => {
  if (!guild.member(client.user).hasPermission("EMBED_LINKS")) return;
  if (!guild.member(client.user).hasPermission("VIEW_AUDIT_LOG")) return;
  if (!log[guild.id])
    log[guild.id] = {
      onoff: "Off"
    };
  if (log[guild.id].onoff === "Off") return;
  var logChannel = guild.channels.cache.find(
    c => c.name === `${log[guild.id].channel}`
  );
  if (!logChannel) return;
 
  guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();
 
    if (userID === client.user.id) return;
 
    let unBanInfo = new Discord.MessageEmbed()
      .setTitle("**[UNBANNED]**")
      .setThumbnail(userAvatar)
      .setColor("GREEN")
      .setDescription(
        `**\n**:unlock: Successfully \`\`UNBANNED\`\` **${user.username}** From the server\n\n**User:** <@${user.id}> (ID: ${user.id})\n**By:** <@${userID}> (ID: ${userID})`
      )
      .setTimestamp()
      .setFooter(guild.name, guild.iconURL());
 
    logChannel.send(unBanInfo);
  });
});
 
client.on("guildMemberUpdate", (oldMember, newMember) => {
  if (!oldMember.guild) return;
  if (!log[oldMember.guild.id])
    log[oldMember.guild.id] = {
      onoff: "Off"
    };
  if (log[oldMember.guild.id].onoff === "Off") return;
  var logChannel = oldMember.guild.channels.cache.find(
    c => c.name === `${log[(oldMember, newMember.guild.id)].channel}`
  );
  if (!logChannel) return;
 
  oldMember.guild.fetchAuditLogs().then(logs => {
    var userID = logs.entries.first().executor.id;
    var userAvatar = logs.entries.first().executor.avatarURL();
    var userTag = logs.entries.first().executor.tag;
 
    if (oldMember.nickname !== newMember.nickname) {
      if (oldMember.nickname === null) {
        var oldNM = "`اسمه الاصلي`";
      } else {
        var oldNM = oldMember.nickname;
      }
      if (newMember.nickname === null) {
        var newNM = "`اسمه الاصلي`";
      } else {
        var newNM = newMember.nickname;
      }
 
      let updateNickname = new Discord.MessageEmbed()
        .setTitle("**[UPDATE MEMBER NICKNAME]**")
        .setThumbnail(userAvatar)
        .setColor("BLUE")
        .setDescription(
          `**\n**:spy: Successfully \`\`CHANGE\`\` Member Nickname.\n\n**User:** ${oldMember} (ID: ${oldMember.id})\n**Old Nickname:** ${oldNM}\n**New Nickname:** ${newNM}\n**By:** <@${userID}> (ID: ${userID})`
        )
        .setTimestamp()
        .setFooter(oldMember.guild.name, oldMember.guild.iconURL());
 
      logChannel.send(updateNickname);
    }
    if (oldMember.roles.cache.size < newMember.roles.cache.size) {
      let role = newMember.roles
        .filter(r => !oldMember.roles.has(r.id))
        .first();
      if (!log[oldMember.guild.id])
        log[oldMember.guild.id] = {
          onoff: "Off"
        };
      if (log[oldMember.guild.id].onoff === "Off") return;
      let roleAdded = new Discord.MessageEmbed()
        .setTitle("**[ADDED ROLE TO MEMBER]**")
        .setThumbnail(oldMember.guild.iconURL())
        .setColor("GREEN")
        .setDescription(
          `**\n**:white_check_mark: Successfully \`\`ADDED\`\` Role to **${oldMember.user.username}**\n\n**User:** <@${oldMember.id}> (ID: ${oldMember.user.id})\n**Role:** \`\`${role.name}\`\` (ID: ${role.id})\n**By:** <@${userID}> (ID: ${userID})`
        )
        .setTimestamp()
        .setFooter(userTag, userAvatar);
 
      logChannel.send(roleAdded);
    }
    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
      let role = oldMember.roles
        .filter(r => !newMember.roles.has(r.id))
        .first();
      if (!log[oldMember.guild.id])
        log[oldMember.guild.id] = {
          onoff: "Off"
        };
      if (log[(oldMember, newMember.guild.id)].onoff === "Off") return;
      let roleRemoved = new Discord.MessageEmbed()
        .setTitle("**[REMOVED ROLE FROM MEMBER]**")
        .setThumbnail(oldMember.guild.iconURL())
        .setColor("RED")
        .setDescription(
          `**\n**:negative_squared_cross_mark: Successfully \`\`REMOVED\`\` Role from **${oldMember.user.username}**\n\n**User:** <@${oldMember.user.id}> (ID: ${oldMember.id})\n**Role:** \`\`${role.name}\`\` (ID: ${role.id})\n**By:** <@${userID}> (ID: ${userID})`
        )
        .setTimestamp()
        .setFooter(userTag, userAvatar);
 
      logChannel.send(roleRemoved);
    }
  });
  if (oldMember.guild.owner.id !== newMember.guild.owner.id) {
    if (!log[oldMember.guild.id])
      log[oldMember.guild.id] = {
        onoff: "Off"
      };
    if (log[(oldMember, newMember.guild.id)].onoff === "Off") return;
    let newOwner = new Discord.MessageEmbed()
      .setTitle("**[UPDATE GUILD OWNER]**")
      .setThumbnail(oldMember.guild.iconURL())
      .setColor("GREEN")
      .setDescription(
        `**\n**:white_check_mark: Successfully \`\`TRANSFER\`\` The Owner Ship.\n\n**Old Owner:** <@${oldMember.user.id}> (ID: ${oldMember.user.id})\n**New Owner:** <@${newMember.user.id}> (ID: ${newMember.user.id})`
      )
      .setTimestamp()
      .setFooter(oldMember.guild.name, oldMember.guild.iconURL());
 
    logChannel.send(newOwner);
  }
});
///رد تلقائي
client.on('message', wine => {
  if (wine.content.includes('السلام عليكم')) {
    wine.reply('وعليكم السلام');
  }
});
client.on('message', wine => {
  if (wine.content.includes('باك')) {
    wine.reply('ولكم');
  }
});

client.on('message', message => {
  if (message.content == 'تحية') {
    message.reply(':heart: احلى تحية للقائد المغوار واين');
  }
});
//
client.on('message', message => {
  if (message.content == '$members') {
    message.channel.send(`Member count is ${message.guild.memberCount}`);
  }
});

//aouto role
client.on('guildMemberAdd', async member => {
  let role = member.guild.roles.cache.find(
    ro => ro.id == '861000250936524811'
  );
  if (!role) return console.log('auto role was not found');
  await member.roles.add(role);
});

//non
client.on('guildCreate', Server => {
  Server.owner.send('Thank you for inviting me, dont delete the log room');
});
 

   ///kick-ban
client.on("message",async(message)=>{
  let target = message.mentions.members.first();
  if(message.content.startsWith(prefix+"ban")){
    if(!message.member.hasPermission("BAN_MEMBERS")) return;
    if(!target) return message.channel.send(`${prefix}ban @user [Reason]`)
    target.ban({reason}).then(()=> message.channel.send(`**✈️ ${target.user} banned from the server!**`)).catch(e => message.channel.send(`I don't have permission!`))
  } else if(message.content.startsWith(prefix+"kick")){
    if(!message.member.hasPermission("KICK_MEMBERS")) return;
    if(!target) return message.channel.send(`${prefix}kick @user [Reason]`)
      target.kick(reason).then(()=> message.channel.send(`**✅ ${target.user} kicked from the server!**`)).catch(e => message.channel.send(`I don't have permission!`))
  }
})
//warn
client.on('message', msg => {
  if (msg.content.startsWith(prefix + "warn")) {
    if (!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return wine.reply('you dont have Permission')
    var user = msg.mentions.users.first(); user
    var reason = msg.content.split(" ").slice(2).join(" ")
    if (!user) return msg.channel.send("منشن الشخص")
    if (!reason) return msg.channel.send("اكتب السبب")
    var logchannel = msg.guild.channels.cache.find(channel => channel.name === "reports");
    msg.channel.send("**تم  التحذير**")

    var embed = new Discord.MessageEmbed()
      .setTitle("NEW WARNED")
      .addField("اسم الشخص", `${user}`)
      .addField("ايدي الشخص", `${user.id}`)
      .addField("تم تحذير الشخص بواسطة", `${msg.author.username}`)
      .addField("ايدي الاداري", `${msg.author.id}`)
      .setColor("RANDOM")
      .setFooter(msg.author.tag, msg.author.avatarURL())
    logchannel.send(embed).then(msg => {
      user.send(`you have warned by ${msg.author.name}
         reason : ${reason}
  `)
    })
  }
});



//clear
client.on("message", async message => {
  let command = message.content.toLowerCase().split(" ")[0];
  command = command.slice(prefix.length);
  if (command == "clear" || command == "مسح") {
    message.delete({ timeout: 0 })
    if (!message.channel.guild) return message.reply(`** This Command For Servers Only**`);
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`> ** You don't have perms :x:**`);
    if (!message.guild.member(client.user).hasPermission('MANAGE_GUILD')) return message.channel.send(`> ** I don't have perms :x:**`);
    let args = message.content.split(" ").slice(1)
    let messagecount = parseInt(args);
    if (args > 100) return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(`\`\`\`js
i cant delete more than 100 messages 
\`\`\``)
    ).then(messages => messages.delete({ timeout: 5000 }))
    if (!messagecount) messagecount = '100';
    message.channel.messages.fetch({ limit: 100 }).then(messages => message.channel.bulkDelete(messagecount)).then(msgs => {
      message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(`\`\`\`js
${msgs.size} messages cleared
\`\`\``)
      ).then(messages =>
        messages.delete({ timeout: 5000 }));
    })
  }
});
//emsay
client.on("message", async msg => {
  if (msg.author.bot) return;
  if (msg.channel.type == "dm") return;
  if (!msg.content.startsWith(prefix)) return;
  const args = msg.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase()
  if (command === "emsay") {
    var arg = msg.content.split(' ').slice(1).join(' ')
    msg.channel.send(
      new Discord.MessageEmbed()
        .setDescription(arg)
    );
  }
});
//mute
const ms = require('ms');

client.on("message", (message) => {
  if (message.content.toLowerCase().startsWith(prefix + "mute")) {
    if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(
      new Discord.MessageEmbed().setColor("RED")
        .setDescription("❌" + " **You Need `MANAGE_ROLES` Permission To Use This Command!**")
        .setFooter(`Request By ${message.author.tag}`).setTimestamp()
    )
    if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send(
      new Discord.MessageEmbed().setColor("RED")
        .setDescription("❌" + " **I Can't Mute Any Member In This Server Becuse I Don't Have `MANAGE_ROLES` Permission!**")
        .setFooter(`Request By ${message.author.tag}`).setTimestamp()
    )
    let member = message.mentions.users.first() || client.users.cache.get(message.content.split(' ')[1])
    var user = message.guild.member(member)
    if (!user) return message.channel.send(
      new Discord.MessageEmbed().setColor("RED")
        .setDescription("❌" + " **Please Mention/ID Same One!**")
        .setFooter(`Request By ${message.author.tag}`).setTimestamp()
    )
    if (user.id === message.author.id) return message.reply(
      new Discord.MessageEmbed().setColor("YELLOW")
        .setDescription("⚠" + " **WTF Are You Doing ??**")
        .setFooter(`Request By ${message.author.tag}`).setTimestamp()
    )
    if (user.id === client.user.id) return message.channel.send(
      new Discord.MessageEmbed().setColor("YELLOW")
        .setDescription("⚠" + " **WTF Are You Doing ??**")
        .setFooter(`Request By ${message.author.tag}`).setTimestamp()
    )
    if (!message.guild.member(user).bannable) return message.reply(
      new Discord.MessageEmbed().setColor("RED")
        .setDescription("❌" + " **Soory I Can't Mute Same One High Than Me >_<**")
        .setFooter(`Request By ${message.author.tag}`).setTimestamp()
    )
    let muteRole = message.guild.roles.cache.find(n => n.name === 'Muted')
    if (!muteRole) {
      message.guild.roles.create({
        data: {
          name: "Muted",
        }
      }).then(async (role) => {
        await message.guild.channels.cache.forEach(channel => {
          channel.overwritePermissions([{
            id: role.id,
            deny: ["SEND_MESSAGES"]
          }]);
        })
      })
    }
    user.roles.add(muteRole)
    var time = message.content.split(' ')[2]
    if (!time) time = '24h'
    message.channel.send(new Discord.MessageEmbed().setColor("GREEN").setDescription("✅" + ` **${user} Has Ben Muted By <@!${message.author.id}>, For a ${ms(ms(time))}**`).setFooter(`Request By ${message.author.tag}`).setTimestamp())
    setTimeout(() => {
      user.roles.remove(muteRole);
    }, ms(time));
    return;
  }
})
//mute 
client.on('message', msg => {
  const error = "❌";
  const timeing = "⏱";
  const success = "✅";
  const lodeing = "🤔";
  let args = msg.content.split(" ");
  if (args[0] === prefix + 'unmute') {
    if (msg.author.bot) return;
    if (msg.channel.type == "dm") return msg.channel.send(new Discord.MessageEmbed().setColor("RED").setDescription(error + ` **You Can't Use This Command In DM's!**`).setFooter(`Request By ${msg.author.tag}`).setTimestamp())
    if (!msg.member.hasPermission('MANAGE_ROLES')) return msg.channel.send(new Discord.MessageEmbed().setDescription(error + " **You Need `MANAGE_ROLES` Permission To Use This Command!**").setFooter(`Request By ${msg.author.tag}`).setTimestamp())
    if (!msg.guild.me.hasPermission('MANAGE_ROLES')) return msg.channel.send(new Discord.MessageEmbed().setDescription(error + " **I Can't Kick Any Member In This Server Becuse I Don't Have `MANAGE_ROLES` Permission!**").setFooter(`Request By ${msg.author.tag}`).setTimestamp())
    let user = msg.mentions.members.first()
    if (!user) return msg.channel.send(new Discord.MessageEmbed().setDescription(error + " **Please Mention Same One!**").setFooter(`Request By ${msg.author.tag}`).setTimestamp())
    if (user.id === msg.author.id) return msg.reply(new Discord.MessageEmbed().setDescription(lodeing + " **WTF Are You Doing ??**").setFooter(`Request By ${msg.author.tag}`).setTimestamp())
    if (!msg.guild.member(user).bannable) return msg.reply(new Discord.MessageEmbed().setDescription(error + " **I Can't Unmute one high than me >_<**").setFooter(`Request By ${msg.author.tag}`).setTimestamp())
    var muteRole = msg.guild.roles.cache.find(n => n.name === 'Muted')
    if (!muteRole) return msg.channel.send(new Discord.MessageEmbed().setDescription(lodeing + ` **WTF Is That ?? [ Super Error ]**`).setFooter(`Request By ${msg.author.tag}`).setTimestamp())
    user.roles.remove(muteRole)
    msg.channel.send(lodeing + " **Processing The Unmute Function**").then((m) => {
      m.edit(success + " **Processing is complete**")
    })
    msg.channel.send(new Discord.MessageEmbed().setDescription(success + ` **${user} Has Ben Unmuted By <@!${msg.author.id}>**`).setFooter(`Request By ${msg.author.tag}`).setTimestamp())
  }
})
//antilink
/*client.on("message", niro => {
  if (niro.content.includes("https://") || niro.content.includes("Https://")) {
    if (niro.member.hasPermission('ADMINISTRATOR')) return niro.reply('you dont have Permission');
    console.log("Share links" + niro.content + " from " + `${niro.author.tag}` + "successful deleted")
    niro.delete();
    niro.channel.send("**No i delete your message you can not share links here , " + `<@${niro.author.id}>**`)
  }
  if (niro.content.includes("http://") || niro.content.includes("discord.gg")) {
    if (niro.member.hasPermission('ADMINISTRATOR')) return;
    console.log("Share links " + niro.content + " from " + `${niro.author.tag}` + "successful deleted")
    niro.delete();
    niro.channel.send("**No  I delete your message you can not share the links here, " + `<@${niro.author.id}>**`)
  }
  if (niro.content.includes("www.") || niro.content.includes(".com")) {
    if (niro.member.hasPermission('ADMINISTRATOR')) return;
    console.log("share links" + niro.content + " from " + `${niro.author.tag} + "successful deleted"`)
    niro.delete();
    niro.channel.send("**No , I delete your message , you can not share links here , " + `<@${niro.author.id}>**`)
  }
})*/
//antiswear
let swair = JSON.parse(fs.readFileSync("./swair.json", "utf8"));
client.on("message", async msg => {
  if (msg.content.startsWith(prefix + "anitsw off")) {
    if (!msg.channel.guild)
      return msg.reply("**This Command Only For Servers**");
    if (!msg.member.hasPermission("MANAGE_GUILD"))
      return msg.channel.send(
        "**ليس لديك صلحيات لأسعمال هذا الامر** `MANAGE_GUILD`"
      );
    swair[msg.guild.id] = {
      onoff: "Off"
    };
    msg.channel.send(`**⛔ تم الغاء التفعيل __𝐎𝐅𝐅__ !**`);
    fs.writeFile("./swair.json", JSON.stringify(swair), err => {
      if (err)
        console.error(err).catch(err => {
          console.error(err);
        });
    });
  }
}).on("message", async msg => {
  if (msg.content.startsWith(prefix + "antisw on")) {
    if (!msg.channel.guild)
      return msg.reply("**This Command Only For Servers**");
    if (!msg.member.hasPermission("MANAGE_GUILD"))
      return msg.channel.send(
        "**ليس لديك صلحيات لأستعمال هذا الأمر** `MANAGE_GUILD`"
      );
    swair[msg.guild.id] = {
      onoff: "On"
    };
    msg.channel.send(`**✅ تم التفعيل __𝐎𝐍__ !**`);
    fs.writeFile("./swair.json", JSON.stringify(swair), err => {
      if (err)
        console.error(err).catch(err => {
          console.error(err);
        });
    });
  }
}).on("message", msg => {
  var args = msg.content.split(/[ ]+/);
  if (msg.content.includes("شرموط")) {
    if (!swair[msg.guild.id])
      swair[msg.guild.id] = {
        onoff: "Off"
      };
    if (swair[msg.guild.id].onoff === "Off") return;
    msg.delete();
    return msg.reply(
      `**أحترم نفسك عيب **`
    );
  }
}).on("message", msg => {
  var args = msg.content.split(/[ ]+/);
  if (msg.content.includes("منيوك")) {
    if (!swair[msg.guild.id])
      swair[msg.guild.id] = {
        onoff: "Off"
      };
    if (swair[msg.guild.id].onoff === "Off") return;
    msg.delete();
    return msg.reply(
      `**أحترم نفسك عيب **`
    );
  }
}).on("message", msg => {
  var args = msg.content.split(/[ ]+/);
  if (msg.content.includes("متناك")) {
    if (!swair[msg.guild.id])
      swair[msg.guild.id] = {
        onoff: "Off"
      };
    if (swair[msg.guild.id].onoff === "Off") return;
    msg.delete();
    return msg.reply(
      `**أحترم نفسك عيب **`
    );
  }
}).on("message", msg => {
  var args = msg.content.split(/[ ]+/);
  if (msg.content.includes("عير")) {
    if (!swair[msg.guild.id])
      swair[msg.guild.id] = {
        onoff: "Off"
      };
    if (swair[msg.guild.id].onoff === "Off") return;
    msg.delete();
    return msg.reply(
      `**أحترم نفسك عيب **`
    );
  }
}).on("message", msg => {
  var args = msg.content.split(/[ ]+/);
  if (msg.content.includes("زبي")) {
    if (!swair[msg.guild.id])
      swair[msg.guild.id] = {
        onoff: "Off"
      };
    if (swair[msg.guild.id].onoff === "Off") return;
    msg.delete();
    return msg.reply(
      `**أحترم نفسك عيب **`
    );
  }
}).on("message", msg => {
  var args = msg.content.split(/[ ]+/);
  if (msg.content.includes("كس")) {
    if (!swair[msg.guild.id])
      swair[msg.guild.id] = {
        onoff: "Off"
      };
    if (swair[msg.guild.id].onoff === "Off") return;
    msg.delete();
    return msg.reply(
      `**أحترم نفسك عيب **`
    );
  }
}).on("message", msg => {
  var args = msg.content.split(/[ ]+/);
  if (msg.content.includes("كس امك")) {
    if (!swair[msg.guild.id])
      swair[msg.guild.id] = {
        onoff: "Off"
      };
    if (swair[msg.guild.id].onoff === "Off") return;
    msg.delete();
    return msg.reply(
      `**أحترم نفسك عيب **`
    );
  }
})
//role 
client.on('message' , ryham=>
{
   
    if(ryham.content.startsWith(prefix + 'role'))
    {
        if(!ryham.guild)return ryham.reply("this command is for server only");
       var role = ryham.mentions.roles.first()
       var user = ryham.mentions.members.first()
       
       if(!user || !role)return ryham.reply(`use \`${prefix}role @member @role\``)
       if(!ryham.member.hasPermission('MANAGE_ROLES'))return ryham.reply('you dont hava \`MANAGE_ROLES \`');
       if(!ryham.member.hasPermission('MANAGE_ROLES'))return ryham.reply('i dont hava \`MANAGE_ROLES \`');
       if(ryham.member.roles.cache.has(role.id))return ryham.channel.send(`${user} is hava this role${role} ?`);
       
       user.roles.add(role).then(me=>{
        ryham.channel.send(`**this member ${user}was given ${role} role 
        by:${ryham.author.username}🌟
        **`)
       })
     
    }
})
//when
client.on('guildCreate', guild => {
  guild.channels.create("wine-log", { type: "text" })
  let wine = wine.guild.channels.cache.find(wine => wine.name === 'wine-log');
  if (!wine) return;
  wine.send("Thank for add the bot, dont delete this channel")
});
//lock-unlock
client.on('message', async message => {
  if (message.content.startsWith(prefix + 'lock')) {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`>>> \`\`\`You Don't have the permission : \`\`\` \n\n **\`MANAGE_CHANNELS\`**`);
    let channel = message.mentions.channels.first();
    let channel_find = message.guild.channels.cache.find(ch => ch.id == channel);
    if (!channel) channel_find = message.channel
    if (!channel_find) return;
    channel_find.updateOverwrite(message.guild.id, {
      SEND_MESSAGES: false
    });
    message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(`\`\`\`js\n🔒 | Done Locked ${channel_find.name}\n\`\`\``)
    );
  }
});
client.on('message', async message => {
  if (message.content.startsWith(prefix + 'unlock')) {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`>>> \`\`\`You Don't have the permission : \`\`\` \n\n **\`MANAGE_CHANNELS\`**`);
    let channel = message.mentions.channels.first();
    let channel_find = message.guild.channels.cache.find(ch => ch.id == channel);
    if (!channel) channel_find = message.channel;
    if (!channel_find) return;
    channel_find.updateOverwrite(message.guild.id, {
      SEND_MESSAGES: true
    });
    message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(`\`\`\`js\n🔓 | Done Unlocked ${channel_find.name}\n\`\`\``)
    );
  }
});
//show-hide
client.on('message', message => {
  if (message.content === prefix + "hide") {
    if (message.author.bot || !message.guild) return;
    if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.reply(' ** You dont have `MANAGE_CHANNELS` permission **');
    let everyone = message.guild.roles.cache.find(hyper => hyper.name === '@everyone');
    message.channel.createOverwrite(everyone, {
      VIEW_CHANNEL: false
    }).then(() => {
      const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setThumbnail(message.guild.iconURL())
        .setDescription(`> **Done Hide This Room ${message.channel}**`)
        .setFooter(`By ${message.author.username}`)
      message.channel.send(embed)
    })
  }
});

client.on('message', message => {
  if (message.content === prefix + "show") {
    if (message.author.bot || !message.guild) return;
    if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.reply(' ** You dont have `MANAGE_CHANNELS` permission **');
    let everyone = message.guild.roles.cache.find(hyper => hyper.name === '@everyone');
    message.channel.createOverwrite(everyone, {
      VIEW_CHANNEL: true
    }).then(() => {
      const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setThumbnail(message.guild.iconURL())
        .setDescription(`> **Done Show This Room ${message.channel}**`)

        .setFooter(`By ${message.author.username}`)
      message.channel.send(embed)
    })
  }
});
//Anti-spam

//add emoji
const { parse } = require('twemoji-parser');
client.on('message', wine => {
  if (wine.content.startsWith(prefix + 'addemoji')) {
    const args = wine.content.split(' ').slice(1)
    if (!wine.member.hasPermission('MANAGE_EMOJIS')) {
      return wine.channel.send("**`You dont have permission to add emojis 😐`**");
    }

    if (!wine.guild.me.hasPermission('MANAGE_EMOJIS')) {
      return wine.channel.send("**`I need permission to add emojis 😐`**");
    }

    const emoji = args.join("");
    if (!emoji) return wine.channel.send('**`Please type the emoji to add 😃`**');

    let the_typed_emoji = Discord.Util.parseEmoji(emoji);

    if (the_typed_emoji.id) {
      const link = `https://cdn.discordapp.com/emojis/${the_typed_emoji.id}.${
        the_typed_emoji.animated ? 'gif' : 'png'
        }`;
      const name = args.slice(1).join(' ');
 
      wine.guild.emojis.create(`${link}`, `${name || `${the_typed_emoji.name}`}`);
      const done = new Discord.MessageEmbed()
        .setTitle("emoji has been added")
        .setColor('RED')
        .setFooter(`SOLAY COMMUNITY`)
        .setDescription(
          `add emojie ${name || `${the_typed_emoji.name}`} preview emojie (${link})`
        );
      return wine.channel.send(done);
    } else {
      let CheckEmoji = parse(emoji, { assetType: 'png' });
      if (!CheckEmoji[0])
        return wine.channel.send('invalied emojiev');
      wine.channel.send("unknown 🤷");
    }
  }
})
//avatar 

//ping 
client.on('message', message =>{
  if(message.content === prefix + 'ping'){
message.channel.send('ping').then(message => { 
message.edit(`\`\`\`js
ping: ${client.ws.ping} ms\`\`\``);
  });
  }
});
//user
client.on('message', async message => {
    var moment = require("moment");
    if (message.content.startsWith(prefix + "user")) {
        if (message.author.bot) return;
        if (message.channel.type == "dm") return message.channel.send(
            new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription("❌" + ` **You Can't Use This Command In DM's!**`)
            .setFooter(client.user.username, client.user.avatarURL({ dynamic: true }))
            .setTimestamp()
        )
        var args = message.content.split(" ").slice(1);
        let user = message.mentions.users.first() || message.author || message.guild.member.cache.get(args[1]);
        moment.locale('ar-TN');
        const db = require('quick.db')
        const flags = user.flags || await user.fetchFlags();
        await db.set(`${user.id}`, [])
        if (flags.toArray().includes('DISCORD_PARTNER')) db.push(`${user.id}`, "<:6714discordpartner:839529122467938375>")
        if (flags.toArray().includes('HYPESQUAD_EVENTS')) db.push(`${user.id}`, "<:hypesquadbadge:839529122472656977>");
        if (flags.toArray().includes('HOUSE_BRILLIANCE')) db.push(`${user.id}`, "<:briliatn:865039149101613136>");
        if (flags.toArray().includes('HOUSE_BRAVERY')) db.push(`${user.id}`, "<:Bravery:850826343864336454>");
        if (flags.toArray().includes('HOUSE_BALANCE')) db.push(`${user.id}`, "<:balance:839529122756952074>");
        if (flags.toArray().includes('BUGHUNTER_LEVEL_2')) db.push(`${user.id}`, "<:hunterlv2:839529122900475964>");
        if (flags.toArray().includes('BUGHUNTER_LEVEL_1')) db.push(`${user.id}`, "<:hunterlv1:839529122912010282>");
        if (flags.toArray().includes('EARLY_SUPPORTER')) db.push(`${user.id}`, "<:earlysupporter:839529152100565032>");
        if (flags.toArray().includes('VERIFIED_DEVELOPER')) db.push(`${user.id}`, "<:9developer:839529122878455848>");
        if (flags.toArray().includes('EARLY_VERIFIED_DEVELOPER')) db.push(`${user.id}`, "<:9developer:839529122878455848>");
        let nitro = user.avatarURL({ dynamic: true });
        if (nitro.includes('gif')) db.push(`${user.id}`, " <:nitro:859496544821313606>");
        var emojis = db.get(`${user.id}`);
        var statusFull;
        var status = user.presence.status;
        if (status.includes('dnd')) statusFull = '🔴 | DND';
        if (status.includes('offline')) statusFull = '⚫ | Offline';
        if (status.includes('online')) statusFull = '🟢 | Online';
        if (status.includes('idle')) statusFull = '🟡 | Idle';
        var bot = false;
        if (user.bot) bot = true;
        message.channel.send(
            new Discord.MessageEmbed()
            .setAuthor(user.username, user.avatarURL({ dynamic: true }))
            .setColor(message.member.displayHexColor)
            .addFields({
                name: "**Name:**",
                value: user.username,
                inline: true
            }, {
                name: "**Tag:**",
                value: '#' + user.discriminator,
                inline: true
            }, {
                name: "**Id:**",
                value: user.id,
                inline: true
            }, {
                name: "**Badge:**",
                value: emojis,
                inline: true
            }, {
                name: "**User Presence:**",
                value: statusFull,
                inline: true
            }, {
                name: "**Bot:**",
                value: bot,
                inline: true
            }, {
                name: "**Joined Discord:**",
                value: `${moment(user.createdTimestamp).format('YYYY/M/D')} **\n** \`${moment(user.createdTimestamp).fromNow()}\``,
                inline: true
            }, {
                name: "**Joined Server:**",
                value: `${moment(user.joinedAt).format('YYYY/M/D')} \n \`${moment(user.joinedAt).fromNow()}\``,
                inline: true
            })
            .setThumbnail(user.avatarURL({
                dynamic: true,
                format: 'png',
                size: 1024
            }))
            .setFooter(client.user.username, client.user.avatarURL({ dynamic: true }))
            .setTimestamp()
        )
    }
});

var top = require("./top.json");

function save() {
  fs.writeFileSync("./top.json", JSON.stringify(top, null, 4));
}
client.on("voiceStateUpdate", async function(oldMember, newMember) {
  if (newMember.user.bot) return;
  if (!top[newMember.guild.id]) top[newMember.guild.id] = {};
  if (!top[newMember.guild.id][newMember.user.id]) top[newMember.guild.id][newMember.user.id] = {
    "text": 0,
    "voice": parseInt(Math.random() * 10),
    "msgs": 0,
    "id": newMember.user.id
  }
  save();
  if (!oldMember.voice.channel && newMember.voice.channel) {
    var addXP = setInterval(async function() {
      top[newMember.guild.id][newMember.user.id].voice += parseInt(Math.random() * 4);
      save();
      if (!newMember.voice.channel) {
        clearInterval(addXP);
      }
    }, 60000);
  }
});
client.on("message", async function(message) {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!top[message.guild.id]) top[message.guild.id] = {};
  if (!top[message.guild.id][message.author.id]) top[message.guild.id][message.author.id] = {
    "text": parseInt(Math.random() * 10),
    "voice": 1,
    "msgs": 0,
    "id": message.author.id
  }
  if (top[message.guild.id][message.author.id].msgs > 10) {
    top[message.guild.id][message.author.id].text += parseInt(Math.random() * 4);
    top[message.guild.id][message.author.id].msgs = 0;
  }
  save();
  var args = message.content.split(" ");
  var cmd = args[0].toLowerCase();
  if (!message.content.startsWith(prefix)) return;
  if (message.content.startsWith(prefix + "top text")) {
    var topArray = Object.values(top[message.guild.id]);
    var num = 0;
    var textStr = `${topArray.sort((a, b) => b.text - a.text).slice(0, 5).filter(user => user.text > 0 && message.guild.members.cache.get(user.id)).map(function(user) {
      if (user.text > 0) {
        return `**#${++num} | <@${user.id}> XP: \`${user.text}\` **`
      }
    }).join("\n")}`;
    var embed = new Discord.MessageEmbed()
      .setAuthor("📋 Guild Score Leaderboards", message.guild.iconURL())
      .setColor("13B813")
      .addField(`**:speech_balloon: | TEXT LEADERBOARD**`, `${textStr}`, true)
      .setFooter(message.author.tag, message.author.displayAvatarURL())
      .setTimestamp()
    message.channel.send({
      embed: embed
    });
  } else {
    if (message.content.startsWith(prefix + "top voice")) {
      var topArray = Object.values(top[message.guild.id]);
      var num = 0;
      var voiceStr = `${topArray.sort((a, b) => b.voice - a.voice).slice(0, 5).filter(user => user.voice > 0 && message.guild.members.cache.get(user.id)).map(function(user) {
        if (user.voice > 0) {
          return `**#${++num} | <@${user.id}> XP: \`${user.voice}\` **`
        }
      }).join("\n")}`;
      var embed = new Discord.MessageEmbed()
        .setAuthor("📋 Guild Score Leaderboards", message.guild.iconURL())
        .setColor("13B813")
        .addField(`**:microphone2: | VOICE LEADERBOARD**`, `${voiceStr}`, true)

        .setFooter(message.author.tag, message.author.displayAvatarURL())
        .setTimestamp()
      message.channel.send({
        embed: embed
      });

    } else {
      if (message.content.startsWith(prefix + "reset voice")) {
        var reset = '**:white_check_mark:  Stats has been reset successfully.**'
        var confirm = '**:thinking: Are you sure you want to reset all voice xp?**'

        message.channel.send(`**${confirm}**`).then(async msg => {
          await msg.react("✅")
          await msg.react("❌")
          const ncr1 = msg.createReactionCollector((reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id, { time: 60000 })
          const ncr2 = msg.createReactionCollector((reaction, user) => reaction.emoji.name === "❌" && user.id === message.author.id, { time: 60000 })
          ncr1.on("collect", async r => {
            msg.delete()
            msg.channel.send(`${reset}`)
          })

          ncr2.on("collect", async r => {
            msg.delete()
          })
        })
      } else {
        if (message.content.startsWith(prefix + "top")) {
          var topArray = Object.values(top[message.guild.id]);
          var num = 0;
          var textStr = `${topArray.sort((a, b) => b.text - a.text).slice(0, 10).filter(user => user.text > 0 && message.guild.members.cache.get(user.id)).map(function(user) {
            if (user.text > 0) {
              return `**#${++num} | <@${user.id}> XP: \`${user.text}\` **`
            }
          }).join("\n")}`;
          num = 0;
          var voiceStr = `${topArray.sort((a, b) => b.voice - a.voice).slice(0, 10).filter(user => user.voice > 0 && message.guild.members.cache.get(user.id)).map(function(user) {
            if (user.voice > 0) {
              return `**#${++num} | <@${user.id}> XP: \`${user.voice}\` **`
            }
          }).join("\n")}`;
          var embed = new Discord.MessageEmbed()
            .setAuthor("📋 Guild Score Leaderboardss", message.guild.iconURL())
            .addField("**TOP 5 TEXT :speech_balloon:**", `${textStr}  \n\n  **:sparkles: More?** \`${prefix}top text\``, true)
            .addField("**TOP 5 VOICE :microphone2:**", `${voiceStr} \n\n **:sparkles: More?** \`${prefix}top voice\``, true)
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp()
            .setColor("13B813");
          message.channel.send({
            embed: embed


          });



        }
      }
    }
  }
});
//bot
client.on('message', msg => {
  if (msg.content === prefix + "") {
    const embed = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setTitle(` ${client.user.username} `)
      .addField('``My Name``', ` ${client.user.tag}`, true)
      .addField('``servers``', ` ${client.guilds.cache.size} `, true)
      .addField('``channels``', ` ${client.channels.cache.size} `, true)
      .addField('``Users``', ` ${client.users.cache.size} `, true)
      .addField('``My ID``', ` ${client.user.id} `, true)
      .setFooter(`Code By 1DF9`)
    msg.channel.send(embed);
  }
}).on('message', msg => {
  if (msg.channel.type === 'dm') return;
  var args = msg.content.split(" ").slice(1).join("")
  if (msg.content.startsWith(prefix + 'link')) {
    if (msg.mentions.users.first()) {
      msg.reply(`**Link : https://discord.com/api/oauth2/authorize?client_id=${msg.mentions.users.first().id}&permissions=8&scope=bot**`)
    }
    if (args && !msg.mentions.users.first()) {
      msg.reply(`**Link : https://discord.com/api/oauth2/authorize?client_id=${args}&permissions=8&scope=bot**`)
    }
  }
}).on('message', msg => {
  if (msg.channel.type === 'dm') return;
  var args = msg.content.split(" ").slice(1).join(" ")
  if (msg.content.startsWith(prefix + 'embedpic')) {
    if (!args) return msg.reply("**you Need To Add The Picture URL!**")
    var Discord = require("discord.js")

    const embed = new Discord.MessageEmbed()
      .setAuthor("Embed Photo")
      .setColor('RANDOM')
      .setTitle("Photo Link")
      .setURL(args)
      .setImage(args)
      .setFooter(`Requested By ${msg.author.tag}`, msg.author.avatarURL({ dynamic: true }))
    msg.delete()
    msg.channel.send(embed)
  }
}).on('message', msg => {
  if (msg.channel.type === 'dm') return;
  var args = msg.content.split(" ").slice(1).join(" ")
  if (msg.content.startsWith(prefix + 'encrypt')) {
    if (!args) return msg.reply(`**You Need To Add The Text!**`)
    var encode = generator.generate({
      length: 60,
      numbers: false
    })
    var Discord = require("discord.js")
    const embed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Encryption System')
      .setDescription
      (`**Decrypt Code : ${encode}**`)
      .setTimestamp()
      .setFooter("The Message Will Be Deleted When Someone Decrypt It");
    db.set(encode, args)
    msg.delete()
    msg.author.send(embed)

  }
}).on('message', msg => {
  if (msg.channel.type === 'dm') return;
  var args = msg.content.split(" ").slice(1).join("")
  if (msg.content.startsWith(prefix + 'decrypt')) {
    if (!args) return msg.reply(`**You Need To Add The Text!**`)
    var Discord = require("discord.js")
    const embed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Encryption System')
      .setDescription
      (`**Message : ${db.get(args)}**`)
      .setTimestamp()
      .setFooter("The Message Has Been Deleted From Our System");
    msg.delete()
    msg.author.send(embed)
    db.delete(args)

  }
}).on('message', msg => {
  if (msg.channel.type === 'dm') return;
  var args = msg.content.split(" ").slice(1).join(" ")
  if (msg.content.startsWith(prefix + 'setline')) {
    if (!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return msg.reply("**You Don't Have Perms!**");
    if (!args) return msg.reply("**you Need To Add Line URL!**")
    if (db.get(`${msg.guild.id}line`) === args) return msg.reply(`**Settings Already Using This Line!**`)
    db.set(`${msg.guild.id}line`, args)
    msg.delete()
    msg.reply("**Settings Updated!**")
  }
}).on('message', msg => {
  if (msg.channel.type === 'dm') return;
  if (msg.content.startsWith(prefix + 'line')) {
    if (!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return msg.reply("**You Don't Have Perms!**");
    if (!db.get(`${msg.guild.id}line`)) return msg.reply("**You Didn't Setup The Line Command!**")
    msg.channel.send(db.get(`${msg.guild.id}line`))
    msg.delete()
  }
}).on('message', msg => {
  if (msg.channel.type === 'dm') return;
  var args = msg.content.split(" ").slice(1).join(" ")
  if (msg.content.startsWith(prefix + 'setautorole')) {
    if (!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return msg.reply("**You Don't Have Perms!**");
    if (!args) return msg.reply("**you Need To Add Role Name!**")
    if (db.get(`${msg.guild.id}autorole`) === args) return msg.reply(`**Settings Already Using Name ${args}!**`)
    let role = msg.guild.roles.cache.find(r => r.name === args);
    if (!role) return msg.reply("**I Can't Find This Role!**")
    db.set(`${msg.guild.id}autorole`, args)
    msg.reply("**Settings Updated!**")
  }
}).on('message', msg => {
  if (msg.channel.type === 'dm') return;
  if (msg.content.startsWith(prefix + 'enable autorole')) {
    if (db.has(`${msg.author.id}blacklist`)) return msg.reply(`**You Are Blacklisted!**`)
    if (!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return msg.rely("**You Don't Have Perms!**");
    if (db.get(`${msg.guild.id}autorolestatus`) === "on") return msg.reply("**Settings Already Enabled!**")
    db.set(`${msg.guild.id}autorolestatus`, "on")
    msg.reply("**Settings Updated!**")
  }
}).on('message', msg => {
  if (msg.channel.type === 'dm') return;
  if (msg.content.startsWith(prefix + 'disable autorole')) {
    if (!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return msg.reply("**You Don't Have Perms!**");
    if (db.get(`${msg.guild.id}autorolestatus`) === "off") return msg.reply("**Settings Already Disabled!**")
    db.set(`${msg.guild.id}autorolestatus`, "off")
    msg.reply("**Settings Updated!**")
  }
}).on('guildMemberAdd', member => {
  var role = member.guild.roles.cache.find(role => role.name === db.get(`${member.guild.id}autorole`));
  if (!role) return;
  if (db.get(`${member.guild.id}autorolestatus`) === "on") return member.roles.add(role)
  if (db.get(`${member.guild.id}autorolestatus`) === "off") return;
})

  .login(process.env.token);

  //dev 
client.on('message', (message) => {
    if (message.content.startsWith(prefix + 'dev')) {
        if (message.author.bot) {
            return
        };
        if (message.channel.type == 'dm') {
            return message.channel.send(
                new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(error + `" **You Can't Use This Command In DM's!**`)
                .setFooter(`request BY ${message.author.tag }`)
                .setTimestamp()
            )
        };
        message.channel.send( ' **Processing developer data ...**').then((msg) => {
            msg.edit(success + ' **Processing is complete**')
        });
        message.channel.send(
            new Discord.MessageEmbed()
            .setAuthor('Developer Info.')
            .addField(`:sparkler: Name`, `wine`, true)
            .addField(`🛠 Support Server`, `https://discord.gg/T5es3gh3a4`, true)
            .addField(`✨my website`, ` https://wine-bot-website.w7.repl.co/ `, true)
            .addField(`👨‍💻 Discord Name`, `ⓦⓘ » wine#0001`, true)
            .setFooter(`request BY ${message.author.tag}`)
            .setTimestamp()
        )
    }
});
client.on('message', (message) => {
    if (message.content.startsWith(prefix + 'invite')) {
        if (message.author.bot) {
            return
        };
        if (message.channel.type == 'dm') {
            return message.channel.send(
                new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(error + ` **You Can't Use This Command In DM's!**`)
                .setFooter(`request BY ${message.author.tag}`)
                .setTimestamp()
            )
        };
        message.author.send(
            new Discord.MessageEmbed()
            .setDescription(`[Invite Me Right Now](https://discord.com/oauth2/authorize?client_id=${client.user.id}${'&scope=bot&permissions=859303294)'}`)
        );
        message.react('🌚')
    }
});
client.on('message', (message) => {
    if (message.content.startsWith(prefix + 'bot')) {
        if (message.author.bot) {
            return
        };
        if (message.channel.type == 'dm') {
            return message.channel.send(
                new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(error + ` **You Can't Use This Command In DM's!**`)
                .setFooter(`request BY ${message.author.tag }`)
                .setTimestamp()
            )
        };
        let eembeds = new Discord.MessageEmbed()
        .setAuthor('Bot Info')
        .setDescription(`[invite me](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=859303294)`)
        .addField('**Bot Name:**', `${client.user.tag}`, true)
        .addField('**Bot ping:**', `${client.ws.ping}`, true)
        .addField('**Servers Count:**', `${client.guilds.cache.size}`, true)
        .addField('**Users size:**', `${client.users.cache.size}`, true)
        .addField('**Channels size:**', `${client.channels.cache.size}`, true)
        .addField('**Bot prefix:**', `${prefix}`, true)
        .setFooter(`Requsted by:${message.author.username}`)
        .setTimestamp();
        message.channel.send(eembeds)
    }
})
//server
client.on('message', mecodes => {
  if (mecodes.content === `$server`) {    
                let embed = new Discord.MessageEmbed()
              .setColor("#025efe")
                .setTitle("Server Info")
                .setThumbnail(mecodes.guild.iconURL())
                .setAuthor(`${mecodes.guild.name} Server Info`, mecodes.guild.iconURL())
                .addField("<:globe_with_meridians:> ** Server Name : **", `${mecodes.guild.name}`, true)
                .addField("<:id:> **server id**", `${mecodes.guild.id}`)
                .addField("<:newspaper:> **Server Channels**", `${mecodes.guild.channels.cache.filter(r => r.type === "text").size}`)
                .addField("<:loud_sound:> ** Server Voice Channels**", `${mecodes.guild.channels.cache.filter(c => c.type === "voice").size}`)
                .addField("<:mens:> **Server Members **", `${mecodes.guild.memberCount}`, true)
                .addField("<:name_badge:> **Server Roles **", `${mecodes.guild.roles.cache.size}`, true)
            mecodes.channel.send(embed);
  }
})
//say
client.on("message",  msg =>{
  let moonlight = msg.content.split(" ").slice('1').join(" ")
    if(msg.author.bot)return;
  if (msg.content.startsWith(prefix + 'say')) {
if (!msg.member.hasPermission('ADMINISTRATOR'))
                return msg.channel.send('Permission required!');
                msg.delete()
                   msg.channel.send(`${moonlight}`)
    
  }
});