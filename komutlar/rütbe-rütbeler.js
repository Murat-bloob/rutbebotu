const Discord = require("discord.js");
const Database = require("../Helpers/Database");

exports.run = async (client, message, args) => {
    const db = new Database("./Servers/" + message.guild.id, "Rewards");//pythonic
    var data = db.get(`rewards`) || {};//pythonic

    var list = data.sort((x, y) => y.targetInvite - x.targetInvite);//pythonic
      if(list.length === 0){
        var yok = new Discord.MessageEmbed()//pythonic
            .setAuthor("Hiç Bir Rank Ayarlanmamış")//pythonic
            .setDescription("Ayarlamak İçin !rütbe-ekle @rol davetsayi");//pythonic
            return message.channel.send(yok);
        }

    var embed = new Discord.MessageEmbed()//pythonic
        .addField("Rütbeler", `
    ** **${list.splice(0, 10).map((item, index) => `\`${index + 1}.\` <@&${item.Id}>: \`${item.Invite} Davete\``).join("\n")}//pythonic
    `);

    message.channel.send(embed);
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};
exports.help = {
  name: 'rütbeler',
  description: 'Logo Yaparsınız',
  usage: 'm-logo <yazı>'
};
