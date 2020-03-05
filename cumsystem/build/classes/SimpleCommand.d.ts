import * as Discord from 'discord.js';
import { Command } from './Command';
/**
 * a command the function of which returns the message to sent back
 * @extends Command
 */
export declare class SimpleCommand extends Command {
    /**
     * create a command
     * @param {string} name the name, also what invokes the command
     * @param {Function} cfunction the function to run after the command is ran, returns a string that will be sent back to the user
     */
    constructor(name: string, cfunction: (message: Discord.Message, content: string) => any | undefined);
}
