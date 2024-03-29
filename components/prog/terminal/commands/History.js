import ACommand from './ACommand';

export default class History extends ACommand{
    execute(args) {
        // List all commands
        this.print("Latest commands: \\n");

        // foreach this.messages with a prefix, print the body
        this.messages.forEach(message => {
            if (message.prefix) {
                this.print("[[lightblue]]" + this.skipColorization(message.html ?? message.body) );
            }
        });
    }

    // Change all [ to proper symbol html code
    skipColorization(str) {
        return str.replaceAll("[", "&#91;").replaceAll("]", "&#93;");
    } 
}