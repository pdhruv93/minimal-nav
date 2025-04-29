#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

BLECharacteristic *pCharacteristic;
bool deviceConnected = false;

#define SERVICE_UUID        "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
#define CHARACTERISTIC_UUID "6e400002-b5a3-f393-e0a9-e50e24dcca9e"  // RX

class MyCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
    }

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
    }
};

class CharacteristicCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string value = pCharacteristic->getValue();
      Serial.print("Received: ");
      Serial.println(value.c_str());
    }
};

void setup() {
  Serial.begin(115200);
  BLEDevice::init("ESP32Nav");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_WRITE
                    );

  pCharacteristic->setCallbacks(new CharacteristicCallbacks());
  pService->start();
  pServer->getAdvertising()->start();
  Serial.println("BLE ready");
}

void loop() {
  delay(1000);
}