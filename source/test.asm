.code
    sub rsp, 0x28
    jmp .skip2
    lea rcx, message  ;0x00000ff5
    call printf
    lea rcx, messageB   ;0x00000fe8
    call printf
.skip2:
    lea rax, message
    xor rax, rax
    lea rcx, message
    ;lea rcx, messageB   ;0x00000fd8
    call printf
    mov rcx, 0x00000000
    call ExitProcess


.data
    message db 'OK',0
    messageB db 'ok',0
    messageC db 'oK',0
    

.import
    library kernel,'KERNEL32.DLL',\
	    msvcrt,'MSVCRT.DLL'

    import kernel,\
	    ExitProcess,'ExitProcess'

    import msvcrt,\
        printf,'printf',\
        malloc,'malloc'