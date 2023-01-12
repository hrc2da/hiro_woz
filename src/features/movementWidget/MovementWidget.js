import * as React from 'react';
import ROSLIB from 'roslib';
import { useSelector, useDispatch } from 'react-redux';
import { selectTopViewCroppedb64, selectTopViewb64, selectEnable, updateMotorEnable } from '../robot/RobotSlice';
import { posePublisher, enablePublisher } from '../robot/rosbridge';
import { Paper, Stack, Slider, Accordion, AccordionSummary, AccordionDetails, Grid, Box, Input, Typography, Switch, FormGroup, FormControlLabel } from '@mui/material';
import { height } from '@mui/system';
import PlayControls from '../gui/PlayControls';
import GesturePoint from '../gestureWidget/GesturePoint';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


function valuetext(value) {
    return `${value}°C`;
  }
function preventHorizontalKeyboardNavigation(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
    }
}
function publishTarget(x,y,z,theta,max_x,max_y) {
    let target = {
        x: x/max_x,
        y: y/max_y,
        z: z,
        theta: theta
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
    const [target, setTarget] = React.useState(null);
    const [targetHeight, setTargetHeight] = React.useState(10);
    const [baseSpeed, setBaseSpeed] = React.useState(32);
    const [elbowSpeed, setElbowSpeed] = React.useState(32);
    const [shoulderSpeed, setShoulderSpeed] = React.useState(32);
    const [baseAttack, setBaseAttack] = React.useState(32);
    const [elbowAttack, setElbowAttack] = React.useState(32);
    const [shoulderAttack, setShoulderAttack] = React.useState(32);

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
    }
    const handlePlay = (e)=> {
        if (target[0].constructor !== Array){
            publishTarget(target[0],target[1],targetHeight,0.0,width,height);
            setTarget(null);
        }
        else{
            publishTarget(target[0][0],target[0][1],targetHeight,0.0,width,height);
            for(let i=1; i<target.length; i++){
                setTimeout(()=>{
                    publishTarget(target[i][0],target[i][1],targetHeight,0.0,width,height);
                }, i*1000);
            }
            setTarget(null);
        }
        
    }
    const topView = useSelector(selectTopViewb64)
    const width = props.width;

    const height = 0.75*width;
    // console.log("width:",width)
    // console.log("Topview:",topView)
    return <Paper>
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

                }}
                onContextMenu={(e)=>{
                    e.preventDefault();
                    let newTarget = [e.nativeEvent.offsetX,e.nativeEvent.offsetY];
                    //if there is currently a single target, delete it and replace it with a list
                    if(target == null || target[0].constructor !== Array){
                        setTarget([newTarget]);    
                    }
                    else{
                        setTarget([...target,newTarget]);
                    }
                    
                }} 
                />
                {topView.length > 0 && <image width="100%" height="100%" href={`data:image/jpeg;base64,${topView}`} />}
                {/* <circle cx={450} cy={400} r={20} fill="blue" /> */}
                {/* Draw a circle for each target */}
                {/* {target && target[0].constructor === Array && target.map((t,k)=><text key={k} x={t[0]} y={t[1]} fill="blue"  fontSize="2em">{k}</text>)}
                {target && target[0].constructor === Array && target.map((t,k)=><circle key={k} cx={t[0]} cy={t[1]} fill="blue"  r={8} />)}
                {target && target[0].constructor !== Array && <circle cx={target[0]} cy={target[1]} r={8} fill="red" />} */}
                {target && target[0].constructor === Array && target.map((t,k)=><GesturePoint key={k} x={t[0]} y={t[1]} number={k} />)}
                {target && target[0].constructor !== Array && <GesturePoint x={target[0]} y={target[1]} number={undefined} />}
                {/* <text x={450-5} y={400+5} fill="white">H</text> */}
                <line x1={crosshairs[0]} y1="0" x2={crosshairs[0]} y2={height} style={{strokeWidth:1, stroke:"black"}} />
                <line x1="0" y1={crosshairs[1]} x2={width} y2={crosshairs[1]} style={{strokeWidth:1, stroke:"black"}} />
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
                value={targetHeight}
                onChange={(e)=>setTargetHeight(e.target.value)}
            />

        </Stack>
            {/* normalize the x and y */}
        <Stack>
            <Stack direction="row" spacing={6}>
                <PlayControls handlePlay={handlePlay} handleClear={handleClearMotion}/>
                <FormGroup>
                    <FormControlLabel control={<Switch checked={motorEnableSelector} onChange={handleMotorEnable} />} label="Power" labelPlacement="start"/>
                </FormGroup>
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