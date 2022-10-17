import Cd from "./commands/Cd";
import Clear from "./commands/Clear";
import Echo from "./commands/Echo";
import Help from "./commands/Help";
import History from "./commands/History";
import Ls from "./commands/Ls";

export const Commands = {
    'help': {
        description: 'Show this help',
        handler: Help,
    },
    'ls': {
        description: 'List files and directories (Coming soon)',
        handler: Ls,
    },
    'cd': {
        description: 'Change directory (Coming soon)',
        handler: Cd,
    },
    'clear': {
        description: 'Clear the terminal',
        handler: Clear,
    },
    'echo': {
        description: 'Print arguments',
        handler: Echo,
    },
    'history': {
        description: 'Show the command history',
        handler: History,
    },
}
