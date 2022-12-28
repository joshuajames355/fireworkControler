import {
    Card,
    CardContent,
    Button,
    Typography,
    Divider,
    CardActions,
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import React from "react";
import { ActionGroup } from "../actions";

export interface ActionCardProps {
    actionGroup: ActionGroup;
    onFire: () => void;
}

export function ActionCard(props: ActionCardProps) {
    return (
        <Card raised={true} sx={{ minWidth: 200 }}>
            <CardContent>
                <Typography component="div" variant="h5">
                    {props.actionGroup.name}
                </Typography>
                <Divider />
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    endIcon={<RocketLaunchIcon />}
                    size="large"
                    onClick={props.onFire}
                >
                    Fire
                </Button>
            </CardActions>
        </Card>
    );
}
