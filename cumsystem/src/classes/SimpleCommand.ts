import * as Discord from 'discord.js';
import { Command } from './Command';

Discord; // eslint .......

/**
 * a command the function of which returns the message to sent back
 * @extends Command
 */
export class SimpleCommand extends Command {
	/**
	 * create a command
	 * @param {string} name the name, also what invokes the command
	 * @param {Function} cfunction the function to run after the command is ran, returns a string that will be sent back to the user
	 */
	constructor(name: string, cfunction: (message: Discord.Message, content: string) => any | undefined) {
		super(name, cfunction);

		this.cfunc = (message, content) => {
			const returned: any = cfunction(message, content);

			if (!returned) {
				process.emitWarning(`Command output of ${name} returned nothing, please use Command class instead`);
				return null;
			}

			if (returned.then) { // check if its a promise or not
				returned.then((messageResult: string) => {
					return message.channel.send(messageResult);
				});
			} else {
				return message.channel.send(returned);
			}

			return null;
		};
	}
}