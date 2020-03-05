import * as Discord from 'discord.js';
import { Command } from './Command';
export declare class System {
    prefix: string;
    client: Discord.Client;
    commands: any;
    private application;
    ownerID: string | undefined;
    constructor(client: Discord.Client, prefix: string);
    /**
     * add a command to the commands list
     * @param {string} category the name of the category to use
     * @param {Command} command the command itself
     */
    addCommand(category: string, command: Command): void;
    /**
     * sets a client for the library to use
     * @param {Discord.Client} clientSet the client
     */
    setClient(clientSet: Discord.Client): void;
    /**
     * sets a prefix for the library to use
     * @param {string} prefixSet the prefix
     */
    setPrefix(prefixSet: string): void;
    /**
     * Parses messages, recommended to put in your client message listener
     * @param {Discord.Message} message the message
     * @param {string} prefixOverride a prefix override to use instead of the default one, useful for custom prefixes
     */
    parseMessage(message: Discord.Message, prefixOverride?: string): void;
}
