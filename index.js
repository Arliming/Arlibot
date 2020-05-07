const Discord = require('discord.js')
const Secure = require('./secure.js')
let toEmbed = require(`${__dirname}/KingEmbed.js`)
const client = new Discord.Client()
const secure = new Secure()
const prefix = 'a,'
const {
    Util
} = require("discord.js")
const ytdl = require('ytdl-core');
const queue = new Map();

client.on('message', async msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
    const args = msg.content.split(' ');
    const serveurQueue = queue.get(msg.guild.id);
    if (msg.content.startsWith(`${prefix}play`)) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('Pardon, mais vous devez être dans un vocal pour écouter de la musique !');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) {
            return msg.channel.send('Je ne peux pas me connecter au vocal, je ne possède pas les permissions !');
        }
        if (!permissions.has('SPEAK')) {
            return msg.channel.send('Je ne peux pas jouer dans ce vocal, je ne possède pas les permissions !');
        }
        const songInfo = await ytdl.getInfo(args[1]);
        const song = {
            title: Util.escapeMarkdown(songInfo.title),
            url: songInfo.video_url
        };
        if (!serveurQueue) {
            const queueConstruct = {
                textChannel: msg.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };
            queue.set(msg.guild.id, queueConstruct);
            queueConstruct.songs.push(song);
            try {
                var connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                play(msg.guild, queueConstruct.songs[0]);
            }
            catch (error) {
                console.error(`Je ne peux pas rejoindre le salon vocal: ${error}`);
                queue.delete(msg.guild.id);
                return msg.channel.send(`Je ne peux pas rejoindre le salon vocal: ${error}`);
            }
        }
        else {
            serveurQueue.songs.push(song);
            console.log(serveurQueue.songs);
            return msg.channel.send(`**${song.title}** a été ajouté à la queue !`);
        }
        return undefined;
    }
    else if (msg.content.startsWith(`${prefix}skip`)) {
        if (!msg.member.voiceChannel) return msg.channel.send('Il faut être dans un salon vocal préalablement !');
        if (!serveurQueue) return msg.channel.send('Je ne peux rien skip pour vous.');
        serveurQueue.connection.dispatcher.end('Une commande skip a été utilisée !');
        return undefined;
    }
    else if (msg.content.startsWith(`${prefix}stop`)) {
        if (!msg.member.voiceChannel) return msg.channel.send('Il faut être dans un salon vocal préalablement !');
        if (!serveurQueue) return msg.channel.send('Je ne peux rien stop pour vous.');
        serveurQueue.connection.dispatcher.end('Une commande stop a été utilisée !');
        return undefined;
    }
    else if (msg.content.startsWith(`${prefix}volume`)) {
        if (!msg.member.voiceChannel) return msg.channel.send('Il faut être dans un salon vocal préalablement !');
        if (!serveurQueue) return msg.channel.send('Il n\'y a rien à jouer.');
        if (!args[1]) return msg.channel.send(`Le volume actuel est: **${serveurQueue.volume}**`);
        serveurQueue.volume = args[1];
        serveurQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
        return msg.channel.send(`Je régle le volume à: **${args[1]}**`);
    }
    else if (msg.content.startsWith(`${prefix}np`)) {
        if (!serveurQueue) return msg.channel.send('Il n\'y a rien à jouer.');
        return msg.channel.send(`Now playing: ${serveurQueue.songs[0].title}`);
    }
    else if (msg.content.startsWith(`${prefix}queue`)) {
        if (!serveurQueue) return msg.channel.send('Il n\'y a rien à jouer.');
        return msg.channel.send(`
__**Musique Queue**__
${serveurQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Actuellement:** ${serveurQueue.songs[0].title}
`);
    }
    else if (msg.content.startsWith(`${prefix}pause`)) {
        if (serveurQueue && serveurQueue.playing) {
            serveurQueue.playing = false;
            serveurQueue.connection.dispatcher.pause();
            return msg.channel.send('PAUSE MONSIEUR L\'ARBITRE !!!');
        }
        return msg.channel.send('Il n\'y a rien à jouer.');
    }
    else if (msg.content.startsWith(`${prefix}resume`)) {
        if (serveurQueue && !serveurQueue.playing) {
            serveurQueue.playing = true;
            serveurQueue.connection.dispatcher.resume();
            return msg.channel.send('Et c\'est repartie pour un touuuur en avant manège !!!');
        }
        return msg.channel.send('Il n\'y a rien à jouer.');
    }
    else if (!msg.system && !msg.author.bot) {
        if (msg.content.includes(prefix + 'exit') && msg.member.id === '308540889754501120') {
            msg.channel.send('`Bye tout le monde !`')
            msg.delete()
            client.destroy()
        }
        else if (msg.content.includes(prefix + 'help')) {
            var help = new Discord.RichEmbed()
            help.setColor('#F8E000');
            help.setTitle("Toutes les Commandes");
            help.setAuthor(msg.author.tag, msg.author.avatarURL);
            help.addField(
                ":star: ADMINISTRATOR :star:",
                `\`${prefix}loto\` - [ Lance un giveway ]\n` +
                `Codé, en attente de l'host : Commande de mute, de kick et de ban !\n`
                );
            help.addField(
                "╔══ Commande Principales ══╗",
                `\`${prefix}avatar <pseudo>\` - [ Voir l'avatar d'un membre du discord ]\n` +
                `\`${prefix}embed <help>\` - [ Pour faire votre propre embed ]\n` +
                `\`${prefix}sondage\` - [ Faire votre propre embed de codage ]\n` +
                `\`${prefix}anime help\` - [ Commandes Animes ]\n` +
                `\`${prefix}music\` - [ Commandes Musique ]\n` +
                `\`${prefix}search <recherche>\` - [ Recherche sur Qwant ]\n` +
                `\`${prefix}dé\` - [ Lance un dé ]\n` +
                `\`${prefix}Hyunjin\` - [ Présentation de Hyunjin ]\n` +
                `\`${prefix}Lalisa\` - [ Présentation de Lalisa ]\n`
                );
            help.addField(
                ":pencil: Info :pencil:",
                `\`${prefix}news\` - [ News à propos du Bot ]\n` +
                `\`${prefix}music\` - [ Affiche les commandes du Bot music ]\n` +
                `\`${prefix}invite\` - [ Lien d'invitation du Bot ]\n` +
                `\`${prefix}embed help\` - [ Explication du KingEmbed ]\n`
                );
            help.addField(
                ":no_entry: Commande d'Arli :no_entry:",
                `\`${prefix}exit\` - [ Quitte le Bot ]\n` +
                `\`${prefix}plop\` - [ Affiche les liens d'invites des discords où le Bot est co ]\n` +
                `\`${prefix}membres\` - [ Affiche l'id discord des membres d'un discord ]\n`
                );
            help.setFooter("Made by Arliming");
            help.setThumbnail(client.user.avatarURL);
            help.setTimestamp();
            msg.channel.send(help)
            msg.delete()
        }
        else if (msg.content.includes(prefix + 'search') && msg.content.includes(' ') && msg.content.length > 11) {
            let recherche = msg.content.replace(prefix + "search", "").trim().replace(/ /g, "%20")
            var search = new Discord.RichEmbed()
            search.setColor('#F8E000');
            search.setAuthor(msg.author.tag, msg.author.avatarURL);
            search.setDescription(`https://www.qwant.com/?client=brz-moz&q=${recherche}`);
            search.setFooter("Made by Arliming");
            search.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Qwant_new_logo_2018.svg/1200px-Qwant_new_logo_2018.svg.png");
            search.setTimestamp();
            msg.channel.send(search)
            msg.delete()
        }
        else if (msg.content.includes(prefix + 'dé')) {
            let random = Math.floor(Math.random() * 6)
            let alpha = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:"]
            var lancedé = new Discord.RichEmbed()
            lancedé.setColor('#F8E000');
            lancedé.setAuthor(msg.author.tag, msg.author.avatarURL);
            lancedé.setDescription(`je lance mon dé...`);
            lancedé.setFooter("Made by Arliming");
            lancedé.setThumbnail("https://cdn.discordapp.com/emojis/560972897376665600.gif?v=1");
            lancedé.setTimestamp();
            msg.channel.send(lancedé)
            setTimeout(function () {
                msg.channel.send(alpha[random])
            }, 1000 * 3)
            msg.delete()
        }
        else if (msg.content.includes(prefix + 'loto') && msg.member.hasPermission("ADMINISTRATOR")) {
            let members_id = Array.from(msg.guild.members.keys())
            let member = msg.guild.members.get(members_id[Math.floor(Math.random() * members_id.length)])
            var loto = new Discord.RichEmbed()
            loto.setColor('#F8E000');
            loto.setTitle("MEGA GIVEWAY");
            loto.setAuthor(msg.author.tag, msg.author.avatarURL);
            loto.setDescription(
                `${member.displayName} win the giveway! :tada:\n` +
                `Félicitation ${tag(member)} !`);
            loto.setFooter("Made by Arliming");
            loto.setThumbnail("https://cdn.discordapp.com/attachments/551861039805759518/552207928761778220/kamas.png");
            msg.channel.send(loto)
            msg.delete()
        }
        else if (msg.content.includes(prefix + 'membres') && msg.member.id === '308540889754501120') {
            let info = msg.guild.members.map(membre => '>\t' + membre.id + '\t' + membre.displayName).join('\n')
            console.log(info)
            msg.delete()
        }
        else if (msg.content.includes(prefix + 'invite')) {
            var invitebot = new Discord.RichEmbed()
            invitebot.setColor('#F8E000');
            invitebot.setTitle("Voici le lien d'invitation de Arlibot");
            invitebot.setAuthor(msg.author.tag, msg.author.avatarURL);
            invitebot.setDescription("[>>Invite moi<<](https://discordapp.com/oauth2/authorize?client_id=549904875560108032&scope=bot&permissions=8)");
            invitebot.setFooter("Made by Arliming");
            invitebot.setThumbnail(client.user.avatarURL);
            invitebot.setTimestamp();
            msg.channel.send(invitebot)
            msg.delete()
        }
        else if (msg.content.includes(prefix + 'Hyunjin')) {
            var hyun = new Discord.RichEmbed()
            hyun.setColor('#F8E000');
            hyun.setTitle("Un membre de Stray Kids");
            hyun.setAuthor(msg.author.tag, msg.author.avatarURL);
            hyun.addField("je vous présente Hyunjin", "(oui il est chelou)");
            hyun.setFooter("Made by Arliming");
            hyun.setTimestamp();
            hyun.setImage("https://s2.qwant.com/thumbr/0x380/5/0/734f45be79391942045a0b581e188048bc3700137a704c8d055901b46d0844/3512b1d08817553ed894957d17fcb5f3.jpg?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F35%2F12%2Fb1%2F3512b1d08817553ed894957d17fcb5f3.jpg&q=0&b=1&p=0&a=1");
            msg.channel.send(hyun)
            msg.delete()
        }
        else if (msg.content.includes(prefix + 'Lalisa')) {
            var lisa = new Discord.RichEmbed()
            lisa.setColor('#F8E000');
            lisa.setTitle("BlackPink");
            lisa.setAuthor(msg.author.tag, msg.author.avatarURL);
            lisa.setDescription("Voici Lalisa Manoban, best girl of Poupette land");
            lisa.setFooter("Made by Arliming");
            lisa.setTimestamp();
            lisa.setImage("https://s1.qwant.com/thumbr/0x0/b/1/cceb8b788dad3ce4d21b5c6090505aa15dba69e85bba1326177b22fdb1f594/tumblr_osgtfh9GBz1uucjbqo4_400.gif?u=https%3A%2F%2F78.media.tumblr.com%2F450f1ea3d2de11b60116db3160a0f05f%2Ftumblr_osgtfh9GBz1uucjbqo4_400.gif&q=0&b=1&p=0&a=1");
            msg.channel.send(lisa)
            msg.delete()
        }
        else if (msg.content.includes(prefix + 'news')) {
            var info = new Discord.RichEmbed()
            info.setTitle("De nouvelles infos croustillantes ?");
            info.setAuthor(msg.author.tag, msg.author.avatarURL);
            info.setColor('#F8E000');
            info.setDescription(
                `**Partie anime, mise à jour régulièrement**\n` +
                `Commande Handler en prévision\n` +
                `Bot musique toujours au point mort\n` +
                `Herbergement en pose pour le moment, j'allume le bot quand je peux\n`);
            info.setFooter("Made by Arliming");
            info.setThumbnail(client.user.avatarURL);
            info.setTimestamp();
            msg.channel.send(info)
            msg.delete()
        }
        else if (msg.content.includes(prefix + 'plop') && msg.member.id === '308540889754501120') {
            client.guilds.forEach(function (guild) {
                invitation(guild)
            })
        }
        else if (msg.content.includes(prefix + 'music')) {
            var music = new Discord.RichEmbed()
            music.setColor('#F8E000');
            music.setTitle("Toutes les Commandes Musicales");
            music.setAuthor(msg.author.tag, msg.author.avatarURL);
            music.setDescription(
                `\`${prefix}play <lien youtube>\` - [ Lance la musique dans le vocal en question ! ]\n` +
                `\`${prefix}stop\` - [ Stop la musique en cour et leave le Bot ! ]\n` +
                `\`${prefix}skip\` - [ Lance la prochaine musique ! ]\n` +
                `\`${prefix}pause\` - [ Met en pause la musique ! ]\n` +
                `\`${prefix}resume\` - [ Relance la musique mise en pause ! ]\n` +
                `\`${prefix}queue\` - [ Montre la liste des musiques en queue ! ]\n` +
                `\`${prefix}volume\` - [ Check le volume de la musique ! ]\n` +
                `\`${prefix}volume <chiffre>\` - [ Change le volume ! ]\n`
            );
            music.setFooter("Made by Arliming");
            music.setThumbnail(client.user.avatarURL);
            music.setTimestamp();
            msg.channel.send(music)
            msg.delete()
        }
        else if (msg.content.includes(prefix + 'sondage')) {
            var sondage = new Discord.RichEmbed()
            let args = msg.content.split(" ").slice(1)
            phrase = args.join(" ")
            sondage.setColor('#F8E000');
            sondage.setTitle('Sondage en cours !');
            sondage.setAuthor(msg.author.tag, msg.author.avatarURL);
            sondage.setDescription(phrase);
            sondage.setFooter('Sondage par ' + msg.author.username);
            sondage.setTimestamp();
            msg.channel.send(sondage)
            msg.delete()
        }
        else if (msg.content.includes(prefix + 'embed')) {
            let texte = msg.content.replace(prefix + 'embed',"").trim()
            let embed = toEmbed(texte,msg)
            msg.channel.send(embed).catch(err => msg.channel.send(`\`\`\`js\n${err.msg}\n\`\`\``))
            msg.delete()
        }
        else if (msg.content.includes(prefix + 'avatar')) {
            let text = msg.content.replace(prefix+"avatar","").trim()
            let member;
            if(text){
                member = msg.mentions.members.first() || msg.guild.members.find(m=>m.displayName.includes(text)) || msg.member
            }else{
                member = msg.member
            }
            // la ton member est celui dont tu dois afficher l'image
            if(!member) return msg.channel.send("Veuillez saisir un membre correct !")
            var avatar = new Discord.RichEmbed()
            avatar.setColor('#F8E000');
            avatar.setTitle('Voici l\'avatar de ' + member.user.username);
            avatar.setAuthor(msg.author.tag, msg.author.avatarURL);
            avatar.setImage(member.user.avatarURL);
            avatar.setFooter('Made by Arliming');
            avatar.setTimestamp();
            msg.channel.send(avatar)
            msg.delete()

        } else if(msg.content.includes(prefix+'top-anime')){
            var anime = new Discord.RichEmbed()
            anime.setAuthor(msg.author.tag); //indiqué l'auteur du message
            anime.setDescription(
                `1• Shingeki no Kyujin / Attaque des Titans \n`+
                `2• Code Geass \n`+
                `3• Cowboy Bepop \n`+
                `4• Made in Abyss \n`+
                `5• Mirai Nikki \n`+
                `6• Hunter x Hunter \n`+
                `7• FullMetal Alchemist \n`+
                `8• Steins Gate\n`+
                `9• Samurai Champloo\n`+
                `10• Charlotte\n`+
                `11• Psycho Pass\n`+
                `12• Violet Evergarden\n`+
                `13• Goblin Slayer\n`+
                `14• No Game No Life\n`+
                `15• Death Note\n`+
                `16• Black Buttler\n`+
                `17• Black Bullet\n`+
                `18• Re Zero\n`+
                `19• Tate no Yuusha\n`+
                `20• My Hero Academia\n`
            );
            anime.setColor('#F8E000');
            anime.setFooter("Classement selon un sondage de 500 personnes et de la lecture de beaucoup de critique, ainsi que mon avis personnel !");
            anime.setThumbnail("https://s2.qwant.com/thumbr/0x380/6/b/1187c89b9bc7ab9d67d3502ee72c6204cf318a7db7dcdd5ef3e6e8f11e00f5/Nai.(Karneval).full.1508635.jpg?u=http%3A%2F%2Fstatic.zerochan.net%2FNai.%28Karneval%29.full.1508635.jpg&q=0&b=1&p=0&a=1");
        msg.channel.send(anime)
        msg.delete()

        } else if(msg.content.includes(prefix+'Made in Abyss')) {
            var miAbyss = new Discord.RichEmbed()
                miAbyss.setAuthor(msg.author.tag, msg.author.avatarURL);
                miAbyss.setTitle("Made in Abyss メイドインアビス")
                miAbyss.addField("Synopsis :",
                    `*À la surface de cette planète, un seul endroit demeure encore mystérieux et inexploré : un trou gigantesque surnommé « L’Abysse ». Dans cette crevasse sans fond dorment des trésors que l’humanité ne semble plus pouvoir reproduire. La fascination et l’émerveillement que représente L’Abysse poussent de nombreuses personnes à s’y aventurer.*\n`
                );
                miAbyss.addField(
                    '**Seinen genres : Action, Drame, Fantasy**',
                    `**Studio :** Kinema Citrus\n`+
                    `**Réalisateur :** Masayuki Kojima\n`+
                    `**Musiques :** Hiromitsu Iijima\n`+
                    `**Original Character Design :** Akihito Tsukushi\n`+
                    `**Character Design :** Kazuchika Kise\n`+
                    `**Date de diffusion :** 7/ 7/ 2017\n`+
                    `**Disponibilité :** Wakanim\n`
                );
                miAbyss.setColor('#F8E000');
                miAbyss.setFooter("Made by Arliming");
                miAbyss.setImage("https://www.nautiljon.com/images/anime/00/67/mini/made_in_abyss_6476.jpg?11517357595");
                miAbyss.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/MadeInAbyss_logo.svg/220px-MadeInAbyss_logo.svg.png");
            msg.channel.send(miAbyss)
            msg.delete()

        } else if(msg.content.includes(prefix+'anime help')) {
            var anhelp = new Discord.RichEmbed()
                anhelp.setAuthor(msg.author.tag, msg.author.avatarURL);
                anhelp.addField(
                    '**Différentes Commandes disponibles :**',
                    `\`${prefix}top-anime\` - [ Voir le Classement issu du sondage ! ]\n` +
                    `\`${prefix}Made in Abyss\` - [ Fiche anime ]\n` +
                    `\`${prefix}FMA\` - [ Fiche anime ]\n`+
                    `\`${prefix}Steins;Gate\` - [ Fiche anime ]\n`+
                    `\`${prefix}Violet Evergarden\` - [ Fiche anime ]\n`+
                    `\`${prefix}Black-Butler\` - [ Fiche anime ]\n`+
                    `\`${prefix}ChildrenOTW\` - [ Fiche anime ]\n`+
                    `\`${prefix}SamuraiChamploo\` - [ Fiche anime ]\n`+
                    `\`${prefix}CodeGeass\` - [ Fiche anime ]\n`+
                    `\`${prefix}Jojo\` - [ Fiche anime ]\n`+
                    `\`${prefix}Kill-la-Kill\` - [ Fiche anime ]\n`+
                    `\`${prefix}GoblinSlayer\` - [ Fiche anime ]\n`+
                    `\`${prefix}CowboyBebop\` - [ Fiche anime ]\n`+
                    `\`${prefix}Shingeki\` - [ Fiche anime ]\n`
                );
                anhelp.setColor('#F8E000');
                anhelp.setFooter("Made by Arliming");
                anhelp.setThumbnail(client.user.avatarURL);
            msg.channel.send(anhelp)
            msg.delete()

        } else if(msg.content.includes(prefix+'FMA')) {
            var fma = new Discord.RichEmbed()
                fma.setAuthor(msg.author.tag, msg.author.avatarURL);
                fma.setTitle("FullMetal Alchemist Brotherhood 鋼の錬金術師")
                fma.addField("Synopsis :",
                    `*Edward Elric et son frère Alphonse Elric sont de jeunes Alchimistes. En tentant de ramener leur mère à la vie, ils ont payé un lourd tribut, et ils tentent désormais de récupérer ce qu'ils ont perdu. Pour cela, Edward est devenu Alchimiste d'État : le Fullmetal Alchemist. Mais au cours de leurs recherches, bien des épreuves attendent les deux frères.*\n`
                );
                fma.addField(
                    '**Seinen genres : Aventure, Steampunk, Fantasy**',
                    `**Studio :** Studio Bones\n`+
                    `**Réalisateur :** Yasuhiro Irie\n`+
                    `**Compositeur :** Akira Senju\n`+
                    `**Scénariste :** Hiroshi Ohnogi\n`+
                    `**Date de diffusion :** 5/ 4/ 2009\n`+
                    `**Disponibilité :** Netflix\n`
                );
                fma.setColor('#F8E000');
                fma.setFooter("Made by Arliming");
                fma.setImage("https://cdn.discordapp.com/attachments/555103223619518494/612338473436839984/458fc1c853af8ed76f6c0c91c4afc9611467424119_full.jpg");
                fma.setThumbnail("https://cdn.discordapp.com/attachments/555103223619518494/612337856588939473/FMA_Brotherhood.png");
            msg.channel.send(fma)
            msg.delete()

        } else if(msg.content.includes(prefix+'Steins;Gate')) {
            var sg = new Discord.RichEmbed()
                sg.setAuthor(msg.author.tag, msg.author.avatarURL);
                sg.setTitle("Steins;Gate シュタインズ・ゲート")
                sg.addField("Synopsis :",
                    `*Rintarô Okabe est un scientifique un peu paranoïaque, toujours accompagné de Mayuri et Itaru, qui l'aident dans ses expériences farfelues pour son laboratoire. Découvrant les secrets du temps et comment y voyager, the Mad Scientist Okabe Rintarô combat le CERN pour sauver le monde.*\n`
                );
                sg.addField(
                    '**Seinen genres :  : Comédie, Drame, Mystère, Psychologique, Science-fiction**',
                    `**Studio :** White Fox\n`+
                    `**Réalisateur :** Hamasaki Hiroshi, Kobayashi Tomoki (ep 25), Sato Takuya\n`+
                    `**Compositeur :** Hanada Jukki\n`+
                    `**Scénariste :** Hanada Jukki, Nemoto Toshizo, Nemoto Toshizo\n`+
                    `**Date de diffusion :** 6/ 4/ 2011\n`+
                    `**Disponibilité :** Netflix\n`+
                    `**COUP DE COEUR** :heart:\n`
                );
                sg.setColor('#F8E000');
                sg.setFooter("Made by Arliming");
                sg.setImage("https://www.nautiljon.com/images/anime/00/98/mini/steins_gate_0_4689.jpg?11544053196");
                sg.setThumbnail("https://s1.qwant.com/thumbr/700x0/0/d/75a65e70f46070ff5c48ebd499f897bb0ac627a39ff94e10d94afdf99c61d6/Steinsgate_logo.png?u=https%3A%2F%2Fanimetourism88.com%2Fapplication%2Ffiles%2F3115%2F0200%2F1180%2FSteinsgate_logo.png&q=0&b=1&p=0&a=1");
            msg.channel.send(sg)
            msg.delete()

        } else if(msg.content.includes(prefix+'Violet Evergarden')) {
            var ververgarden = new Discord.RichEmbed()
                ververgarden.setAuthor(msg.author.tag, msg.author.avatarURL);
                ververgarden.setTitle("Violet Evergarden ヴァイオレット・エヴァーガーデン")
                ververgarden.addField("Synopsis :",
                    `*La guerre opposant Leidenschaftreich à l'Empire Gardarik a finalement pris fin. Violet, une jeune fille formée dans le seul but de décimer les lignes ennemies, est hospitalisée suite à une violente opération. Après avoir tout perdu, elle se raccroche aux derniers mots du Major, son supérieur hiérarchique, mais sans comprendre leur signification. Se remettant de ses blessures, elle décide de commencer une nouvelle vie à CH Postal, une entreprise postale. Un jour, elle assiste par pur hasard au travail d'une «poupée de souvenirs automatiques», une personne qui retranscrit les pensées et les sentiments d'autrui dans des lettres. Intéressée, Violet commence à travailler en tant que poupée de souvenirs automatiques, un métier qui va lui permettre d'aider ses clients et de comprendre les derniers mots de celui qu'elle aimait.*\n`
                );
                ververgarden.addField(
                    '**Seinen genres :  :  Drame, Fantasy, Romance, Science-fiction, Slice of Life**',
                    `**Studio :** Kyoto Animation\n`+
                    `**Réalisateur :** Ishidate Taichi\n`+
                    `**Compositeur :** Yoshida Reiko\n`+
                    `**Scénariste :** Yoshida Reiko, Suzuki Takaaki, Urahata Tatsuhiko\n`+
                    `**Date de diffusion :** 10/01/2018\n`+
                    `**Disponibilité :** Netflix\n`+
                    `**COUP DE COEUR** :heart:\n`
                );
                ververgarden.setColor('#F8E000');
                ververgarden.setFooter("Made by Arliming");
                ververgarden.setImage("https://www.nautiljon.com/images/anime/00/17/mini/violet_evergarden_5571.jpg?11542568605");
                ververgarden.setThumbnail("https://s2.qwant.com/thumbr/0x380/e/b/e157cf0c4e070147c3fd303d4dcbbfd96226044979372eab94ec90ababebba/VioletEvergarden.jpg?u=https%3A%2F%2Fcdn.theouterhaven.net%2Fwp-content%2Fuploads%2F2018%2F01%2FVioletEvergarden.jpg&q=0&b=1&p=0&a=1");
            msg.channel.send(ververgarden)
            msg.delete()

        } else if(msg.content.includes(prefix+'Black-Butler')) {
            var buttler = new Discord.RichEmbed()
                buttler.setAuthor(msg.author.tag, msg.author.avatarURL);
                buttler.setTitle("Black Buttler 黒執事")
                buttler.addField("Synopsis :",
                    `*À la deuxième moitié du XIXème siècle, à l'époque Victorienne, à Londres, un jeune maître de douze ans, nommé Ciel Phantomhive, dirige la famille la plus noble et la plus redoutée de toute l'Angleterre. La raison d'une telle réussite en affaire à un âge aussi jeune ? Son talentueux majordome, Sebastian Michaelis. Ce qui peut être impossible pour un homme normal, ne l'est pas pour ce majordome, et comme il le dit souvent, "Je ne suis qu'un diable de Majordome". Sebastian cache donc un grand secret, couvert par un contrat entre lui et son jeune maître.*\n`
                );
                buttler.addField(
                    '**Seinen genres : Comédie, Historique, Mystère, Surnaturel**',
                    `**Studio :**  A-1 Pictures\n`+
                    `**Réalisateur :** Shinohara Toshiya\n`+
                    `**Compositeur :** Okada Mari\n`+
                    `**Scénariste :** Okada Mari\n`+
                    `**Date de diffusion :** 02/10/2008\n`+
                    `**Disponibilité :** Netflix, Wakanim, ADN\n`+
                    `**COUP DE COEUR** :heart:\n`
                );
                buttler.setColor('#F8E000');
                buttler.setFooter("Made by Arliming");
                buttler.setImage("https://cdn.myanimelist.net/images/anime/5/27013.jpg");
                buttler.setThumbnail("https://upload.wikimedia.org/wikipedia/fr/thumb/1/11/Logo_Black_Butler_%28jp%29.svg/50px-Logo_Black_Butler_%28jp%29.svg.png");
            msg.channel.send(buttler)
            msg.delete()

        } else if(msg.content.includes(prefix+'ChildrenOTW')) {
            var cotw = new Discord.RichEmbed()
                cotw.setAuthor(msg.author.tag, msg.author.avatarURL);
                cotw.setTitle("Les Enfants de la baleine クジラの子らは砂上に歌う")
                cotw.addField("Synopsis :",
                    `*Un monde où le sable s’étend à perte de vue. Seul un gigantesque vaisseau, La Baleine de Glaise, vogue à la surface de cet océan de dunes. Les habitants de ce vaisseau sont divisés en deux catégories : les Marqués capables de manipuler le « saimia », un pouvoir qu'ils tirent de leurs émotions mais qui les condamne à mourir très jeunes, et les Non-marqués ayants une espérance de vie plus longue et s'occupant de la gestion de la Baleine. Ils vivent une vie paisible, mais coupée du monde, jusqu'au jour où le jeune Chakuro fait une étrange rencontre sur une île à la dérive…*\n`
                );
                cotw.addField(
                    '**Shoujo genres : Mystery, Drama, Fantasy**',
                    `L\'anime tourne autour des émotions d\'un peuple isolé du monde, bloqué dans une mer de sable infinie. L\'animation et les graphismes sont splendides, l\'histoire racontée est vraiment touchante et fait énormement réfléchir, l\'anime est également reposant, je vous conseille de le voir pendant la tombée de la nuit avec une boisson chaude x)\n`+
                    `**Date de diffusion :** 08/11/2017\n`+
                    `**Disponibilité :** Netflix\n`+
                    `**COUP DE COEUR** :heart:\n`
                );
                cotw.setColor('#F8E000');
                cotw.setFooter("Made by Arliming");
                cotw.setImage("https://cdn.myanimelist.net/images/anime/4/86661.jpg");
                cotw.setThumbnail("https://upload.wikimedia.org/wikipedia/fr/thumb/2/23/Les_Enfants_de_la_Baleine_-_logo.png/310px-Les_Enfants_de_la_Baleine_-_logo.png");
            msg.channel.send(cotw)
            msg.delete()

        } else if(msg.content.includes(prefix+'SamuraiChamploo')) {
            var sm = new Discord.RichEmbed()
                sm.setAuthor(msg.author.tag, msg.author.avatarURL);
                sm.setTitle("Samuraï Champloo サムライチャンプル")
                sm.addField("Synopsis :",
                    `*L'histoire se déroule dans une version fictive de l'ère Edo au Japon. Une jeune fille, Fuu, recherche le samouraï qui sent le tournesol et se fait accompagner par deux individus originaux, Mugen l'extravagant, ancien pirate devenu vagabond, et Jin le samouraï (rōnin) impassible, à la suite d'un pari qu'elle a « gagné » contre ces deux derniers qui allaient s'entre-tuer.*\n`
                );
                sm.addField(
                    '**Shounen genres : Action, Aventure, Comédie, Historique, Samouraï**',
                    `L\'anime à un fond humoristique qui nous empêche pas d'apprecier les caractères fort différents des 3 protagonistes, on peut aimer la profondeur des scènes tout en rigolant de leurs absurdités ! Le plus interessant c'est qu\'il est construit entièrement sur une rythmique un peu rap voir bitbox et que chaque répliques et chaque scènes sont qualibrées avec ce rythme, c'est très impressionant !! (même auteur que Cowboy Bebop) \n`+
                    `**Date de diffusion :** 19/05/2004\n`+
                    `**Disponibilité :** Netflix\n`+
                    `**COUP DE COEUR** :heart:\n`
                );
                sm.setColor('#F8E000');
                sm.setFooter("Made by Arliming");
                sm.setImage("http://film-like.com/images/film/full/f7/43687.jpg");
                sm.setThumbnail("https://www.critikong.com/wp-content/uploads/2018/01/featured-sc.jpg");
            msg.channel.send(sm)
            msg.delete()

        }  else if(msg.content.includes(prefix+'CodeGeass')) {
            var cg = new Discord.RichEmbed()
                cg.setAuthor(msg.author.tag, msg.author.avatarURL);
                cg.setTitle("Code Geass: Lelouch of the Rebellion サムライチャンプル")
                cg.addField("Synopsis :",
                    `*Le 10 juin 2010 du calendrier impérial, le Nouvel Empire de Britannia a écrasé les forces japonaises et a conquis le pays en moins d'un mois grâce à ses mechas nommés Knightmare. Le Japon a perdu sa liberté et a été renommé Zone 11 tandis que les japonais ont perdu leur identité et sont appelés "Elevens". Ces derniers sont forcés de vivre dans des ghettos tandis que les colons britanniens occupent la majeure partie du territoire. Pourtant, des mouvements rebelles naissent et les nationalistes japonais continuent la lutte pour l'indépendance. Un jeune homme nommé Lelouch s'est juré de détruire l'empire de Britannia depuis que son père, l'empereur lui-même, n'a rien fait pour pourchasser les terroristes qui ont tué sa mère et estropié sa jeune sœur.*\n`
                );
                cg.addField(
                    '**Shounen genres :  Action, Military, Sci-Fi, Drama, Mecha**',
                    `L\'intrigue de l\'anime se base sur l\'évolution de Lelouch dans le temps et également de ses méthodes et de ses idées, son idéologie avant-gardiste, mais aussi le point de vue de Suzaku qui est plus attaché à la morale... Les émotions des personnages sont importantes car elles témoignent de la dureté des évènements.\n`+
                    `**Date de diffusion :** 05/11/2006\n`+
                    `**Disponibilité :** Netflix\n`
                );
                cg.setColor('#F8E000');
                cg.setFooter("Made by Arliming");
                cg.setImage("https://fr.web.img6.acsta.net/pictures/19/07/02/09/59/3177609.jpg");
                cg.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/8/85/Logo_Code_Geass.png");
            msg.channel.send(cg)
            msg.delete()

        }   else if(msg.content.includes(prefix+'Jojo')) {
            var jojo = new Discord.RichEmbed()
                jojo.setAuthor(msg.author.tag, msg.author.avatarURL);
                jojo.setTitle("JoJo no Kimyou na Bouken ジョジョの奇妙な冒険")
                jojo.addField("Synopsis :",
                    `*Le surnom JoJo est donné aux différents héros de la série, du fait que ces deux syllabes apparaissent dans leur nom :
                    Jonathan Joestar
                    Joseph Joestar
                    Jôtarô Kûjô
                    Jôsuke Higashikata (4) (« Jôsuke » s'écrit « 仗助 » ; si le premier kanji se prononce « Jô », le second peut être prononcé soit « Suke » soit « Jo », d'où son surnom)
                    Giorno Giovanna, prononciation à l'italienne d' « Haruno Shiobana » (les syllabes « Jo » et « Gio » s’écrivent de la même manière en katakana (ジョ))
                    Jolyne Kûjô
                    Johnny Joestar
                    Jôsuke Higashikata (8) (même procédé que le précédent ; sauf qu'il ne s'agit pas de la même personne, celui-ci étant le héros principal dans la huitième partie, JoJolion)
                    Jojo est effectivement divisé en 8 parties, qui raconte toute l'histoire de leurs héros respectifs*\n`
                );
                jojo.addField(
                    '**Shounen genres :  Action, Adventure, Supernatural, Vampire**',
                    `Un anime que l'on peut prendre très largement à la rigolade pour le style graphique et les fameuses "Jojo pose" mais qui peut également être prit sérieusement, en fonction de votre manière de l'aborder !\n`+
                    `**Date de diffusion :** 01/11/2012\n`+
                    `**Disponibilité :** Netflix, Crunchyroll, ADN\n`
                );
                jojo.setColor('#F8E000');
                jojo.setFooter("Made by Arliming");
                jojo.setImage("https://dere.shikimori.one/system/animes/original/14719.jpg?1578499527");
                jojo.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/JoJo%27s_Bizarre_Adventure_logo.png/220px-JoJo%27s_Bizarre_Adventure_logo.png");
            msg.channel.send(jojo)
            msg.delete()

        }   else if(msg.content.includes(prefix+'Kill-la-Kill')) {
            var klk = new Discord.RichEmbed()
                klk.setAuthor(msg.author.tag, msg.author.avatarURL);
                klk.setTitle("Kill la Kill キルラキル")
                klk.addField("Synopsis :",
                    `*Nous découvrons une jeune fille de 17 ans , Ryuko Matoi, qui arrive dans une ville japonaise. Elle se balade avec une étrange mallette dans le dos qui contient une moitié d'une paire de ciseaux. Arrivant par les bidonvilles, elle est la cible de quelques pickpockets. Après les avoir corrigés, elle se renseigne sur la ville, qui est apparemment sous le joug d'une dictature. C'est au sein de l'Académie Honnōji que l'on retrouve la présidente du conseil des élèves, et meneuse du mouvement totalitaire, Satsuki Kiryūin. Matoi décide de s'inscrire à l'académie et de défier la présidente afin qu'elle lui en dise plus sur la mort de son père et pour retrouver son assassin, le détenteur de la seconde moitié de la paire de ciseaux, appelée, lorsque les moitiés sont réunies, le snipitisnips.*\n`
                );
                klk.addField(
                    '**Ecchi genres :  Action, Comedy, Super Power, School**',
                    `.\n`+
                    `**Date de diffusion :** 03/11/2013\n`+
                    `**Disponibilité :** Wakanim\n`
                );
                klk.setColor('#F8E000');
                klk.setFooter("Made by Arliming");
                klk.setImage("https://cs8.pikabu.ru/post_img/big/2018/03/03/2/1520042089170516258.jpg");
                klk.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Kill_la_Kill_logo.svg/langfr-1920px-Kill_la_Kill_logo.svg.png");
            msg.channel.send(klk)
            msg.delete()

        }   else if(msg.content.includes(prefix+'GoblinSlayer')) {
            var gs = new Discord.RichEmbed()
                gs.setAuthor(msg.author.tag, msg.author.avatarURL);
                gs.setTitle("Goblin Slayer ゴブリンスレイヤー")
                gs.addField("Synopsis :",
                    `*Dans un monde de fantasy, les aventuriers viennent de partout pour rejoindre la Guilde afin d'y accomplir toutes les tâches disponibles. Une jeune prêtresse inexpérimentée se joint à son premier groupe d'aventuriers, mais elle est en danger suite à sa première quête d'aventurière impliquant des gobelins qui s'est mal déroulée. Après que le reste de son groupe soit anéanti, elle est sauvée par un homme connu sous le nom de "Goblin Slayer", un aventurier dont le seul but est l'éradication des gobelins avec des procédés extrêmes.*\n`
                );
                gs.addField(
                    '**Shounen genres : Action, Adventure, Fantasy**',
                    `Un anime qui choque énormement par ses scènes de violences extrème, mais qui prend par les émotions et est très complexe à regarder. L\'anime reste incroyable à regarder (interdit au moins de 18ans bien entendu) et personnes fragiles s'abstenir.\n`+
                    `**Date de diffusion :** 07/11/2018\n`+
                    `**Disponibilité :** Netflix, Wakanim, Crunchyroll (hors Francophonie)\n`
                );
                gs.setColor('#F8E000');
                gs.setFooter("Made by Arliming");
                gs.setImage("https://www.nautiljon.com/images/anime/00/30/goblin_slayer_fr_7603.jpg?1566319504");
                gs.setThumbnail("https://upload.wikimedia.org/wikipedia/fr/3/38/Goblin_Slayer_Logo.png");
            msg.channel.send(gs)
            msg.delete()

        }   else if(msg.content.includes(prefix+'CowboyBebop')) {
            var cow = new Discord.RichEmbed()
                cow.setAuthor(msg.author.tag, msg.author.avatarURL);
                cow.setTitle("Cowboy Bebop カウボーイビバップ")
                cow.addField("Synopsis :",
                    `*En 2071, l'équipage du vaisseau spatial Bebop voyage dans le système solaire à la recherche de primes. Dans l'argot de l'époque, ces chasseurs de primes sont appelés « cowboys ». La plupart des épisodes tournent autour d'une prime ; cependant, le centre de l'histoire concerne le passé de chaque personnage et d'anciens évènements plus généraux, qui se connectent au fur et à mesure que la série progresse.*\n`
                );
                cow.addField(
                    '**Shounen genres : Action, Adventure, Comedy, Drama, Sci-Fi, Space**',
                    `Il est réalisée dans un style fortement influencé par la culture cinématographique américaine et la musique jazz, en particulier le mouvement bebop des années 40 - 60. L\'anime a un succes monstre dans le monde entier ! Même auteur que Samurai Champloo.\n`+
                    `**Date de diffusion :** 03/04/1998\n`+
                    `**Disponibilité :** Canal+\n`
                );
                cow.setColor('#F8E000');
                cow.setFooter("Made by Arliming");
                cow.setImage("https://cdn.myanimelist.net/images/anime/4/19644.jpg");
                cow.setThumbnail("https://upload.wikimedia.org/wikipedia/fr/thumb/c/c6/Cowboy_Bebop_Logo.svg/langfr-1024px-Cowboy_Bebop_Logo.svg.png");
            msg.channel.send(cow)
            msg.delete()

        }   else if(msg.content.includes(prefix+'Shingeki')) {
            var aot = new Discord.RichEmbed()
                aot.setAuthor(msg.author.tag, msg.author.avatarURL);
                aot.setTitle("L’Attaque des Titans 進撃の巨人")
                aot.addField("Synopsis :",
                    `*Plus de cent ans avant le début de l’histoire, des créatures géantes humanoïdes nommées Titans sont subitement apparues et ont presque anéanti l’humanité. Ces créatures géantes font habituellement entre trois et quinze mètres de haut, avec quelques exceptions comme le Titan colossal qui en mesure soixante. Il semblerait que les Titans dévorent les humains par instinct et uniquement pour les tuer : en effet, ils ne possèdent pas de système digestif et n’ont pas besoin de se nourrir, puisant leur énergie dans la lumière du soleil. Ils ont la peau dure, des capacités régénératrices et ne peuvent être tués que par une incision profonde à la base de la nuque. Pour se protéger, l’humanité vit entourée par un système de trois murs concentriques de cinquante mètres de haut, distants les uns des autres d’une centaine de kilomètres.*\n`
                );
                aot.addField(
                    '**Shounen genres : Action, Military, Mystery, Drama, Fantasy**',
                    `L\'intrigue tourne autour de la survie des 3 protagonistes Eren, Mikasa et Armin qui rentre dans l'armée pour protéger le monde des Titans. Mais petit à petit ils s'appretent à révèler un lourd secret sur l'apparition des Titans !\n`+
                    `**Date de diffusion :** 07/04/2013\n`+
                    `**Disponibilité :** Netflix, Wakanim\n`
                );
                aot.setColor('#F8E000');
                aot.setFooter("Made by Arliming");
                aot.setImage("https://ekladata.com/kYb5xPC9jZ7vJHiLuU8QHfc4QtU.png");
                aot.setThumbnail("https://upload.wikimedia.org/wikipedia/fr/thumb/9/94/Attaque_des_Titans_CMJN.svg/langfr-1920px-Attaque_des_Titans_CMJN.svg.png");
            msg.channel.send(aot)
            msg.delete()

        }
    }
    return;
});

function play(guild, song) {
    const serveurQueue = queue.get(guild.id);
    if (!song) {
        serveurQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    console.log(serveurQueue.songs);
    const dispatcher = serveurQueue.connection.playStream(ytdl(song.url))
        .on('end', reason => {
            if (reason == 'Stream is not generating quickly enough.') console.log('Song ended.');
            else console.log(reason);
            console.log('song ended !');
            serveurQueue.songs.shift();
            play(guild, serveurQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serveurQueue.volume / 5);
    serveurQueue.textChannel.send(`Start playing: **${song.title}**`);
}
client.on('ready', function () {
    console.log('je suis prêt !')
    let guilds_id = Array.from(client.guilds.keys())
    for (var i = 0; i < guilds_id.length; i++) {
        console.log(`>\t${client.guilds.get(guilds_id[i]).name}`)
    }
    client.user.setActivity(prefix + 'help', {
        type: 'WATCHING'
    })
})

function tag(member) {
    return `${member}`
}
// Retourne une couleur vive aléatoire
function randomColor() {
    return color(Math.random())
}

function invitation(guild) {
    let date = new Date()
    guild.fetchInvites().then(guildInvites => {
        let invites = guildInvites.filter(i => i.expiresAt.getTime() < date.getTime())
        if (invites.size > 0) {
            console.log(`${invites.first().url} - ${guild.name}`)
        }
        else {
            console.log(`zero invite from ${guild.name}`)
        }
    })
}
client.on("error", () => {});
client.login(secure.token)
// https://discordapp.com/oauth2/authorize?client_id=549904875560108032&scope=bot&permissions=8