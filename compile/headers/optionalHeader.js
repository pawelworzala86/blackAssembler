// Nagłówek OptionalHeader w pliku PE – rozpiska fragmentów

// 0x00-0x17: Tekst ASCII: "am cannot be run in DOS mode.\r\n$"
const dosStubText = "616d2063616e6e6f742062652072756e20696e20444f53206d6f64652e0d0a24";

// 0x18-0x23: Padding (wypełnienie zerami)
const dosStubPadding = "0000000000000000";

// 0x24-0x27: 'PE\0\0' - sygnatura nagłówka PE
const peSignature = "50450000";

// 0x28-0x2b: Machine (0x8664 = x86_64), NumberOfSections
const fileHeaderPart1 = "64860300";

// 0x2c-0x2f: TimeDateStamp
const timeDateStamp = "9d63e168";

// 0x30-0x33: PointerToSymbolTable
const ptrToSymbolTable = "00000000";

// 0x34-0x37: NumberOfSymbols
const numberOfSymbols = "00000000";

// 0x38-0x39: SizeOfOptionalHeader
const sizeOfOptionalHeader = "f000";

// 0x3a-0x3b: Characteristics
const characteristics = "2f00";

// 0x3c-0x3f: Magic + linker wersja
const optionalMagicAndLinker = "0b020000";

// 0x40-0x43: SizeOfCode
const sizeOfCode = "00040000";

// 0x44-0x47: SizeOfInitializedData
const sizeOfInitData = "00040000";

// 0x48-0x4b: SizeOfUninitializedData
const sizeOfUninitData = "00000000";

const some1 = "00";

// 0x4c-0x4f: AddressOfEntryPoint
const entryPoint = "10000000";

// 0x50-0x53: BaseOfCode
const baseOfCode = "10000000";//

// 0x54-0x57: BaseOfData
const baseOfData = "00400000";

const some2 = "00";

// 0x58-0x5b: ImageBase
const imageBase = "00000010";//

// 0x5c-0x5f: SectionAlignment
const sectionAlignment = "00000002"; 

// 0x60-0x63: FileAlignment
const fileAlignment = "00000100";///////////////////////

const some3 = "000000";

// 0x64-0x67: Major/MinorOperatingSystemVersion
const osVersion = "00000005";/////////

// 0x68-0x6b: Major/MinorImageVersion
const imageVersion = "00000000";

const some4 = "00000000";

// 0x6c-0x6f: Major/MinorSubsystemVersion
const subsystemVersion = "40000000";

// 0x70-0x73: Win32VersionValue
const win32VersionValue = "02000004";///////////

// 0x74-0x77: SizeOfImage
const sizeOfImage = "78000003";///////

const some5 = '00'

// 0x78-0x7b: SizeOfHeaders
const sizeOfHeaders = "00000010";//

// 0x7c-0x7f: CheckSum
const checksum = "00000000";

// 0x80-0x83: Subsystem
const subsystem = "00000010";////

// 0x84-0x87: DllCharacteristics
const dllCharacteristics = "00000000";

// 0x88-0x8b: SizeOfStackReserve
const sizeOfStackReserve = "00000000";

// 0x8c-0x8f: SizeOfStackCommit
const sizeOfStackCommit = "01000000";

// 0x90-0x93: SizeOfHeapReserve
const sizeOfHeapReserve = "00000000";

// 0x94-0x97: SizeOfHeapCommit
const sizeOfHeapCommit = "00000000";

// 0x98-0x9b: LoaderFlags
const loaderFlags = "00000000";

// 0x9c-0x9f: NumberOfRvaAndSizes
const numberOfRvaAndSizes = "00001000";

// 0xa0-0x13f: DataDirectory[16] (po 8 bajtów)
const dataDirectories =
  "0000000000000000" + // Export Table
  "0000003000008b00" + // Import Table
  "0000000000000000" + // Resource Table
  "0000000000000000" + // Exception Table
  "0000000000000000" + // Certificate Table
  "0000000000000000"  // Base Relocation Table
 // "0000000000000000" + // Debug
  //"0000000000000000" + // Architecture
  //"0000000000000000" + // GlobalPtr
  //"0000000000000000" + // TLS Table
 // "0000000000000000" + // Load Config Table
  //"0000000000000000" + // Bound Import
  //"0000000000000000" + // IAT
  //"0000000000000000" + // Delay Import Descriptor
  //"0000000000000000" + // CLR Runtime Header
  //"0000000000000000";  // Reserved

const some6 = '0000'

// Składanie całego optionalHeader:
const optionalHeader =
  dosStubText +
  dosStubPadding +
  peSignature +
  fileHeaderPart1 +
  timeDateStamp +
  ptrToSymbolTable +
  numberOfSymbols +
  sizeOfOptionalHeader +
  characteristics +
  optionalMagicAndLinker +
  sizeOfCode +
  sizeOfInitData +
  sizeOfUninitData +
  some1+
  entryPoint +
  baseOfCode +
  baseOfData +
  some2+
  imageBase +
  sectionAlignment +
  fileAlignment +
  some3+
  osVersion +
  imageVersion +
  some4+
  subsystemVersion +
  win32VersionValue +
  sizeOfImage +
  some5+
  sizeOfHeaders +
  checksum +
  subsystem +
  dllCharacteristics +
  sizeOfStackReserve +
  sizeOfStackCommit +
  sizeOfHeapReserve +
  sizeOfHeapCommit +
  loaderFlags +
  numberOfRvaAndSizes +
  dataDirectories+
  some6;

console.log(optionalHeader==`616d2063616e6e6f742062652072756e20696e20444f53206d6f64652e0d0a24
    0000000000000000
    50450000
    64860300
    9d63e168
    00000000
    00000000
    f000
    2f00
    0b020000
    00040000
    00040000
    00000000
    00
    10000000
    10000000
    00400000
    00
    00000010
    00000002
    00000100
    000000
    00000005
    00000000
    00000000
    40000000
    02000004
    78000003
    00
    00000010
    00000000
    00000010
    00000000
    00000000
    01000000
    00000000
    00000000
    00000000
    00001000
    0000000000000000
    0000003000008b00
    0000000000000000
    0000000000000000
    0000000000000000
    0000000000000000
    0000`.replace(/\n|\ /gm,''));

export function get(){
    return optionalHeader
}