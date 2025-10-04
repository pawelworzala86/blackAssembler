export function getCallInstruction(params) {
    let start = 'ff'
        //let modrm = '14'
        let modrm = '15'

        //console.log('OFFSET',OFFSET)
        const off = LE(params[0].replace('0x',''))

    return start+' '+modrm+' '+off
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