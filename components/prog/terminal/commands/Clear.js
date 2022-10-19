import ACommand from "./ACommand";

export default class Clear extends ACommand{
    execute(args) {
        // set all messages to .hidden = true
        this.messages.forEach(message => {
            message.hidden = true;
        }
        );
    }
}