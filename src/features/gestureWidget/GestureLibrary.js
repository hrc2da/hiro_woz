import * as React from 'react';
import { MenuItem, Button, IconButton, Drawer, Stack, Typography, Paper, Divider } from '@mui/material';
import Select,  { SelectChangeEvent } from '@mui/material/Select';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PlayIcon from '@mui/icons-material/PlayArrow';
import MinimizeIcon from '@mui/icons-material/Minimize';
import { useSelector, useDispatch } from 'react-redux';
import { selectGestureList, selectActiveGesture, activateGesture, addGestureToPlaylist, selectSelectedLibraryGesture, chooseLibraryGesture } from './GestureSlice';
import GesturePath from './GesturePath';
import GesturePoint from './GesturePoint';
import GestureEditPanel from './GestureEditPanel';
import GestureDetailPanel from './GestureDetailPanel';
import {setShowEditPanelState} from '../gui/GuiSlice';
import { gesturePublisher } from '../robot/rosbridge';

export default function GestureLibrary(props){
    // const [selectedGesture, setSelectedGesture] = React.useState(0);
    const selectedGesture = useSelector(selectSelectedLibraryGesture);
    const gestureList = useSelector(selectGestureList);
    const activeGesture = useSelector(selectActiveGesture);
    const dispatch = useDispatch();

    const handleChange = (event) => {
        console.log("gesture library select change: " + event.target.value);
        dispatch(chooseLibraryGesture(event.target.value));
      };

    if(gestureList.length > 0) {
        return <React.Fragment>  
            <Stack direction="row">
                <Select
                    // labelId="demo-simple-select-label"
                    id="gesture-library-select"
                    label="Library Gesture"
                    size="small"
                    variant="filled"
                    value={selectedGesture}
                    onChange={handleChange}
                >
                        {gestureList.map((gesture,k) => {
                                    return <MenuItem key={k} value={k}>{gesture.name}</MenuItem>
                            })
                        }


                </Select>
                <IconButton
                    onClick={(e)=>{
                        console.log(gestureList[selectedGesture]);
                        let msg = {}
                        msg.data = JSON.stringify(gestureList[selectedGesture]);
                        gesturePublisher.publish(msg);
                    }
                }>
                    <PlayIcon />
                </IconButton>
                <IconButton
                    onClick={(e)=>{
                        dispatch(activateGesture(gestureList[selectedGesture]));
                        dispatch(setShowEditPanelState(true));
                    }
                }>
                    <EditIcon />
                </IconButton>
                
                <IconButton 
                    onClick={()=>{dispatch(addGestureToPlaylist(gestureList[selectedGesture].uid))}}
                >
                    <AddCircleIcon 
                        
                    />
                </IconButton>
            </Stack>
            <Divider />
            <GestureDetailPanel gesture={selectedGesture}/>         
        </React.Fragment>
    }
    else{
        return <div>cat</div>
        // return editdrawer
    }
}