#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "read_lcd_id_bsp.h"
#include "driver/gpio.h"
#include "esp_rom_sys.h"
#include "esp_log.h"
#define bit_mask (uint64_t)0x01

#define EXAMPLE_PIN_NUM_LCD_CS            (GPIO_NUM_9)
#define EXAMPLE_PIN_NUM_LCD_PCLK          (GPIO_NUM_10) 
#define EXAMPLE_PIN_NUM_LCD_DATA0         (GPIO_NUM_11)
#define EXAMPLE_PIN_NUM_LCD_DATA1         (GPIO_NUM_12)
#define EXAMPLE_PIN_NUM_LCD_DATA2         (GPIO_NUM_13)
#define EXAMPLE_PIN_NUM_LCD_DATA3         (GPIO_NUM_14)
#define EXAMPLE_PIN_NUM_LCD_RST           (GPIO_NUM_21)

#define lcd_cs_1 gpio_set_level(EXAMPLE_PIN_NUM_LCD_CS,1)
#define lcd_cs_0 gpio_set_level(EXAMPLE_PIN_NUM_LCD_CS,0)
#define lcd_clk_1 gpio_set_level(EXAMPLE_PIN_NUM_LCD_PCLK,1)
#define lcd_clk_0 gpio_set_level(EXAMPLE_PIN_NUM_LCD_PCLK,0)
#define lcd_d0_1 gpio_set_level(EXAMPLE_PIN_NUM_LCD_DATA0,1)
#define lcd_d0_0 gpio_set_level(EXAMPLE_PIN_NUM_LCD_DATA0,0)
#define lcd_d1_1 gpio_set_level(EXAMPLE_PIN_NUM_LCD_DATA1,1)
#define lcd_d1_0 gpio_set_level(EXAMPLE_PIN_NUM_LCD_DATA1,0)
#define lcd_d2_1 gpio_set_level(EXAMPLE_PIN_NUM_LCD_DATA2,1)
#define lcd_d2_0 gpio_set_level(EXAMPLE_PIN_NUM_LCD_DATA2,0)
#define lcd_d3_1 gpio_set_level(EXAMPLE_PIN_NUM_LCD_DATA3,1)
#define lcd_d3_0 gpio_set_level(EXAMPLE_PIN_NUM_LCD_DATA3,0)
#define lcd_rst_1 gpio_set_level(EXAMPLE_PIN_NUM_LCD_RST,1)
#define lcd_rst_0 gpio_set_level(EXAMPLE_PIN_NUM_LCD_RST,0)

#define read_d0 gpio_get_level(EXAMPLE_PIN_NUM_LCD_DATA0)

void lcd_gpio_init(void)
{
  gpio_config_t gpio_conf = {};
  gpio_conf.intr_type = GPIO_INTR_DISABLE;
  gpio_conf.mode = GPIO_MODE_OUTPUT;
  gpio_conf.pin_bit_mask = (bit_mask<<EXAMPLE_PIN_NUM_LCD_CS) | (bit_mask<<EXAMPLE_PIN_NUM_LCD_PCLK) | (bit_mask<<EXAMPLE_PIN_NUM_LCD_DATA0) \
  | (bit_mask<<EXAMPLE_PIN_NUM_LCD_DATA1) | (bit_mask<<EXAMPLE_PIN_NUM_LCD_DATA2) | (bit_mask<<EXAMPLE_PIN_NUM_LCD_DATA3) | (bit_mask<<EXAMPLE_PIN_NUM_LCD_RST);
  gpio_conf.pull_down_en = GPIO_PULLDOWN_DISABLE;
  gpio_conf.pull_up_en = GPIO_PULLUP_ENABLE;

  ESP_ERROR_CHECK_WITHOUT_ABORT(gpio_config(&gpio_conf)); //ESP32板载GPIO
}
void sda_read_mode(void)
{
  gpio_config_t gpio_conf = {};
  gpio_conf.intr_type = GPIO_INTR_DISABLE;
  gpio_conf.mode = GPIO_MODE_INPUT;
  gpio_conf.pin_bit_mask = (bit_mask<<EXAMPLE_PIN_NUM_LCD_DATA0);
  gpio_conf.pull_down_en = GPIO_PULLDOWN_DISABLE;
  gpio_conf.pull_up_en = GPIO_PULLUP_ENABLE;

  ESP_ERROR_CHECK_WITHOUT_ABORT(gpio_config(&gpio_conf)); //ESP32板载GPIO
}
void sda_write_mode(void)
{
  gpio_config_t gpio_conf = {};
  gpio_conf.intr_type = GPIO_INTR_DISABLE;
  gpio_conf.mode = GPIO_MODE_OUTPUT;
  gpio_conf.pin_bit_mask = (bit_mask<<EXAMPLE_PIN_NUM_LCD_DATA0);
  gpio_conf.pull_down_en = GPIO_PULLDOWN_DISABLE;
  gpio_conf.pull_up_en = GPIO_PULLUP_ENABLE;

  ESP_ERROR_CHECK_WITHOUT_ABORT(gpio_config(&gpio_conf)); //ESP32板载GPIO
}
void delay_us(uint32_t us)
{
  esp_rom_delay_us(us);
}
//SPI写数据
void  SPI_1L_SendData(uint8_t dat)
{  
  uint8_t i;
  for(i=0; i<8; i++)			
  {   
    if( (dat&0x80)!=0 ) lcd_d0_1;
    else                lcd_d0_0;
    dat  <<= 1;
	  lcd_clk_0;//delay_us(2);
	  lcd_clk_1; 
  }
}
void WriteComm(uint8_t regval)
{ 
	lcd_cs_0;
  lcd_d0_0;
  lcd_clk_0;

  lcd_d0_0;
  lcd_clk_0;
  lcd_clk_1;
  SPI_1L_SendData(regval);
  lcd_cs_1;
}
void WriteData(uint8_t val)
{   
  lcd_cs_0;
  lcd_d0_0;
  lcd_clk_0;

  lcd_d0_1;
  lcd_clk_0;
  lcd_clk_1;
  SPI_1L_SendData(val);
  lcd_cs_1;
}
void SPI_WriteComm(uint8_t regval)
{ 
	SPI_1L_SendData(0x02);
	SPI_1L_SendData(0x00);
	SPI_1L_SendData(regval);
	SPI_1L_SendData(0x00);//delay_us(2);
}

void SPI_ReadComm(uint8_t regval)
{    
	SPI_1L_SendData(0x03);//
	SPI_1L_SendData(0x00);
	SPI_1L_SendData(regval);
	SPI_1L_SendData(0x00);//PAM
}

uint8_t SPI_ReadData(void)
{
	uint8_t i=0,dat=0;
  for(i=0; i<8; i++)			
  { 
    lcd_clk_0;
    sda_read_mode();//读取返回数据前，设置为输入模式
    dat=(dat<<1)| read_d0;
    sda_write_mode();//读取返回数据后，设置为输出模式	
    lcd_clk_1;
    delay_us(1);//必要的延时 
  }
  // Write_Mode();//读取返回数据后，设置为输出模式	
	return dat;	 
}
uint8_t SPI_ReadData_Continue(void)
{
	uint8_t i=0,dat=0;
  for(i=0; i<8; i++)			
  {  
    lcd_clk_0;
    sda_read_mode();//读取返回数据前，设置为输入模式
    delay_us(1);//必要的延时 
    dat=(dat<<1)|read_d0; 
    sda_write_mode();//读取返回数据后，设置为输出模式	
    lcd_clk_1;
    delay_us(1);//必要的延时
  }
	return dat;	 
}

uint8_t read_lcd_id(void)
{
  lcd_gpio_init();
  lcd_rst_1;
  vTaskDelay(pdMS_TO_TICKS(120));
  lcd_rst_0;
  vTaskDelay(pdMS_TO_TICKS(120));
  lcd_rst_1;
  vTaskDelay(pdMS_TO_TICKS(120));
  SPI_ReadComm(0xDA);
  uint8_t ret = SPI_ReadData_Continue();
  ESP_LOGI("lcd_Model","0x%02x",ret);
  return ret;
}