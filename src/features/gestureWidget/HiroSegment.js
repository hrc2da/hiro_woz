import * as React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, IconButton, Stack, TextField, Typography, Card, CardContent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { selectFocusPoint, focusOnPoint, removePoint, movePoint, updatePoint, updatePointApproach } from './GestureSlice';


export default function HiroSegment(props){
    
    const [reorderStart, setReorderStart] = React.useState(-1);
    const [reorderEnd, setReorderEnd] = React.useState(-1);
    const focusPoint = useSelector(selectFocusPoint);
    const dispatch = useDispatch();
    const k = props.k;
    const point = props.point;
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
                                // multiline
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
                                // multiline
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
}                
 