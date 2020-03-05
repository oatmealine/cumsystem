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

```ts
const Discord = require('discord.js');
const CommandSystem = require('cumsystem');

let client = new Discord.Client();
let cs = new CommandSystem.System(client, '!'); // set the prefix

client.on('message', m => cs.parseMessage(m)); // arrow functions are required!!!!
client.on('ready', () => console.log('ready!'));

cs.addCommand('core', new CommandSystem.SimpleCommand('hi', () => {
  return 'hello!';
})
  .setDescription('says hello back'));

cs.addCommand('core', new CommandSystem.SimpleCommand('say', (msg, bot, content) => {
  return content;
})
  .setDescription('says whatever you tell it to say')
  .setOwnerOnly());

client.login(token);
```

## Short documentation (incomplete, hopefully will be replaced by an auto-documentation soon)

### System( client : Client, prefix : string )

Initializes a new command system. It's recommended to only create one per client.

#### System#addCommand( category : string, command : Command )

Adds a command to the command system to a specified category. The category is created if it doesnt exist.

#### System#setClient( client : Client )

Sets a new client to the command system.

#### System#setPrefix( prefix : string )

Sets the prefix of the command system.

#### System#parseMessage( message : Message, prefixOverride : string )

Parses messages, recommended to put in your client message listener.

### Command( name : string, cfunction : (message: Message, content: string) => any )

Represents a command. `cfunction` will be ran when the command is executed.

`content` is a variable that is the message's content without the prefix. For example:

`msg.content`: `!say abcdefg aa aa`
`content`: `abcdefg aa aa`

#### Command#setName( name : string )

#### Command#setUsage( usage : string )

Sets the usage of the command. Will be used for checking the syntax!!, use `Command#setDisplayUsage` to set a display usage.

Types available:
- `user`
- `number`
- `id`
- `url`
- `string` / `any`

Example:
```ts
new Command('', message => {
  message.channel.send('usage test passed!');
})
  .setUsage('(string) (number) (user)')
  .setDisplayUsage('(parameter 1) (parameter 2) (parameter 3)')
```

#### Command#setDisplayUsage (usage : string )

Check `Command#setUsage()`

#### Command#addExample ( example : string )

Adds an example usage of the command.

#### Command#addAlias ( alias : string )

Adds an alias that you can alternatively use to execute the command.

#### Command#setHidden ( hidden? : boolean )

Makes the command hidden from the built-in help command.

#### Command#setOwnerOnly ( owner? : boolean )

Makes the command only accessible to the bot owner.

#### Command#setGuildOnly ( guild? : boolean )

Makes the command only accessible from a server/guild (cannot be ran in a DM).

#### Command#setDMOnly ( dm? : boolean )

Makes the command only accessible from DMs.

#### Command#setNSFW ( nsfw? : boolean )

Makes the command only accessible in NSFW channels or DMs.

#### Command#addUserPermission ( perm : PermissionResolvable )

Adds a permission that the user executing the command must have.

#### Command#addClientPermission ( perm : PermissionResolvable )

Adds a permission that the client requires to run the command.

#### Command#setUserCooldown ( time : number )

Makes a per-user cooldown to the command. If above 0, then a user can only run it once every `time`ms.

#### Command#setGlobalCooldown ( time : number )

`Command#setUserCooldown()`, but global instead of per-user.

#### Command#runCommand ( message : Message, client : Client )

Runs the command. Not recommended to run without `System#parseMessage()`.

### SimpleCommand ( name : string, cfunction : (message: Message, content: string) => any ) | extends Command

The `Command` class, but the output of `cfunction` will be sent back as a message.