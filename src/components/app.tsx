import * as React from "react";
import { ActionGrid } from "./actionGrid";
import { THEME } from "./theme";
import {
    MY_ACTION_SETS,
    ActionSet,
    fireActionGroup,
    SerialAdapter,
} from "../actions";
import {
    AppBar,
    Snackbar,
    Toolbar,
    Typography,
    ThemeProvider,
    CssBaseline,
    Alert,
} from "@mui/material";

export function App() {
    let [snackBarOpen, setSnackBarOpen] = React.useState(false);
    let [lastMessageError, setLastMessageError] = React.useState(false);
    let [connectionStatus, setConnectionStatus] = React.useState(false);

    let [serial, _] = React.useState(
        () =>
            new SerialAdapter(
                () => {
                    setConnectionStatus(serial.connectionStatus);
                },
                () => {
                    setLastMessageError(false);
                    setSnackBarOpen(true);
                },
                () => {
                    setLastMessageError(true);
                    setSnackBarOpen(true);
                }
            )
    );

    return (
        <ThemeProvider theme={THEME}>
            <CssBaseline />
            {MY_ACTION_SETS.map((set: ActionSet) => (
                <ActionGrid
                    actionSet={set}
                    onFireActionGroup={(actionGroup) =>
                        fireActionGroup(actionGroup, serial)
                    }
                />
            ))}
            <Snackbar
                open={snackBarOpen}
                onClose={() => {
                    setSnackBarOpen(false);
                }}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => {
                        setSnackBarOpen(false);
                    }}
                    severity={lastMessageError ? "error" : "success"}
                    sx={{ width: "100%" }}
                >
                    {lastMessageError
                        ? "Command Failed!"
                        : "Command Acknowledged!"}
                </Alert>
            </Snackbar>

            <AppBar
                position="fixed"
                color="secondary"
                sx={{ top: "auto", bottom: 0 }}
            >
                <Toolbar>
                    <Typography>
                        Connection Status:
                        {connectionStatus ? "Alive" : "Offline"}
                    </Typography>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}
