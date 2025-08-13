include 'format/format.inc'

format PE64 CONSOLE
entry start

section '.text' code readable executable
    start:
    sub	rsp, 8*5

    lea rcx, [message]
    call [printf]

    lea rcx, [messageB]
    call [printf]

    lea rcx, [messageC]
    call [printf]

    ;add rsp, 8*5
    mov rcx, 0
    call [ExitProcess]

section '.data' data readable writeable
    message db "OK",0
    messageB db "ok",0
    messageC db "oK",0

section '.idata' import data readable writeable
  dd 0,0,0,RVA kernel_name,RVA kernel_table
  dd 0,0,0,RVA msvcrt_name,RVA msvcrt_table
  dd 0,0,0,0,0

  kernel_table:
    ExitProcess dq RVA _ExitProcess
    dq 0
  msvcrt_table:
    printf dq RVA _printf
    dq 0

  kernel_name db 'KERNEL32.DLL',0
  msvcrt_name db 'MSVCRT.DLL',0

  _ExitProcess dw 0
    db 'ExitProcess',0
  _printf dw 0
    db 'printf',0