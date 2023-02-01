import * as React from 'react';
import PropTypes from 'prop-types';
import {Paper, Select, FormControl, Stack, Typography,IconButton, Button, TextField, Divider} from '@mui/material';
import DangerousIcon from '@mui/icons-material/Dangerous';
import SaveIcon from '@mui/icons-material/Save';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import PlayControls from '../gui/PlayControls';
import {Refresh, Save, Delete} from '@mui/icons-material';
import { addNewGesture, selectPlaylistGestures, selectPlaylistName, updatePlaylistName, savePlaylist } from './GestureSlice';
import {updateMotorEnable} from '../robot/RobotSlice';
import { posePublisher, enablePublisher } from '../robot/rosbridge';
import GestureList from './GestureList';
import GestureLibrary from './GestureLibrary';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch, useSelector } from 'react-redux';
import ROSLIB from 'roslib';


export default function GestureWidget(props){
    const playlistName = useSelector(selectPlaylistName);
    const playList = useSelector(selectPlaylistGestures);
    const dispatch = useDispatch();
    const handleMotorEnable = (event) =>{
        let motors = ['swing','shoulder','elbow']
        for(let i=0; i<motors.length; i++){
            let msg = new ROSLIB.Message({data:JSON.stringify({motor_name:motors[i],torque_enable:0})});
            enablePublisher.publish(msg);
        }
        dispatch(updateMotorEnable(false));
    }
    return <Paper>
            <Stack 
                direction="row" 
                spacing={8}
                style={{backgroundColor: "rgb(85 108 214 / 50%)", padding: "10px"}}
            >
            <Typography style={{marginTop: "auto", marginBottom: "auto"}} variant="h4">Playlist</Typography>
            <IconButton
                    variant="outlined" 
                    style={{marginLeft: "auto", marginTop: "auto", marginBottom: "auto", backgroundColor: "red"}}  
                    onClick={handleMotorEnable}
                >
                    <DangerousIcon 
                        style={{width:"70px", height:"70px", padding: "0px", color: "gold"}}
                    />
                </IconButton>
            </Stack>
            
            <Stack direction="row">
                <TextField 
                    label=""
                    variant="outlined"
                    style={{width: "100%"}}
                    value={playlistName ? playlistName : "Untitled"}
                    onChange={(e)=>dispatch(updatePlaylistName(e.target.value))}
                />
                
                <Button
                    variant="contained"
                    component="label"
                    style={{backgroundColor: "green"}}
                    onClick={()=>{
                        if(playList.length <= 0){
                            console.log("Playlist is empty!");
                            return;
                        }
                        if(!playlistName){
                            console.log("Playlist name is empty!");
                            return;
                        }
                        dispatch(savePlaylist(playlistName,playList))
                    }}
                    >
                    <SaveIcon />
                </Button>
                <Button
                    variant="contained"
                    component="label"
                    >
                    <FileOpenIcon />
                </Button>
                <Button
                    variant="contained"
                    component="label"
                    style={{backgroundColor: "brown"}}
                    >
                    <CancelIcon />
                </Button>
            </Stack>
            <Divider />
            <GestureList />
            <Divider />
            <Typography 
                style={{marginTop: "auto", marginBottom: "auto", backgroundColor: "rgb(85 108 214 / 50%)", padding: "10px"}} 
                variant="h4" 
            >
                    Gesture Library     
            </Typography>
            <Divider />
            <GestureLibrary />
            <FormControl sx={{ width: "100%" }}>
                {/* <Select
                    multiple
                    native
                >
                    {gestures.map((gesture) => (
                        <option key={gesture} value={gesture}>
                            {gesture}
                        </option>
                    ))}reeText
                </Select> */}
            <PlayControls />
            <Stack direction="row" spacing={8}>
                    {/* <PlayControls handlePlay={handleSpeak} handleClear={handleClear}/> */}
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