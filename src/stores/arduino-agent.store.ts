import { writable } from 'svelte/store';

export interface ArduinoMessage {
  type: 'Arduino' | 'Computer';
  message: string;
  id: string;
  time: string;
}

export enum PortState {
  CLOSE = 'CLOSE',
  CLOSING = 'CLOSING',
  OPEN = 'OPEN',
  OPENNING = 'OPENNING',
  UPLOADING = 'UPLOADING',
}

export interface ArduinoPhysicalState {
  portName?: string;
  hasExtension: boolean;
  listOfUseDevices: string[];
  messages: ArduinoMessage[];
  isConnected: boolean;
  portState: PortState;
}

const arduinoPhysicalStore = writable<ArduinoPhysicalState>({
  portName: null,
  hasExtension: false,
  listOfUseDevices: [],
  messages: [],
  isConnected: false,
  portState: PortState.CLOSE,
});

function start(daemon) {
  daemon.agentFound.subscribe((status) => {
    arduinoPhysicalStore.update((s) => {
      return { ...s, hasExtension: status };
    });
  });

  daemon.devicesList.subscribe(({ serial, network }) => {
    const serialDevices = serial;
    const networkDevices = network;
    console.log(serialDevices, 'serialDevices');
  });
}

export default {
  subscribe: arduinoPhysicalStore.subscribe,
  start,
};
