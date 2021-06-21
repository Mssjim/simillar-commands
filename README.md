<div align="center">
  <br />
  <p>
    <img src="./logo.png" width="800" alt="simillar-commands" />
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/simillar-commands"><img src="https://img.shields.io/npm/v/simillar-commands.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/simillar-commands"><img src="https://img.shields.io/npm/dt/simillar-commands.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://github.com/Mssjim/simillar-commands"><img src="https://badge.fury.io/gh/Mssjim%2Fsimillar-commands.svg" alt="GitHub Version" /></a>
    <a href="https://github.com/Mssjim/simillar-commands/blob/master/LICENSE"><img src="https://img.shields.io/github/license/Mssjim/simillar-commands.svg" alt="GitHub Version" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/simillar-commands/"><img src="https://nodei.co/npm/simillar-commands.png?downloads=true&stars=true" alt="NPM info" /></a>
  </p>
</div>
A simple npm utility module for obtaining similar commands in Discord Bots projects.

# Installation
* `npm install simillar-commands`

# Usage

**Basic Example**
<br>Get an array with all simillar commands
```js
// Import the Simillar Commands function
const { simillarCommands } = require('simillar-commands');

// Create an array of commands
const commands = [
	'ping',
	'say',
	//....
	'unsay'
];

// Get simillar commands
simillarCommands(commands, 'ping'); // ['ping']
simillarCommands(commands, 'pin');  // ['ping']
simillarCommands(commands, 'pong'); // ['ping']
simillarCommands(commands, 'sâY');  // ['say']
simillarCommands(commands, 'nsay'); // ['say', 'unsay']
simillarCommands(commands, 'foo');  // []
```

<br>**Normalize Commands**
<br>Normalize commands before use to prevent errors
```js
// Import the Normalize function
const { normalize } = require('simillar-commands');

const command = 'CômmandExàmplê';

normalize(command); // commandexample

// Case insensitive usage
normalize(command, false); // CommandExample
```

<br>**Basic Bot '_Did you mean?_' system**
<br>Show a react Embed to suggest a simillar command
```js
// Import the Simillar Command and Normalize function
const { simillarCommand, normalize } = require('simillar-commands');

// Setup Discord Bot and Creates a Collection/Array of Commands
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

client.commands = new Discord.Collection();

client.commands.set('ping', { name:'ping', run: msg => msg.reply('pong!') });
client.commands.set('say', { name:'say', run: msg => msg.reply(msg.content.replace(`${prefix}say `, '')) });

// Creates a Command Handler
client.on('message', async(msg) => {
	if(!msg.guild || !msg.content.startsWith(prefix) || msg.author.bot) return;
	const cmd = normalize(msg.content.slice(prefix.length).split(' ')[0]);

	let command = client.commands.get(cmd);
	
	if(command) { // Run command normally
		command.run(msg);
	} else { // Search for simillar command
		const simillar = simillarCommand(client.commands, cmd);

        // Creates a Embed
		const embed = new Discord.MessageEmbed()
			.setDescription(`Did you mean **${simillar}**?`);
		
		const msgEmbed = await msg.reply(embed);
        msgEmbed.react('✅');

        // Setup the Reaction Collector
        const filter = (reaction, user) => {
			if(reaction.emoji.name != '✅') return false;
			return(user.id == msg.author.id)
		}

		msgEmbed.createReactionCollector(filter, { max: 1 })
			.on('collect', () => { // Run command normally
				command = client.commands.get(simillar);
				command.run(msg);
			});
	}
});

// Start Bot
client.login('TOKEN');
```
<br>**Case Insensitive**
<br>You can also add a param to not ignore the case.

```js
// Import module functions
const { normalize, simillarCommands, simillarCommand } = require('simillar-commands');

normalize('CômmÁnD');        // command
normalize('CômmÁnD', false); // CommAnD

const commands = ['ban', 'unban', 'BaN' , 'ping'];

simillarCommands(commands, 'bam');          // ['ban', 'BaN']
simillarCommands(commands, 'bam', false);   // ['ban']
simillarCommands(commands, 'BaM', false);   // ['BaN']
simillarCommands(commands, 'nban');         // ['ban, 'unban', 'BaN']
simillarCommands(commands, 'nBaN', false);  // ['BaN']
```

