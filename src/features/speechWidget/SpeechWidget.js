import * as React from 'react';
import PropTypes from 'prop-types';
import {Paper, Stack, Select, FormControl, Typography, IconButton} from '@mui/material';
import {PlayCircle, Stop, Cancel} from '@mui/icons-material';
import PlayControls from '../gui/PlayControls';

import { useSelector, useDispatch } from 'react-redux';
import { selectSpeechPublisher } from '../robot/RobotSlice';
import { speechPublisher } from '../robot/rosbridge';
import ROSLIB from 'roslib';

const phrases = [
    "Great job!",
    "Remember to create negative space.",
    "This looks terrible!",
    "What are you thinking?"
]


export default function SpeechWidget(props){
    const speaker = speechPublisher;
    
    const [phrase, setPhrase] = React.useState([]);
    const handleChangeMultiple = (event) => {
        const { options } = event.target;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
            value.push(options[i].value);
            }
        }
        setPhrase([value]);
    };
    const handleClear = (event) => {
        setPhrase([]);
    }
    const handleSpeak = (event) => {
        const msg = new ROSLIB.Message({data:phrase[0][0]})
        speaker.publish(msg);
        setPhrase([]);
    }
    return <Paper>
            <Typography variant="h4">Speak</Typography>
            <FormControl sx={{ width: "100%" }}>
                <Select
                    multiple
                    native
                    value={phrase}
                    onChange={handleChangeMultiple}
                >
                    {phrases.map((phrase) => (
                        <option key={phrase} value={phrase}>
                            {phrase}
                        </option>
                    ))}
                </Select>
                <PlayControls handlePlay={handleSpeak} handleClear={handleClear}/>
            </FormControl>
        </Paper>
}