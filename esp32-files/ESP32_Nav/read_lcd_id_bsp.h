#ifndef READ_LCD_ID_H
#define READ_LCD_ID_H
#ifdef __cplusplus
extern "C" {
#endif 
void lcd_gpio_init(void);
void SPI_ReadComm(uint8_t regval);
uint8_t SPI_ReadData(void);
uint8_t read_lcd_id(void);
#ifdef __cplusplus
}
#endif
#endif
