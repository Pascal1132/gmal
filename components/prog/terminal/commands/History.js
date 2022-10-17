import ACommand from './ACommand';

export default class History extends ACommand{
    execute(str) {
        // List all commands
        this.print("Latest commands: \\n");

        // foreach this.messages with a prefix, print the body
        this.messages.forEach(message => {
            if (message.prefix) {
                this.print("[[lightblue]]" + (message.html ?? message.body) );
            }
        });

    }
}