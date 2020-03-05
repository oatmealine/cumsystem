"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Command_1 = require("./Command");
/**
 * a command the function of which returns the message to sent back
 * @extends Command
 */
var SimpleCommand = /** @class */ (function (_super) {
    __extends(SimpleCommand, _super);
    /**
     * create a command
     * @param {string} name the name, also what invokes the command
     * @param {Function} cfunction the function to run after the command is ran, returns a string that will be sent back to the user
     */
    function SimpleCommand(name, cfunction) {
        var _this = _super.call(this, name, cfunction) || this;
        _this.cfunc = function (message, content) {
            var returned = cfunction(message, content);
            if (!returned) {
                process.emitWarning("Command output of " + name + " returned nothing, please use Command class instead");
                return null;
            }
            if (returned.then) { // check if its a promise or not
                returned.then(function (messageResult) {
                    return message.channel.send(messageResult);
                });
            }
            else {
                return message.channel.send(returned);
            }
            return null;
        };
        return _this;
    }
    return SimpleCommand;
}(Command_1.Command));
exports.SimpleCommand = SimpleCommand;
