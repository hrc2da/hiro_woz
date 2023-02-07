import * as React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import {Paper, Stack, Grid, IconButton} from '@mui/material';
import SpeechWidget from '../speechWidget/SpeechWidget';
import MovementWidget from '../movementWidget/MovementWidget';
import GestureWidget from '../gestureWidget/GestureWidget';
import DangerousIcon from '@mui/icons-material/Dangerous';

export default function ControlView(props) {
    const ref = React.useRef(null);
    const [movementWidth, setMovementWidth] = React.useState(640);
    // React.useEffect(() => {
    //     setMovementWidth(0.9*ref.current.offsetWidth);
    //   }, []);
    return <Grid container spacing={2}>
        <Grid ref={ref} item xs={7}>
            <MovementWidget width={movementWidth} />  
        </Grid>
        <Grid item xs={5}>
            <Stack direction="column" spacing={2}>
                {/* <IconButton
                    
                >
                    <DangerousIcon 
                        style={{width:"100px", height:"100px", padding: "0px", color: "red"}}
                    />
                </IconButton> */}
                <GestureWidget />
                <SpeechWidget />
                
            </Stack>
        </Grid>
        
    </Grid>
        
}