import ACommand from "./ACommand";

export default class Echo extends ACommand{
    async execute(args) {
        this.print(args.join(' '));
    }
}