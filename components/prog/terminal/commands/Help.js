import ACommand from './ACommand';
import {Commands} from '../config';

export default class Help extends ACommand{
    execute(str) {
        // List all commands
        this.print("Available commands: \\n");

        // foreach object property of Commands, print the key and command.description
        for (const [key, command] of Object.entries(Commands)) {
            this.print("[[lightblue]]" + key + ": [[default]]" + command.description);
        }
    }
}