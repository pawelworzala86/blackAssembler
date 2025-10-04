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

export function getOrInstruction(params) {
    // params[0] - dst, params[1] - src or imm32
    if (isRegister(params[1])) {
        // or reg, reg
        let dst = params[0], src = params[1];
        let dst_id = reg_bin[dst], src_id = reg_bin[src];

        // REX prefix
        let rex = 0x40;
        if (src_id >= 8) rex |= 0x4; // R bit (reg field)
        if (dst_id >= 8) rex |= 0x1; // B bit (r/m field)
        rex |= 0x8; // 64-bit
        let rex_str = rex.toString(16).toUpperCase();

        let opcode = '09'; // or r/m64, r64

        // ModR/M byte: 11 reg src, r/m dst
        let modrm = 0xC0 | ((src_id & 7) << 3) | (dst_id & 7);
        let modrm_str = modrm.toString(16).toUpperCase().padStart(2, '0');

        return rex_str + ' ' + opcode + ' ' + modrm_str;
    } else {
        // or reg, imm32
        let dst = params[0];
        let dst_id = reg_bin[dst];

        // Opcja 1: or rax, imm32 – specjalne kodowanie
        if (dst === 'rax') {
            // or rax, imm32: 48 0D xx xx xx xx
            let rex_str = '48';
            let opcode = '0D';
            let imm_le = LE(params[1]);
            return rex_str + ' ' + opcode + ' ' + imm_le;
        }
        // Opcja 2: or reg, imm32: 48 81 C8+reg imm32
        let rex = 0x48;
        if (dst_id >= 8) rex = 0x49;
        let rex_str = rex.toString(16).toUpperCase();
        let opcode = '81';
        let modrm = (0xC0 | (0x1 << 3) | (dst_id & 7)).toString(16).toUpperCase(); // reg/opcode=001 (or), r/m=dst
        let imm_le = LE(params[1]);
        return rex_str + ' ' + opcode + ' ' + modrm + ' ' + imm_le;
    }
}

// Przykłady użycia:
console.log(getOrInstruction(['rax', 'rax']));       // '48 09 C0'
console.log(getOrInstruction(['r12', 'r12']));       // '4D 09 E4'
console.log(getOrInstruction(['r9', '0x12345678'])); // '49 81 C9 78 56 34 12'