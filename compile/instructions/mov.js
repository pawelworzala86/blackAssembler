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
    hexstr = hexstr.padStart(8, '0'); // upewnij się, że mamy 8 znaków
    let bytes = [];
    for (let i = hexstr.length; i > 0; i -= 2) {
        bytes.push(hexstr.substring(i-2, i));
    }
    return bytes.join(' ');
}

export function getMovInstruction(params) {
    // params[0] - dst, params[1] - src lub imm32
    if (isRegister(params[1])) {
        // mov reg, reg
        let dst = params[0], src = params[1];
        let dst_id = reg_bin[dst], src_id = reg_bin[src];

        // REX prefix
        let rex = 0x40;
        if (src_id >= 8) rex |= 0x4; // R bit (reg field)
        if (dst_id >= 8) rex |= 0x1; // B bit (r/m field)
        rex |= 0x8; // 64-bit
        let rex_str = rex.toString(16).toUpperCase();

        let opcode = '89'; // mov r/m64, r64

        // ModR/M byte: 11 reg src, r/m dst
        let modrm = 0xC0 | ((src_id & 7) << 3) | (dst_id & 7);
        let modrm_str = modrm.toString(16).toUpperCase().padStart(2, '0');

        return rex_str + ' ' + opcode + ' ' + modrm_str;
    } else {
        // mov reg, imm32
        let dst = params[0];
        let dst_id = reg_bin[dst];

        // REX dla r8–r15
        let rex = 0x48;
        if (dst_id >= 8) rex = 0x49;
        let rex_str = rex.toString(16).toUpperCase();

        // opcode dla mov r64, imm32 to B8+reg
        let opcode = (0xB8 + (dst_id & 7)).toString(16).toUpperCase();

        let imm32 = params[1].replace(/^0x/i, '');
        let imm_le = LE(imm32);

        return rex_str + ' ' + opcode + ' ' + imm_le;
    }
}

// PRZYKŁADY:
console.log(getMovInstruction(['rax', 'rax']));       // '48 89 C0'
console.log(getMovInstruction(['r12', 'r12']));       // '4D 89 E4'
console.log(getMovInstruction(['r9', '0x12345678'])); // '49 B9 78 56 34 12 00 00 00 00'