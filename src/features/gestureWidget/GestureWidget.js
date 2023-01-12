import * as React from 'react';
import PropTypes from 'prop-types';
import {Paper, Select, FormControl, Typography} from '@mui/material';
import PlayControls from '../gui/PlayControls';

const gestures = [
    "Nod",
    "Breathe",
    "Shake Head",
    "Sweep"
]
export default function GestureWidget(props){
    return <Paper>
            <Typography variant="h4">Gesture</Typography>
            <FormControl sx={{ width: "100%" }}>
                <Select
                    multiple
                    native
                >
                    {gestures.map((gesture) => (
                        <option key={gesture} value={gesture}>
                            {gesture}
                        </option>
                    ))}
                </Select>
            <PlayControls />
            </FormControl>
        </Paper>
}