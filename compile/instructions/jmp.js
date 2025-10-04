import conv from './../convert.js'

export function getJmpInstruction(parts,CALLS,OFFSET) {
    //let parts = line.split(' ')
        let func = parts[1]
        //let off = toHexMinus2(num+1)
        //console.log('CALLS',CALLS)
        let num = CALLS[func]-(OFFSET+5)//FUNCTIONS[func]-(OFFSET+5)
        //console.log('num',num, func)
        //console.log('...',FUNCTIONS[func],OFFSET)

        let bytes = ''

        if(num>=0){
            let off = conv.addHex('00000000', conv.littleEndian.fromHex(num))
            //console.log('off',off)
            off=off.hex.padStart(8, '0');
            off = off[0]+off[1]+' '+off[2]+off[3]+' '+off[4]+off[5]+' '+off[6]+off[7]
            //console.log('off',off)
            bytes = off
        }else{
            //let num = FUNCTIONS[func]-(OFFSET+6)
            let off = conv.toHexMinus(num+1)
            off = off[6]+off[7]+' '+off[4]+off[5]+' '+off[2]+off[3]+' '+off[0]+off[1]
            //console.log('off OFF',off)
            bytes = off
        }

        return 'e9 '+bytes
}