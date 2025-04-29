import {BleManager, Characteristic, Device, State} from 'react-native-ble-plx';
import {Buffer} from 'buffer';
global.Buffer = Buffer; // Needed for buffer support

const manager = new BleManager();

let connectedDevice: Device | null = null;
let writableChar: Characteristic | null = null;

const DEVICE_NAME = 'ESP32Nav';
const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

export const connectToBLEDevice = async () => {
  // First, wait for BLE state to be ready
  const state = await manager.state();

  if (state !== State.PoweredOn) {
    manager.onStateChange(newState => {
      if (newState === State.PoweredOn) {
        console.log('Bluetooth powered on, starting scan...');
        initializeDevice();
      }
    }, true);
  } else {
    console.log('Bluetooth already powered on');
    initializeDevice();
  }
};

const initializeDevice = async () => {
  manager.startDeviceScan(null, null, async (error, device) => {
    if (error) {
      console.log('Scan error:', error);
      return;
    }

    if (device?.name === DEVICE_NAME) {
      console.log('Found device:', device.name);
      manager.stopDeviceScan();

      try {
        connectedDevice = await device.connect();
        await connectedDevice.discoverAllServicesAndCharacteristics();

        const services = await connectedDevice.services();
        for (const service of services) {
          const characteristics = await service.characteristics();
          for (const char of characteristics) {
            if (
              service.uuid === SERVICE_UUID &&
              char.uuid === CHARACTERISTIC_UUID
            ) {
              writableChar = char;
              console.log('Writable characteristic ready!');
              return;
            }
          }
        }
      } catch (err) {
        console.error('Connection failed:', err);
      }
    }
  });
};

export const sendDataToESP32 = async (text: string) => {
  if (!writableChar) {
    console.log('Characteristic not ready yet');
    return;
  }

  const base64Data = Buffer.from(text, 'utf8').toString('base64');

  try {
    console.log(':::::::Sending data to BLE device::::::', base64Data);
    await writableChar.writeWithResponse(base64Data);
    console.log('::::Data sent to BLE device:::::');
  } catch (err) {
    console.log('Send error:', err);
  }
};
