"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = __importStar(require("discord.js"));
var util = __importStar(require("./util"));
var CommandSystem = __importStar(require("./index"));
function addCommands(cs) {
    cs.addCommand('core', new CommandSystem.SimpleCommand('help', function (message) {
        var params = message.content.split(' ');
        if (params[1]) {
            var command_1;
            var categoryName_1 = '';
            // ts is being stupid
            // @ts-ignore
            Object.values(cs.commands).forEach(function (category, i) {
                if (command_1) {
                    return;
                }
                categoryName_1 = Object.keys(cs.commands)[i];
                Object.values(category).forEach(function (cmd) {
                    if (cmd.name === params[1] || cmd.aliases.includes(params[1])) {
                        command_1 = cmd;
                    }
                });
            });
            // ts is being stupid
            // @ts-ignore
            if (command_1) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("**" + util.grammar(command_1.name) + "** (" + util.grammar(categoryName_1) + ")")
                    .addField('Usage', cs.prefix + command_1.name + ' ' + command_1.displayUsage)
                    .setDescription(command_1.description)
                    .setColor(Math.floor(Math.random() * 16777215));
                var commandExamplesPatched = command_1.examples.map(function (v) { return cs.prefix + command_1.name + ' ' + v; });
                if (command_1.examples.length !== 0) {
                    embed = embed.addField('Examples', '`' + commandExamplesPatched.join('`,\n`') + '`');
                }
                if (command_1.aliases.length !== 0) {
                    embed = embed.addField('Aliases', '`' + command_1.aliases.join('`, `') + '`');
                }
                return { embed: embed };
            }
            else {
                var category_1;
                var categoryName_2 = '';
                // ts is being stupid
                // @ts-ignore
                Object.values(cs.commands).forEach(function (cat, i) {
                    if (category_1) {
                        return;
                    }
                    categoryName_2 = Object.keys(cs.commands)[i];
                    if (categoryName_2 === params[1].toLowerCase()) {
                        category_1 = cat;
                    }
                });
                // ts is being stupid
                // @ts-ignore
                if (category_1) {
                    var embed = new Discord.MessageEmbed()
                        .setTitle("**" + util.grammar(categoryName_2) + "** [" + Object.keys(category_1).length + "]")
                        .setColor(Math.floor(Math.random() * 16777215));
                    var commands_1 = [];
                    Object.values(category_1).forEach(function (cmd) {
                        if (!cmd.hidden) {
                            commands_1.push('`' + cmd.name + '` - ' + cmd.description.split('\n')[0]);
                        }
                    });
                    if (commands_1.length !== 0)
                        embed.addField('Commands', commands_1.join('\n'));
                    return { embed: embed };
                }
                else {
                    return "Command or category `" + params[1] + "` not found!";
                }
            }
        }
        else {
            var embed_1 = new Discord.MessageEmbed()
                .setTitle('**All Commands**')
                .setColor(Math.floor(Math.random() * 16777215))
                .setFooter('Do help (category) to get all commands for a category!');
            // ts is being stupid
            // @ts-ignore
            Object.values(cs.commands).forEach(function (category, i) {
                var categoryName = Object.keys(cs.commands)[i];
                var commands = [];
                Object.values(category).forEach(function (cmd) {
                    if (!cmd.hidden)
                        commands.push(cmd.name);
                });
                if (commands.length !== 0)
                    embed_1.addField(util.grammar(categoryName) + " [" + commands.length + "]", '`' + commands.join('`, `') + '`');
            });
            return { embed: embed_1 };
        }
    })
        .setUsage('[string]')
        .setIgnorePrefix()
        .addAlias('cmds')
        .addClientPermission('EMBED_LINKS')
        .setDescription('see commands, or check out a comnmand in detail'));
    cs.addCommand('core', new CommandSystem.Command('ping', function (message, bot) {
        var dateStart = Date.now();
        message.channel.send('hol up').then(function (m) {
            m.edit("Message latency: " + (Date.now() - dateStart) + "ms\nWebsocket ping: " + message.client.ws.ping + "ms");
        });
    })
        .setDescription('ping the bot'));
}
exports.addCommands = addCommands;
