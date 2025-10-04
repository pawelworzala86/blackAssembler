const fs = require('fs');
const code = require('./code.js');

const headers = {};

headers.dosHeader = Buffer.from(require('./headers/dosHeader.js').get(),'hex')
headers.peHeader = Buffer.from(require('./headers/peHeader.js').get(),'hex')
headers.fileHeader = Buffer.from(require('./headers/fileHeader.js').get(),'hex')
headers.optionalHeader = Buffer.from(require('./headers/optionalHeader.js').get(),'hex')
let sectionHeaders = Buffer.from(require('./headers/sectionHeaders.js').get(),'hex')







function loadSection(code){
    //let code = fs.readFileSync('./cache/'+name+'.txt').toString()
    code = code.replace(/\;.*/gm,'')
    code = code.replace(/\n|\ /gm,'')
    return Buffer.from(code, 'hex')
}

const {text,data,idata} = code()

const sectionsData = {}
sectionsData.text = loadSection(text)
sectionsData.data = loadSection(data)
sectionsData.idata = loadSection(idata)

sectionsData.stext = Math.ceil(sectionsData.text.length / 512) * 512;
sectionsData.sdata = Math.ceil(sectionsData.data.length / 512) * 512;
sectionsData.sidata = Math.ceil(sectionsData.idata.length / 512) * 512;



//sectionHeaders = Buffer.alloc(512);
// Jeśli bufor jest za krótki, powiększamy go do size bajtów
const size = (2248-2048)+sectionsData.stext+sectionsData.sdata+sectionsData.sidata
if (sectionHeaders.length < size) {
  const extended = Buffer.alloc(size);
  sectionHeaders.copy(extended); // Kopiuje zawartość na początek extended
  headers.sectionHeaders = extended;
} else if (sectionHeaders.length > size) {
  // Jeśli plik jest dłuższy niż size, przycinamy
  headers.sectionHeaders = sectionHeaders.slice(0, size);
} else {
  headers.sectionHeaders = sectionHeaders;
}

const fileBuffer = Buffer.concat([headers.dosHeader, headers.peHeader, headers.fileHeader, headers.optionalHeader, headers.sectionHeaders]);





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
    sizeOfRawData: sectionsData.stext,
    pointerToRawData: sectionsData.stext,
    sectionData: sectionsData.text,
})
sections.push({
    name: ".data",
    virtualSize: sectionsData.data.length,
    virtualAddress: 4096*2,
    sizeOfRawData: sectionsData.sdata,
    pointerToRawData: sectionsData.stext+sectionsData.sdata,
    sectionData: sectionsData.data,
})
sections.push({
    name: ".idata",
    virtualSize: sectionsData.idata.length,
    virtualAddress: 4096*3,
    sizeOfRawData: sectionsData.sidata,
    pointerToRawData: sectionsData.stext+sectionsData.sdata+sectionsData.sidata,
    sectionData: sectionsData.idata,
})

//console.log(sections)
//process.exit(1)

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


const fileName = process.argv[2]

fs.writeFileSync('./out/'+fileName+'.exe', fileBuffer)