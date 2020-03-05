import * as Discord from 'discord.js';
import { Command } from './Command';

Discord; // eslint .......

/**
 * A command the function of which returns the message to send back
 * @extends Command
 */
export class SimpleCommand extends Command {
	/**
	 * Create a command
 	 * @example
 	 * let command = new CommandSystem.SimpleCommand('test', () => {
 	 *  return 'Testing!';
 	 * });
	 * @param {string} name The name, also what invokes the command
	 * @param {Function} cfunction The function to run after the command is ran, returns content that will be sent back to the user, or a promise that returns the content
	 */
	constructor(name: string, cfunction: (message: Discord.Message, content: string) => any | Promise<any> | undefined) {
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