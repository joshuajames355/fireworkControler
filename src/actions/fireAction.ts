import { SerialAdapter } from "./serial";
import { Action, ActionGroup } from "./types";

export function fireAction(action: Action, serial: SerialAdapter) {
    fireChannel(action.channel, serial);
}

export function fireActionGroup(
    actionGroup: ActionGroup,
    serial: SerialAdapter
) {
    actionGroup.actions.forEach((element) => {
        if (element.type == "TimedAction") {
            setTimeout(
                () => fireAction(element.action, serial),
                element.delayMs
            );
        } else if (element.type == "Action") {
            fireAction(element, serial);
        }
    });
}

function fireChannel(channel: number, serial: SerialAdapter) {
    if (channel < 0 || channel > 15) {
        return false;
    }

    serial.sendMessage(4, channel);

    return true;
}
