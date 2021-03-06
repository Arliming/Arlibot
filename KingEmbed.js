const Discord = require("discord.js");

function toEmbed(texte, message={
	guild : {
		name : "[ missing Message argument for getting guild.name ]",
		iconURL : "https://stickeramoi.com/3777-large_default/autocollant-point-interrogation-muraux.jpg"
	},
	author : {
		username : "[ missing Message argument for getting author.username ]",
		avatarURL : "https://stickeramoi.com/3777-large_default/autocollant-point-interrogation-muraux.jpg"
	},
	client : {
		emojis : new Discord.Collection()
	}
}){

	if(texte === "help"){
		return help
	}

	let content = texte.slice(0);
	
	let condition = (txt,t1,t2) => txt.includes(t1)&&txt.includes(t2)&&txt.indexOf(t1)<txt.indexOf(t2);
	let rogner = (txt,t1,t2) => txt.slice(txt.indexOf(t1)+t1.length,txt.indexOf(t2));
	let replaceOne = (t1,t2,fn) =>{
		if(condition(content,t1,t2)){
			let item = rogner(content,t1,t2);
			if(typeof fn === "function") {content = fn(t1,t2,item)}
			else{content = content.replace(t1+item+t2,"")}
			return item
		}	return null
	}
	let replaceAll = (t1,t2,fn) => {
		let items = [];
		while(condition(content,t1,t2)){
			items.push(replaceOne(t1,t2,fn));
		}	return items;
	}
	let args = (txt) => {
		let tmp = rogner(txt,'{','}');
		return [
			txt.replace(`{${tmp}}`,""),
			tmp
		];
	};

	let date = new Date()
	content = content
        .replace(/{guild name}/g,message.guild.name)
        .replace(/{guild image}/g,message.guild.iconURL)
        .replace(/{user name}/g,message.author.username)
        .replace(/{user image}/g,message.author.avatarURL)
        .replace(/{date}/g,`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`)
        .replace(/{hour}/g,`${date.getHours()}:${date.getMinutes()}H`)

	replaceAll('e[',']e',function(t1,t2,item){
		return content.replace(t1+item+t2,
			`${message.client.emojis.find(e=>e.name.includes(item))||"`[NaE]`"}`
		);
	});
	replaceAll('u[',']u',function(t1,t2,item){
		let emoji = message.client.emojis.find(e=>e.name.includes(item))
		return content.replace(t1+item+t2,
			emoji?emoji.url:"`[NaE]`"
		);
	});
	let title = replaceOne('t[',']t')
	let image = replaceOne('i[',']i')
	let thumb = replaceOne('l[',']l')
	let footer = replaceOne('b[',']b')
	let author = replaceOne('a[',']a')
	let color = replaceOne('c[',']c')
	let fields = replaceAll('f[',']f')
	let embed = new Discord.RichEmbed()
	if(content.includes("{time}")) {
    	content = content.replace("{time}","")
    	embed.setTimestamp()
    }
	content = content.trim()
	if(title) embed.setTitle(title);
    if(author) embed.setAuthor(args(author)[0],args(author)[1]);
	if(footer) embed.setFooter(args(footer)[0],args(footer)[1]);
	if(image) embed.setImage(image);
	if(color) embed.setColor(color);
	if(thumb) embed.setThumbnail(thumb);
	if(content) embed.setDescription(content);
	if(fields.length>25) fields=fields.slice(0,24);
	fields.forEach(function(field){
		let a = args(field)
		if(a[1].length>1020)return;
		embed.addField(a[0],a[1],true)
	})
	return embed
}

module.exports = toEmbed

let help = new Discord.RichEmbed()
	.setTitle("📌 KingEmbed Help")
	.setDescription("KingEmbed vous sert à créer entièrement un RichEmbed de façon textuelle. Pour cela il vous suffit de connaitre les balises spécifiques. En voici une liste.")
	.addField("UTILISER KINGEMBED",`
Pour utiliser cette fonction, vous devez d'abord copier
le fichier KingEmbed.js à coté de l'index de votre bot.
Vous pourrez ensuite importe la fonction avec un require.\`\`\`js
let toEmbed = require("./KingEmbed.js")
\`\`\`
Vous pouvez ensuite utilier KingEmbed de cette façon ↓\`\`\`js
// Récupérer un embed à partir de texte ↓
let embed = toEmbed(texte)
// Récupérer l'embed d'aide de la fonction ↓
let embed = toEmbed("help")
// Récupérer un embed stocké dans un .txt ↓
let fs = require('fs')
let file = fs.readFileSync('./embed.txt',{
	encoding:"utf8"
})
let embed = toEmbed(file)
// Pour utiliser les balises spéciales ↓
let embed = toEmbed(texte,message)
\`\`\``,false)
	.addField("LES BALISES",`
Les balises servent à compléter l'embed.
Les x[**arg**]x reçoivent un argument textuel
Les {key} doivent être écrits comme tels
Les x[**arg**{**arg**}]x reçoivent **deux** arguments`,false)
	.addField("LA STRUCTURE",`
t[**titre**]t *titre*
i[**url**]i *image*
l[**url**]l *logo*
c[**hexColor**]c *couleur*
{time} *date de footer*
b[**text**{**url**}]b *footer*
a[**name**{**url**}]a *auteur*
f[**name**{**value**}]f *field*`,true)
	.addField("LES DONNEES",`
e[**emojiName**]e *emoji*
u[**emojiName**]u *url*
{guild name}
{guild image}
{user name}
{user image}
{hour} *HH:MM*
{date} *DD-MM-YYYY*`,true)