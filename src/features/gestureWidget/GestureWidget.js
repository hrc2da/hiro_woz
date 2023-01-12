import * as React from 'react';
import PropTypes from 'prop-types';
import {Paper, Select, FormControl, Typography} from '@mui/material';
import PlayControls from '../gui/PlayControls';
import { addNewGesture } from './GestureSlice';

const gestures = [
    "Nod",
    "Breathe",
    "Shake Head",
    "Sweep"
]
export default function GestureWidget(props){
    return <Paper>
            <Typography variant="h4">Gestures</Typography>
            <FormControl sx={{ width: "100%" }}>
                <Select
                    multiple
                    native
                >
                    {gestures.map((gesture) => (
                        <option key={gesture} value={gesture}>
                            {gesture}
                        </option>
                    ))}reeText
                </Select>
            <PlayControls />
            <Stack direction="row" spacing={8}>
                    <PlayControls handlePlay={handleSpeak} handleClear={handleClear}/>
                    <Stack direction="row">
                        <IconButton
                            onClick={()=>dispatch(addNewGesture(f))}
                        >
                            <Save />
                        </IconButton>
                        <IconButton
                            onClick={()=>dispatch(removeFromPhraseList(phraseIdx))}
                        >
                            <Delete />
                        </IconButton>
                        <IconButton
                            onClick={()=>{setPhraseIdx(-1); dispatch(setPhraseList([]));}}
                        >
                            <Refresh />
                        </IconButton>

                    </Stack>
                    
                </Stack>
            </FormControl>
        </Paper>
}