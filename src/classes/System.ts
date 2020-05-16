import * as Discord from 'discord.js';
import { Command } from './Command';

import { addCommands } from '../defaultCommands';
import { EventEmitter } from 'events';

Discord; // eslint bein a DUMBASS
Command;

/**
 * Represents the commands and options of a single bot
 */
export class System extends EventEmitter {
	 /** The prefix used for detecting commands */
	public prefix: string = '!';
	 /** The client of the command system */
  public client: Discord.Client;

	 /** An array of commands */
  public commands: Command[] = [];

	 /** The client application of the client, only used to get the owner ID */
  private application: Discord.ClientApplication | undefined;

	 /** The ID of the bot owner */
	public ownerID: string | undefined;
	
	private setValues: any = {}; 

	 /**
	 * Makes a new command system with no commands except the default commands (ping, help)
   * @example
	 * ```typescript
   * const Discord = require('discord.js');
   * const CommandSystem = require('cumsystem');
   * 
   * const client = new Discord.Client();
   * const cs = new CommandSystem.System(client, '!');
	 * ```
	 * @param {Discord.Client} client The client of the command system
	 * @param {string} prefix The prefix to use for command detection
	 */
	constructor(client: Discord.Client, prefix: string) {
		super();
		
		this.client = client;
  	this.prefix = prefix;

  	addCommands(this);

  	client.on('ready', () => {
  		client.fetchApplication()
  			.then(app => {
  				this.application = app;
  				this.ownerID = this.application.owner?.id;

  				if (!this.ownerID)
  					process.emitWarning('Couldn\'t fetch owner id from the client\'s application');
  			});
		});
	}

	/**
   * Add a command to the commands list
	 * @example
	 * ```typescript
	 * cs.addCommand(new CommandSystem.SimpleCommand('hi', () => {
   *   return 'hello!';
	 * }));
	 * ```
   * @param {Command} command The command itself
   */
	public addCommand(command: Command): void {
		this.commands.push(command);
	}

	/**
   * Sets a client for the command system to use
   * @param {Discord.Client} clientSet The client
   */
	public setClient(clientSet: Discord.Client) {
  	this.client = clientSet;
	}

	/**
   * Sets a prefix for the command system to use
   * @param {string} prefixSet The prefix
   */
	public setPrefix(prefixSet: string) {
  	this.prefix = prefixSet;
	}

	/**
	 * Set a key to a value in the system (useful for passing values through modules without directly passing them to the function)
	 * @param {string} key
	 * @param {any} value
	 */
	public set(key: string, value: any): any {
		this.setValues[key] = value;
		return value;
	}

	/**
	 * Get a value from a key in the system
	 * @param {string} key
	 */
	public get(key: string): any {
		return this.setValues[key];
	}

	/**
   * Parses messages, recommended to put in your client message listener
   * @param {Discord.Message} message The message
   * @param {string} prefixOverride A prefix override to use instead of the default one, useful for custom prefixes
   */
	public parseMessage(message: Discord.Message, prefixOverride?: string) {
  	let content: string = message.content;

  	let thisPrefix: string = this.prefix;
  	if (prefixOverride) thisPrefix = prefixOverride;

  	if (message.author.bot || message.author.id === message.client.user?.id) return;

  	if (content.startsWith(thisPrefix) || content.startsWith(this.prefix)) {
  		content = content.slice(content.startsWith(thisPrefix) ? thisPrefix.length : this.prefix.length, content.length);
  		const cmd = content.split(' ')[0];

  		this.commands.forEach((command: Command) => {
				if (command.name === cmd || command.aliases.includes(cmd)) {					
  				if ((message.content.startsWith(thisPrefix) || (message.content.startsWith(this.prefix) && command['ignorePrefix'])) || (thisPrefix == this.prefix)) {
  					command.runCommand(message, this);
  				}
  			}
  		});
  	}
	}
}