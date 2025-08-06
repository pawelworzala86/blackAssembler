
; programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

;include 'include\\opengl.inc'


section '.text' code readable executable

    start:
    sub	rsp,8		; Make stack dqword aligned

    invoke printf, message

    invoke	ExitProcess,0

section '.data' data readable writeable
    message db "OK",0


section '.idata' import data readable writeable
library kernel,'KERNEL32.DLL',\
user,'USER32.DLL',\
gdi,'GDI32.DLL',\
opengl,'OPENGL32.DLL',\
msvcrt,'MSVCRT.DLL',\
freeimage,'FREEIMAGE.DLL'

import kernel,\
ExitProcess,'ExitProcess',\
GetModuleHandle,'GetModuleHandleA',\
GetTickCount,'GetTickCount',\
CreateFileA,'CreateFileA',\
GetFileSize,'GetFileSize',\
ReadFile,'ReadFile',\
CloseHandle,'CloseHandle'

import user,\
LoadIcon,'LoadIconA',\
LoadCursor,'LoadCursorA',\
RegisterClass,'RegisterClassA',\
CreateWindowEx,'CreateWindowExA',\
GetMessage,'GetMessageA',\
TranslateMessage,'TranslateMessage',\
DispatchMessage,'DispatchMessageA',\
DefWindowProc,'DefWindowProcA',\
GetDC,'GetDC',\
GetClientRect,'GetClientRect',\
ReleaseDC,'ReleaseDC',\
PostQuitMessage,'PostQuitMessage'

import gdi,\
ChoosePixelFormat,'ChoosePixelFormat',\
SetPixelFormat,'SetPixelFormat',\
SwapBuffers,'SwapBuffers'

import opengl,\
wglCreateContext,'wglCreateContext',\
wglMakeCurrent,'wglMakeCurrent',\
glViewport,'glViewport',\
wglDeleteContext,'wglDeleteContext',\
wglGetProcAddress,'wglGetProcAddress',\
glClear,'glClear',\
glDrawArrays,'glDrawArrays',\
glDepthFunc,'glDepthFunc',\
glEnable,'glEnable',\
glGenTextures,'glGenTextures',\
glBindTexture,'glBindTexture',\
glTexParameteri,'glTexParameteri',\
glTexImage2D,'glTexImage2D'

import msvcrt,\
printf,'printf',\
malloc,'malloc',\
realloc,'realloc'

import freeimage,\
FreeImage_OpenMemory,'FreeImage_OpenMemory',\
FreeImage_LoadFromMemory,'FreeImage_LoadFromMemory',\
FreeImage_GetWidth,'FreeImage_GetWidth',\
FreeImage_GetHeight,'FreeImage_GetHeight',\
FreeImage_GetBits,'FreeImage_GetBits',\
FreeImage_ConvertTo32Bits,'FreeImage_ConvertTo32Bits',\
FreeImage_GetFormatFromFIF,'FreeImage_GetFormatFromFIF',\
FreeImage_LoadFromHandle,'FreeImage_LoadFromHandle',\
FreeImage_Initialise,'FreeImage_Initialise',\
FreeImage_Load,'FreeImage_Load',\
FreeImage_GetFileType,'FreeImage_GetFileType',\
FreeImage_GetFileTypeFromMemory,'FreeImage_GetFileTypeFromMemory',\
FreeImage_DeInit,'FreeImage_DeInit',\
FreeImage_Unload,'FreeImage_Unload'