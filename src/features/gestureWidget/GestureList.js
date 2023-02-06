import * as React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, Paper, IconButton, Drawer, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import PlayIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MinimizeIcon from '@mui/icons-material/Minimize';
import { useSelector, useDispatch } from 'react-redux';
import { selectGestureList, selectActiveGesture, activateGesture, chooseLibraryGesture, selectPlaylistGestures, removeGestureFromPlaylist, moveGestureInPlaylist } from './GestureSlice';
import GestureEditPanel from './GestureEditPanel';
import {selectShowEditPanel, setShowEditPanelState} from '../gui/GuiSlice';
import { gesturePublisher } from '../robot/rosbridge';

export default function GestureList(props){
    // const [showEditPanel, setShowEditPanel] = React.useState(true);
    const showEditPanel = useSelector(selectShowEditPanel);
    const gestureList = useSelector(selectGestureList);
    const activeGesture = useSelector(selectActiveGesture);
    const playlistGestures = useSelector(selectPlaylistGestures);
    const [reorderStart, setReorderStart] = React.useState(-1);
    const [reorderEnd, setReorderEnd] = React.useState(-1);
    
    const dispatch = useDispatch();
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
    if(gestureList.length > 0) {
        return <React.Fragment>  
            {playlistGestures.map((gestureId, k) => {
                let gesture = gestureList.find(g => g.uid === gestureId);
                console.log(gesture);
                        return <Paper key={k}
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
                                    <Typography variant="h5" style={{marginTop:"auto", marginBottom:"auto", marginRight: "5px"}}>{gesture.name}</Typography>
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
                                            dispatch(setShowEditPanelState(true));
                                        }
                                    }
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={(e)=>{
                                            e.stopPropagation();
                                            for(let i = 0; i < gestureList.length; i++){
                                                if(gestureList[i].uid === gesture.uid){
                                                    dispatch(chooseLibraryGesture(i));
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    >
                                    <SearchIcon />
                                        
                                    </IconButton>
                                    <IconButton
                                        onClick={(e)=>{
                                            console.log(gesture);
                                            let msg = {}
                                            msg.data = JSON.stringify(gesture);
                                            gesturePublisher.publish(msg);
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
        return editdrawer
    }
}