import * as Discord from 'discord.js';
export declare function getParams(message: Discord.Message): string[];
export declare function grammar(str: string): string;
export declare function parseUser(bot: Discord.Client, parse: string, guild?: Discord.Guild): Discord.User | null;
