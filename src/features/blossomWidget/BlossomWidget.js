import * as React from 'react';
import PropTypes from 'prop-types';
import {Paper, Slider, Select, FormControl, Stack, Typography,IconButton, Button, TextField, Divider} from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import {updateMotorEnable} from '../robot/RobotSlice';
import { blossomPublisher, speechPublisher } from '../robot/rosbridge';

import { useDispatch, useSelector } from 'react-redux';

import ROSLIB from 'roslib';


export default function BlossomWidget(props){
    const [roll, setRoll] = React.useState(0);
    const [pitch, setPitch] = React.useState(0);
    const [yaw, setYaw] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const [liveMode, setLiveMode] = React.useState(false);
    const [speech, setSpeech] = React.useState("");

    const dispatch = useDispatch();

    function handleSliderChange(event, newValue){
        //send a message to the robot with the new values
        switch(event.target.name){
            case "roll":
                setRoll(newValue);
                break;
            case "pitch":
                setPitch(newValue);
                break;
            case "yaw":
                setYaw(newValue);
                break;
            case "height":
                setHeight(newValue);
                break;
            default:
                console.log("unknown slider name", event.target.name)
                break;
        }
        if(liveMode){
            play(null);
        }
    }

    function play(e){
        let pose = new ROSLIB.Message({
            roll: roll,
            pitch: pitch,
            yaw: -yaw,
            height: height
        });
        console.log("sending new pose", pose);
        blossomPublisher.publish(pose);
        if(e != null && speech != ""){
            let speechMsg = new ROSLIB.Message({
                data: speech
            });
            speechPublisher.publish(speechMsg);
        }
    }
    function toggleLive(e){
        setLiveMode(!liveMode);
    }

    //return a form with four sliders, one for roll, pitch, yaw, and height
    return <Paper> 
            <FormControl sx={{ width: "100%" }}>
                <Stack spacing={4}>
                    <Stack direction="row" spacing={8}>
                        <Typography width={10}>Nod:</Typography> 
                        <Slider aria-label="Roll" name="roll" defaultValue={0} min={-1.5} max={1.5} step={0.1} valueLabelDisplay="on" onChange={handleSliderChange} />
                    </Stack>
                    <Stack direction="row" spacing={8}>
                        <Typography width={10}>Tilt:</Typography> 
                        <Slider aria-label="Pitch" name="pitch" defaultValue={0} min={-1.5} max={1.5} step={0.1} valueLabelDisplay="on" onChange={handleSliderChange} />
                    </Stack>
                    <Stack direction="row" spacing={8}>
                        <Typography width={10}>Turn:</Typography>
                        <Slider aria-label="Yaw" name="yaw" defaultValue={0} min={-1.5} max={1.5} step={0.1} valueLabelDisplay="on" onChange={handleSliderChange} />
                    </Stack>
                    <Stack direction="row" spacing={8}>
                        <Typography width={10}>Height:</Typography>
                        <Slider aria-label="Height" name="height" defaultValue={0} min={0} max={100} step={1} valueLabelDisplay="on" onChange={handleSliderChange} />
                    </Stack>
                </Stack>
            </FormControl>
            <Stack direction="row" spacing={2}>
                <Button onClick={toggleLive}>{ liveMode ? "End Live" : "Go Live"}</Button>
                <TextField label="Say" size="small" value={speech} onChange={(e)=>setSpeech(e.target.value)}/>
                <IconButton onClick={play}>
                    <PlayCircleIcon />
                </IconButton>
            </Stack>
            
        </Paper>

}