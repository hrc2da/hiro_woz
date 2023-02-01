import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Stack, IconButton, Button, Typography, Select, MenuItem} from '@mui/material';
import {PlayCircle, Stop, Cancel, ConstructionOutlined} from '@mui/icons-material';
import Popover from '@mui/material/Popover';
import {selectProjectList, selectProjectName, updateProjectList, updateProjectName} from './ProjectSlice';
import {setGestureState} from '../gestureWidget/GestureSlice';
import {listProjects, loadProject, saveProject} from '../robot/rosbridge';
import ROSLIB from 'roslib';

export default function LoadProjectDialog(props){
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const projectName = useSelector(selectProjectName);
  
    const handleClick = (event) => {
        let request = new ROSLIB.ServiceRequest({});
        console.log("getting project list")
        listProjects.callService(request, (result) => {
            let projects = []
            
            console.log("result",result)
            if(result.names != undefined){
                projects = result.names;
            }
            console.log("projects",projects)
            return dispatch(updateProjectList(projects));
        }, (error) => {
            console.log("error",error);
        });
      setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleChange = (event) => {
        let request = new ROSLIB.ServiceRequest({
            name: event.target.value
        });
        console.log("target",event.target.value)
        loadProject.callService(request, (result) => {
            console.log("result",result);
            dispatch(updateProjectName(event.target.value));
            handleClose();
            try{
                return dispatch(setGestureState(JSON.parse(result.json).state));
            }
            catch (e) {
                console.error(e);
            }
            
        });
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const projectList = useSelector(selectProjectList);

    return <React.Fragment>
                <Button aria-describedby={id} variant="contained" onClick={handleClick}>
                Load Project
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
                <Typography sx={{ p: 2 }}>Choose a Project to Load:</Typography>
                <Select
                    fullWidth
                    value={projectName}
                    onChange={handleChange}
                >
                    {projectList.length == 0 && <MenuItem value={""}>No Projects Found</MenuItem>}
                    {projectList.map((project,k) => (
                        <MenuItem key={k} value={project}>{project}</MenuItem>
                    ))}
                </Select>
                
                </Popover>
            </React.Fragment>
}
