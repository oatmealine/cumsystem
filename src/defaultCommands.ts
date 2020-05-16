import * as Discord from 'discord.js';

import * as CommandSystem from './index';

function grammar(str: string) : string {
	const newstring = str.slice(1, str.length);
	return str[0].toUpperCase() + newstring;
}

export function addCommands(cs: CommandSystem.System) {
	cs.addCommand(new CommandSystem.SimpleCommand('help', (message) => {
		const params = message.content.split(' ');

		if (params[1]) {
			let command: CommandSystem.Command;

			cs.commands.forEach(cmd => {
				if (command) { return; }

				if (cmd.name === params[1] || cmd.aliases.includes(params[1])) {
					command = cmd;
				}
			});

			// hey TS MAYBE IF YOU READ THE BEFORE CODE YOU WOULD KNOW IT WOULD BE ASSIGNED OR NOT AND IT CHECKS HERE IF IT IS ?????
			// @ts-ignore
			if (command) {
				let embed = new Discord.MessageEmbed()
					.setTitle(`**${grammar(command.name)}** (${grammar(command.category)})`)
					.addField('Usage', cs.prefix + command.name + ' ' + command.displayUsage)
					.setDescription(command.description)
					.setColor(Math.floor(Math.random() * 16777215));

				let commandExamplesPatched = command.examples.map(v => cs.prefix + command.name + ' ' + v);

				if (command.examples.length !== 0) { embed = embed.addField('Examples', '`' + commandExamplesPatched.join('`,\n`') + '`'); }
				if (command.aliases.length !== 0) { embed = embed.addField('Aliases', '`' + command.aliases.join('`, `') + '`'); }

				return {embed};
			} else {
				let categoryCommands: CommandSystem.Command[] = cs.commands.filter(c => c.category === params[1].toLowerCase());

				if (categoryCommands.length === 0) return `Command or category \`${params[1]}\` not found!`;

				const embed = new Discord.MessageEmbed()
					.setTitle(`**${grammar(params[1].toLowerCase())}** [${categoryCommands.length}]`)
					.setColor(Math.floor(Math.random() * 16777215));

				embed.addField('Commands', categoryCommands.map(c => c.name).join('\n'));

				return {embed};
			}
		} else {
			const embed = new Discord.MessageEmbed()
				.setTitle('**All Commands**')
				.setColor(Math.floor(Math.random() * 16777215))
				.setFooter('Do help (category) to get all commands for a category!');

			let categorizedCommands: any = {};

			cs.commands.forEach(command => {
				if (!command.hidden) {
					if (!categorizedCommands[command.category]) categorizedCommands[command.category] = [];
					categorizedCommands[command.category].push(command);
				}
			});

			Object.keys(categorizedCommands).forEach(cat => {
				let commands = categorizedCommands[cat];

				if (commands.length !== 0)
					embed.addField(`${grammar(cat)} [${commands.length}]`,
						`\`${commands.map((c: CommandSystem.Command) => c.name.toLowerCase()).join('`, `')}\``);
			});

			return {embed};
		}
	})
		.setCategory('core')
		.setUsage('[string]')
		.setIgnorePrefix()
		.addAlias('cmds')
		.addClientPermission('EMBED_LINKS')
		.setDescription('see commands, or check out a comnmand in detail'));

	cs.addCommand(new CommandSystem.Command('ping', (message) => {
		const dateStart = Date.now();
    
		message.channel.send('hol up').then(m => {
			m.edit(`Message latency: ${Date.now() - dateStart}ms\nWebsocket ping: ${message.client.ws.ping}ms`);
		});
	})
		.setCategory('core')
		.setDescription('ping the bot'));
}