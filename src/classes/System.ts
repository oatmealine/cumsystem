import * as Discord from 'discord.js';
import { Command } from './Command';

import { addCommands } from '../defaultCommands';

Discord; // eslint bein a DUMBASS
Command;

export class System {
  public prefix: string = '!';
  public client: Discord.Client;

  public commands: any = {};

  private application: Discord.ClientApplication | undefined;

  public ownerID: string | undefined;

  constructor(client: Discord.Client, prefix: string) {
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
   * add a command to the commands list
   * @param {string} category the name of the category to use
   * @param {Command} command the command itself
   */
  public addCommand(category: string, command: Command): void {
  	if (!this.commands[category]) {
  		this.commands[category] = [];
  	}

  	this.commands[category][command.name] = command;
  }

  /**
   * sets a client for the library to use
   * @param {Discord.Client} clientSet the client
   */
  public setClient(clientSet: Discord.Client) {
  	this.client = clientSet;
  }

  /**
   * sets a prefix for the library to use
   * @param {string} prefixSet the prefix
   */
  public setPrefix(prefixSet: string) {
  	this.prefix = prefixSet;
  }

  /**
   * Parses messages, recommended to put in your client message listener
   * @param {Discord.Message} message the message
   * @param {string} prefixOverride a prefix override to use instead of the default one, useful for custom prefixes
   */
  public parseMessage(message: Discord.Message, prefixOverride?: string) {
  	let content: string = message.content;

  	let thisPrefix: string = this.prefix;
  	if (prefixOverride) thisPrefix = prefixOverride;

  	if (message.author.bot || message.author.id === message.client.user?.id) return;

  	if (content.startsWith(thisPrefix) || content.startsWith(this.prefix)) {
  		content = content.slice(content.startsWith(thisPrefix) ? thisPrefix.length : this.prefix.length, content.length);
  		const cmd = content.split(' ')[0];

  		//@ts-ignore
  		Object.values(this.commands).forEach((cat: object) => {
  			Object.values(cat).forEach((command) => {
  				if ((command['name'] === cmd || command['aliases'].includes(cmd))) {					
  					if (((message.content.startsWith(thisPrefix) || (message.content.startsWith(this.prefix) && command['ignorePrefix'])) || (thisPrefix == this.prefix))) {
  						command['runCommand'](message, this);
  					}
  				}
  			}); 
  		});
  	}
  }
}