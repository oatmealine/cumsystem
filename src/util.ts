import * as Discord from 'discord.js';

Discord; // fuck you eslint

export function getParams(message: Discord.Message) : string[] {
	return message.content.split(' ').slice(1, message.content.length);
}

export function grammar(str: string) : string {
	const newstring = str.slice(1, str.length);
	return str[0].toUpperCase() + newstring;
}

export function parseUser(bot : Discord.Client, parse : string, guild? : Discord.Guild) : Discord.User | null {
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
			let users = guild.members.cache.filter(u => u.nickname !== null && u.nickname.toLowerCase().startsWith(parse.toLowerCase()));
			if (users.size > 0) {
				let user = users.first();
				if (user)
					return user.user;
			}

			users = guild.members.cache.filter(u => u.nickname !== null && u.nickname.toLowerCase() === parse.toLowerCase());
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