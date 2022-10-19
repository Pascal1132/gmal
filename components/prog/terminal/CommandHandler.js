import ACommand from './commands/ACommand';
import {Commands} from './config';

export default class CommandHandler {
    static async handleCommand(command, messages, prefix) {
        // take the first word of the command
        const commandName = command.split(' ')[0]?.toLowerCase() ?? '';
        // to lower case
        if (commandName in Commands) {
            messages.push({
                body: command,
                prefix: prefix,
            });
            /**
             * @type {ACommand}
             */
            const handler = Commands[commandName].handler;
            const instance = new handler(messages, prefix);
            await instance.execute(command);
            return instance.messages;
        } else {
            messages.push({
                body: command,
                prefix: prefix,
            });
            messages.push({
                body: `Command not found: ${command}`,
            });
        }
        return messages;
    }
}