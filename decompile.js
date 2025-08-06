const fs = require('fs');



const headers = {};
function parseHeaders(buffer) {
    headers.dosHeader = buffer.slice(0, 64)
    headers.peHeader = buffer.slice(64, 64 + 4)
    headers.fileHeader = buffer.slice(64 + 4, 64 + 24)
    headers.optionalHeader = buffer.slice(64 + 24, 64 + 24 + 224)
    headers.sectionHeaders = buffer.slice(64 + 24 + 224, 64 + 24 + 224 + (40 * buffer.readUInt16LE(64 + 6)))

    fs.writeFileSync('./headers/dosHeader.bin',headers.dosHeader)
    fs.writeFileSync('./headers/peHeader.bin',headers.peHeader)
    fs.writeFileSync('./headers/fileHeader.bin',headers.fileHeader)
    fs.writeFileSync('./headers/optionalHeader.bin',headers.optionalHeader)
    fs.writeFileSync('./headers/sectionHeaders.bin',headers.sectionHeaders)

    fs.writeFileSync('./headers/dosHeader.txt',headers.dosHeader.toString('hex'))
    fs.writeFileSync('./headers/peHeader.txt',headers.peHeader.toString('hex'))
    fs.writeFileSync('./headers/fileHeader.txt',headers.fileHeader.toString('hex'))
    fs.writeFileSync('./headers/optionalHeader.txt',headers.optionalHeader.toString('hex'))
    fs.writeFileSync('./headers/sectionHeaders.txt',headers.sectionHeaders.toString('hex'))
}

/*
const dosHeader = require('./sources/headers/dosHeader.js')
headers.dosHeader = dosHeader
const peHeader = require('./sources/headers/peHeader.js')
headers.peHeader = peHeader
const fileHeader = require('./sources/headers/fileHeader.js')
headers.fileHeader = fileHeader
const optionalHeader = require('./sources/headers/optionalHeader.js')
headers.optionalHeader = optionalHeader
*/


function calculateCheckSum(buffer) {
    let checksum = 0;
    for (let i = 0; i < buffer.length; i += 4) {
        if (i + 4 <= buffer.length) {
            checksum += buffer.readUInt32LE(i);
            checksum = (checksum & 0xFFFFFFFF) + (checksum >> 32); // Dodajemy przeniesienie
        } else {
            // Dla ostatnich bajtów, gdy ich liczba jest mniejsza niż 4
            const remainingBytes = buffer.length - i;
            let lastWord = 0;
            for (let j = 0; j < remainingBytes; j++) {
                lastWord |= buffer[i + j] << (j * 8);
            }
            checksum += lastWord;
            checksum = (checksum & 0xFFFFFFFF) + (checksum >> 32); // Dodajemy przeniesienie
        }
    }

    checksum = (checksum & 0xFFFF) + (checksum >> 16);
    checksum += (checksum >> 16);

    // Wartość końcowa sumy kontrolnej
    checksum = checksum & 0xFFFF;
    checksum += buffer.length;


    let chch = 4194304-2048
    checksum=chch+checksum

    return checksum;
}



const fileName = 'test.exe';
const buffer = fs.readFileSync('./'+fileName);
parseHeaders(buffer);


const check = headers.optionalHeader.readUInt32LE(88);
console.log('check',check)//4194304
headers.optionalHeader.writeUInt32LE(4194304, 88);

//const peFileWithoutChecksum = Buffer.concat([headers.dosHeader, headers.peHeader, headers.fileHeader, headers.optionalHeader, headers.sectionHeaders]);


//let checksum = calculateCheckSum(peFileWithoutChecksum);
//let checksum = getCheckSum()
//console.log('checksum',checksum)
//headers.optionalHeader.writeUInt32LE(checksum, 88);
/*
function getCheckSum() {
    const checkSum = headers.optionalHeader.readUInt32LE(88);
    return checkSum;
}*/


//fs.writeFileSync('./cache/new_'+fileName,peFileWithChecksum)


function getAllSections() {
    const numberOfSections = 5//headers.fileHeader.readUInt16LE(6);
    const sectionHeadersOffset = 64 + 24 + 224;
    const sections = [];

    for (let i = 0; i < numberOfSections; i++) {
        const sectionOffset = sectionHeadersOffset + (i * 40);
        const name = buffer.slice(sectionOffset, sectionOffset + 8).toString('utf8').replace(/\0/g, '');
        const virtualSize = buffer.readUInt32LE(sectionOffset + 8);
        const virtualAddress = buffer.readUInt32LE(sectionOffset + 12);
        const sizeOfRawData = buffer.readUInt32LE(sectionOffset + 16);
        const pointerToRawData = buffer.readUInt32LE(sectionOffset + 20);
        const sectionData = buffer.slice(pointerToRawData, pointerToRawData + sizeOfRawData);

        sections.push({
            name,
            virtualSize,
            virtualAddress,
            sizeOfRawData,
            pointerToRawData,
            sectionData
        });
    }

    return sections;
}


const peFileWithChecksumNew = Buffer.concat([headers.dosHeader, headers.peHeader, headers.fileHeader, headers.optionalHeader, headers.sectionHeaders]);


/*
function hexStringToBuffer(hexString) {
    // Usuwa wszystkie spacje z ciągu heksadecymalnego
    const cleanedHexString = hexString.replace(/\s+/g, '');
    
    // Sprawdza, czy długość ciągu jest parzysta
    if (cleanedHexString.length % 2 !== 0) {
        throw new Error('Nieprawidłowy ciąg heksadecymalny.');
    }
    
    // Konwertuje ciąg heksadecymalny na bufor
    const buffer = Buffer.from(cleanedHexString, 'hex');
    
    return buffer;
}
*/

//const textDataBuffer = require('./text.js')
//const textDataBuffer = require('./compile.js')

let printf = 0

const sections = getAllSections();
let idx=0
//let text={sizeOfRawData:1024+512}
sections.forEach(section => {
    /*if(section.name=='.text'){
        section.sectionData.writeUInt32LE(12, 7);
        //fs.writeFileSync('./sec.bin',section.sectionData)
        let buff = fs.readFileSync('./sec.bin')
        let code = buff.toString('hex')
        //console.log(code)
        if(code.indexOf('48c7c00c000000')>-1){
            console.log('FINDED')
            code=code.replace('48c7c00c000000','48c7c00b000000')
        }
        section.sectionData = hexStringToBuffer(code)
    }*/
    if(section.name=='.text'){
        //console.log('ORIGIN', section.virtualSize, section.sizeOfRawData)
        //console.log('ORIGIN', textDataBuffer.virtualSize, textDataBuffer.sizeOfRawData)
        //section.virtualSize = textDataBuffer.virtualSize
        //section.sizeOfRawData = textDataBuffer.sizeOfRawData
        //text.sizeOfRawData = textDataBuffer.sizeOfRawData
        //section.sectionData=textDataBuffer.buffer
        printf = section.virtualAddress + 4 + 45
    }
    if(section.name=='.data'){
        //section.pointerToRawData = section.sizeOfRawData + 512
    }
    if(section.name=='.idata'){
        //section.pointerToRawData = section.sizeOfRawData + 512 + 512
    }
    if(section.name.length){
        fs.writeFileSync(`./sections/${section.name.trim()}.bin`, section.sectionData);
        fs.writeFileSync(`./sections/${section.name.trim()}.txt`, section.sectionData.toString('hex'));
        //writeSection(section,idx)
    }
    if(section.name=='.text'){
        console.log('text',section.sectionData.toString('hex'))
    }
    console.log('section',section)
    idx++
});

console.log('secctions.length',sections.length)
//# Powiększenie sekcji .text
//sections[2]["sizeOfRawData"] = 512

//# Przesunięcie pointerToRawData dla sekcji .data i .idata
//sections[1]["pointerToRawData"] = sections[0]["pointerToRawData"] + sections[0]["sizeOfRawData"]
//sections[2]["pointerToRawData"] = sections[1]["pointerToRawData"] + sections[1]["sizeOfRawData"]
//sections[3]["pointerToRawData"] = sections[2]["pointerToRawData"] + sections[2]["sizeOfRawData"]
//sections[4]["pointerToRawData"] = sections[3]["pointerToRawData"] + sections[3]["sizeOfRawData"]

fs.writeFileSync(`./sectionsData.json`, JSON.stringify(sections,null,4));



function writeSection(section,idx){
    const sectionOffset = 64 + 24 + 224 + (idx * 40);
    peFileWithChecksumNew.write(section.name.padEnd(8, '\0'), sectionOffset, 'utf8');

console.log('virtualSize',section.virtualSize)
    peFileWithChecksumNew.writeUInt32LE(section.virtualSize, sectionOffset + 8);
    peFileWithChecksumNew.writeUInt32LE(section.virtualAddress, sectionOffset + 12);
    peFileWithChecksumNew.writeUInt32LE(section.sizeOfRawData, sectionOffset + 16);
    peFileWithChecksumNew.writeUInt32LE(section.pointerToRawData, sectionOffset + 20);

    section.sectionData.copy(peFileWithChecksumNew, section.pointerToRawData);
}


//fs.writeFileSync('./out/b_'+fileName,peFileWithChecksumNew)
//let fileCodeHex = peFileWithChecksumNew.toString('hex')
//fs.writeFileSync('./'+fileName.replace('.exe','.txt'), fileCodeHex)


let checksum2 = calculateCheckSum(peFileWithChecksumNew);
console.log(checksum2)









//          printf - address hook
/*
var finded = fileCodeHex.indexOf('ff153d200000')
console.log('finded',finded)
var slice = fileCodeHex.substring(finded, finded+32)
console.log('slice',slice)

var startAt = fileCodeHex.indexOf('4883ec08')
console.log('startAt',startAt)
//4883ec08

var offsetDecimal = 8253*2 //0x203d
var targetAddress = (finded-startAt)+offsetDecimal
console.log('targetAddress',targetAddress)



var finded = fileCodeHex.indexOf('ff153b200000')
console.log('finded',finded)
var slice = fileCodeHex.substring(finded, finded+32)
console.log('slice',slice)

var startAt = fileCodeHex.indexOf('4883ec08')
console.log('startAt',startAt)
//4883ec08

var offsetDecimal = 8224*2 //0x2020
var targetAddress = (finded-startAt)+offsetDecimal
//var targetAddress = targetAddress-((finded-startAt)+offsetDecimal)
console.log('targetAddress',targetAddress)

console.log('targetAddress',targetAddress/2)
console.log('4096',4096*2)//text section
//target addres - .text - length bytes + 8*/
//console.log('printf',printf) // początek tablicy z funkcjami - idata - pierwszy adres

//console.log('ExitProcess',(printf+21))