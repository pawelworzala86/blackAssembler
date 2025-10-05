const fs = require('fs')


module.exports = function(importData,code){


/*
    dd 0,0,0,RVA kernel_name,RVA kernel_table
    dd 0,0,0,RVA msvcrt_name,RVA msvcrt_table
    dd 0,0,0,0,0

    kernel_table:
        ExitProcess dq RVA _ExitProcess
        dq 0
    msvcrt_table:
        printf dq RVA _printf
        malloc dq RVA _malloc
        dq 0

    kernel_name:
    db 'KERNEL32.DLL',0
    msvcrt_name:
    db 'MSVCRT.DLL',0

    _ExitProcess:
    dw 0
        db 'ExitProcess',0
    _printf:
    dw 0
        db 'printf',0
    _malloc:
    dw 0
        db 'malloc',0
*/
/*
let importData = `
  library kernel,'KERNEL32.DLL',\
	  msvcrt,'MSVCRT.DLL'

  import kernel,\
	 ExitProcess,'ExitProcess'

  import msvcrt,\
	 printf,'printf',\
	 malloc,'malloc'
`*/

/*const imp = {
    'kernel32': {
        dll: 'kernel32.dll',
        funcs: [
            {from:'ExitProcess',target:'ExitProcess'},
        ]
    },
    'msvcrt': {
        dll: 'msvcrt.dll',
        funcs: [
            {from:'printf',target:'printf'},
            {from:'malloc',target:'malloc'},
        ]
    }
}*/

const imp = {}

function addDLL(name,dll){
    imp[name] = {dll:dll,funcs:[]}
}
function addDllFunc(name,from,target){
    imp[name].funcs.push({from,target})
}

function importFromData(data){
    data=data.replace(/\,\\\n/gm,',')
    data=data.replace(/\'/gm,'')
    data.replace(/library.*/gm,match=>{
        let parts = match.replace('library','').trim().split(',').map(p=>p.trim())
        console.log(parts)
        for(let i=0;i<parts.length;i+=2){
            addDLL(parts[i],parts[i+1])
        }
    })
    data.replace(/import.*/gm,match=>{
        let parts = match.replace('import','').trim().split(',').map(p=>p.trim())
        console.log(parts)
        let name = parts[0]
        for(let i=1;i<parts.length;i+=2){
            if(new RegExp('\\['+parts[i]+'\\]','gm').exec(code)){
                addDllFunc(name,parts[i],parts[i+1])
            }
        }
    })
    console.log(data)
}
importFromData(importData)

/*
addDLL('kernel32','kernel32.dll')
addDllFunc('kernel32','ExitProcess','ExitProcess')
addDLL('msvcrt','msvcrt.dll')
addDllFunc('msvcrt','printf','printf')
addDllFunc('msvcrt','malloc','malloc')
*/





let names1 = ''
Object.keys(imp).map(key=>{
    names1 += `dd 0,0,0,RVA ${key}_name,RVA ${key}_table\n`
})
names1 += `dd 0,0,0,0,0\n`

let names2 = ''
Object.keys(imp).map(key=>{
    names2 += `${key}_table:\n`
    Object.keys(imp[key].funcs).map(key2=>{
        names2 += `    ${imp[key].funcs[key2].target} dq RVA _${imp[key].funcs[key2].target}\n`
    })
    names2 += `    dq 0\n`
})

let dllnames = ''
Object.keys(imp).map(key=>{
    dllnames += `${key}_name:
    db '${imp[key].dll}',0\n`
})

let funcsnames = ''
Object.keys(imp).map(key=>{
    Object.keys(imp[key].funcs).map(key2=>{
        funcsnames += `_${imp[key].funcs[key2].target}:
    dw 0
        db '${imp[key].funcs[key2].from}',0\n`//`${imp[key].funcs[key2].target} dq RVA _${imp[key].funcs[key2].target}\n`
    })
})

let result = `${names1}
${names2}
${dllnames}
${funcsnames}
`

fs.writeFileSync('./cache/idata.parsed.txt',result)

return result

}