#ifndef LCD_BSP_H
#define LCD_BSP_H
#include "Arduino.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/spi_master.h"
#include "esp_err.h"
#include "esp_timer.h"
#include "esp_lcd_panel_interface.h"
#include "esp_lcd_panel_io.h"
#include "esp_lcd_panel_vendor.h"
#include "esp_lcd_panel_ops.h"
#include "esp_lcd_panel_commands.h"
#include "lvgl.h"
#include "demos/lv_demos.h"
#include "esp_check.h"
#include "driver/gpio.h"

#ifdef __cplusplus
extern "C" {
#endif 

static bool example_notify_lvgl_flush_ready(esp_lcd_panel_io_handle_t panel_io, esp_lcd_panel_io_event_data_t *edata, void *user_ctx);
static void example_lvgl_flush_cb(lv_disp_drv_t *drv, const lv_area_t *area, lv_color_t *color_map);
void example_lvgl_rounder_cb(struct _lv_disp_drv_t *disp_drv, lv_area_t *area);
static void example_increase_lvgl_tick(void *arg);
static void example_lvgl_port_task(void *arg);
static void example_lvgl_unlock(void);
static bool example_lvgl_lock(int timeout_ms);
void lcd_lvgl_Init(void);
static void example_lvgl_touch_cb(lv_indev_drv_t *drv, lv_indev_data_t *data);
#ifdef __cplusplus
}
#endif

#endif