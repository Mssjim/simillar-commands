const errorRules = [1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 4]; // Max accepted errors [array index = word length]
const adjChars = {
    A: ['Q', 'W', 'S', 'Z'],
    B: ['V', 'G', 'H', 'N'],
    C: ['X', 'D', 'F', 'V'],
    D: ['S', 'W', 'E', 'R', 'F', 'C', 'X'],
    E: ['W', '3', '4', 'R', 'F', 'D', 'S'],
    F: ['D', 'E', 'R', 'T', 'G', 'V', 'C'],
    G: ['F', 'R', 'T', 'Y', 'H', 'B', 'V'],
    H: ['G', 'T', 'Y', 'U', 'J', 'N', 'B'],
    I: ['U', '8', '9', 'O', 'L', 'K', 'J'],
    J: ['H', 'Y', 'U', 'I', 'K', 'M', 'N'],
    K: ['J', 'U', 'I', 'O', 'L', 'M'],
    L: ['K', 'I', 'O', 'P', 'N'],
    M: ['N', 'J', 'K'],
    N: ['B', 'H', 'J', 'M', 'I', 'O', 'P'],
    O: ['I', '9', '0', 'P', 'N', 'L', 'K'],
    P: ['O', '9', '0', 'N', 'L'],
    Q: ['1', '2', 'W', 'S', 'A'],
    R: ['E', '4', '5', 'T', 'G', 'F', 'D'],
    S: ['A', 'Q', 'W', 'E', 'D', 'X', 'Z'],
    T: ['R', '5', '6', 'Y', 'H', 'G', 'F', 'R'],
    U: ['Y', '7', '8', 'I', 'K', 'J', 'H'],
    V: ['C', 'F', 'G', 'B'],
    W: ['Q', '2', '3', 'E', 'D', 'S', 'A'],
    X: ['Z', 'S', 'D', 'C'],
    Y: ['T', '6', '7', 'U', 'J', 'H', 'G'],
    Z: ['A', 'S', 'X'],
    a: ['q', 'w', 's', 'z'],
    b: ['v', 'g', 'h', 'n'],
    c: ['x', 'd', 'f', 'v'],
    d: ['s', 'w', 'e', 'r', 'f', 'c', 'x'],
    e: ['w', '3', '4', 'r', 'f', 'd', 's'],
    f: ['d', 'e', 'r', 't', 'g', 'v', 'c'],
    g: ['f', 'r', 't', 'y', 'h', 'b', 'v'],
    h: ['g', 't', 'y', 'u', 'j', 'n', 'b'],
    i: ['u', '8', '9', 'o', 'l', 'k', 'j'],
    j: ['h', 'y', 'u', 'i', 'k', 'm', 'n'],
    k: ['j', 'u', 'i', 'o', 'l', 'm'],
    l: ['k', 'i', 'o', 'p', 'n'],
    m: ['n', 'j', 'k'],
    n: ['b', 'h', 'j', 'm', 'i', 'o', 'p'],
    o: ['i', '9', '0', 'p', 'n', 'l', 'k'],
    p: ['o', '9', '0', 'n', 'l'],
    q: ['1', '2', 'w', 's', 'a'],
    r: ['e', '4', '5', 't', 'g', 'f', 'd'],
    s: ['a', 'q', 'w', 'e', 'd', 'x', 'z'],
    t: ['r', '5', '6', 'y', 'h', 'g', 'f', 'r'],
    u: ['y', '7', '8', 'i', 'k', 'j', 'h'],
    v: ['c', 'f', 'g', 'b'],
    w: ['q', '2', '3', 'e', 'd', 's', 'a'],
    x: ['z', 's', 'd', 'c'],
    y: ['t', '6', '7', 'u', 'j', 'h', 'g'],
    z: ['a', 's', 'x'],
    0: ['9', 'p', 'o'],
    1: ['2', 'q'],
    2: ['1', '3', 'w', 'q'],
    3: ['2', '4', 'e', 'w'],
    4: ['3', '5', 'r', 'e'],
    5: ['4', '6', 't', 'r'],
    6: ['5', '7', 'y', 't'],
    7: ['6', '8', 'u', 'y'],
    8: ['7', '9', 'i', 'u'],
    9: ['8', '0', 'o', 'i'],
};

const shiftChars = (cmd, i) => { // Shift '[i]' and [i+1] char positions
    return cmd.substring(0, i) + cmd[i+1] + cmd[i] + cmd.substring(i+2, cmd.length);
};

const normalize = (string, ignoreCase = true) => {
    string = ignoreCase ? string.toLowerCase() : string;
    
    return string
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

const compareCommands = (cmd1, cmd2, normalizeString = true, ignoreCase = true) => {
    cmd1 = normalizeString ? normalize(cmd1, ignoreCase) : cmd1;
    cmd2 = normalizeString ? normalize(cmd2, ignoreCase) : cmd2;

    for(let i = 0; i < cmd1.length; i++) // Check if 'cmd1' has a missing char
        if(cmd1 == cmd2.slice(0, i) + cmd2.slice(i+1)) return true;

    for(let i = 0; i < cmd1.length; i++) // Check if 'cmd2' has a missing char
        if(cmd2 == cmd1.slice(0, i) + cmd1.slice(i+1)) return true;
    
    const maxLen = Math.max(cmd1.length, cmd2.length);
    const maxErrors = errorRules[maxLen] || errorRules[errorRules.length-1];

    let errors = 0;
    for(let i = 0; i < maxLen; i++) {
        const adj = adjChars[cmd1[i]] || [];
        if (cmd1[i] != cmd2[i]) {
            errors++;
            if(!adj.includes(cmd2[i])) return false;
            if(errors > maxErrors) return false;
        }
    }
    return true;
};

const simillarCommands = (commands, cmd, normalize = true, ignoreCase = true) => {
    let simillarCommands = [];

    if(commands instanceof Map)
        commands = Array.from(commands.keys())

    if(!Array.isArray(commands)) throw Error(`Expected Array or Map of Commands. Received ${typeof(commands)}`);

    commands.forEach(command => {
        for(let i = 0; i < cmd.length; i++) {
            if(i == 0) {
                if(compareCommands(command, cmd, normalize, ignoreCase)) {
                    simillarCommands.push(command);
                    break;
                }
            } else {
                if(compareCommands(command, shiftChars(cmd, i-1), normalize, ignoreCase)) {
                    simillarCommands.push(command);
                    break;
                }
            }
        }
    });

    return simillarCommands;
}

const simillarCommand = (commands, cmd, normalize = true, ignoreCase = true) => {
    return simillarCommands(commands, cmd, normalize, ignoreCase)[0];
}

module.exports = {
    normalize,
    simillarCommands,
    simillarCommand
}