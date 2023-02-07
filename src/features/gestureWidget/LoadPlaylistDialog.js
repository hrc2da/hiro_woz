import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Stack, IconButton, Button, Typography, Select, MenuItem} from '@mui/material';
// import {FileOpenIcon} from '@mui/icons-material';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import Popover from '@mui/material/Popover';

import {selectPlaylistName, selectPlaylistStore, loadPlaylistFromStore} from '../gestureWidget/GestureSlice';

import ROSLIB from 'roslib';

export default function LoadPlaylistDialog(props){
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = React.useState(null);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleChange = (event) => {
        console.log("target",event.target.value);
        dispatch(loadPlaylistFromStore(event.target.value));
        props.resetPlaylist();
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const playlistStore = useSelector(selectPlaylistStore);
    const playlistList = Object.keys(playlistStore);

    const playlistName = useSelector(selectPlaylistName);

    return <React.Fragment>
                <Button aria-describedby={id} variant="contained" onClick={handleClick}>
                    <FileOpenIcon />
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
                <Typography sx={{ p: 2 }}>Choose a Playlist to Load:</Typography>
                <Select
                    fullWidth
                    value={playlistName}
                    onChange={handleChange}
                >
                    {playlistList.length == 0 && <MenuItem value={""}>No Playlists Found</MenuItem>}
                    {playlistList.map((p,k) => (
                        <MenuItem key={k} value={p}>{p}</MenuItem>
                    ))}
                </Select>
                
                </Popover>
            </React.Fragment>
}
