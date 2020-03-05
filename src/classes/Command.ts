import * as Discord from 'discord.js';
import * as util from '../util';
import { System } from './System';

System; // eslint .. ./.,,,, ,

/**
 * represents a command the bot can run (for example, a help command)
 */
export class Command {
	public name: string;
	public cfunc: (message: Discord.Message, content: string) => any | undefined;
	public description: string;

	public usage: string;
	public displayUsage: string;

	public clientPermissions: Discord.PermissionResolvable[];
	public userPermissions: Discord.PermissionResolvable[];
	public needsDM: boolean;
	public needsGuild: boolean;

	public hidden: boolean;
	public ownerOnly: boolean;
	public ignorePrefix: boolean;
	public debugOnly: boolean;
	public nsfwOnly: boolean;

	public aliases: string[];
	public examples: string[];

	public usageCheck: ((content: string) => boolean) | undefined;

	public globalCooldown: number;
	public userCooldown: number;
	private globalCooldowns: number = 0;
	private userCooldowns: any = {};

	/**
	 * create a command
	 * @param {string} name the name, also what invokes the command
	 * @param {function} cfunction the function to run after the command is ran
	 */
	constructor(name : string, cfunction : (message: Discord.Message, content: string) => any | null) {
		this.name = name;
		this.cfunc = cfunction;
		this.usage = '';
		this.displayUsage = '';
		this.clientPermissions = [];
		this.userPermissions = [];

		this.needsDM = false;
		this.needsGuild = false;

		this.hidden = false;
		this.ignorePrefix = false;
		this.debugOnly = false;
		this.ownerOnly = false;
		this.nsfwOnly = false;

		this.description = 'No description provided';

		this.aliases = [];
		this.examples = [];
		
		this.globalCooldown = 0;
		this.userCooldown = 0;

		return this;
	}

	/**
	 * change the command name
	 * @param {string} name the name to use for the command
	 */
	public setName(name : string) {
		this.name = name;
		return this;
	}

	/**
	 * changes the usage for parsing the command
	 * ex. usage: (string) (number) [any]
	 * @param {string} usage the usage, use () for necessary and [] for optional arguments
	 */
	public setUsage(usage : string) {
		this.usage = usage;
		this.displayUsage = usage;
		return this;
	}

	/**
	 * changes the usage in the help command. isnt parsed
	 * @param {string} usage the usage
	 */
	public setDisplayUsage(usage : string) {
		this.displayUsage = usage;
		return this;
	}

	/**
	 * add an example usage to the command
	 * ex: 20 text
	 * @param {string} example an example usage of the command
	 */
	public addExample(example : string) {
		this.examples.push(example);
		return this;
	}

	/**
	 * adds an alias which the command can be invoked with
	 * @param {string} alias the name of the alias
	 */
	public addAlias(alias : string) {
		this.aliases.push(alias);
		return this;
	}

	/**
	 * adds aliases which the command can be invoked with
	 * @param {string[]} aliases an array of alias names
	 */
	public addAliases(aliases : string[]) {
		aliases.forEach((alias) => {
			this.addAlias(alias);
		});
		return this;
	}

	/**
	 * sets the command's decription, display only
	 * @param {string} desc the description, leave empty to remove
	 */
	public setDescription(desc? : string) {
		this.description = desc === undefined ? 'No description provided' : desc;
		return this;
	}

	/**
	 * change the command's visibility in the help command
	 * @param {boolean} hide
	 */
	public setHidden(hide? : boolean) {
		this.hidden = hide === undefined ? true : hide;
		return this;
	}

	/**
	 * set the command to be ran as owner only
	 * @param {boolean} owner 
	 */
	public setOwnerOnly(owner? : boolean) {
		this.ownerOnly = owner === undefined ? true : owner;
		return this;
	}

	/**
	 * set whether the command is able to be ran outside dms or not
	 * @param {boolean} needs 
	 */
	public setDMOnly(needs?: boolean) {
		this.needsDM = needs === undefined ? true : needs;
		return this;
	}

	/**
	 * set whether the command is able to be ran outside servers or not
	 * @param {boolean} needs 
	 */
	public setGuildOnly(needs?: boolean) {
		this.needsGuild = needs === undefined ? true : needs;
		return this;
	}

	/**
	 * set whether the command needs an nsfw channel to run
	 * @param {boolean} needs 
	 */
	public setNSFW(needs?: boolean) {
		this.nsfwOnly = needs === undefined ? true : needs;
		return this;
	}

	/**
	 * set whether the command ignores any given custom prefixes (only really useful for commands that change the prefix)
	 * @param {boolean} needs
	 */
	public setIgnorePrefix(needs?: boolean) {
		this.ignorePrefix = needs === undefined ? true : needs;
		return this;
	}

	/**
	 * add a permission required for the client to run the command
	 * @param {Discord.PermissionResolvable} perm the permission to add
	 */
	public addClientPermission(perm: Discord.PermissionResolvable) {
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
	 */
	public addUserPermission(perm: Discord.PermissionResolvable) {
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
	 */
	public addClientPermissions(perms: Discord.PermissionResolvable[]) {
		perms.forEach((perm) => {
			this.addClientPermission(perm);
		});

		return this;
	}

	/**
	 * add multiple permissions required for the user to invoke the command
	 * @param {Discord.PermissionResolvable[]} perms an array of permissions to add
	 */
	public addUserPermissions(perms: Discord.PermissionResolvable[]) {
		perms.forEach((perm) => {
			this.addUserPermission(perm);
		});

		return this;
	}

	/**
	 * set a per-user cooldown on the command to prevent it from being spammed
	 * @param {number} time the cooldown in ms
	 */
	public setUserCooldown(time : number) {
		this.userCooldown = time;
		return this;
	}

	/**
	 * set a global cooldown on the command to prevent it from being spammed
	 * @param {number} time the cooldown in ms
	 */
	public setGlobalCooldown(time : number) {
		this.globalCooldown = time;
		return this;
	}

	/**
	 * check if you can run the command with a message, and if so run it
	 * @param {Discord.Message} message the message that invoked the command
	 * @param {Discord.Client} client the client of the bot that recieved the command
	 */
	public runCommand(message: Discord.Message, system: System) {
		const params = util.getParams(message);

		if (this.ownerOnly && message.author.id !== system.ownerID)
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
		
		if (this.userCooldown > 0) {
			if (this.userCooldowns[message.author.id] === undefined || Date.now() - this.userCooldowns[message.author.id] > 0) {
				this.userCooldowns[message.author.id] = this.userCooldown;
			} else {
				return message.react('⏱️');
			}
		}

		if (this.globalCooldown > 0) {
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
						argumentsValid[i] = util.parseUser(message.client, params[i], message.guild === null ? undefined : message.guild) !== null;
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

		if (this.userPermissions.length > 0 && message.guild && message.author.id !== system.ownerID) {
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

		return this.cfunc(message, params.join(' '));
	}
}