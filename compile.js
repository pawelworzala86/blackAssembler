const fs = require('fs');

const headers = {};

headers.dosHeader = fs.readFileSync('./headers/dosHeader.bin')
headers.peHeader = fs.readFileSync('./headers/peHeader.bin')
headers.fileHeader = fs.readFileSync('./headers/fileHeader.bin')
headers.optionalHeader = fs.readFileSync('./headers/optionalHeader.bin')
headers.sectionHeaders = fs.readFileSync('./headers/sectionHeaders.bin')


const fileBuffer = Buffer.concat([headers.dosHeader, headers.peHeader, headers.fileHeader, headers.optionalHeader, headers.sectionHeaders]);






function loadSection(name){
    let code = fs.readFileSync('./sections/'+name+'.txt').toString()
    code = code.replace(/\;.*/gm,'')
    code = code.replace(/\n|\ /gm,'')
    return Buffer.from(code, 'hex')
}


const sectionsData = {}
sectionsData.text = loadSection('.text.exp')
sectionsData.data = loadSection('.data.exp')
sectionsData.idata = loadSection('.idata.exp')

const sections = []

sections.push({
    name: "",
    virtualSize: 0,
    virtualAddress: 0,
    sizeOfRawData: 0,
    pointerToRawData: 0,
    sectionData: Buffer.from('', 'hex'),
})
sections.push({
    name: "",
    virtualSize: 0,
    virtualAddress: 0,
    sizeOfRawData: 0,
    pointerToRawData: 0,
    sectionData: Buffer.from('', 'hex'),
})
sections.push({
    name: ".text",
    virtualSize: sectionsData.text.length,
    virtualAddress: 4096*1,
    sizeOfRawData: 512,
    pointerToRawData: 512*1,
    sectionData: sectionsData.text,
})
sections.push({
    name: ".data",
    virtualSize: sectionsData.data.length,
    virtualAddress: 4096*2,
    sizeOfRawData: 512,
    pointerToRawData: 512*2,
    sectionData: sectionsData.data,
})
sections.push({
    name: ".idata",
    virtualSize: sectionsData.idata.length,
    virtualAddress: 4096*3,
    sizeOfRawData: 512,
    pointerToRawData: 512*3,
    sectionData: sectionsData.idata,
})

sections.map((section,idx)=>{
    if(section.name.length){
        writeSection(section,idx)
    }
    return section
})

function writeSection(section,idx){
    const sectionOffset = 64 + 24 + 224 + (idx * 40);
    fileBuffer.write(section.name.padEnd(8, '\0'), sectionOffset, 'utf8');

    //console.log('virtualSize',section.virtualSize)
    fileBuffer.writeUInt32LE(section.virtualSize, sectionOffset + 8);
    fileBuffer.writeUInt32LE(section.virtualAddress, sectionOffset + 12);
    fileBuffer.writeUInt32LE(section.sizeOfRawData, sectionOffset + 16);
    fileBuffer.writeUInt32LE(section.pointerToRawData, sectionOffset + 20);

    //section.sectionData.copy(fileBuffer, section.pointerToRawData);
    //fileBuffer.copy(section.sectionData, section.pointerToRawData)//, 512, 512);
    section.sectionData.copy(fileBuffer, section.pointerToRawData)//, 0, 512);
}




fs.writeFileSync('./testNew.exe', fileBuffer)