import * as React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, Paper, IconButton, Drawer, Stack, TextField, Divider, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import PlayIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MinimizeIcon from '@mui/icons-material/Minimize';
import { useSelector, useDispatch } from 'react-redux';
import { selectGestureList, selectActiveGesture, activateGesture, chooseLibraryGesture, 
    selectPlaylistGestures, removeGestureFromPlaylist, moveGestureInPlaylist, 
    selectPlaylistName, updatePlaylistName, savePlaylist, resetPlaylist } from './GestureSlice';
import GestureEditPanel from './GestureEditPanel';
import {selectShowEditPanel, setShowEditPanelState } from '../gui/GuiSlice';
import { gesturePublisher } from '../robot/rosbridge';
import LoadPlaylistDialog from './LoadPlaylistDialog';
import ROSLIB from 'roslib';
import {updateMotorEnable} from '../robot/RobotSlice';
import DangerousIcon from '@mui/icons-material/Dangerous';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export default function GestureList(props){
    // const [showEditPanel, setShowEditPanel] = React.useState(true);
    const showEditPanel = useSelector(selectShowEditPanel);
    const gestureList = useSelector(selectGestureList);
    const activeGesture = useSelector(selectActiveGesture);
    const playlistGestures = useSelector(selectPlaylistGestures);
    const [reorderStart, setReorderStart] = React.useState(-1);
    const [reorderEnd, setReorderEnd] = React.useState(-1);
    const [playlistHighlight, setPlaylistHighlight] = React.useState(-1);
    const [playedList, setPlayedList] = React.useState([]);
    const playlistName = useSelector(selectPlaylistName);
    const dispatch = useDispatch();

    const handleMotorEnable = (event) =>{
        let motors = ['swing','shoulder','elbow']
        for(let i=0; i<motors.length; i++){
            let msg = new ROSLIB.Message({data:JSON.stringify({motor_name:motors[i],torque_enable:0})});
            enablePublisher.publish(msg);
        }
        dispatch(updateMotorEnable(false));
    }
    const editdrawer = <Drawer
                            sx={{ width: 600,
                                flexShrink: 0,
                                '& .MuiDrawer-paper': { width: 600, boxSizing: 'border-box' }
                            }}
                            anchor="right"
                            variant="persistent"
                            open={showEditPanel}
                            // onClose={()=>setShowEditPanel(false)}
                        >
                            <GestureEditPanel show={showEditPanel} handleClose = {()=>dispatch(setShowEditPanelState(false))}/>
                        </Drawer>
    const playlistMenu = <React.Fragment>
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
                                {/* <Button
                                    variant="contained"
                                    component="label"
                                    >
                                    <FileOpenIcon />
                                </Button> */}
                                <LoadPlaylistDialog resetPlaylist={(e)=>{setPlayedList([]); setPlaylistHighlight(-1);}}/>
                                <Button
                                    variant="contained"
                                    component="label"
                                    style={{backgroundColor: "brown"}}
                                    onClick={()=>dispatch(resetPlaylist())}
                                    >
                                    <CancelIcon />
                                </Button>
                            </Stack>
                            <Divider />
                        </React.Fragment>
    const setLibraryDisplay = (gesture) => {
        for(let i = 0; i < gestureList.length; i++){
            if(gestureList[i].uid === gesture.uid){
                dispatch(chooseLibraryGesture(i));
                break;
            }
        }    
    }
    if(gestureList.length > 0) {
        return <React.Fragment>  
            {playlistMenu}
            {playlistGestures.map((gestureId, k) => {
                let gesture = gestureList.find(g => g.uid === gestureId);
                console.log(gesture);
                        return <Paper key={k}
                            style={{backgroundColor: playlistHighlight === k ? "#e0e0e0" : "#ffffff"}}
                            draggable
                            onDragStart = {(e)=>setReorderStart(k)}
                            onDragEnter = {(e)=>setReorderEnd(k)}
                            onDragEnd = {(e)=>dispatch(moveGestureInPlaylist(reorderStart, reorderEnd))}
                        >
                            {/* <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header" 
                            > */}
                                <Stack direction="row" spacing={0}>
                                <Typography variant="h5" style={{marginTop:"auto", marginBottom:"auto", marginLeft: "5px", marginRight: "5px"}}>{k}.</Typography>
                                    {/* <Stack direction="column" spacing={1}>
                                        <IconButton
                                            onClick={(e)=>e.stopPropagation()}
                                        >
                                            <ArrowUpwardIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={(e)=>e.stopPropagation()}
                                        >
                                            <ArrowDownardIcon />
                                        </IconButton>
                                    </Stack> */}
                                    <Typography variant="h5" style={{marginTop:"auto", 
                                                                    marginBottom:"auto", 
                                                                    marginRight: "5px", 
                                                                    color: playedList.find((g) => g.name === gesture.name) ? "gray" : "black"}}
                                                                    >
                                                                        {gesture.name}
                                    </Typography>
                                    <IconButton
                                    style={{marginLeft:"auto"}} 
                                        onClick={(e)=>{
                                            e.stopPropagation();
                                            dispatch(removeGestureFromPlaylist(k))}}
                                    >
                            
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={(e)=>{
                                            e.stopPropagation();
                                            dispatch(activateGesture(gesture));
                                            setLibraryDisplay(gesture);
                                            dispatch(setShowEditPanelState(true));
                                        }
                                    }
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={(e)=>{
                                            e.stopPropagation();
                                            setLibraryDisplay(gesture);
                                            // for(let i = 0; i < gestureList.length; i++){
                                            //     if(gestureList[i].uid === gesture.uid){
                                            //         dispatch(chooseLibraryGesture(i));
                                            //         break;
                                            //     }
                                            // }
                                        }
                                    }
                                    >
                                    <SearchIcon />
                                        
                                    </IconButton>
                                    <IconButton
                                        onClick={(e)=>{
                                            console.log(gesture);
                                            
                                            let msg = {}
                                            setPlaylistHighlight(k);
                                            setPlayedList([...playedList, gesture]);
                                            msg.data = JSON.stringify(gesture);
                                            gesturePublisher.publish(msg);
                                            setLibraryDisplay(gesture);
                                            
                                        }
                                    }>
                                        <PlayIcon />
                                    </IconButton>
                                    
                                    
                                    
                                </Stack>
                            {/* </AccordionSummary> */}
                            {/* <AccordionDetails>
                                <Typography>
                                    <Stack direction="row" spacing={2}>
                                        
                                        
                                        <Button>
                                            Delete
                                        </Button>
                                       
                                    </Stack>
                                </Typography>
                            </AccordionDetails> */}
                        {/* </Accordion> */}
                        </Paper>
                    })
                }
                {editdrawer}
        </React.Fragment>
    }
    else{
        // return <div>cat</div>
        return <React.Fragment>
            {playlistMenu}
            {editDrawer}
        </React.Fragment>    
        }
}