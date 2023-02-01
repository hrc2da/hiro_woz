import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFocusPoint, focusOnPoint, selectActiveGesture, updatePoint } from './GestureSlice';

export default function GesturePoint(props){
    const [radius, setRadius] = React.useState(8);
    const [clicked, setClicked] = React.useState(false);
    const focusPoint = useSelector(selectFocusPoint);
    const currentGesture = useSelector(selectActiveGesture);
    const dispatch = useDispatch();
    if(props.number == undefined){
        return <circle 
                    cx={props.x} 
                    cy={props.y} 
                    r={radius} 
                    fill="blue" 
                    onMouseEnter={props.disableInteractions ? undefined : ()=>setRadius(12)}
                    onMouseOut={props.disableInteractions ? undefined :()=>setRadius(8)} 
                    onContextMenu={props.disableInteractions ? undefined :(e)=>{
                        e.preventDefault();
                        props.handleClear();
                    }}
                />
    }
    else{
        return <React.Fragment>
                <text style={{pointerEvents:"none", userSElect: "none"}} x={props.x} y={props.y} fill="green"  fontSize="2em">{props.number}</text>
                <circle 
                    cx={props.x} 
                    cy={props.y} 
                    fill="#00ffae"  
                    r={focusPoint == props.number+"p" ? 12 : 8}
                    stroke="white"
                    strokeWidth={focusPoint == props.number+"p" ? 3 : 0}
                    onMouseEnter={props.disableInteractions ? undefined :()=> dispatch(focusOnPoint(props.number+"p"))}
                    onClick={props.disableInteractions ? undefined :()=>dispatch(focusOnPoint(-1))}  
                    onMouseDown={props.disableInteractions ? undefined :()=>{
                        console.log("mouse down",props.number)
                        props.handleClick();
                    }}
                    onMouseUp={props.disableInteractions ? undefined :()=>{
                        console.log("mouse up",props.number)
                        props.handleRelease();
                    }}
                    onMouseMove={props.disableInteractions ? undefined :(e)=>{
                            if(props.clickedPoint === props.number){
                                let x = e.nativeEvent.offsetX;
                                let y = e.nativeEvent.offsetY;
                                let point_obj = {...currentGesture.points[props.number], x: x, y: y}
                                dispatch(updatePoint( props.number, point_obj));
                            }
                        }  
                    }         
                />
            </React.Fragment>
    }
}