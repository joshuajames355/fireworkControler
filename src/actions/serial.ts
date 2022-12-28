import { SerialPort } from "serialport";

const port = new SerialPort({baudRate: 9600, path: "test"})

export function sendMessage(type: number, channel: number = 1){
    var parity = 0;
    port.write(Buffer.from([type, channel, parity, 0]))
}