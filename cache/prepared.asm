section '.text'
    sub rsp, 0x28
    lea rcx, message  ;0x00000ff5
    call printf
    lea rcx, messageB   ;0x00000fe8
    call printf
    lea rcx, messageB   ;0x00000fd8
    call printf
    mov rcx, 0x00000000
    call ExitProcess


section '.data'
    message:
db 'OK',0
    messageB:
db 'ok',0
    messageC:
db 'oK',0
    

section '.idata'
    dd 0,0,0,RVA kernel_name,RVA kernel_table
    dd 0,0,0,RVA msvcrt_name,RVA msvcrt_table
    dd 0,0,0,0,0

    kernel_table:
        ExitProcess:
dq RVA _ExitProcess
        dq 0
    msvcrt_table:
        printf:
dq RVA _printf
        malloc:
dq RVA _malloc
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