import ACommand from "./ACommand";

export default class Echo extends ACommand{
    async execute(str) {
        // remove the command from the string
        str = str.replace("echo ", "");
        // add the string to the history
        this.print(str);
    }
}