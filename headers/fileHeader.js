// Przykładowy nagłówek fileHeader jako ciąg hex
// 00b409cd21b8014ccd21546869732070726f6772

// 0x00: 00      // NOP lub padding
const nop = "00";

// 0x01-0x02: b409   // Instrukcja MOV AX, 0x09B4 (w little endian: 0x09B4, czyli INT 21h, AH=09h - DOS: Wyświetl tekst)
const movAx = "b409";

// 0x03-0x04: cd21   // INT 21h
const int21h_1 = "cd21";

// 0x05-0x06: b801   // MOV AX, 0x01B8 (w little endian: 0x01B8)
const movAx2 = "b801";

// 0x07-0x08: 4ccd   // INT 21h, 4C (AH=4Ch, zakończ program)
const int21h_2 = "4ccd";

// 0x09-0x0a: 2154   // Część tekstu lub danych (prawdopodobnie początek napisu "This ...")
const txt1 = "2154"; // !T

// 0x0b-0x14: 6869732070726f6772   // ASCII: "his progr"
const txt2 = "6869732070726f6772"; // "his progr"

// Złożenie nagłówka fileHeader
const fileHeader =
  nop +
  movAx +
  int21h_1 +
  movAx2 +
  int21h_2 +
  txt1 +
  txt2;

console.log(fileHeader==`00b409cd21b8014ccd21546869732070726f6772`); // "00b409cd21b8014ccd21546869732070726f6772"

export function get(){
    return fileHeader
}