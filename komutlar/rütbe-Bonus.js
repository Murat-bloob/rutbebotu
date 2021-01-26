const Discord = require("discord.js");
const Database = require("../Helpers/Database");
// exports.onLoad = (client) => {};
/**
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 */
exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !message.member.hasPermission("MANAGE_GUILD")) return message.reply("Yetkiniz Bulunmamaktadır"); //pythonic
//pythonic
    var victim = message.mentions.members.size > 0 ? message.mentions.members.first().id : args.length > 0 ? args[0] : undefined;//pythonic//pythonic//pythonic
    if(!victim) return message.reply("Lütfen Birinin İD Sini Yaz");//pythonic//pythonic
    victim = message.guild.member(victim);//pythonic
    if(!victim) return message.reply("İD Sini Yazdığınız Kişi Sunucuda Bulunmamaktadır.");//pythonic

    var num = Number(args[1]);//pythonic
    if(isNaN(num)) return message.reply("Lütfen Bonus Olacak Sayı Giriniz.");//pythonic
    const db = new Database("./Servers/" + message.guild.id, "Invites");//pythonic

    var bonus = (db.add(`invites.${victim.id}.bonus`, num) || 0), total = (db.get(`invites.${victim.id}.total`) || 0);
    message.channel.send(`${victim} Adlı Kişiye ${num} Civarı Bonus Eklendi.`);//pythonic

    global.onUpdateInvite(victim, message.guild.id, total + bonus);//pythonic
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};
exports.help = {
  name: 'bonus-ekle',
  description: 'Logo Yaparsınız',
  usage: 'm-logo <yazı>'
};
