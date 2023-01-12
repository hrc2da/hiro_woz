import * as React from 'react';
import PropTypes from 'prop-types';
import {Paper, Stack, Select, FormControl, Typography, IconButton, TextField} from '@mui/material';
import {Refresh, Save, Delete} from '@mui/icons-material';
import PlayControls from '../gui/PlayControls';

import { useSelector, useDispatch } from 'react-redux';
import { selectSpeechPublisher } from '../robot/RobotSlice';
import { speechPublisher } from '../robot/rosbridge';
import { selectPhrases, addToPhraseList, removeFromPhraseList, setPhraseList } from './PhrasesSlice';
import ROSLIB from 'roslib';

// const phrases = [
//     // "This grouping of rocks is important to the horizontal structure of your garden",
//     // "I really like how you created horizontal structure with this grouping",
//     // "The distances between rocks are bad. ",
//     // "How about placing the rocks in this section?",
//     // "How about reducing the number of rock clusters?",
//     // "Please consider the height of the rocks",
//     // "Please consider making use of negative space in this area"
//     // "Our garden looks great!",
//     // "This is a really clear relationship between these rocks.",
//     // "You followed the design principles really well!",
//     // "I like how you are make use of negative space here",
//     // "This is a really clever use of vertical relationships between rocks.",
//     // "That was really good, do something like that again!",
//     "Let's start over.",
//     "Let's redo this rock part.",
//     "Let's rake again.",
//     "Please reconsider your rock placement and raking patterns.",
//     "Please rethink the way that you are doing this",
//     "Try not to spread the rocks out like this",
//     "You don't have enough structure here",
//     "Why did you do this? I don't understand what you are trying to do here",
//     "Can you explain what you were trying to accomplish with this arrangement?",
//     "This is not good, we should remove this and start over"


// ]


export default function SpeechWidget(props){
    const phrases = useSelector(selectPhrases);
    const dispatch = useDispatch()
    const speaker = speechPublisher;
    const [freeText, setFreeText] = React.useState("");
    const handleTextInputChange = (event) => {
        setFreeText(event.target.value);
      };
    const [phraseIdx, setPhraseIdx] = React.useState(-1);
    const handleChangeMultiple = (event) => {
        const { options } = event.target;
        let value = -1;
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
                value = i;
                break;
            }
        }
        setPhraseIdx(value);
    };
    const handleClear = (event) => {
        setPhraseIdx(-1);
    }
    const handleSpeak = (event) => {
        let msg;
        if(phraseIdx >= 0){
            msg = new ROSLIB.Message({data:phrases[phraseIdx]});
        }
        else{
            msg = new ROSLIB.Message({data:freeText})
        }
        speaker.publish(msg);
        setPhraseIdx(-1);
    }
    return <Paper>
            <Typography variant="h4" gutterBottom={true}>Speak</Typography>
            <FormControl sx={{ width: "100%" }}>
            <TextField
                id="outlined-multiline-static"
                label="Enter a phrase for HIRO to say:"
                multiline
                onChange={handleTextInputChange}
                onClick={handleClear}
                rows={4}
                defaultValue=""
            />
                <Select
                    multiple
                    native
                    value={[phrases[phraseIdx]]}
                    onChange={handleChangeMultiple}
                >
                    {(phrases.length > 0) && phrases.map((phrase) => (
                        <option key={phrase} value={phrase}>
                            {phrase}
                        </option>
                    ))}
                </Select>
                <Stack direction="row" spacing={8}>
                    <PlayControls handlePlay={handleSpeak} handleClear={handleClear}/>
                    <Stack direction="row">
                        <IconButton
                            onClick={()=>dispatch(addToPhraseList(freeText))}
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