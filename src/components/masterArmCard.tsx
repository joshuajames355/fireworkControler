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

export interface MasterArmCardProps {
    isArmed: boolean;
    toggleArmStatus: () => void;
}

export function MasterArmCard(props: MasterArmCardProps) {
    return (
        <Card raised={true} sx={{ minWidth: 200, padding: 2, margin: 2 }}>
            <CardContent>
                <Typography component="div" variant="h5">
                    Master Arm
                </Typography>
                <Divider />
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    endIcon={<RocketLaunchIcon />}
                    size="large"
                    onClick={props.toggleArmStatus}
                    sx={{ width: 1 }}
                >
                    {props.isArmed ? "Disarm" : "Arm"}
                </Button>
            </CardActions>
        </Card>
    );
}
