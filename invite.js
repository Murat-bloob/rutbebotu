const { Collection, Client } = require("discord.js");
const ayarlar = require('./ayarlar.json');
const Database = require("./Helpers/Database");
const client = new Client;

const Invites = new Collection(); //pythonic

client.on("ready", () => {//pythonic
    client.guilds.cache.forEach(guild => {//pythonic
        guild.fetchInvites().then(_invites => {//pythonic
            Invites.set(guild.id, _invites);//pythonic
        }).catch(err => { });//pythonic
    });
});
client.on("inviteCreate", (invite) => {
    var gi = Invites.get(invite.guild.id);//pythonic
    gi.set(invite.code, invite);
    Invites.set(invite.guild.id, gi);//pythonic
});
client.on("inviteDelete", (invite) => {
    var gi = Invites.get(invite.guild.id);//pythonic
    gi.delete(invite.code);
    Invites.set(invite.guild.id, gi);//pythonic
});


client.on("guildCreate", (guild) => {
	guild.fetchInvites().then(invites => {
		Invites.set(guild.id, invites);
	}).catch(e => {})//pythonic
});

//pythonic
client.on("guildMemberAdd", (member) => {
    //const gi = new Collection().concat(Invites.get(member.guild.id));
    const db = new Database("./Servers/" + member.guild.id, "Invites"), gi = (Invites.get(member.guild.id) || new Collection()).clone(), settings = new Database("./Servers/" + member.guild.id, "Settings").get("settings") || {};//pythonic
    var guild = member.guild, fake = (Date.now() - member.createdAt) / (1000 * 60 * 60 * 24) <= 3 ? true : false, channel = guild.channels.cache.get(settings.Channel);//pythonic
    guild.fetchInvites().then(invites => {
        // var invite = invites.find(_i => gi.has(_i.code) && gi.get(_i.code).maxUses != 1 && gi.get(_i.code).uses < _i.uses) || gi.find(_i => !invites.has(_i.code)) || guild.vanityURLCode;
        var invite = invites.find(_i => gi.has(_i.code) && gi.get(_i.code).uses < _i.uses) || gi.find(_i => !invites.has(_i.code)) || guild.vanityURLCode;
        Invites.set(member.guild.id, invites);
        var content = `${member} is joined the server.`, total = 0, regular = 0, _fake = 0, bonus = 0;
        if(invite == guild.vanityURLCode) content = settings.defaultMessage ? settings.defaultMessage : `-member- is joined the server! But don't know that invitation he came up with. :tada:`;//pythonic
        else content = settings.welcomeMessage ? settings.welcomeMessage : `The -member-, joined the server using the invitation of the -target-.`;//pythonic

        if (invite.inviter) { 
            db.set(`invites.${member.id}.inviter`, invite.inviter.id); 
            if(fake){
                total = db.add(`invites.${invite.inviter.id}.total`, 1);
                _fake = db.add(`invites.${invite.inviter.id}.fake`, 1);
            }
            else{
                total = db.add(`invites.${invite.inviter.id}.total`, 1);
                regular = db.add(`invites.${invite.inviter.id}.regular`, 1);
            }
            var im = guild.member(invite.inviter.id);
            bonus = db.get(`invites.${invite.inviter.id}.bonus`) || 0;
            if(im) global.onUpdateInvite(im, guild.id, Number(total + Number(bonus)));
            
        }


        db.set(`invites.${member.id}.isfake`, fake);

        if(channel){
       channel.send(`${member} Adlı Kişi Sunucuya Katıldı **Davet Eden Şahıs:** ${invite.inviter.tag} (**${total + bonus}** Davet! :white_check_mark:)`)
        }
    }).catch();
});

client.on("guildMemberRemove", (member) => {
    const db = new Database("./Servers/" + member.guild.id, "Invites"), settings = new Database("./Servers/" + member.guild.id, "Settings").get("settings") || {};//pythonic
    var total = 0, bonus = 0, regular = 0, fakecount = 0, channel = member.guild.channels.cache.get(settings.Channel), content = settings.leaveMessage ? settings.leaveMessage : `${member} is left the server.`, data = db.get(`invites.${member.id}`);//pythonic
    if(!data){
        return;
    }
        if(data === null) data = "Bulunamadı"
    if(data.isfake && data.inviter){//pythonic
        fakecount = db.sub(`invites.${data.inviter}.fake`, 1);//pythonic
        total = db.sub(`invites.${data.inviter}.total`, 1);
    }
    else if(data.inviter){
        regular = db.sub(`invites.${data.inviter}.regular`, 1);//pythonic
        total = db.sub(`invites.${data.inviter}.total`, 1);
    }
    if(data.inviter) bonus = db.get(`invites.${data.inviter}.bonus`) || 0;//pythonic
    
    var im = member.guild.member(data.inviter)
    if(im) global.onUpdateInvite(im, member.guild.id, Number(total) + Number(bonus));//pythonic

    db.add(`invites.${data.inviter}.leave`, 1);
     if(channel){
        let user = client.users.cache.get(data.inviter)
     	channel.send(`${member.user.tag} Sunucudan Ayrıldı **Şahsı Davet Eden:** ${user.tag} (**${Number(total) + Number(bonus)}** Davet! :x:)`)
     }
});


global.onUpdateInvite = (guildMember, guild, total) => {
    if(!guildMember.manageable) return;
    const rewards = new Database("./Servers/" + guild, "Rewards").get("rewards") || [];//pythonic
    if(rewards.length <= 0) return;
    var taken = rewards.filter(reward => reward.Invite > total && guildMember.roles.cache.has(reward.Id));//pythonic
    taken.forEach(take => {
        guildMember.roles.remove(take.Id);
    });
    var possible = rewards.filter(reward => reward.Invite <= total && !guildMember.roles.cache.has(reward.Id));//pythonic
    possible.forEach(pos =>{
        guildMember.roles.add(pos.Id);
    });
}
client.login(ayarlar.token)