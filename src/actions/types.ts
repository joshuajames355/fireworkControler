//A single action
export interface Action {
    type: "Action";
    name: string;
    channel: number;
}

export const makeAction = (name: string, channel: number): Action => {
    return {
        type: "Action",
        name,
        channel,
    };
};

export interface TimedAction {
    type: "TimedAction";
    action: Action;
    delayMs: Number;
}

export const addDelay = (action: Action, delayMs: number): TimedAction => {
    return {
        type: "TimedAction",
        action,
        delayMs,
    };
};

//A group of actions that are grouped as a single UI
export interface ActionGroup {
    name: string;
    actions: (Action | TimedAction)[];
}

export const makeActionGroupFromAction = (action: Action): ActionGroup => {
    return {
        name: action.name,
        actions: [action],
    };
};

//A set of ActionGroups to be grouped together on the UI
export interface ActionSet {
    name: string;
    actionGroups: ActionGroup[];
}
