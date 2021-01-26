const Discord = require("discord.js");
const Database = require("../Helpers/Database");


exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !message.member.hasPermission("MANAGE_GUILD")) return message.reply("Yetkin Yok!");//pythonic
const db = new Database("./Servers/" + message.guild.id, "Rewards");//pythonic
    const db2 = new Database("./Servers/" + message.guild.id, "Invites");//pythonic
db.set("rewards");//pythonic
message.channel.send("Rütbeler Sıfırlandı")//pythonic
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};
exports.help = {
  name: 'rütbe-sıfırla',
  description: 'Logo Yaparsınız',
  usage: 'm-logo <yazı>'
};

