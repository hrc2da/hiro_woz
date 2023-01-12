import * as React from 'react';

export default function GesturePoint(props){
    const [radius, setRadius] = React.useState(8);
    if(props.number == undefined){
        return <circle 
                    cx={props.x} 
                    cy={props.y} 
                    r={radius} 
                    fill="red" 
                    onMouseEnter={()=>setRadius(12)}
                    onMouseOut={()=>setRadius(8)} 
                />
    }
    else{
        return <React.Fragment>
                <text x={props.x} y={props.y} fill="green"  fontSize="2em">{props.number}</text>
                <circle 
                    cx={props.x} 
                    cy={props.y} 
                    fill="green"  
                    r={radius}
                    onMouseEnter={()=>setRadius(12)}
                    onMouseOut={()=>setRadius(8)}              
                />
            </React.Fragment>
    }
}