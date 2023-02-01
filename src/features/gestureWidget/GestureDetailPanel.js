import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Paper, Typography, Stack, Divider } from '@mui/material';
import { selectGestureList } from './GestureSlice';
import { selectMovementWidth } from '../gui/GuiSlice';
import useMeasure from 'react-use-measure'
import GesturePath from './GesturePath';
import GesturePoint from './GesturePoint';

export default function GestureDetailPanel(props){
    const gestureList = useSelector(selectGestureList);
    const gesture = gestureList[props.gesture];
    const movementWidth = useSelector(selectMovementWidth);
    const [ref, bounds] = useMeasure()
    console.log(bounds);
    const width = bounds.width;
    const height = 0.75*width;
    const movementHeight = movementWidth * 0.75;
    return <Paper ref={ref}>
            <Typography variant="h6">Name: {gesture.name}</Typography>
                
                <Typography>Description: {gesture.description}</Typography>
                <Typography>Speech: {gesture.points.map((p,k)=>{
                    return <span key={k}>{p.approach.speech + " " + "<P" + k + "> " + p.speech} </span>
                })}</Typography>
                <Divider />
                <svg
                    width={width}
                    height={height}
                >
                    {gesture.points.length > 1 && gesture.points.slice(1).map((p,k)=><GesturePath key={k+1} disableInteractions={true} colorOverride="black" x = {width*p.x/movementWidth} y={height*p.y/movementHeight} prevx={width*gesture.points[k].x/movementWidth} prevy={height*gesture.points[k].y/movementHeight} number={k+1} />)}
                    {gesture.points.length > 0 && gesture.points.map((p,k)=><GesturePoint key={k} disableInteractions={true} x={width*p.x/movementWidth} y={height*p.y/movementHeight} number={k} />)}
                </svg>
        </Paper>   
}

