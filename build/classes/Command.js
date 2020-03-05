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
var util = __importStar(require("../util"));
/**
 * represents a command the bot can run (for example, a help command)
 */
var Command = /** @class */ (function () {
    /**
     * create a command
     * @param {string} name the name, also what invokes the command
     * @param {function} cfunction the function to run after the command is ran
     */
    function Command(name, cfunction) {
        this.globalCooldowns = 0;
        this.userCooldowns = {};
        this.name = name;
        this.cfunc = cfunction;
        this.usage = '';
        this.displayUsage = '';
        this.clientPermissions = [];
        this.userPermissions = [];
        this.needsDM = false;
        this.needsGuild = false;
        this.hidden = false;
        this.ignorePrefix = false;
        this.debugOnly = false;
        this.ownerOnly = false;
        this.nsfwOnly = false;
        this.description = 'No description provided';
        this.aliases = [];
        this.examples = [];
        this.globalCooldown = 0;
        this.userCooldown = 0;
        return this;
    }
    /**
     * change the command name
     * @param {string} name the name to use for the command
     */
    Command.prototype.setName = function (name) {
        this.name = name;
        return this;
    };
    /**
     * changes the usage for parsing the command
     * ex. usage: (string) (number) [any]
     * @param {string} usage the usage, use () for necessary and [] for optional arguments
     */
    Command.prototype.setUsage = function (usage) {
        this.usage = usage;
        this.displayUsage = usage;
        return this;
    };
    /**
     * changes the usage in the help command. isnt parsed
     * @param {string} usage the usage
     */
    Command.prototype.setDisplayUsage = function (usage) {
        this.displayUsage = usage;
        return this;
    };
    /**
     * add an example usage to the command
     * ex: 20 text
     * @param {string} example an example usage of the command
     */
    Command.prototype.addExample = function (example) {
        this.examples.push(example);
        return this;
    };
    /**
     * adds an alias which the command can be invoked with
     * @param {string} alias the name of the alias
     */
    Command.prototype.addAlias = function (alias) {
        this.aliases.push(alias);
        return this;
    };
    /**
     * adds aliases which the command can be invoked with
     * @param {string[]} aliases an array of alias names
     */
    Command.prototype.addAliases = function (aliases) {
        var _this = this;
        aliases.forEach(function (alias) {
            _this.addAlias(alias);
        });
        return this;
    };
    /**
     * sets the command's decription, display only
     * @param {string} desc the description, leave empty to remove
     */
    Command.prototype.setDescription = function (desc) {
        this.description = desc === undefined ? 'No description provided' : desc;
        return this;
    };
    /**
     * change the command's visibility in the help command
     * @param {boolean} hide
     */
    Command.prototype.setHidden = function (hide) {
        this.hidden = hide === undefined ? true : hide;
        return this;
    };
    /**
     * set the command to be ran as owner only
     * @param {boolean} owner
     */
    Command.prototype.setOwnerOnly = function (owner) {
        this.ownerOnly = owner === undefined ? true : owner;
        return this;
    };
    /**
     * set whether the command is able to be ran outside dms or not
     * @param {boolean} needs
     */
    Command.prototype.setDMOnly = function (needs) {
        this.needsDM = needs === undefined ? true : needs;
        return this;
    };
    /**
     * set whether the command is able to be ran outside servers or not
     * @param {boolean} needs
     */
    Command.prototype.setGuildOnly = function (needs) {
        this.needsGuild = needs === undefined ? true : needs;
        return this;
    };
    /**
     * set whether the command needs an nsfw channel to run
     * @param {boolean} needs
     */
    Command.prototype.setNSFW = function (needs) {
        this.nsfwOnly = needs === undefined ? true : needs;
        return this;
    };
    /**
     * set whether the command ignores any given custom prefixes (only really useful for commands that change the prefix)
     * @param {boolean} needs
     */
    Command.prototype.setIgnorePrefix = function (needs) {
        this.ignorePrefix = needs === undefined ? true : needs;
        return this;
    };
    /**
     * add a permission required for the client to run the command
     * @param {Discord.PermissionResolvable} perm the permission to add
     */
    Command.prototype.addClientPermission = function (perm) {
        if (Object.keys(Discord.Permissions.FLAGS).includes(perm.toString())) {
            this.clientPermissions.push(perm);
        }
        else {
            process.emitWarning("Unknown permission: " + perm);
        }
        return this;
    };
    /**
     * add a permission required for the user to invoke the command
     * @param {Discord.PermissionResolvable} perm the permission to add
     */
    Command.prototype.addUserPermission = function (perm) {
        if (Object.keys(Discord.Permissions.FLAGS).includes(perm.toString())) {
            this.userPermissions.push(perm);
        }
        else {
            process.emitWarning("Unknown permission: " + perm);
        }
        return this;
    };
    /**
     * add multiple permissions required for the client to run the command
     * @param {Discord.PermissionResolvable[]} perms an array of permissions to add
     */
    Command.prototype.addClientPermissions = function (perms) {
        var _this = this;
        perms.forEach(function (perm) {
            _this.addClientPermission(perm);
        });
        return this;
    };
    /**
     * add multiple permissions required for the user to invoke the command
     * @param {Discord.PermissionResolvable[]} perms an array of permissions to add
     */
    Command.prototype.addUserPermissions = function (perms) {
        var _this = this;
        perms.forEach(function (perm) {
            _this.addUserPermission(perm);
        });
        return this;
    };
    /**
     * set a per-user cooldown on the command to prevent it from being spammed
     * @param {number} time the cooldown in ms
     */
    Command.prototype.setUserCooldown = function (time) {
        this.userCooldown = time;
        return this;
    };
    /**
     * set a global cooldown on the command to prevent it from being spammed
     * @param {number} time the cooldown in ms
     */
    Command.prototype.setGlobalCooldown = function (time) {
        this.globalCooldown = time;
        return this;
    };
    /**
     * check if you can run the command with a message, and if so run it
     * @param {Discord.Message} message the message that invoked the command
     * @param {Discord.Client} client the client of the bot that recieved the command
     */
    Command.prototype.runCommand = function (message, system) {
        var params = util.getParams(message);
        if (this.ownerOnly && message.author.id !== system.ownerID)
            return message.channel.send('This command can only be ran by the owner!');
        if (this.needsGuild && !message.guild)
            return message.channel.send('This command needs to be ran in a server!');
        if (this.needsDM && message.guild)
            return message.channel.send('This command needs to be ran in a DM!');
        if (this.nsfwOnly) {
            // only check if ran inside a guild
            if (message.guild && message.channel instanceof Discord.TextChannel) {
                // nsfw off check
                if (!message.channel.nsfw)
                    return message.channel.send('This command needs to be ran in an NSFW channel or DM!');
                // check for no nsfw tag in topic
                if (message.channel.topic !== null && message.channel.topic.includes('[no_nsfw]'))
                    return message.channel.send('This command needs to be ran in an NSFW channel, but this channel has a [no_nsfw] tag in the topic.');
            }
        }
        if (this.userCooldown > 0) {
            if (this.userCooldowns[message.author.id] === undefined || Date.now() - this.userCooldowns[message.author.id] > 0) {
                this.userCooldowns[message.author.id] = this.userCooldown;
            }
            else {
                return message.react('⏱️');
            }
        }
        if (this.globalCooldown > 0) {
            if ((Date.now() - this.globalCooldowns) > 0) {
                this.globalCooldowns = Date.now() + this.globalCooldown;
            }
            else {
                return message.react('⏱️');
            }
        }
        var argumentsValid = [];
        if (this.usage && !this.usageCheck) {
            var argument = this.usage.split(' ');
            argument.forEach(function (arg, i) {
                if (params[i] !== undefined) {
                    switch (arg.slice(1, arg.length - 1)) {
                        case 'any':
                        case 'string':
                            argumentsValid[i] = true;
                            break;
                        case 'user':
                            argumentsValid[i] = util.parseUser(message.client, params[i], message.guild === null ? undefined : message.guild) !== null;
                            break;
                        case 'url':
                            argumentsValid[i] = params[i].startsWith('http://') || params[i].startsWith('https://');
                            break;
                        case 'number':
                            argumentsValid[i] = !isNaN(Number(params[i]));
                            break;
                        case 'id':
                            argumentsValid[i] = message.client ? Boolean((message.client.guilds.cache.get(params[i]) || message.client.users.cache.get(params[i]) || message.client.channels.cache.get(params[i]))) : true;
                    }
                }
                else {
                    argumentsValid[i] = arg.startsWith('[') && arg.endsWith(']');
                }
            });
        }
        else {
            argumentsValid = this.usageCheck ? [this.usageCheck(message.content)] : [true];
        }
        if (argumentsValid !== null) {
            if (argumentsValid.includes(false)) {
                return message.channel.send("Invalid syntax! `" + (this.name + ' ' + this.displayUsage) + "`");
            }
        }
        if (this.userPermissions.length > 0 && message.guild && message.author.id !== system.ownerID) {
            var missingPermissions_1 = [];
            this.userPermissions.forEach(function (perm) {
                if (message.member !== null && !message.member.hasPermission(perm)) {
                    missingPermissions_1.push(perm);
                }
            });
            if (missingPermissions_1.length > 0) {
                return message.channel.send("**You can't run this command!** You need these permissions to use this command: `" + missingPermissions_1.join(', ') + "`");
            }
        }
        if (this.clientPermissions.length > 0 && message.guild) {
            var missingpermissions_1 = [];
            this.clientPermissions.forEach(function (perm) {
                if (message.guild !== null && message.guild.me !== null && !message.guild.me.hasPermission(perm)) {
                    missingpermissions_1.push(perm);
                }
            });
            if (missingpermissions_1.length > 0) {
                return message.channel.send("**I can't run this command!** This bot need these permissions to run this command: `" + missingpermissions_1.join(', ') + "`");
            }
        }
        return this.cfunc(message, params.join(' '));
    };
    return Command;
}());
exports.Command = Command;
