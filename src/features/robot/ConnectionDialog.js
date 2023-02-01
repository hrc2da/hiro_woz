import * as React from 'react';
import { IconButton, Paper, Card, Stack, TextField, Typography } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import {setupRosBridge, closeRosBridge, 
        setupVidBridge, closeVidBridge, 
        setupRosBridges, closeRosBridges} from './rosbridge';
import {selectRosBridgeStatus, selectRosBridgeError, 
    selectVidBridgeStatus, selectVidBridgeError } from './RobotSlice';
import {useSelector, useDispatch} from 'react-redux';


export default function ConnectionDialog(props) {
    const [ip, setIp] = React.useState('192.168.1.81');
    const [rosPort, setRosPort] = React.useState('9090');
    const [vidPort, setVidPort] = React.useState('8080');
    const rosBridgeStatus = useSelector(selectRosBridgeStatus);
    const rosBridgeError = useSelector(selectRosBridgeError);
    const vidBridgeStatus = useSelector(selectVidBridgeStatus);
    const vidBridgeError = useSelector(selectVidBridgeError);
    const dispatch = useDispatch();
    const handleConnect = (bridge) => {
        if (bridge == 'ros') {
            setupRosBridge(`ws://${ip}`, dispatch, rosPort);
        }
        else if (bridge == 'vid') {
            setupVidBridge(`ws://${ip}`, dispatch, vidPort);
        }
        else { // both
            setupRosBridges(`ws://${ip}`, dispatch, rosPort, vidPort);
        }
    }
    const handleDisconnect = (bridge) => {
        if (bridge == 'ros') {
            closeRosBridge();
        }
        else if (bridge == 'vid') {
            closeVidBridge();
        }
        else { // both
            closeRosBridges();
        }
    }
    const handleIpChange = (e) => {
        setIp(e.target.value);
    }
    const handleRosPortChange = (e) => {
        setRosPort(e.target.value);
    }
    const handleVidPortChange = (e) => {
        setVidPort(e.target.value);
    }
    
    return <Stack direction="row">
        
        <TextField disabled={rosBridgeStatus || vidBridgeStatus} label="host" value={ip} onChange={handleIpChange}/>
        <Paper elevation={2}>
        {rosBridgeStatus == false && <IconButton
                                        style={{color:"green"}}
                                        onClick={(e)=>handleConnect('ros')}
                                    >
                                        <PowerSettingsNewIcon />
                                    </IconButton>
        }
        {rosBridgeStatus == true && <IconButton
                                        style={{color:"darkred"}}
                                        onClick = {(e)=>handleDisconnect('ros')}
                                    >
                                        <PowerOffIcon />
                                    </IconButton>
        }
        <TextField disabled={rosBridgeStatus} variant="outlined" margin="none" size="small" style={{width:70}} label="ros port" value={rosPort} onChange={handleRosPortChange}/>
        </Paper>
        <Paper elevation={2}>
        {vidBridgeStatus == false && <IconButton
                                        style={{color:"green"}}
                                        onClick={(e)=>handleConnect('vid')}
                                    >
                                        <PowerSettingsNewIcon />
                                    </IconButton>
        }
        {vidBridgeStatus == true && <IconButton
                                        style={{color:"darkred"}}
                                        onClick = {(e)=>handleDisconnect('vid')}
                                    >
                                        <PowerOffIcon />
                                    </IconButton>
                                    
        }
        <TextField disabled={vidBridgeStatus} margin="none" size="small" style={{width:70}} label="vid port" value={vidPort} onChange={handleVidPortChange}/>
        </Paper>
    </Stack>
}