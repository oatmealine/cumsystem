import * as Discord from 'discord.js';
import { System } from './System';

System; // eslint .. ./.,,,, ,

function parseUser(bot : Discord.Client, parse : string, guild? : Discord.Guild) : Discord.User | null {
	if(parse.startsWith('<@') && parse.startsWith('>')) {
		parse = parse.substr(2, parse.length-3);
	}

	if(!isNaN(Number(parse))) {
		let user = bot.users.cache.get(parse);
		if (user !== undefined)
			return user;
	} else {
		if (parse.split('#').length === 2) {
			let name = parse.split('#')[0];
			let discrim = parse.split('#')[1];
			let users = bot.users.cache.filter(u => u.username === name && u.discriminator === discrim);
	
			if (users.size === 1) {
				return users.first() || null;
			}
		}

		if (guild) {
			let users = guild.members.cache.filter(u => u.nickname !== null && u.nickname?.toLowerCase().startsWith(parse.toLowerCase()));
			if (users.size > 0) {
				let user = users.first();
				if (user)
					return user.user;
			}

			users = guild.members.cache.filter(u => u.nickname !== null && u.nickname?.toLowerCase() === parse.toLowerCase());
			if (users.size > 0) {
				let user = users.first();
				if (user)
					return user.user;
			}

			users = guild.members.cache.filter(u => u.user.username.toLowerCase() === parse.toLowerCase());
			if (users.size > 0) {
				let user = users.first();
				if (user)
					return user.user;
			}

			users = guild.members.cache.filter(u => u.user.username.toLowerCase().startsWith(parse.toLowerCase()));
			if (users.size > 0) {
				let user = users.first();
				if (user)
					return user.user;
			}
		}
	}

	return null;
}

/**
 * Represents a command the bot can run (for example, a help command)
 *
 * `content` is a variable that is the message's content without the prefix. For example:
 * 
 * `msg.content`: `!say abcdefg aa aa`
 * 
 * `content`: `abcdefg aa aa`
 */
export class Command {
	/** The name of the command, also what the command uses to be invoked */
	public name: string;
	/** The function to run when the command is invoked */
	public cfunc: (message: Discord.Message, content: string) => any | undefined;
	/** A description of the command; shows up in the help command */
	public description: string;
	/** The category the command belongs in */
	public category: string;

	/** The usage of the command. Used for checking the syntax */
	public usage: string;
	/** The usage of the command, but only used for the help command */
	public displayUsage: string;

	/** An array of permissions the client needs to run the command */
	public clientPermissions: Discord.PermissionResolvable[];
	/** An array of permissions the user needs to invoke the command */
	public userPermissions: Discord.PermissionResolvable[];
	/** The command can only be ran in a DM */
	public needsDM: boolean;
	/** The command can only be ran in a guild/server */
	public needsGuild: boolean;

	/** The comand wont show up in the help commands */
	public hidden: boolean;
	/** The command can only be ran by the owner */
	public ownerOnly: boolean;
	/** The command will ignore prefix overrides */
	public ignorePrefix: boolean;
	/** The command can only be ran in an NSFW channel or in DMs */
	public nsfwOnly: boolean;

	/** An array of alternative names that can be used to invoke the command */
	public aliases: string[];
	/** An array of example usages of the command. Only show up in help */
	public examples: string[];

	/** The function used to check the usage of the command, will use the default one if not provided */
	public usageCheck: ((content: string) => boolean) | undefined;

	/** Amount of ms until anyone can use the command since it was last used */
	public globalCooldown: number;
	/** Amount of ms until a user can use the command again */
	public userCooldown: number;
	private globalCooldowns: number = 0;
	private userCooldowns: any = {};

	/**
	 * Create a command
	 * @example
	 * ```typescript
	 * let command = new CommandSystem.Command('test', msg => {
	 *  msg.channel.send('Testing!');
	 * });
	 * ```
	 * @param {string} name The name, also what invokes the command
	 * @param {function} cfunction The function to run after the command is ran
	 */
	constructor(name : string, cfunction : (message: Discord.Message, content: string) => any | null) {
		this.name = name;
		this.cfunc = cfunction;
		this.category = 'uncategorized';
		this.usage = '';
		this.displayUsage = '';
		this.clientPermissions = [];
		this.userPermissions = [];

		this.needsDM = false;
		this.needsGuild = false;

		this.hidden = false;
		this.ignorePrefix = false;
		this.ownerOnly = false;
		this.nsfwOnly = false;

		this.description = '';

		this.aliases = [];
		this.examples = [];
		
		this.globalCooldown = 0;
		this.userCooldown = 0;

		return this;
	}

	/**
	 * Change the command name
	 * @param {string} name The name to use for the command
	 * @returns {Command} Itself
	 */
	public setName(name : string) : Command {
		this.name = name;
		return this;
	}

	/**
	 * Sets the usage of the command. Will be used for checking the syntax!!, use `Command#setDisplayUsage` to set a display usage.
   *
	 * Types available:
   * - `user`
   * - `number`
   * - `id`
   * - `url`
   * - `string` / `any`
   *
   * @example
	 * ```typescript
	 * new Command('', message => {
   *  message.channel.send('usage test passed!');
   * })
   *  .setUsage('(string) (number) (user)')
   *  .setDisplayUsage('(parameter 1) (parameter 2) (parameter 3)');
	 * ```
	 * @param {string} usage the usage, use () for necessary and [] for optional arguments
	 * @returns {Command} Itself
	 */
	public setUsage(usage : string) : Command {
		this.usage = usage;
		this.displayUsage = usage;
		return this;
	}

	/**
	 * Changes the usage in the help command. Isn't parsed
	 * @param {string} usage the usage
	 * @returns {Command} Itself
	 */
	public setDisplayUsage(usage : string) : Command {
		this.displayUsage = usage;
		return this;
	}

	/**
	 * Add an example usage to the command
	 * @example
	 * ```typescript
	 * new Command('', message => {
   *  message.channel.send('usage test passed!');
   * })
   *  .setUsage('(string) (number) (user)')
   *  .setDisplayUsage('(parameter 1) (parameter 2) (parameter 3)')
	 *  .addExample('text 1 551929694019256333');
	 * ```
	 * @param {string} example an example usage of the command
	 * @returns {Command} Itself
	 */
	public addExample(example : string) : Command {
		this.examples.push(example);
		return this;
	}

	/**
	 * Adds an alias which the command can be invoked with
	 * @param {string} alias the name of the alias
	 * @returns {Command} Itself
	 */
	public addAlias(alias : string) : Command {
		this.aliases.push(alias);
		return this;
	}

	/**
	 * Adds aliases which the command can be invoked with
	 * @param {string[]} aliases an array of alias names
	 * @returns {Command} Itself
	 */
	public addAliases(aliases : string[]) : Command {
		aliases.forEach((alias) => {
			this.addAlias(alias);
		});
		return this;
	}

	/**
	 * Sets the command's decription, display only
	 * @param {string} desc the description, leave empty to remove
	 * @returns {Command} Itself
	 */
	public setDescription(desc? : string) : Command {
		this.description = desc === undefined ? 'No description provided' : desc;
		return this;
	}
	
	/**
	 * Sets the command's category, display only
	 * @param {string} category the category, leave empty to remove
	 * @returns {Command} Itself
	 */
	public setCategory(category? : string) : Command {
		this.category = category?.toLowerCase() || 'uncategorized';
		return this;
	}

	/**
	 * Change the command's visibility in the help command
	 * @param {boolean} hide
	 * @returns {Command} Itself
	 */
	public setHidden(hide? : boolean) : Command {
		this.hidden = hide === undefined ? true : hide;
		return this;
	}

	/**
	 * Set the command to be ran as owner only
	 * @param {boolean} owner 
	 * @returns {Command} Itself
	 */
	public setOwnerOnly(owner? : boolean) : Command {
		this.ownerOnly = owner === undefined ? true : owner;
		return this;
	}

	/**
	 * Set whether the command is able to be ran outside dms or not
	 * @param {boolean} needs 
	 * @returns {Command} Itself
	 */
	public setDMOnly(needs?: boolean) : Command {
		this.needsDM = needs === undefined ? true : needs;
		return this;
	}

	/**
	 * Set whether the command is able to be ran outside servers or not
	 * @param {boolean} needs 
	 * @returns {Command} Itself
	 */
	public setGuildOnly(needs?: boolean) : Command {
		this.needsGuild = needs === undefined ? true : needs;
		return this;
	}

	/**
	 * Set whether the command can only be ran in an NSFW channel or a DM
	 * @param {boolean} needs 
	 * @returns {Command} Itself
	 */
	public setNSFW(needs?: boolean) : Command {
		this.nsfwOnly = needs === undefined ? true : needs;
		return this;
	}

	/**
	 * Set whether the command ignores any given custom prefixes (only really useful for commands that change the prefix)
	 * @param {boolean} needs
	 * @returns {Command} Itself
	 */
	public setIgnorePrefix(needs?: boolean) : Command {
		this.ignorePrefix = needs === undefined ? true : needs;
		return this;
	}

	/**
	 * Add a permission required for the client to run the command
	 * @param {Discord.PermissionResolvable} perm The permission to add
	 * @returns {Command} Itself
	 */
	public addClientPermission(perm: Discord.PermissionResolvable) : Command {
		if (Object.keys(Discord.Permissions.FLAGS).includes(perm.toString())) {
			this.clientPermissions.push(perm);
		} else {
			process.emitWarning(`Unknown permission: ${perm}`);
		}
		return this;
	}

	/**
	 * add a permission required for the user to invoke the command
	 * @param {Discord.PermissionResolvable} perm the permission to add
	 * @returns {Command} Itself
	 */
	public addUserPermission(perm: Discord.PermissionResolvable) : Command {
		if (Object.keys(Discord.Permissions.FLAGS).includes(perm.toString())) {
			this.userPermissions.push(perm);
		} else {
			process.emitWarning(`Unknown permission: ${perm}`);
		}
		return this;
	}

	/**
	 * add multiple permissions required for the client to run the command
	 * @param {Discord.PermissionResolvable[]} perms an array of permissions to add
	 * @returns {Command} Itself
	 */
	public addClientPermissions(perms: Discord.PermissionResolvable[]) : Command {
		perms.forEach((perm) => {
			this.addClientPermission(perm);
		});

		return this;
	}

	/**
	 * add multiple permissions required for the user to invoke the command
	 * @param {Discord.PermissionResolvable[]} perms an array of permissions to add
	 * @returns {Command} Itself
	 */
	public addUserPermissions(perms: Discord.PermissionResolvable[]) : Command {
		perms.forEach((perm) => {
			this.addUserPermission(perm);
		});

		return this;
	}

	/**
	 * Set a per-user cooldown on the command to prevent it from being spammed
	 * @param {number} time the cooldown in ms
	 * @returns {Command} Itself
	 */
	public setUserCooldown(time : number) : Command {
		this.userCooldown = time;
		return this;
	}

	/**
	 * Set a global cooldown on the command to prevent it from being spammed
	 * @param {number} time the cooldown in ms
	 * @returns {Command} Itself
	 */
	public setGlobalCooldown(time : number) : Command {
		this.globalCooldown = time;
		return this;
	}

	/**
	 * check if you can run the command with a message, and if so run it
	 * @param {Discord.Message} message the message that invoked the command
	 * @param {Discord.Client} client the client of the bot that recieved the command
	 */
	public runCommand(message: Discord.Message, system: System) {
		const params = message.content.split(' ').slice(1);

		let owner = message.author.id === system.ownerID;

		if (this.ownerOnly && !owner)
			return message.channel.send('This command can only be ran by the owner!');

		if (this.needsGuild && !message.guild)
			return message.channel.send('This command needs to be ran in a server!');

		if (this.needsDM && message.guild)
			return message.channel.send('This command needs to be ran in a DM!');

		if (this.nsfwOnly) {
			// only check if ran inside a guild
			if (message.guild && message.channel instanceof Discord.TextChannel) {
				// nsfw off check
				if (!message.channel.nsfw) return message.channel.send('This command needs to be ran in an NSFW channel or DM!');

				// check for no nsfw tag in topic
				if (message.channel.topic !== null && message.channel.topic.includes('[no_nsfw]'))
					return message.channel.send('This command needs to be ran in an NSFW channel, but this channel has a [no_nsfw] tag in the topic.');
			}
		}
		
		if (this.userCooldown > 0 && !owner) {
			if (this.userCooldowns[message.author.id] === undefined || Date.now() - this.userCooldowns[message.author.id] > 0) {
				this.userCooldowns[message.author.id] = this.userCooldown;
			} else {
				return message.react('⏱️');
			}
		}

		if (this.globalCooldown > 0 && !owner) {
			if ((Date.now() - this.globalCooldowns) > 0) {
				this.globalCooldowns = Date.now() + this.globalCooldown;
			} else {
				return message.react('⏱️');
			}
		}

		let argumentsValid: boolean[] = [];

		if (this.usage && !this.usageCheck) {
			const argument = this.usage.split(' ');

			argument.forEach((arg, i) => {
				if (params[i] !== undefined) {
					switch (arg.slice(1, arg.length - 1)) {
					case 'any':
					case 'string':
						argumentsValid[i] = true;
						break;
					case 'user':
						argumentsValid[i] = parseUser(message.client, params[i], message.guild === null ? undefined : message.guild) !== null;
						break;
					case 'url':
						argumentsValid[i] = params[i].startsWith('http://') || params[i].startsWith('https://');
						break;
					case 'number':
						argumentsValid[i] = !isNaN(Number(params[i]));
						break;
					case 'id':
						argumentsValid[i] = message.client ? Boolean((message.client.guilds.cache.get(params[i]) || message.client.users.cache.get(params[i]) || message.client.channels.cache.get(params[i]))) : true;
					}
				} else {
					argumentsValid[i] = arg.startsWith('[') && arg.endsWith(']');
				}
			});
		} else {
			argumentsValid = this.usageCheck ? [this.usageCheck(message.content)] : [true];
		}

		if (argumentsValid !== null) {
			if (argumentsValid.includes(false)) {
				return message.channel.send(`Invalid syntax! \`${this.name+' '+this.displayUsage}\``);
			}
		}

		if (this.userPermissions.length > 0 && message.guild) {
			const missingPermissions: Discord.PermissionResolvable[] = [];

			this.userPermissions.forEach((perm) => {
				if (message.member !== null && !message.member.hasPermission(perm)) {
					missingPermissions.push(perm);
				}
			});

			if (missingPermissions.length > 0) {
				return message.channel.send(`**You can't run this command!** You need these permissions to use this command: \`${missingPermissions.join(', ')}\``);
			}
		}

		if (this.clientPermissions.length > 0 && message.guild) {
			const missingpermissions: Discord.PermissionResolvable[] = [];

			this.clientPermissions.forEach((perm) => {
				if (message.guild !== null && message.guild.me !== null && !message.guild.me.hasPermission(perm)) {
					missingpermissions.push(perm);
				}
			});

			if (missingpermissions.length > 0) {
				return message.channel.send(`**I can't run this command!** This bot need these permissions to run this command: \`${missingpermissions.join(', ')}\``);
			}
		}

		try {
			this.cfunc(message, params.join(' '));
		} catch(err) {
			system.emit('error', err, message, this);
		}
	}
}