const fs = require('fs');
const make = require('./compiler')

let idata = `  dd 0,0,0,RVA kernel_name,RVA kernel_table
  dd 0,0,0,RVA msvcrt_name,RVA msvcrt_table
  dd 0,0,0,0,0

  kernel_table:
    ExitProcess:
     dq RVA _ExitProcess
    dq 0
  msvcrt_table:
    printf:
     dq RVA _printf
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
    db 'printf',0`

idata = make(idata)

fs.writeFileSync('./cache/idata.txt',idata)






let data = `4f4b00`

data = make(data)

fs.writeFileSync('./cache/data.txt',data)






let text = `48 83 EC 28                         ; sub rsp, 0x28
48 8D 0D F5 0F 00 00                ; lea rcx, [rip + 0xff5]     ; adres względny
FF 15 3B 20 00 00                   ; call QWORD PTR [rip + 0x203b]
48 C7 C1 00 00 00 00                ; mov rcx, 0x0
FF 15 1E 20 00 00                   ; call QWORD PTR [rip + 0x201e]`

text = make(text)

fs.writeFileSync('./cache/text.txt',text)