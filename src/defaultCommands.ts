import * as Discord from 'discord.js';

import * as util from './util';

import * as CommandSystem from './index';

export function addCommands(cs: CommandSystem.System) {
	cs.addCommand('core', new CommandSystem.SimpleCommand('help', (message) => {
		const params = message.content.split(' ');

		if (params[1]) {
			let command: CommandSystem.Command;
			let categoryName = '';

			// ts is being stupid
			// @ts-ignore
			Object.values(cs.commands).forEach((category: object, i) => {
				if (command) { return; }

				categoryName = Object.keys(cs.commands)[i];

				Object.values(category).forEach((cmd: CommandSystem.Command) => {
					if (cmd.name === params[1] || cmd.aliases.includes(params[1])) {
						command = cmd;
					}
				});
			});

			// ts is being stupid
			// @ts-ignore
			if (command) {
				let embed = new Discord.MessageEmbed()
					.setTitle(`**${util.grammar(command.name)}** (${util.grammar(categoryName)})`)
					.addField('Usage', cs.prefix + command.name + ' ' + command.displayUsage)
					.setDescription(command.description)
					.setColor(Math.floor(Math.random() * 16777215));

				let commandExamplesPatched = command.examples.map(v => cs.prefix + command.name + ' ' + v);

				if (command.examples.length !== 0) { embed = embed.addField('Examples', '`' + commandExamplesPatched.join('`,\n`') + '`'); }
				if (command.aliases.length !== 0) { embed = embed.addField('Aliases', '`' + command.aliases.join('`, `') + '`'); }

				return {embed};
			} else {
				let category: object;
				let categoryName = '';

				// ts is being stupid
				// @ts-ignore
				Object.values(cs.commands).forEach((cat: object, i) => {
					if (category) { return; }

					categoryName = Object.keys(cs.commands)[i];
					if (categoryName === params[1].toLowerCase()) { category = cat; }
				});

				// ts is being stupid
				// @ts-ignore
				if (category) {
					const embed = new Discord.MessageEmbed()
						.setTitle(`**${util.grammar(categoryName)}** [${Object.keys(category).length}]`)
						.setColor(Math.floor(Math.random() * 16777215));

					const commands: string[] = [];

					Object.values(category).forEach((cmd: CommandSystem.Command) => {
						if (!cmd.hidden) { commands.push('`' + cmd.name + '` - ' + cmd.description.split('\n')[0]); }
					});

					if (commands.length !== 0) embed.addField('Commands', commands.join('\n'));

					return {embed};
				} else {
					return `Command or category \`${params[1]}\` not found!`;
				}
			}
		} else {
			const embed = new Discord.MessageEmbed()
				.setTitle('**All Commands**')
				.setColor(Math.floor(Math.random() * 16777215))
				.setFooter('Do help (category) to get all commands for a category!');

			// ts is being stupid
			// @ts-ignore
			Object.values(cs.commands).forEach((category: object, i) => {
				const categoryName = Object.keys(cs.commands)[i];
				const commands: string[] = [];

				Object.values(category).forEach((cmd: CommandSystem.Command) => {
					if (!cmd.hidden) commands.push(cmd.name);
				});

				if (commands.length !== 0) embed.addField(`${util.grammar(categoryName)} [${commands.length}]`, '`' + commands.join('`, `') + '`');
			});

			return {embed};
		}
	})
		.setUsage('[string]')
		.setIgnorePrefix()
		.addAlias('cmds')
		.addClientPermission('EMBED_LINKS')
		.setDescription('see commands, or check out a comnmand in detail'));

	cs.addCommand('core', new CommandSystem.Command('ping', (message) => {
		const dateStart = Date.now();
    
		message.channel.send('hol up').then(m => {
			m.edit(`Message latency: ${Date.now() - dateStart}ms\nWebsocket ping: ${message.client.ws.ping}ms`);
		});
	})
		.setDescription('ping the bot'));
}