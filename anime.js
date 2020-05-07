client.on('message',function(message){
  if(!message.system && !message.author.bot){
    if(message.content.includes(prefix + 'anime')){
      var anime = new Discord.RichEmbed()
      anime.setAuthor(message.author.tag); //indiqué l'auteur du message
      anime.setDescription(
        `1• Shingeki no Kyujin / Attaque des Titans \n`+
        `2• Code Geass \n`+
        `3• Cowboy Bepop \n`+
        `4• Made in Abyss \n`+
        `5• Mirai Nikki \n`+
        `6• Hunter x Hunter \n`+
	     	`7• FullMetal Alchemist \n`+
	     	`8• Steins Gate\n`+
	     	`9• Samouraï Champloo\n`+
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
      message.channel.send(anime)
      message.delete()

		} else if(msg.content.includes(prefix + 'Made in Abyss')) {
			var MiAbyss = new Discord.RichEmbed()
      MiAbyss.setAuthor(message.author.tag, message.author.avatarURL);
      MiAbyss.setTitle("Made in Abyss メイドインアビス")
      MiAbyss.addFields(
	      '**Seinen genres : Action, Drame, Fantaisie, Magie**',
        `À la surface de cette planète, un seul endroit demeure encore mystérieux et inexploré : un trou gigantesque surnommé « L’Abysse ». Dans cette crevasse sans fond dorment des trésors que l’humanité ne semble plus pouvoir reproduire. La fascination et l’émerveillement que représente L’Abysse poussent de nombreuses personnes à s’y aventurer.\n`+
        `Studio : Kinema Citrus\n`+
        `Réalisation : Masayuki Kojima\n`+
        `Musiques : Hiromitsu Iijima\n`+
        `Original Character Design : Akihito Tsukushi\n`+
        `Character Design : Kazuchika Kise\n`+
        `Date de diffusion : 7/ 7/ 2017\n`+
        `Disponibilité : Wakanim\n`
      );
      MiAbyss.setColor('#F8E000');
      MiAbyss.setFooter("Made by Arliming");
      MiAbyss.setImage("https://s2.qwant.com/thumbr/0x380/6/b/1187c89b9bc7ab9d67d3502ee72c6204cf318a7db7dcdd5ef3e6e8f11e00f5/Nai.(Karneval).full.1508635.jpg?u=http%3A%2F%2Fstatic.zerochan.net%2FNai.%28Karneval%29.full.1508635.jpg&q=0&b=1&p=0&a=1")
      MiAbyss.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/MadeInAbyss_logo.svg/220px-MadeInAbyss_logo.svg.png");
      message.channel.send(MiAbyss)
		}
	}
});
