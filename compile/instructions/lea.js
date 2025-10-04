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
    hexstr = hexstr.replace(/^0x/i, '').padStart(8, '0'); // upewnij się, że mamy 8 znaków
    let bytes = [];
    for (let i = hexstr.length; i > 0; i -= 2) {
        bytes.push(hexstr.substring(i-2, i));
    }
    return bytes.join(' ');
}

export function getLeaInstruction(params) {
    // params[0] - dst, params[1] - src (rejestr lub imm32)
    if (isRegister(params[1])) {
        // lea reg, [reg]
        let dst = params[0], src = params[1];
        let dst_id = reg_bin[dst], src_id = reg_bin[src];

        // REX prefix
        let rex = 0x40;
        if (dst_id >= 8) rex |= 0x1; // B bit (r/m field)
        if (src_id >= 8) rex |= 0x4; // R bit (reg field)
        rex |= 0x8; // 64-bit
        let rex_str = rex.toString(16).toUpperCase();

        let opcode = '8D'; // lea

        // ModR/M: 11 reg src, r/m dst
        let modrm = 0xC0 | ((src_id & 7) << 3) | (dst_id & 7);
        let modrm_str = modrm.toString(16).toUpperCase().padStart(2, '0');

        return rex_str + ' ' + opcode + ' ' + modrm_str;
    } else {
        // lea reg, [imm32]
        let dst = params[0];
        let dst_id = reg_bin[dst];

        // REX dla r8–r15
        let rex = 0x48;
        if (dst_id >= 8) rex = 0x49;
        let rex_str = rex.toString(16).toUpperCase();

        let opcode = '8D';

        // ModR/M: mod=00, reg=dst, r/m=101 (adres bezpośredni)
        // modrm: 00[reg][101]
        let modrm = 0x05 | ((dst_id & 7) << 3);
        let modrm_str = modrm.toString(16).toUpperCase().padStart(2, '0');

        let imm32 = params[1].replace(/^0x/i, '');
        let imm_le = LE(imm32);

        return rex_str + ' ' + opcode + ' ' + modrm_str + ' ' + imm_le;
    }
}

// Przykłady użycia
console.log(getLeaInstruction(['rax', 'rax']));       // '48 8D C0'
console.log(getLeaInstruction(['r12', 'r12']));       // '4D 8D E4'
console.log(getLeaInstruction(['r9', '0x12345678'])); // '49 8D 0D 78 56 34 12'