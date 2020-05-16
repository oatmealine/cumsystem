# Cumsystem

A simple and powerful Discord.JS command system

## Usage

`npm i cumsystem`

or

`npm i https://github.com/oatmealine/cumsystem`

then

```ts
const CommandSystem = require('cumsystem');
```

or

```ts
import * as CommandSystem from 'cumsystem';
```

### Example

```js
const Discord = require('discord.js');
const CommandSystem = require('./cumsystem');

let client = new Discord.Client();
let cs = new CommandSystem.System(client, '!');

client.on('message', m => cs.parseMessage(m));
client.on('ready', () => console.log('ready!'));

cs.on('error', (err, msg, cmd) => {
	console.error(`got error while running ${cmd.name}:`);
	console.error(err);

	msg.channel.send(`got error!: ${err}\nyou should report this to the developer!`);
})

cs.addCommand(new CommandSystem.SimpleCommand('hi', () => {
  return 'hello!';
})
	.setCategory('core')
  .setDescription('says hello back'));

cs.addCommand(new CommandSystem.SimpleCommand('say', (msg, content) => {
  return content;
})
	.setCategory('core')
  .setDescription('says whatever you tell it to say')
  .setOwnerOnly());
	
client.login(token);
```

## Documentation

[TypeDoc](https://oatmealine.github.io/cumsystem)