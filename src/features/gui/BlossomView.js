import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTopViewb64 } from '../robot/RobotSlice';
import SpeechWidget from '../speechWidget/SpeechWidget';
import MovementWidget from '../movementWidget/MovementWidget';
import GestureWidget from '../gestureWidget/GestureWidget';
import BlossomWidget from '../blossomWidget/BlossomWidget';
import {Paper, Stack, Grid, IconButton} from '@mui/material';


function BlossomView(props) {
    const topView = useSelector(selectTopViewb64)
    const ref = React.useRef(null);
    const [movementWidth, setMovementWidth] = React.useState(640);
    // return <img src={`data:image/jpeg;base64,${topView}`} />

    return <Grid container spacing={2}>
    <Grid ref={ref} item xs={7}>
        <BlossomWidget width={movementWidth} />  
    </Grid>
    <Grid item xs={5}>
        <Stack direction="column" spacing={2}>
            <GestureWidget robot="blossom" />
            <SpeechWidget />
            
        </Stack>
    </Grid>
    
</Grid>
}

export default BlossomView;