export function getJmpInstruction(parts,CALLS,OFFSET) {
    //let parts = line.split(' ')
        let func = parts[0]
        //let off = toHexMinus2(num+1)
        //console.log('CALLS',CALLS)
        let num = CALLS[func]-(OFFSET+5)//FUNCTIONS[func]-(OFFSET+5)
        //console.log('num',num, func)
        //console.log('...',FUNCTIONS[func],OFFSET)

        let bytes = ''

        if(num>=0){
            let off = addHex('00000000', lefromHex(num))
            //console.log('off',off)
            off=off.hex.padStart(8, '0');
            off = off[0]+off[1]+' '+off[2]+off[3]+' '+off[4]+off[5]+' '+off[6]+off[7]
            //console.log('off',off)
            bytes = off
        }else{
            //let num = FUNCTIONS[func]-(OFFSET+6)
            let off = toHexMinus(num+1)
            off = off[6]+off[7]+' '+off[4]+off[5]+' '+off[2]+off[3]+' '+off[0]+off[1]
            //console.log('off OFF',off)
            bytes = off
        }

        return 'e9 '+bytes
}

function toHexMinus(value) {
    if (value < 0) {
        value = 0xFFFFFFFF + value + 1;
    }
    return /*'0x' +*/ value.toString(16).toUpperCase();
}

function addHex(hex1, hex2){
    // Convert hex strings to integers
    const int1 = parseInt(hex1, 16);
    const int2 = parseInt(hex2, 16);

    // Perform subtraction
    const result = int1 + int2;

    // Convert result back to hex (if needed) and return both formats
    const resultHex = result.toString(16);

    return {
        decimal: result,
        hex: resultHex
    };
}

function lefromHex(value){
    const littleEndianBytes2 = fromHex(value);
    return littleEndianBytes2.toString('hex')
}

// Function to convert a number to its little-endian byte representation
function fromHex(value) {
    // Create an array to hold the bytes
    const bytes = [];
    
    // Extract each byte from the integer and push to the array
    for (let i = 0; i < 4; i++) {
        bytes.push(value & 0xFF); // Mask the lowest byte
        value >>= 8; // Right shift the value by 8 bits
    }
    
    const buffer =  new Buffer.alloc(4);
    buffer.writeUInt8(bytes[0], 0);
    buffer.writeUInt8(bytes[1], 1);
    buffer.writeUInt8(bytes[2], 2);
    buffer.writeUInt8(bytes[3], 3);
    return buffer
}