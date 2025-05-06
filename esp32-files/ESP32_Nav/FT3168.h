#ifndef FT3168_H
#define FT3168_H
#include "driver/i2c.h"

#ifdef __cplusplus
extern "C" {
#endif 

void Touch_Init(void);

uint8_t getTouch(uint16_t *x,uint16_t *y);
#ifdef __cplusplus
}
#endif
#endif