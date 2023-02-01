import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Stack, IconButton, Button, Typography, TextField} from '@mui/material';
import {PlayCircle, Stop, Cancel, ConstructionOutlined} from '@mui/icons-material';
import Popover from '@mui/material/Popover';
import {selectProjectList, selectProjectName, updateProjectList, updateProjectName} from './ProjectSlice';
import {listProjects, loadProject, saveProject} from '../robot/rosbridge';
import {setGestureState, selectGestureState} from '../gestureWidget/GestureSlice';
import ROSLIB from 'roslib';

export default function SaveProjectDialog(props){
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const gestureState = useSelector(selectGestureState);
    const projectName = useSelector(selectProjectName);
    const [saveName, setSaveName] = React.useState(projectName);
    const handleClick = (event) => {
        let request = new ROSLIB.ServiceRequest({});
        listProjects.callService(request, (result) => {
            let projects = ["watson"]
            if(result.names != undefined){
                projects = result.names;
            }
            return dispatch(updateProjectList(projects));
            
        }, (error) => {
            console.log("error",error);
        });
      setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
      setAnchorEl(null);
    };
  

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;



    return <React.Fragment>
                <Button aria-describedby={id} variant="outlined" onClick={handleClick}>
                Save Project
                </Button>
                <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                >
                <Typography sx={{ p: 2 }}>Save Project As:</Typography>
                <TextField 
                    id="save-project-name"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    fullWidth
                    />

                <Button 
                    variant="outlined"
                    onClick={(e) => {

                      let msg = new ROSLIB.Message({
                        data: JSON.stringify({"name": saveName, "state": gestureState})
                      });
                      saveProject.publish(msg)
                      dispatch(updateProjectName(saveName));
                      handleClose();
                    }}
                      
                  >
                    Save
                </Button>
                
                </Popover>
            </React.Fragment>
}
