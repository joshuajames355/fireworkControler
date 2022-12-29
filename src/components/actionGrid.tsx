import { ActionSet, ActionGroup } from "../actions";
import { Grid, Paper, Typography, Divider } from "@mui/material";
import React from "react";
import { ActionCard } from "./actionCard";

export interface ActionGridProps {
    actionSet: ActionSet;
    onFireActionGroup: (actionGroup: ActionGroup) => void;
}

export function ActionGrid(props: ActionGridProps) {
    return (
        <Paper
            variant="outlined"
            elevation={8}
            sx={{ paddingX: 2, paddingY: 2, marginY: 2, marginX: 2 }}
        >
            <Typography component="div" variant="h4">
                {props.actionSet.name}
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <Grid container spacing={2}>
                {props.actionSet.actionGroups.map((group: ActionGroup) => {
                    return (
                        <Grid item key={group.name}>
                            <ActionCard
                                actionGroup={group}
                                onFire={() => props.onFireActionGroup(group)}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </Paper>
    );
}
