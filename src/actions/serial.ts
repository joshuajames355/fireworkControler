import { SerialPort } from "serialport";

const port = new SerialPort({ baudRate: 9600, path: "test" });

let lastMessage: Buffer | undefined = undefined;
let retryAttempts: number = 0;

export function sendMessage(type: number, channel: number = 1) {
    let parity = type ^ channel;
    lastMessage = Buffer.from([type, channel, parity, 0]);
    retryAttempts = 0;
    port.write(lastMessage);
}

port.on("readable", function () {
    let data = port.read();
    if ((data & 1) == 0) {
        //error
        retryAttempts += 1;
        console.error(
            "Failed to send message " +
                lastMessage?.toJSON() +
                " " +
                retryAttempts.toString +
                " times"
        );

        if (retryAttempts < 5) {
            port.write(data);
        }
    }
});
