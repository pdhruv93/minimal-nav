#ifndef _UI_IMG_MANAGER_H
#define _UI_IMG_MANAGER_H

uint8_t* _ui_load_binary(char* fname, const uint32_t size);

#define UI_LOAD_IMAGE _ui_load_binary

#endif
