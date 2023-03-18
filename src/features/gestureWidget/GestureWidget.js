import * as React from 'react';
import PropTypes from 'prop-types';
import {Paper, Select, FormControl, Stack, Typography,IconButton, Button, TextField, Divider} from '@mui/material';
import DangerousIcon from '@mui/icons-material/Dangerous';
import SaveIcon from '@mui/icons-material/Save';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import PlayControls from '../gui/PlayControls';
import {Refresh, Save, Delete} from '@mui/icons-material';
import { addNewGesture, selectPlaylistStore, selectPlaylistGestures, selectPlaylistName, updatePlaylistName, savePlaylist, resetPlaylist } from './GestureSlice';
import {updateMotorEnable} from '../robot/RobotSlice';
import { posePublisher, enablePublisher } from '../robot/rosbridge';
import GestureList from './GestureList';
import GestureLibrary from './GestureLibrary';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch, useSelector } from 'react-redux';
import LoadPlaylistDialog from './LoadPlaylistDialog';
import ROSLIB from 'roslib';


export default function GestureWidget(props){
    const playlistName = useSelector(selectPlaylistName);
    const playList = useSelector(selectPlaylistGestures);
    const dispatch = useDispatch();
    
    return <Paper>
            
            <GestureList robot={props.robot}/>
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