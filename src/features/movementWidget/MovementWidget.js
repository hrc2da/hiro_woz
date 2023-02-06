import * as React from 'react';
import ROSLIB from 'roslib';
import { useSelector, useDispatch } from 'react-redux';
import { selectTopViewCroppedb64, selectTopViewb64, selectEnable, updateMotorEnable } from '../robot/RobotSlice';
import { posePublisher, enablePublisher } from '../robot/rosbridge';
import { Paper, Stack, Button, IconButton, TextField, Slider, Accordion, AccordionSummary, AccordionDetails, Grid, Box, Input, Typography, Switch, FormGroup, FormControlLabel } from '@mui/material';
import { height } from '@mui/system';
import PlayControls from '../gui/PlayControls';
import GesturePoint from '../gestureWidget/GesturePoint';
import GesturePath from '../gestureWidget/GesturePath';
import { addNewGesture, clearPoints, appendPoint, updatePoint, setGestureDummy, selectActiveGesture, selectFocusPoint } from '../gestureWidget/GestureSlice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import {selectMovementWidth} from '../gui/GuiSlice';
import { CommitSharp } from '@mui/icons-material';


function valuetext(value) {
    return `${value}°C`;
  }
function preventHorizontalKeyboardNavigation(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
    }
}
// function publishTarget(x,y,z,theta,max_x,max_y) {
    // max_x is width and max_y is height
//     let target = {
//         x: x/max_x,
//         y: y/max_y,
//         z: z,
//         theta: theta
//     }
//     let msg = new ROSLIB.Message({data:JSON.stringify(target)})
//     posePublisher.publish(msg)
// }
function publishPxTarget(x,y,z,theta,rail) {
    //sending px targets
    let target = {
        x: x,
        y: y,
        z: z,
        theta: theta,
        rail: rail
    }
    let msg = new ROSLIB.Message({data:JSON.stringify(target)})
    posePublisher.publish(msg)
}
export default function MovementWidget(props){

    const motorEnableSelector = useSelector(selectEnable);
    const dispatch = useDispatch();
    const handleMotorEnable = (event) =>{
        let motors = ['swing','shoulder','elbow']
        for(let i=0; i<motors.length; i++){
            let msg = new ROSLIB.Message({data:JSON.stringify({motor_name:motors[i],torque_enable:event.target.checked})});
            enablePublisher.publish(msg);
        }
        dispatch(updateMotorEnable(event.target.checked));
    }
    
    const [crosshairs, setCrosshairs] = React.useState([100,100]);
    const [clickedPoint, setClickedPoint] = React.useState(null);
    const [target, setTarget] = React.useState(null);
    const [targetHeight, setTargetHeight] = React.useState(10);
    const [targetRail, setTargetRail] = React.useState(50);
    const [baseSpeed, setBaseSpeed] = React.useState(32);
    const [elbowSpeed, setElbowSpeed] = React.useState(32);
    const [shoulderSpeed, setShoulderSpeed] = React.useState(32);
    const [baseAttack, setBaseAttack] = React.useState(32);
    const [elbowAttack, setElbowAttack] = React.useState(32);
    const [shoulderAttack, setShoulderAttack] = React.useState(32);
    const [showSaveDialog, setShowSaveDialog] = React.useState(false);

    const handleSliderChange = (event, newValue, setter) => {
        setter(newValue);
    };
    const handleInputChange = (event, setter) => {
        setter(event.target.value === '' ? '' : Number(event.target.value));
    };
    const handleBlur = () => {
        if (value < 0) {
          setValue(0);
        } else if (value > 100) {
          setValue(100);
        }
      };   
    const handleClearMotion = (e) => {
        setTarget(null);
        dispatch(clearPoints());
    }
    const handlePlay = (e)=> {
        console.log("got a play command")
        if (target[0].constructor !== Array){
            publishPxTarget(target[0],target[1],targetHeight,0.0,targetRail);
            setTarget(null);
        }
        else{
            publishPxTarget(target[0][0],target[0][1],targetHeight,0.0,targetRail);
            for(let i=1; i<target.length; i++){
                setTimeout(()=>{
                    publishPxTarget(target[i][0],target[i][1],targetHeight,0.0,targetRail);
                }, i*1000);
            }
            setTarget(null);
        }
        
    }
    const topView = useSelector(selectTopViewb64);
    const activeGesture = useSelector(selectActiveGesture);
    const focusPoint = useSelector(selectFocusPoint);
    const width = useSelector(selectMovementWidth);


    const handleUpdateRail = (value) => {
        if(focusPoint == -1 || focusPoint == undefined){
            //we're updating the targetPoint
            setTargetRail(value);
        }
        else{
            let point = activeGesture.points[parseInt(focusPoint.slice(0,-1))];
            dispatch(updatePoint(focusPoint.slice(0,-1),{...point,"rail":value}))
        }
    }

    const handleUpdateHeight = (value) =>{
        if(focusPoint == -1 || focusPoint == undefined){
            //we're updating the targetPoint
            setTargetHeight(value);
        }
        else{
            let point = activeGesture.points[parseInt(focusPoint.slice(0,-1))];
            dispatch(updatePoint(focusPoint.slice(0,-1),{...point,"z":value}))
        }

    }
    const height = 0.75*width;
    // console.log("width:",width)
    // console.log("Topview:",topView)
    return <Paper style={{userSelect: "none"}}>
        <Stack direction="row" sx={{ height: height }} spacing={2}>
            <svg 
                width={width} 
                height={height}
                onMouseMove={(e)=>{
                    let crosshairs = [e.nativeEvent.offsetX,e.nativeEvent.offsetY];
                    // setCrosshairs(crosshairs);
                }}
                
                

            >
                <rect width="100%" height="100%" style={{fill:"white",strokeWidth:3, stroke:"black"}} 
                   onClick={(e)=>{
                    let newTarget = [e.nativeEvent.offsetX,e.nativeEvent.offsetY];
                    setTarget(newTarget);
                    setTargetRail(newTarget[0]);
                    // dispatch(setGestureDummy(8));
                    console.log("hfsdfadfasdfasdfasdfdfai",newTarget[0]);
                    }}
                    onContextMenu={(e)=>{
                        e.preventDefault();
                        let newTarget = [e.nativeEvent.offsetX,e.nativeEvent.offsetY,targetHeight];
                        //if there is currently a single target, delete it and replace it with a list
                        // if(target == null || target[0].constructor !== Array){
                        //     setTarget([newTarget]);    
                        // }
                        // else{
                        //     setTarget([...target,newTarget]);
                        // }
                        dispatch(appendPoint(newTarget));
                        
                    }}
                    onMouseUp={(e)=>{setClickedPoint(null)}} 
                />
                
                {topView.length > 0 && <image 
                        width="100%" 
                        height="100%" 
                        href={`data:image/jpeg;base64,${topView}`}
                        onClick={(e)=>{
                            let newTarget = [e.nativeEvent.offsetX,e.nativeEvent.offsetY];
                            setTarget(newTarget);
                            setTargetRail(newTarget[0]);
                            // dispatch(setGestureDummy(8));
                            console.log("hfsdfadfasdfasdfasdfdfai",newTarget[0]);
        
                            }}
                            onContextMenu={(e)=>{
                                e.preventDefault();
                                let newTarget = [e.nativeEvent.offsetX,e.nativeEvent.offsetY,targetHeight];
                                //if there is currently a single target, delete it and replace it with a list
                                // if(target == null || target[0].constructor !== Array){
                                //     setTarget([newTarget]);    
                                // }
                                // else{
                                //     setTarget([...target,newTarget]);
                                // }
                                dispatch(appendPoint(newTarget));
                                
                            }}
                            onMouseUp={(e)=>{setClickedPoint(null)}} 
                />}
                
                {/* <circle cx={450} cy={400} r={20} fill="blue" /> */}
                {/* Draw a circle for each target */}
                {/* {target && target[0].constructor === Array && target.map((t,k)=><text key={k} x={t[0]} y={t[1]} fill="blue"  fontSize="2em">{k}</text>)}
                {target && target[0].constructor === Array && target.map((t,k)=><circle key={k} cx={t[0]} cy={t[1]} fill="blue"  r={8} />)}
                {target && target[0].constructor !== Array && <circle cx={target[0]} cy={target[1]} r={8} fill="red" />} */}
                {/* {target && target[0].constructor === Array && target.map((t,k)=><GesturePoint key={k} x={t[0]} y={t[1]} number={k} />)} */}
                {/*edges of the gesture*/}
                {activeGesture.points.length > 1 && activeGesture.points.slice(1).map((p,k)=><GesturePath key={k+1} colorOverride="black" x = {p.x} y={p.y} prevx={activeGesture.points[k].x} prevy={activeGesture.points[k].y} number={k+1} />)}
                {/*points of the gesture*/}
                {activeGesture.points.length > 0 && activeGesture.points.map((p,k)=><GesturePoint clickedPoint = {clickedPoint} handleClick={()=>setClickedPoint(k)} handleRelease={()=>setClickedPoint(null)} key={k} x={p.x} y={p.y} number={k} />)}
                
                {target && target[0].constructor !== Array && <GesturePoint x={target[0]} y={target[1]} handleClear={()=>setTarget(null)} number={undefined} />}
                {/* <text x={450-5} y={400+5} fill="white">H</text> */}
                {/* <line x1={crosshairs[0]} y1="0" x2={crosshairs[0]} y2={height} style={{strokeWidth:1, stroke:"black"}} /> */}
                {/* <line x1="0" y1={crosshairs[1]} x2={width} y2={crosshairs[1]} style={{strokeWidth:1, stroke:"black"}} /> */}
            </svg>
            <Slider
                sx={{
                    '& input[type="range"]': {
                      WebkitAppearance: 'slider-vertical',
                    },
                  }}
                aria-label="Height"
                orientation="vertical"
                getAriaValueText={valuetext}
                min={-50}
                max={80}
                step={1}
                marks
                valueLabelDisplay="on"
                value={focusPoint && activeGesture.points && focusPoint != -1 && parseInt(focusPoint.slice(0,-1)) <= activeGesture.points.length ? activeGesture.points[parseInt(focusPoint.slice(0,-1))].z : targetHeight}
                onChange={(e)=>handleUpdateHeight(e.target.value)}
            />

        </Stack>
            {/* normalize the x and y */}
        <Stack>
            <Stack direction="row">
                <Slider sx ={{width:"540px", marginLeft:"55px"}}
                    value={focusPoint && activeGesture.points && focusPoint != -1 && parseInt(focusPoint.slice(0,-1)) <= activeGesture.points.length ? activeGesture.points[parseInt(focusPoint.slice(0,-1))].rail : targetRail}
                    min = {50}
                    max = {590}
                    onChange={(e)=>handleUpdateRail(e.target.value)}
                />
                <Button>ON</Button>
            </Stack>
            
            <Stack direction="row" spacing={6}>
                <PlayControls handlePlay={handlePlay} handleClear={handleClearMotion}/>
                <FormGroup>
                    <FormControlLabel control={<Switch checked={motorEnableSelector} onChange={handleMotorEnable} />} label="Power" labelPlacement="start"/>
                </FormGroup>
                <Button variant="outlined" endIcon={<ArrowRightAltIcon /> } onClick={()=>setShowSaveDialog(true)}>Save Gesture</Button>
                {showSaveDialog && <Stack direction="row">
                    <TextField id="save-name" label="Name" variant="outlined" />
                    <IconButton aria-label="save" onClick = { ()=>{
                            let newGesture = {...activeGesture};
                            newGesture.save_name = document.getElementById("save-name").value;   
                            dispatch(addNewGesture(newGesture));
                        }}>
                        <SaveIcon />
                    </IconButton>
                    <IconButton aria-label="cancel" onClick={()=>setShowSaveDialog(false)}>
                        <CancelIcon />
                    </IconButton>
                </Stack>}
            </Stack>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="motor-control-panel"
                    id="motor-control-header"
                >
                    Motor Controls
                </AccordionSummary>
                <AccordionDetails>
                    <Stack direction="row">
                        <Box sx={{ width: 250 }}>
                            <Typography id="input-slider" gutterBottom>
                                Base
                            </Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    Speed
                                </Grid>
                                <Grid item xs>
                                <Slider
                                    value={typeof baseSpeed === 'number' ? baseSpeed : 0}
                                    onChange={(e,v) => handleSliderChange(e,v,setBaseSpeed)}
                                    aria-labelledby="input-slider"
                                    min={0}
                                    max={128}
                                    step={1}
                                />
                                </Grid>
                                <Grid item>
                                <Input
                                    value={baseSpeed}
                                    size="small"
                                    onChange={(e) => handleInputChange(e,setBaseSpeed)}
                                    onBlur={handleBlur}
                                    inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: 128,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                    }}
                                />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    Attack
                                </Grid>
                                <Grid item xs>
                                <Slider
                                    value={typeof baseAttack === 'number' ? baseAttack : 0}
                                    onChange={(e,v) => handleSliderChange(e,v,setBaseAttack)}
                                    aria-labelledby="input-slider"
                                    min={0}
                                    max={128}
                                    step={1}
                                />
                                </Grid>
                                <Grid item>
                                <Input
                                    value={baseAttack}
                                    size="small"
                                    onChange={(e) => handleInputChange(e,setBaseAttack)}
                                    onBlur={handleBlur}
                                    inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: 128,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                    }}
                                />
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{ width: 250 }}>
                            <Typography id="input-slider" gutterBottom>
                                Shoulder
                            </Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    Speed
                                </Grid>
                                <Grid item xs>
                                <Slider
                                    value={typeof shoulderSpeed === 'number' ? shoulderSpeed : 0}
                                    onChange={(e,v) => handleSliderChange(e,v,setShoulderSpeed)}
                                    aria-labelledby="input-slider"
                                    min={0}
                                    max={128}
                                    step={1}
                                />
                                </Grid>
                                <Grid item>
                                <Input
                                    value={shoulderSpeed}
                                    size="small"
                                    onChange={(e) => handleInputChange(e,setShoulderSpeed)}
                                    onBlur={handleBlur}
                                    inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: 128,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                    }}
                                />
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{ width: 250 }}>
                            <Typography id="input-slider" gutterBottom>
                                Elbow
                            </Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    Speed
                                </Grid>
                                <Grid item xs>
                                <Slider
                                    value={typeof elbowSpeed === 'number' ? elbowSpeed : 0}
                                    onChange={(e,v) => handleSliderChange(e,v,setElbowSpeed)}
                                    aria-labelledby="input-slider"
                                    min={0}
                                    max={128}
                                    step={1}
                                />
                                </Grid>
                                <Grid item>
                                <Input
                                    value={elbowSpeed}
                                    size="small"
                                    onChange={(e) => handleInputChange(e,setElbowSpeed)}
                                    onBlur={handleBlur}
                                    inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: 128,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                    }}
                                />
                                </Grid>
                            </Grid>
                        </Box>
                    </Stack>
                </AccordionDetails>



            </Accordion>
            
        </Stack>
            
        </Paper>
}