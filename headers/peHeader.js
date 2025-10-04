// Przykładowy peHeader jako ciąg hex
// 0e1fba0e

// 0x00: 0e       // instrukcja: PUSH 0Eh (w x86)
// 0x01: 1f       // instrukcja: POP DS
const pushPopDS = "0e1f";

// 0x02-0x03: ba0e // instrukcja: MOV DX, 0E0h (w little endian: 0x0eba)
const movDx = "ba0e";

// Składanie nagłówka peHeader
const peHeader =
  pushPopDS +
  movDx;

console.log(peHeader=='0e1fba0e'); // "0e1fba0e"

export function get(){
    return peHeader
}