#include "lcd_bsp.h"
#include "FT3168.h"

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#include <ArduinoJson.h>
#include "ui.h"

BLECharacteristic *pCharacteristic;
bool deviceConnected = false;

#define SERVICE_UUID        "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
#define CHARACTERISTIC_UUID "6e400002-b5a3-f393-e0a9-e50e24dcca9e"  // RX

class MyCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      lv_label_set_text(ui_Message, "BLE device connected");
      lv_scr_load(ui_NavigationScreen);
    }

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      lv_scr_load(ui_HomeScreen);
      lv_label_set_text(ui_Message, "No Bluetooth device connected");
    }
};

class CharacteristicCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      String value = pCharacteristic->getValue();
      
      Serial.print("Received: ");
      Serial.println(value.c_str());

      // Allocate the JSON document (Static for memory efficiency)
      StaticJsonDocument<200> doc;

      // Parse the JSON string
      DeserializationError error = deserializeJson(doc, value);

      if (error) {
        Serial.print("deserializeJson() failed: ");
        Serial.println(error.c_str());
        return;
      }

      // Extract values
      const char* nextTurnDistance = doc["nextTurnDistance"];
      const char* instruction = doc["instruction"];
      const char* totalDistanceRemaining = doc["totalDistanceRemaining"];
      const char* totalTimeRemaining = doc["totalTimeRemaining"];
      const char* maneuverImageIndex = doc["maneuverImageIndex"];

      // update UI labels with data
      lv_label_set_text(ui_NextTurnDistance, nextTurnDistance);
      lv_label_set_text(ui_Instruction, instruction);
      lv_label_set_text(ui_RemainingDistance, totalDistanceRemaining);
      lv_label_set_text(ui_RemainingTime, totalTimeRemaining);
      lv_img_set_src(ui_DirectionImage, "F:/ic_destination_right.png");
    }
};

void setup()
{
  Serial.begin(115200);
  Touch_Init();
  lcd_lvgl_Init();

  BLEDevice::init("ESP32Nav");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(CHARACTERISTIC_UUID, BLECharacteristic::PROPERTY_WRITE);

  pCharacteristic->setCallbacks(new CharacteristicCallbacks());
  pService->start();
  pServer->getAdvertising()->start();
  Serial.println("BLE ready");
}

void loop()
{
  delay(3000);
}
