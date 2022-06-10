import * as React from 'react';
import {Stack, IconButton} from '@mui/material';
import {PlayCircle, Stop, Cancel} from '@mui/icons-material';

export default function PlayControls(props){
    return <Stack direction="row" spacing={1}>
                <IconButton aria-label="play" onClick={props.handlePlay}>
                    <PlayCircle />
                </IconButton>
                <IconButton aria-label="stop" onClick={props.handleStop}>
                    <Stop />
                </IconButton>
                <IconButton aria-label="cancel" onClick={props.handleClear}>
                    <Cancel />
                </IconButton>
            </Stack>
}
