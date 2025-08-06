const fs = require('fs');

const fileName = 'test.exe';
const buffer = fs.readFileSync('./'+fileName);



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

parseHeaders(buffer);


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



let sections = getAllSections();
let idx=0
sections.forEach(section => {
    if(section.name.length){
        fs.writeFileSync(`./sections/${section.name.trim()}.bin`, section.sectionData);
        fs.writeFileSync(`./sections/${section.name.trim()}.txt`, section.sectionData.toString('hex'));
    }
    idx++
});