import * as React from "react";
import { ActionGrid } from "./actionGrid";
import { MY_ACTION_SETS, ActionSet } from "../actions";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { THEME } from "./theme";

export function App() {
    return (
        <ThemeProvider theme={THEME}>
            <CssBaseline />
            {MY_ACTION_SETS.map((set: ActionSet) => (
                <ActionGrid actionSet={set} />
            ))}
        </ThemeProvider>
    );
}
