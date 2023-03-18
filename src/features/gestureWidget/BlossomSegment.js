import * as React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, IconButton, Stack, Slider, TextField, Typography, Card, CardContent } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { selectFocusPoint, focusOnPoint, removePoint, movePoint, updatePoint, updatePointApproach } from './GestureSlice';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { gesturePublisher } from '../robot/rosbridge';
import ROSLIB from 'roslib';

export default function BlossomSegment(props){
    
    const [reorderStart, setReorderStart] = React.useState(-1);
    const [reorderEnd, setReorderEnd] = React.useState(-1);
    const focusPoint = useSelector(selectFocusPoint);
    const dispatch = useDispatch();
    const k = props.k;
    const point = props.point;
    const blossom = point.blossom;

    function play(e){

        let single_point_gesture = { "points": [point] };
        
        
        let msg = new ROSLIB.Message({
            data: JSON.stringify(single_point_gesture)
        });
        // console.log("sending new pose", pose);
        gesturePublisher.publish(msg);
    
    }
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
                                
                                value={point.approach.blossom && point.approach.blossom.speech==-1 ? "" : point.approach.blossom.speech}
                                InputLabelProps={{shrink: true}}
                                onChange={(e)=>{   
                                    // let approach = {...point.approach, "speech": e.target.value}
                                    // dispatch(updatePoint(k,{...point, "approach": approach}));
                                    dispatch(updatePointApproach(k,{...point.approach, blossom: {...point.approach.blossom, "speech": e.target.value}}));
                                }} 
                            />
                            {/* <TextField
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
                            /> */}
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
                    <Stack spacing={4}>
                    <Typography variant="h6" style={{paddingRight:"8px", paddingTop: "5px"}}>P{k}</Typography>
                        <Stack direction="row" spacing={8}>
                            <Typography width={10}>Nod:</Typography> 
                            <Slider 
                                aria-label="Roll" 
                                name="roll" 
                                value={blossom.roll} 
                                min={-1.5} 
                                max={1.5} 
                                step={0.1} 
                                valueLabelDisplay="on" 
                                onChange={(e)=>{   
                                    dispatch(updatePoint(k,{...point, blossom: {...blossom, roll: parseFloat(e.target.value)}}));
                                }}   
                            />
                            <TextField 
                                sx={{maxWidth:"75px", backgroundColor:"white"}}
                                label="Nod" 
                                type="number"
                                InputLabelProps={{shrink: true}}
                                value={blossom.roll}
                                inputProps={{
                                    min:-1.5,
                                    max:1.5, 
                                    step:0.1  
                                  }}
                                
                                size="small" 
                                onChange={(e)=>{   
                                    dispatch(updatePoint(k,{...point, blossom: {...blossom, roll: parseFloat(e.target.value)}}));
                                }}   
                            />
                        </Stack>
                        <Stack direction="row" spacing={8}>
                            <Typography width={10}>Tilt:</Typography> 
                            <Slider 
                                aria-label="Pitch" 
                                name="pitch" 
                                value={blossom.pitch}
                                min={-1.5} 
                                max={1.5} 
                                step={0.1} 
                                valueLabelDisplay="on" 
                                onChange={(e)=>{   
                                    dispatch(updatePoint(k,{...point, blossom: {...blossom, pitch: parseFloat(e.target.value)}}));
                                }}
                            />
                            <TextField 
                                sx={{maxWidth:"75px", backgroundColor:"white"}}
                                label="Tilt"
                                type="number"   
                                InputLabelProps={{shrink: true}}
                                value={blossom.pitch}
                                min={-1.5} 
                                max={1.5} 
                                step={0.1} 
                                size="small"
                                onChange={(e)=>{   
                                    dispatch(updatePoint(k,{...point, blossom: {...blossom, pitch: parseFloat(e.target.value)}}));
                                }}   
                            />
                        </Stack>
                        <Stack direction="row" spacing={8}>
                            <Typography width={10}>Turn:</Typography>
                            <Slider 
                                aria-label="Yaw" 
                                name="yaw" 
                                value={-blossom.yaw} 
                                min={-1.5} 
                                max={1.5} 
                                step={0.1} 
                                valueLabelDisplay="on" 
                                track="inverted"
                                onChange={(e)=>{   
                                    dispatch(updatePoint(k,{...point, blossom: {...blossom, yaw: parseFloat(-e.target.value)}}));
                                }} 
                            />
                            <TextField 
                                sx={{maxWidth:"75px", backgroundColor:"white"}}
                                label="Turn"
                                type="number"   
                                InputLabelProps={{shrink: true}}
                                value={-blossom.yaw}
                                min={-1.5} 
                                max={1.5} 
                                step={0.1} 
                                size="small"
                                onChange={(e)=>{   
                                    dispatch(updatePoint(k,{...point, blossom: {...blossom, yaw: parseFloat(-e.target.value)}}));
                                }}   
                            />
                        </Stack>
                        <Stack direction="row" spacing={8}>
                            <Typography width={10}>Height:</Typography>
                            <Slider 
                                aria-label="Height" 
                                name="height" 
                                value={blossom.height}
                                min={0} 
                                max={100} 
                                step={1} 
                                valueLabelDisplay="on" 
                                onChange={(e)=>{   
                                    dispatch(updatePoint(k,{...point, blossom: {...blossom, height: parseFloat(e.target.value)}}));
                                }} 
                            />
                            <TextField 
                                sx={{maxWidth:"75px", backgroundColor:"white"}}
                                label="Height"
                                type="number"   
                                InputLabelProps={{shrink: true}}
                                value={blossom.height}
                                size="small"
                                onChange={(e)=>{   
                                    dispatch(updatePoint(k,{...point, blossom: {...blossom, height: parseFloat(e.target.value)}}));
                                }}  
                            />
                        </Stack>
                    </Stack>
                        <Stack direction="row">
                            {/* <Typography variant="h6" style={{paddingRight:"8px", paddingTop: "5px"}}>P{k}</Typography>
                            <TextField 
                                sx={{maxWidth:"75px", backgroundColor:"white"}}
                                label="Nod" 
                                type="number"
                                InputLabelProps={{shrink: true}}
                                value={blossom.roll} 
                                size="small" 
                                onChange={(e)=>{   
                                    dispatch(updatePoint(k,{...point, blossom: {...blossom, roll: parseFloat(e.target.value)}}));
                                }}   
                            />
                            <TextField 
                                sx={{maxWidth:"75px", backgroundColor:"white"}}
                                label="Tilt"
                                type="number"   
                                InputLabelProps={{shrink: true}}
                                value={blossom.pitch}
                                size="small"
                                onChange={(e)=>{   
                                    dispatch(updatePoint(k,{...point, blossom: {...blossom, pitch: parseFloat(e.target.value)}}));
                                }}   
                            />
                            <TextField 
                                sx={{maxWidth:"75px", backgroundColor:"white"}}
                                label="Turn"
                                type="number"   
                                InputLabelProps={{shrink: true}}
                                value={blossom.yaw}
                                size="small"
                                onChange={(e)=>{   
                                    dispatch(updatePoint(k,{...point, blossom: {...blossom, yaw: parseFloat(e.target.value)}}));
                                }}   
                            />
                            <TextField 
                                sx={{maxWidth:"75px", backgroundColor:"white"}}
                                label="Height"
                                type="number"   
                                InputLabelProps={{shrink: true}}
                                value={blossom.height}
                                size="small"
                                onChange={(e)=>{   
                                    dispatch(updatePoint(k,{...point, blossom: {...blossom, height: parseFloat(e.target.value)}}));
                                }}  
                            /> */}
                            <TextField
                                sx={{maxWidth:"300px", backgroundColor:"white"}}
                                // multiline
                                label="Say"
                                type="text"
                                InputLabelProps={{shrink: true}}
                                value={blossom.speech ? blossom.speech : ""}
                                onChange={(e)=>{   
                                    dispatch(updatePoint(k,{...point, blossom: {...blossom, "speech": e.target.value}}));
                                }}   
                            />
                            {/*add a play button*/}
                            <IconButton onClick={play}>
                                <PlayCircleOutlineIcon/>
                            </IconButton>
                            
                        </Stack>
                    </CardContent>
                </Card> 
            </Stack>
}                
 