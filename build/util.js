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
Discord; // fuck you eslint
function getParams(message) {
    return message.content.split(' ').slice(1, message.content.length);
}
exports.getParams = getParams;
function grammar(str) {
    var newstring = str.slice(1, str.length);
    return str[0].toUpperCase() + newstring;
}
exports.grammar = grammar;
function parseUser(bot, parse, guild) {
    if (parse.startsWith('<@') && parse.startsWith('>')) {
        parse = parse.substr(2, parse.length - 3);
    }
    if (!isNaN(Number(parse))) {
        var user = bot.users.cache.get(parse);
        if (user !== undefined)
            return user;
    }
    else {
        if (parse.split('#').length === 2) {
            var name_1 = parse.split('#')[0];
            var discrim_1 = parse.split('#')[1];
            var users = bot.users.cache.filter(function (u) { return u.username === name_1 && u.discriminator === discrim_1; });
            if (users.size === 1) {
                return users.first() || null;
            }
        }
        if (guild) {
            var users = guild.members.cache.filter(function (u) { return u.nickname !== null && u.nickname.toLowerCase().startsWith(parse.toLowerCase()); });
            if (users.size > 0) {
                var user = users.first();
                if (user)
                    return user.user;
            }
            users = guild.members.cache.filter(function (u) { return u.nickname !== null && u.nickname.toLowerCase() === parse.toLowerCase(); });
            if (users.size > 0) {
                var user = users.first();
                if (user)
                    return user.user;
            }
            users = guild.members.cache.filter(function (u) { return u.user.username.toLowerCase() === parse.toLowerCase(); });
            if (users.size > 0) {
                var user = users.first();
                if (user)
                    return user.user;
            }
            users = guild.members.cache.filter(function (u) { return u.user.username.toLowerCase().startsWith(parse.toLowerCase()); });
            if (users.size > 0) {
                var user = users.first();
                if (user)
                    return user.user;
            }
        }
    }
    return null;
}
exports.parseUser = parseUser;
