import { WebSerialPortPromise } from '@duinoapp/upload-multitool';
import { get, writable } from 'svelte/store';
import { ArduinoMessage } from './arduino-message.store';

const arduinoPortStore = writable<WebSerialPortPromise | null>(null);

const usbMessageStore = writable<ArduinoMessage>();
let buffer = '';

export default {
    subscribe: arduinoPortStore.subscribe,
    connect: async () => {
        const port = await WebSerialPortPromise.requestPort(
            {},
            { baudRate: 115200 }
        );
        await port.open();
        port.on('data', (data) => {
            buffer += data.toString();

            // Split on newlines
            const lines = buffer.split('\n');

            // Emit all complete lines
            for (let i = 0; i < lines.length - 1; i++) {
                const line = lines[i].trim(); // Clean \r if present

                if (!line) continue;

                usbMessageStore.set({
                    message: line,
                    type: "Arduino",
                    id: Date.now() + "_" + Math.random().toString(),
                    time: new Date().toLocaleTimeString(),
                });
                console.log('Received complete message:', line);
            }

            // Keep last incomplete part in buffer
            buffer = lines[lines.length - 1];
        }); 
        arduinoPortStore.set(port);
    },
    disconnect: async () => {
        const port = await get(arduinoPortStore);
        if (port) {
            await port.close();
        }
        arduinoPortStore.set(null);
    },
    isConnected: () => {
        const port = get(arduinoPortStore);
        return port !== null && port.isOpen;
    },
    sendMessage: async (message: string) => {
        const port = await get(arduinoPortStore);
        if (port) {
            await port.write(message);
            console.log('Sent:', message);
            usbMessageStore.set({
                message,
                type: "Computer",
                id: new Date().getTime() + "_" + Math.random().toString(),
                time: new Date().toLocaleTimeString(),
            });
        } else {
            console.error('Port is not connected');
        }
    },
    clearMessages: () => {
        usbMessageStore.set(null);
    },
    arduinoMessages: usbMessageStore.subscribe,
    getLastMessage: () => {
        return get(usbMessageStore)?.message ?? "";
    }
};




