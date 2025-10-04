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

export function getMulInstruction(params) {
    // params[0] - dst, params[1] - src or imm32
    if (isRegister(params[1])) {
        // imul reg, reg (pełna forma 3-argumentowa, tu jako 2-argumentowa)
        let dst = params[0], src = params[1];
        let dst_id = reg_bin[dst], src_id = reg_bin[src];

        // REX prefix
        let rex = 0x40;
        if (dst_id >= 8) rex |= 0x1; // B bit (r/m field)
        if (src_id >= 8) rex |= 0x4; // R bit (reg field)
        rex |= 0x8; // 64-bit
        let rex_str = rex.toString(16).toUpperCase();

        let opcode1 = '0F';
        let opcode2 = 'AF';

        // ModR/M: 11 reg dst, r/m src
        let modrm = 0xC0 | ((dst_id & 7) << 3) | (src_id & 7);
        let modrm_str = modrm.toString(16).toUpperCase().padStart(2, '0');

        return rex_str + ' ' + opcode1 + ' ' + opcode2 + ' ' + modrm_str;
    } else {
        // imul reg, imm32 (czyli imul reg, reg, imm32 gdzie src = dst)
        let dst = params[0];
        let dst_id = reg_bin[dst];

        // REX dla r8-r15
        let rex = dst_id >= 8 ? 0x49 : 0x48;
        let rex_str = rex.toString(16).toUpperCase();

        // opcode: 69 /r id
        let opcode = '69';
        // ModR/M: 11 reg dst, r/m dst
        let modrm = 0xC0 | ((dst_id & 7) << 3) | (dst_id & 7);
        let modrm_str = modrm.toString(16).toUpperCase().padStart(2, '0');

        let imm_le = LE(params[1]);
        return rex_str + ' ' + opcode + ' ' + modrm_str + ' ' + imm_le;
    }
}

// Przykłady użycia:
console.log(getMulInstruction(['rax', 'rax']));       // '48 0F AF C0'
console.log(getMulInstruction(['r12', 'r12']));       // '4D 0F AF E4'
console.log(getMulInstruction(['r9', '0x12345678'])); // '49 69 C9 78 56 34 12'