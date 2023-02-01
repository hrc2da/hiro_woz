import * as React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, IconButton, Stack, Paper, TextField, Typography, Card, CardContent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownardIcon from '@mui/icons-material/ArrowDownward';
import MinimizeIcon from '@mui/icons-material/Minimize';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { selectGestureList, selectActiveGesture, activateGesture, selectFocusPoint, focusOnPoint, removePoint, movePoint, updatePoint, updatePointApproach, replaceGesture } from './GestureSlice';


export default function GestureEditPanel(props){
    const currentGesture = useSelector(selectActiveGesture);
    const [reorderStart, setReorderStart] = React.useState(-1);
    const [reorderEnd, setReorderEnd] = React.useState(-1);
    const [currentPoint, setCurrentPoint] = React.useState(-1);
    const gestureList = useSelector(selectGestureList);
    const focusPoint = useSelector(selectFocusPoint);
    const dispatch = useDispatch();
    return <React.Fragment>
            <Stack direction="row">
                <Typography variant="h4">Edit Gesture</Typography>
                <IconButton
                    onClick={()=>{
                        for(let i=0; i<gestureList.length; i++){
                            if(gestureList[i].uid === currentGesture.uid){
                                dispatch(activateGesture(gestureList[i]));
                                break;
                            }
                        }
                    }}
                >
                    <RefreshIcon />
                </IconButton>
                <IconButton
                    onClick={()=>{
                        for(let i=0; i<gestureList.length; i++){
                            if(gestureList[i].uid === currentGesture.uid){
                                dispatch(replaceGesture(i, currentGesture));
                                break;
                            }
                        }
                    }}
                >
                    <SaveIcon />
                </IconButton>
                <IconButton
                    onClick={()=>props.handleClose()}
                >
                    <CloseFullscreenIcon />
                </IconButton>
            </Stack>
            <Stack direction="column" spacing={1}>
            {currentGesture.points.map((point,k) => {
                return <Stack key={k}
                        draggable
                        onDragStart = {(e)=>setReorderStart(k)}
                        onDragEnter = {(e)=>setReorderEnd(k)}
                        onDragEnd = {(e)=>dispatch(movePoint(reorderStart, reorderEnd))}
                >
                            <Accordion
                                onMouseOver={(e)=>dispatch(focusOnPoint(k+"e"))}
                                onMouseOut={(e)=>dispatch(focusOnPoint(-1))}
                                style={{backgroundColor: "lightgray", border: focusPoint === k+"e" ? "5px solid gray" : " 5px solid lightgray"}}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography>Approach</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Stack direction="row" spacing={1}>
                                        <TextField
                                            sx={{maxWidth:"300px", backgroundColor:"white"}}
                                            multiline
                                            label="Say"
                                            type="text"
                                            value={point.approach.speech==-1 ? "" : point.approach.speech}
                                            InputLabelProps={{shrink: true}}
                                            onChange={(e)=>{   
                                                // let approach = {...point.approach, "speech": e.target.value}
                                                // dispatch(updatePoint(k,{...point, "approach": approach}));
                                                dispatch(updatePointApproach(k,{...point.approach, "speech": e.target.value}));
                                            }} 
                                        />
                                        <TextField
                                            sx={{maxWidth:"75px", backgroundColor:"white"}}
                                            label="Duration (s)"
                                            type="number"
                                            size="small"
                                            InputLabelProps={{shrink: true}}
                                            value={point.approach.duration}
                                            onChange={(e)=>{   
                                                // let approach = {...point.approach, "duration": parseFloat(e.target.value)}
                                                // dispatch(updatePoint(k,{...point, "approach": approach}));
                                                dispatch(updatePointApproach(k,{...point.approach, "duration": parseFloat(e.target.value)}));
                                            }}   
                                        />
                                        <Button
                                            variant="outlined"
                                        >
                                            Speed
                                        </Button>
                                    </Stack>
                                </AccordionDetails>                                
                            </Accordion>
                            <Card 
                                onMouseOver={(e)=>dispatch(focusOnPoint(k+"p"))}
                                onMouseOut={(e)=>dispatch(focusOnPoint(-1))}
                                style={{backgroundColor: focusPoint === k+"p" ? "lightgray" : "white"}}
                            >
                                <CardContent>
                                    <Stack direction="row">
                                        <Typography variant="h6" style={{paddingRight:"8px", paddingTop: "5px"}}>P{k}</Typography>
                                        <TextField 
                                            sx={{maxWidth:"75px", backgroundColor:"white"}}
                                            label="X" 
                                            type="number"
                                            InputLabelProps={{shrink: true}}
                                            value={point.x} 
                                            size="small" 
                                            onChange={(e)=>{   
                                                dispatch(updatePoint(k,{...point, x: parseInt(e.target.value)}));
                                            }}   
                                        />
                                        <TextField 
                                            sx={{maxWidth:"75px", backgroundColor:"white"}}
                                            label="Y"
                                            type="number"   
                                            InputLabelProps={{shrink: true}}
                                            value={point.y}
                                            size="small"
                                            onChange={(e)=>{   
                                                dispatch(updatePoint(k,{...point, y: parseInt(e.target.value)}));
                                            }}   
                                        />
                                        <TextField 
                                            sx={{maxWidth:"75px", backgroundColor:"white"}}
                                            label="Z"
                                            type="number"   
                                            InputLabelProps={{shrink: true}}
                                            value={point.z}
                                            size="small"
                                            onChange={(e)=>{   
                                                dispatch(updatePoint(k,{...point, z: parseInt(e.target.value)}));
                                            }}   
                                        />
                                        <TextField 
                                            sx={{maxWidth:"75px", backgroundColor:"white"}}
                                            label="Pause (s)"
                                            type="number"   
                                            InputLabelProps={{shrink: true}}
                                            value={point.pause}
                                            size="small"
                                            onChange={(e)=>{   
                                                dispatch(updatePoint(k,{...point, pause: parseInt(e.target.value)}));
                                            }}  
                                        />
                                        <TextField
                                            sx={{maxWidth:"300px", backgroundColor:"white"}}
                                            multiline
                                            label="Say"
                                            type="text"
                                            InputLabelProps={{shrink: true}}
                                            value={point.speech ? point.speech : ""}
                                            onChange={(e)=>{   
                                                dispatch(updatePoint(k,{...point, "speech": e.target.value}));
                                            }}   
                                        />
                                        <IconButton
                                            style={{marginLeft: "auto"}}
                                            onClick={()=>dispatch(removePoint(k))}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                        
                                    </Stack>
                                </CardContent>
                            </Card> 
                        </Stack>
                
            })}

    </Stack>
    </React.Fragment>
}