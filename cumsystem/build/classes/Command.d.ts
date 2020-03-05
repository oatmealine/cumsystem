import * as Discord from 'discord.js';
import { System } from './System';
/**
 * represents a command the bot can run (for example, a help command)
 */
export declare class Command {
    name: string;
    cfunc: (message: Discord.Message, content: string) => any | undefined;
    description: string;
    usage: string;
    displayUsage: string;
    clientPermissions: Discord.PermissionResolvable[];
    userPermissions: Discord.PermissionResolvable[];
    needsDM: boolean;
    needsGuild: boolean;
    hidden: boolean;
    ownerOnly: boolean;
    ignorePrefix: boolean;
    debugOnly: boolean;
    nsfwOnly: boolean;
    aliases: string[];
    examples: string[];
    usageCheck: ((content: string) => boolean) | undefined;
    globalCooldown: number;
    userCooldown: number;
    private globalCooldowns;
    private userCooldowns;
    /**
     * create a command
     * @param {string} name the name, also what invokes the command
     * @param {function} cfunction the function to run after the command is ran
     */
    constructor(name: string, cfunction: (message: Discord.Message, content: string) => any | null);
    /**
     * change the command name
     * @param {string} name the name to use for the command
     */
    setName(name: string): this;
    /**
     * changes the usage for parsing the command
     * ex. usage: (string) (number) [any]
     * @param {string} usage the usage, use () for necessary and [] for optional arguments
     */
    setUsage(usage: string): this;
    /**
     * changes the usage in the help command. isnt parsed
     * @param {string} usage the usage
     */
    setDisplayUsage(usage: string): this;
    /**
     * add an example usage to the command
     * ex: 20 text
     * @param {string} example an example usage of the command
     */
    addExample(example: string): this;
    /**
     * adds an alias which the command can be invoked with
     * @param {string} alias the name of the alias
     */
    addAlias(alias: string): this;
    /**
     * adds aliases which the command can be invoked with
     * @param {string[]} aliases an array of alias names
     */
    addAliases(aliases: string[]): this;
    /**
     * sets the command's decription, display only
     * @param {string} desc the description, leave empty to remove
     */
    setDescription(desc?: string): this;
    /**
     * change the command's visibility in the help command
     * @param {boolean} hide
     */
    setHidden(hide?: boolean): this;
    /**
     * set the command to be ran as owner only
     * @param {boolean} owner
     */
    setOwnerOnly(owner?: boolean): this;
    /**
     * set whether the command is able to be ran outside dms or not
     * @param {boolean} needs
     */
    setDMOnly(needs?: boolean): this;
    /**
     * set whether the command is able to be ran outside servers or not
     * @param {boolean} needs
     */
    setGuildOnly(needs?: boolean): this;
    /**
     * set whether the command needs an nsfw channel to run
     * @param {boolean} needs
     */
    setNSFW(needs?: boolean): this;
    /**
     * set whether the command ignores any given custom prefixes (only really useful for commands that change the prefix)
     * @param {boolean} needs
     */
    setIgnorePrefix(needs?: boolean): this;
    /**
     * add a permission required for the client to run the command
     * @param {Discord.PermissionResolvable} perm the permission to add
     */
    addClientPermission(perm: Discord.PermissionResolvable): this;
    /**
     * add a permission required for the user to invoke the command
     * @param {Discord.PermissionResolvable} perm the permission to add
     */
    addUserPermission(perm: Discord.PermissionResolvable): this;
    /**
     * add multiple permissions required for the client to run the command
     * @param {Discord.PermissionResolvable[]} perms an array of permissions to add
     */
    addClientPermissions(perms: Discord.PermissionResolvable[]): this;
    /**
     * add multiple permissions required for the user to invoke the command
     * @param {Discord.PermissionResolvable[]} perms an array of permissions to add
     */
    addUserPermissions(perms: Discord.PermissionResolvable[]): this;
    /**
     * set a per-user cooldown on the command to prevent it from being spammed
     * @param {number} time the cooldown in ms
     */
    setUserCooldown(time: number): this;
    /**
     * set a global cooldown on the command to prevent it from being spammed
     * @param {number} time the cooldown in ms
     */
    setGlobalCooldown(time: number): this;
    /**
     * check if you can run the command with a message, and if so run it
     * @param {Discord.Message} message the message that invoked the command
     * @param {Discord.Client} client the client of the bot that recieved the command
     */
    runCommand(message: Discord.Message, system: System): any;
}
