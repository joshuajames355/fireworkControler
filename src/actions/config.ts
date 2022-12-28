import {
    ActionSet,
    Action,
    makeAction,
    makeActionGroupFromAction,
    addDelay,
} from "./types";

export const MY_ACTIONS: Action[] = [...Array(15).keys()].map(
    (_: number, i: number) => makeAction("Channel " + (i + 1).toString(), i + 1)
);

export const DEFAULT_ACTION_SET = {
    actionGroups: MY_ACTIONS.map(makeActionGroupFromAction),
    name: "Default Actions",
};
export const CUSTOM_ACTION_GROUPS: ActionSet = {
    actionGroups: [
        { name: "Fire All", actions: MY_ACTIONS },
        {
            name: "Fire 1-3 Staggered",
            actions: [
                MY_ACTIONS[0],
                addDelay(MY_ACTIONS[1], 500),
                addDelay(MY_ACTIONS[2], 1000),
                addDelay(MY_ACTIONS[3], 1500),
                addDelay(MY_ACTIONS[4], 2000),
            ],
        },
    ],
    name: "Custom Actions",
};

export const MY_ACTION_SETS: ActionSet[] = [
    DEFAULT_ACTION_SET,
    CUSTOM_ACTION_GROUPS,
];
