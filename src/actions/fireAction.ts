import { sendMessage } from "./serial";
import { Action, ActionGroup } from "./types";

export function fireAction(action: Action){
    fireChannel(action.channel)
}

export function fireActionGroup(actionGroup: ActionGroup){
    actionGroup.actions.forEach(element => {
        if(element.type == "TimedAction"){
            setTimeout(() => 
                fireAction(element.action), element.delayMs
            )
        }
        else if(element.type == "Action"){
            fireAction(element)
        }
    });
}

function fireChannel(channel: number)
{
    if(channel < 0 || channel > 15){
        return false
    }

    sendMessage(4, channel)

    return true
}