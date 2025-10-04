// Nagłówek DOS (IMAGE_DOS_HEADER) dla pliku PE/PE101

// 0x00-0x01: Magic number 'MZ'
const mz = "4d5a"; // 'MZ'

// 0x02-0x03: Last page size
const lastPageSize = "8000";

// 0x04-0x05: Number of pages
const numberOfPages = "0100";

// 0x06-0x07: Number of relocation entries
const relocations = "0000";

// 0x08-0x09: Header size in paragraphs
const headerParagraphs = "0400";

// 0x0A-0x0B: Minimum extra paragraphs needed
const minExtraParagraphs = "1000";

// 0x0C-0x0D: Maximum extra paragraphs needed
const maxExtraParagraphs = "ffff";

// 0x0E-0x0F: Initial (relative) SS value
const initialSS = "0000";

// 0x10-0x11: Initial SP value
const initialSP = "4001";

// 0x12-0x13: Checksum
const checksum = "0000";

// 0x14-0x15: Initial IP value
const initialIP = "0000";

const some1 = "0000";

// 0x16-0x17: Initial (relative) CS value
const initialCS = "4000";

// 0x18-0x19: File address of relocation table
const relocationTable = "0000";

// 0x1A-0x1B: Overlay number
const overlayNumber = "0000";

// 0x1C-0x2B: Reserved (20 bytes = 40 hex chars)
const reserved1 = "0000000000000000000000000000000000000000";

// 0x2C-0x2D: OEM identifier
const oemID = "0000";

// 0x2E-0x2F: OEM information
const oemInfo = "0000";

// 0x30-0x53: Reserved (40 bytes = 80 hex chars)
const reserved2 = "000000000000";

// 0x54-0x57: File address of PE header (e_lfanew)
const e_lfanew = "80000000";

// Złożenie całego nagłówka:
const hexString =
  mz +
  lastPageSize +
  numberOfPages +
  relocations +
  headerParagraphs +
  minExtraParagraphs +
  maxExtraParagraphs +
  initialSS +
  initialSP +
  checksum +
  initialIP +
    some1+
  initialCS +
  relocationTable +
  overlayNumber +
  reserved1 +
  oemID +
  oemInfo +
  reserved2 +
  e_lfanew;

console.log(hexString==`4d5a
    8000
    0100
    0000
    0400
    1000
    ffff
    0000
    4001
    0000
    0000
    0000
    4000
    0000
    0000
    0000000000000000000000000000000000000000
    0000
    0000
    000000000000
    80000000`.replace(/\n|\ /gm,''));

export function get(){
    return hexString
}