"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaultCommands_1 = require("../defaultCommands");
var System = /** @class */ (function () {
    function System(client, prefix) {
        var _this = this;
        this.prefix = '!';
        this.commands = {};
        this.client = client;
        this.prefix = prefix;
        defaultCommands_1.addCommands(this);
        client.on('ready', function () {
            client.fetchApplication()
                .then(function (app) {
                var _a;
                _this.application = app;
                _this.ownerID = (_a = _this.application.owner) === null || _a === void 0 ? void 0 : _a.id;
                if (!_this.ownerID)
                    process.emitWarning('Couldn\'t fetch owner id from the client\'s application');
            });
        });
    }
    /**
     * add a command to the commands list
     * @param {string} category the name of the category to use
     * @param {Command} command the command itself
     */
    System.prototype.addCommand = function (category, command) {
        if (!this.commands[category]) {
            this.commands[category] = [];
        }
        this.commands[category][command.name] = command;
    };
    /**
     * sets a client for the library to use
     * @param {Discord.Client} clientSet the client
     */
    System.prototype.setClient = function (clientSet) {
        this.client = clientSet;
    };
    /**
     * sets a prefix for the library to use
     * @param {string} prefixSet the prefix
     */
    System.prototype.setPrefix = function (prefixSet) {
        this.prefix = prefixSet;
    };
    /**
     * Parses messages, recommended to put in your client message listener
     * @param {Discord.Message} message the message
     * @param {string} prefixOverride a prefix override to use instead of the default one, useful for custom prefixes
     */
    System.prototype.parseMessage = function (message, prefixOverride) {
        var _this = this;
        var _a;
        var content = message.content;
        var thisPrefix = this.prefix;
        if (prefixOverride)
            thisPrefix = prefixOverride;
        if (message.author.bot || message.author.id === ((_a = message.client.user) === null || _a === void 0 ? void 0 : _a.id))
            return;
        if (content.startsWith(thisPrefix) || content.startsWith(this.prefix)) {
            content = content.slice(content.startsWith(thisPrefix) ? thisPrefix.length : this.prefix.length, content.length);
            var cmd_1 = content.split(' ')[0];
            //@ts-ignore
            Object.values(this.commands).forEach(function (cat) {
                Object.values(cat).forEach(function (command) {
                    if ((command['name'] === cmd_1 || command['aliases'].includes(cmd_1))) {
                        if (((message.content.startsWith(thisPrefix) || (message.content.startsWith(_this.prefix) && command['ignorePrefix'])) || (thisPrefix == _this.prefix))) {
                            command['runCommand'](message, _this);
                        }
                    }
                });
            });
        }
    };
    return System;
}());
exports.System = System;
