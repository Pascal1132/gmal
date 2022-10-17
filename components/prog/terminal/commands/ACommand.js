const terminalColors = {
    black: '#000000',
    red: '#ff0000',
    green: '#00ff00',
    yellow: '#ffff00',
    blue: '#0000ff',
    magenta: '#ff00ff',
    cyan: '#00ffff',
    white: '#ffffff',
    default: '#ffffff',
    lightgray: '#d3d3d3',
    lightblue: '#add8e6',
}


export default class ACommand {
    messages;
    currentPrefix;
    constructor(messages, currentPrefix) {
        this.messages = messages;
        this.currentPrefix = currentPrefix;
    }
    print(str) {
        // split all \n and add them to the history
        const cmds = str.split("\\n");
        for (let i = 0; i < cmds.length; i++) {
            this.messages.push({
                html: ACommand.colorize(ACommand.clean(cmds[i])),
            });
        }
    }

    // colorize string like : [[red]]this is red[[default]]this is default.
    // Should return : <span style="color:#ff0000">this is red</span><span style="color:#ffffff">this is default</span>
    static colorize(str) {
        let result = str;
        for (const color in terminalColors) {
            const regex = new RegExp(`\\[\\[${color}\\]\\]`, 'g');
            result = result.replace(regex, `<span style="color:${terminalColors[color]}">`);
        }
        result = result.replace(/\[\[default\]\]/g, '</span>');
        return result;
    }
    /**
     * Clean function remove all the html tags from a string
     * @param {*} str 
     */
    static clean(str) {
        return str.replace(/(<([^>]+)>)/gi, "");
    }
}