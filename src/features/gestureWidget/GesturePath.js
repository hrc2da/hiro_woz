import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFocusPoint, focusOnPoint } from './GestureSlice';

export default function GesturePath(props){
    const [strokeWidth, setStrokeWidth] = React.useState(4);
    const [strokeColor, setStrokeColor] = React.useState("white");
    const focusPoint = useSelector(selectFocusPoint);
    const dispatch = useDispatch();
        return <line 
                    x1={props.prevx} 
                    y1={props.prevy}
                    x2={props.x}
                    y2={props.y} 
                    stroke={props.colorOverride ? props.colorOverride :focusPoint == props.number+"e" ? "black" : "white"}
                    strokeWidth={focusPoint == props.number+"e" ? 8 : 4}
                    strokeDasharray={(5,5)}  
                    
                    onMouseOver={props.disableInteractions? undefined : ()=>{
                        dispatch(focusOnPoint(props.number+"e"));
                    }}
                    onMouseOut={props.disableInteractions? undefined: ()=>{
                        dispatch(focusOnPoint(-1));
                    }}              
                />

}