// Tabele kodów rejestrów
let reg_bin = {
    'rax': 0,  'rcx': 1,  'rdx': 2,  'rbx': 3,
    'rsp': 4,  'rbp': 5,  'rsi': 6,  'rdi': 7,
    'r8': 8,   'r9': 9,   'r10': 10, 'r11': 11,
    'r12': 12, 'r13': 13, 'r14': 14, 'r15': 15,
};

function isRegister(name) {
    return reg_bin.hasOwnProperty(name);
}

// Dla xor reg, imm32 (twój dotychczasowy kod)
let reg_table_imm = {
    'rax': { rex: '48', modrm: 'F0' },
    'rcx': { rex: '48', modrm: 'F1' },
    'rdx': { rex: '48', modrm: 'F2' },
    'rbx': { rex: '48', modrm: 'F3' },
    'rsp': { rex: '48', modrm: 'F4' },
    'rbp': { rex: '48', modrm: 'F5' },
    'rsi': { rex: '48', modrm: 'F6' },
    'rdi': { rex: '48', modrm: 'F7' },
    'r8':  { rex: '49', modrm: 'F0' },
    'r9':  { rex: '49', modrm: 'F1' },
    'r10': { rex: '49', modrm: 'F2' },
    'r11': { rex: '49', modrm: 'F3' },
    'r12': { rex: '49', modrm: 'F4' },
    'r13': { rex: '49', modrm: 'F5' },
    'r14': { rex: '49', modrm: 'F6' },
    'r15': { rex: '49', modrm: 'F7' },
};

export function getXorInstruction(params) {
    // params[0] - dst, params[1] - src lub imm32
    if (isRegister(params[1])) {
        // xor reg, reg
        let dst = params[0], src = params[1];
        let dst_id = reg_bin[dst], src_id = reg_bin[src];

        // REX prefix
        let rex = 0x40;
        if (dst_id >= 8) rex |= 0x1; // R bit
        if (src_id >= 8) rex |= 0x4; // B bit
        rex |= 0x8; // 64-bit
        let rex_str = rex.toString(16).toUpperCase();

        let opcode = '31'; // xor r/m64, r64

        // ModR/M byte: 11 reg src, r/m dst
        let modrm = 0xC0 | ((src_id & 7) << 3) | (dst_id & 7);
        let modrm_str = modrm.toString(16).toUpperCase().padStart(2, '0');

        return rex_str + ' ' + opcode + ' ' + modrm_str;
    } else {
        // xor reg, imm32 (twój przypadek)
        let reg_table = reg_table_imm[params[0]];
        let xor = '81';
        let result = reg_table.rex + ' ' + xor + ' ' + reg_table.modrm;

        // LE - zamiana na little endian
        let from = LE(params[1].replace('0x',''));
        return result + ' ' + from;
    }
}

// Przykładowa funkcja LE
function LE(hexstr) {
    let n = hexstr.length;
    let bytes = [];
    for (let i = n; i > 0; i -= 2) {
        bytes.push(hexstr.substring(Math.max(0, i-2), i));
    }
    while (bytes.length < 4) bytes.push('00');
    return bytes.join(' ');
}

// Przykłady użycia:
// getXorInstruction(['rax', 'rax'])      // => '48 31 C0'
// getXorInstruction(['r12', 'r12'])      // => '4D 31 E4'
// getXorInstruction(['r9', '0x12345678'])// => '49 81 F1 78 56 34 12'