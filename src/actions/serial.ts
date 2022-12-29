import { SerialPort } from "serialport";
import { ByteLengthParser } from "@serialport/parser-byte-length";

const HEARTBEAT_INTERVAL = 10000;
export class SerialAdapter {
    port: SerialPort;
    parser: ByteLengthParser;

    lastMessage: Buffer | undefined = undefined;
    retryAttempts: number = 0;
    isLastMessageRequestedByUser: boolean = false; //we only want to send onAck when a command requested by the user is acked

    heartbeatStartTimer: NodeJS.Timeout | undefined;
    heartbeatEndTimer: NodeJS.Timeout | undefined;

    connectionStatus: boolean = false;
    onConnectionStatusChange?: () => void;
    onAck?: () => void;
    onError?: () => void;
    masterArm: boolean = false;
    onMasterArmChanged?: () => void;

    constructor(
        onConnectionStatusChange?: () => void,
        onAck?: () => void,
        onError?: () => void,
        onMasterArmChanged?: () => void
    ) {
        this.port = new SerialPort({
            baudRate: 9600,
            path: "COM3",
            stopBits: 1,
            dataBits: 8,
        });
        this.parser = this.port.pipe(new ByteLengthParser({ length: 1 }));

        this.onConnectionStatusChange = onConnectionStatusChange;
        this.onAck = onAck;
        this.onError = onError;
        this.onMasterArmChanged = onMasterArmChanged;

        this.port.on("open", () => {
            console.log("Port Opened!");
            setTimeout(()=>{
                this.sendHeartbeat();
                this.resetHeartbeat();
            })
        });

        this.port.on("close", () => {
            console.error("Port Closed!");
        });

        this.port.on("error", (error) => {
            this.setConnectionStatus(false);
            this.onError?.();
            console.error("Serial Error " + error.message);
        });

        this.parser.on("data", (data: Buffer) => {
            console.log("Received " + data.toString("hex"));
            if ((data[0] & 5) == 0) {
                //check for message errors and parity errors
                //error
                this.retryAttempts += 1;
                console.error(
                    "Failed to send message " +
                        this.lastMessage?.toString("hex") +
                        " " +
                        this.retryAttempts.toString() +
                        " times"
                );

                if (this.retryAttempts < 5 && this.lastMessage) {
                    this.port.write(this.lastMessage);
                    console.log(
                        "Resending " + this.lastMessage.toString("hex")
                    );
                } else {
                    this.setConnectionStatus(false);
                    this.resetHeartbeat();
                }

                this.onError?.();
            } else {
                this.setConnectionStatus(true);
                this.resetHeartbeat();
                if (this.isLastMessageRequestedByUser) this.onAck?.();
                this.isLastMessageRequestedByUser = false;
            }

            var newArmedStatus = (data[0] & 2) > 0;
            if (newArmedStatus != this.masterArm) {
                this.masterArm = newArmedStatus;
                this.onMasterArmChanged?.();
            }
        });
    }

    setConnectionStatus(newStatus: boolean) {
        if (newStatus != this.connectionStatus) {
            this.connectionStatus = newStatus;
            this.onConnectionStatusChange?.();
        }
    }

    sendMessage(type: number, channel: number = 1) {
        let parity = type ^ channel;
        this.lastMessage = Buffer.from([type, channel, parity, 0]);
        this.retryAttempts = 0;
        this.port.write(this.lastMessage);
        console.log("Sending " + this.lastMessage.toString("hex"));
    }

    fireChannel(channel: number) {
        this.sendMessage(4, channel);
        this.isLastMessageRequestedByUser = true;
    }

    arm() {
        this.sendMessage(2);
        this.isLastMessageRequestedByUser = true;
    }

    disarm() {
        this.sendMessage(3);
        this.isLastMessageRequestedByUser = true;
    }

    sendHeartbeat() {
        this.sendMessage(1);
        this.isLastMessageRequestedByUser = false;
    }

    resetHeartbeat() {
        clearTimeout(this.heartbeatStartTimer);
        this.heartbeatStartTimer = setTimeout(
            this.sendHeartbeat.bind(this),
            HEARTBEAT_INTERVAL
        );

        clearTimeout(this.heartbeatEndTimer);
        this.heartbeatEndTimer = setTimeout(() => {
            this.setConnectionStatus(false);
            this.resetHeartbeat();
        }, HEARTBEAT_INTERVAL * 1.5);
    }
}
