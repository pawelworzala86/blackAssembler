// Tabela kodów rejestrów
const reg_bin = {
    'rax': 0,  'rcx': 1,  'rdx': 2,  'rbx': 3,
    'rsp': 4,  'rbp': 5,  'rsi': 6,  'rdi': 7,
    'r8': 8,   'r9': 9,   'r10': 10, 'r11': 11,
    'r12': 12, 'r13': 13, 'r14': 14, 'r15': 15,
};

function isRegister(name) {
    return reg_bin.hasOwnProperty(name);
}

// Funkcja zamieniająca wartość na little endian (imm32 na 'xx xx xx xx')
function LE(hexstr) {
    hexstr = hexstr.replace(/^0x/i, '').padStart(8, '0');
    let bytes = [];
    for (let i = hexstr.length; i > 0; i -= 2) {
        bytes.push(hexstr.substring(i-2, i));
    }
    // używamy tylko 4 bajtów dla imm32
    return bytes.slice(0, 4).join(' ');
}

export function getDivInstruction(params) {
    // params[0] - dst, params[1] - src or imm32
    if (isRegister(params[1])) {
        // div r/m64 (np. div rax) – dzieli RDX:RAX przez wskazany rejestr
        let src = params[1];
        let src_id = reg_bin[src];

        // REX prefix
        let rex = 0x48;
        if (src_id >= 8) rex = 0x49;
        let rex_str = rex.toString(16).toUpperCase();

        let opcode = 'F7';
        // ModR/M: 11 111 src (reg/opcode=110=div, r/m=src)
        let modrm = 0xF0 | (src_id & 7);
        let modrm_str = modrm.toString(16).toUpperCase().padStart(2, '0');

        return rex_str + ' ' + opcode + ' ' + modrm_str;
    } else {
        // div [imm32] – dzieli przez wartość z adresu imm32
        let opcode = 'F7';
        let rex_str = '48';

        // ModR/M: 00 111 101 (mod=00, reg/opcode=110 (div), r/m=101 (adres bezpośredni))
        let modrm = 0xF5;
        let modrm_str = modrm.toString(16).toUpperCase();

        let imm_le = LE(params[1]);
        return rex_str + ' ' + opcode + ' ' + modrm_str + ' ' + imm_le;
    }
}

// Przykłady użycia:
console.log(getDivInstruction(['rax', 'rax']));       // '48 F7 F0'
console.log(getDivInstruction(['r12', 'r12']));       // '49 F7 F4'
console.log(getDivInstruction(['r9', '0x12345678'])); // '48 F7 F5 78 56 34 12'