import * as React from "react";
import { ActionGrid } from "./actionGrid";
import { MY_ACTION_SETS, ActionSet } from "../actions";

export function App() {
    return (
        <div>
            {MY_ACTION_SETS.map((set: ActionSet) => (
                <ActionGrid actionSet={set} />
            ))}
        </div>
    );
}
