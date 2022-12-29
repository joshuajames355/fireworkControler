import { SerialPort } from "serialport";

const HEARTBEAT_INTERVAL = 5000;
export class SerialAdapter {
    port: SerialPort;

    lastMessage: Buffer | undefined = undefined;
    retryAttempts: number = 0;

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
        this.port = new SerialPort({ baudRate: 9600, path: "test" });
        this.onConnectionStatusChange = onConnectionStatusChange;
        this.onAck = onAck;
        this.onError = onError;
        this.onMasterArmChanged = onMasterArmChanged;

        this.port.on("open", () => {
            this.sendHeartbeat();
        });

        this.port.on("error", (error) => {
            this.setConnectionStatus(false);
            this.onError?.();
            console.error("Serial Error " + error.message);
        });

        this.port.on("readable", () => {
            let data = this.port.read();
            console.log("Received " + data.toString());
            if ((data & 1) == 0) {
                //error
                this.retryAttempts += 1;
                console.error(
                    "Failed to send message " +
                        this.lastMessage?.toString("hex") +
                        " " +
                        this.retryAttempts.toString +
                        " times"
                );

                if (this.retryAttempts < 5) {
                    this.port.write(data);
                } else {
                    this.setConnectionStatus(false);
                    this.resetHeartbeat();
                }

                this.onError?.();
            } else {
                this.connectionStatus = true;
                this.resetHeartbeat();
                this.onAck?.();
            }

            var newArmedStatus = (data & 2) > 0;
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
        this.onError?.();
    }

    sendHeartbeat() {
        this.sendMessage(1);
    }
    resetHeartbeat() {
        clearTimeout(this.heartbeatStartTimer);
        this.heartbeatStartTimer = setTimeout(
            this.sendHeartbeat,
            HEARTBEAT_INTERVAL
        );

        clearTimeout(this.heartbeatEndTimer);
        this.heartbeatEndTimer = setTimeout(() => {
            this.setConnectionStatus(false);
            this.resetHeartbeat();
        }, HEARTBEAT_INTERVAL * 1.5);
    }
}
