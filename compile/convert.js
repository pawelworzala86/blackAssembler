// Little-endian byte array
const littleEndianBytes = [0x44, 0x20, 0x00, 0x00];

// Convert little-endian byte array to integer
let displacement = 0;
for (let i = 0; i < littleEndianBytes.length; i++) {
    displacement += littleEndianBytes[i] << (8 * i);
}

//console.log(displacement.toString(16)); // Output: 8260 (which is 0x2044)








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

const value = 0x2044;
const littleEndianBytes2 = fromHex(value);

//console.log(littleEndianBytes2.toString('hex')); // Output: [68, 32, 0, 0]

module.exports = {
    littleEndian:{
        fromHex(value){
            const littleEndianBytes2 = fromHex(value);
            return littleEndianBytes2.toString('hex')
        }
    },
    intToBinary3Bits(num,bits){
        let binaryString = num.toString(2);
        binaryString = binaryString.padStart(bits, '0');
        return binaryString;
    },
    addHex(hex1, hex2) {
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
    },
    binaryToHex(binaryString) {
        if (binaryString.length % 4 !== 0) {
          binaryString = binaryString.padStart(Math.ceil(binaryString.length / 4) * 4, '0');
        }
        const decimalValue = parseInt(binaryString, 2);
        const hexString = decimalValue.toString(16).toUpperCase();
        return hexString;
    },
    toHexMinus(value) {
        if (value < 0) {
          value = 0xFFFFFFFF + value + 1;
        }
        return /*'0x' +*/ value.toString(16).toUpperCase();
      },
      intToHex32LE(number) {
        // Ensure the number is a 32-bit integer
        number = number >>> 0;
        
        // Convert to hexadecimal string and pad with zeros if necessary
        let hexString = number.toString(16).toUpperCase().padStart(8, '0');
    
        // Format as 4 pairs of hex digits
        let parts = ''
        hexString.match(/.{1,2}/g).map(h=>{
            parts=h+' '+parts
        })
        return parts.trim()
    },
}