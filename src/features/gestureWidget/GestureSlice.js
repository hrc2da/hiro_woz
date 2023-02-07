import { NoEncryption } from '@mui/icons-material';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const gestureSlice = createSlice({
    name:  'gesture',
    initialState: {
        'activeGesture': {"uid": 0, "name": undefined, "description": undefined, "points":[]},
        'pointIndex': -1,
        'gestures': [],
        'playlist': [],
        'playlistStore': {},
        'playlistName': undefined,
        'uidCounter': 0,
        'selectedLibraryGesture': 0,
        'dummy': 5
    },
    reducers: {
        setState : (state, action) => {
            state.uidCounter = action.payload.uidCounter
            state.gestures = action.payload.gestures
            state.playlist = action.payload.playlist
            state.playlistStore = action.payload.playlistStore
            state.playlistName = action.payload.playlistName
            state.selectedLibraryGesture = action.payload.selectedLibraryGesture
            state.activeGesture = action.payload.activeGesture
            state.pointIndex = action.payload.pointIndex
            state.dummy = action.payload.dummy
        },
        incrementUID: (state) => {
            state.uidCounter += 1
        },
        setActiveGesture: (state, action) => {
            state.activeGesture = action.payload
        },
        setFocusPoint: (state, action) => {
            state.focusPoint = action.payload
        },
        setSelectedLibraryGesture: (state, action) => {
            state.selectedLibraryGesture = action.payload
        },
        addActivePoint: (state, action) => {
            let new_point = {
                x: action.payload[0],
                y: action.payload[1],
                z: action.payload[2],
                rail: action.payload[0],
                approach: {
                    speed: -1,
                    duration: -1,
                    speech: -1
                },
                pause: 0,
                speech: undefined
            }
            state.activeGesture.points = [...state.activeGesture.points, new_point]
        },
        removeActivePoint: (state, action) => {
            let indexToRemove = action.payload
            let new_points = []
            for (let i = 0; i < state.activeGesture.points.length; i++) {
                if (i === indexToRemove) {
                    continue
                } else {
                    new_points.push(state.activeGesture.points[i])
                }
            }
            state.activeGesture.points = new_points
        },
        reorderPoints: (state, action) => {
            let new_points = []
            let indexToMove = action.payload.indexToMove
            let newIndex = action.payload.newIndex
            let points = state.activeGesture.points
            if (indexToMove < newIndex) {
                for (let i = 0; i < points.length; i++) {
                    if (i === indexToMove) {
                        continue
                    } else if (i === newIndex) {
                        new_points.push(points[i])
                        new_points.push(points[indexToMove])
                        
                    } else {
                        new_points.push(points[i])
                    }
                }   
            } else {
                for (let i = 0; i < points.length; i++) {
                    if (i === indexToMove) {
                        continue
                    } else if (i === newIndex) {
                        new_points.push(points[indexToMove])
                        new_points.push(points[i])
                        
                    } else {
                        new_points.push(points[i])
                    }
                }
            }
            state.activeGesture.points = new_points
        },
        updateActivePoint: (state, action) => {
            let point_id = action.payload.id;
            if (point_id < state.activeGesture.points.length) {
                state.activeGesture.points[point_id] = action.payload.point
            }
        },
        updateActivePointApproach: (state, action) => {
            let point_id = action.payload.id;
            if (point_id < state.activeGesture.points.length) {
                state.activeGesture.points[point_id].approach = action.payload.approach;
            }
        },
        clearActiveGesture: (state) => {
            state.activeGesture = {"id": 0, "name": undefined, "description": undefined, "points":[],"edges":[]}
        },
        addGesture: (state, action) => {
            let curMaxId = 0;
            for(let i=0; i<state.gestures.length; i++) {
                if (state.gestures[i].uid > curMaxId) {
                    curMaxId = state.gestures[i].uid
                }
            }
            
            let new_gesture = {
                "uid": curMaxId+1,
                "name": action.payload.save_name,
                "description": action.payload.description ? action.payload.description : undefined,
                "points": action.payload.points,
            }
            state.gestures = [...state.gestures, new_gesture]
        },
        updateGesture: (state, action) => {
            let gesture_index = action.payload.index;
            let gesture = action.payload.gesture;
            state.gestures[gesture_index] = gesture;
        },

        addToPlaylist: (state, action) => {
            state.playlist = [...state.playlist, action.payload]
        },
        removeFromPlaylist: (state, action) => {
            let indexToRemove = action.payload
            let new_playlist = []
            let playlist = state.playlist
            for (let i = 0; i < playlist.length; i++) {
                if (i === indexToRemove) {
                    continue
                } else {
                    new_playlist.push(playlist[i])
                }
            }
            state.playlist = new_playlist
        },
        reorderPlaylist: (state, action) => {
            let new_playlist = []
            let indexToMove = action.payload.indexToMove
            let newIndex = action.payload.newIndex
            let playlist = state.playlist
            if (indexToMove < newIndex) {
                for (let i = 0; i < playlist.length; i++) {
                    if (i === indexToMove) {
                        continue
                    } else if (i === newIndex) {
                        new_playlist.push(playlist[i])
                        new_playlist.push(playlist[indexToMove])

                    } else {
                        new_playlist.push(playlist[i])
                    }
                }
            } else {
                for (let i = 0; i < playlist.length; i++) {
                    if (i === indexToMove) {
                        continue
                    } else if (i === newIndex) {
                        new_playlist.push(playlist[indexToMove])
                        new_playlist.push(playlist[i])

                    } else {
                        new_playlist.push(playlist[i])
                    }
                }
            }
            state.playlist = new_playlist
        },
        setPlaylistName: (state, action) => {
            state.playlistName = action.payload
        },
        clearPlaylist: (state) => {
            state.playlist = []
            state.playlistName = undefined
        },
        loadPlaylist: (state, action) => {
            state.playlist = state.playlistStore[action.payload]
            state.playlistName = action.payload
        },
        addPlaylistToStore: (state, action) => {
            state.playlistStore[action.payload.name] = action.payload.playlist;
        },
        setDummy: (state, action) => {
           state.dummy = action.payload
        }
    }
  });

export default gestureSlice;

export const selectActiveGesture = (state) => state.gesture.activeGesture;
export const selectGestureList = (state) => state.gesture.gestures;
export const selectFocusPoint = (state) => state.gesture.focusPoint;
export const selectPlaylistGestures = (state) => state.gesture.playlist;
export const selectSelectedLibraryGesture = (state) => state.gesture.selectedLibraryGesture;
export const selectPlaylistName = (state) => state.gesture.playlistName;
export const selectGestureState = (state) => state.gesture;
export const selectPlaylistStore = (state) => state.gesture.playlistStore;
const { setState, setActiveGesture, setFocusPoint, addActivePoint, removeActivePoint,
        updateActivePoint, updateActivePointApproach, reorderPoints, clearActiveGesture, 
        addGesture, updateGesture, addToPlaylist, removeFromPlaylist, reorderPlaylist,
        setSelectedLibraryGesture,setPlaylistName, addPlaylistToStore, clearPlaylist, loadPlaylist,
        setDummy } = gestureSlice.actions;



export function setGestureState(state) {
    console.log("setting gesture state")
    return dispatch => {
        dispatch(setState(state));
    }
}

export function chooseLibraryGesture(gesture) {
    return dispatch => {
        dispatch(setSelectedLibraryGesture(gesture));
    }
}
export function appendPoint(point) {
    console.log("appending point",point);
    console.log(addActivePoint(point));
    return dispatch => {
        dispatch(addActivePoint(point));
    }
}

export function removePoint(index) {
    return dispatch => {
        dispatch(removeActivePoint(index));
    }
}

export function updatePoint(id,point) {
    return dispatch => {
        dispatch(updateActivePoint({
            id:id,
            point:point
        }));
    }
}

export function updatePointApproach(id,approach) {
    return dispatch => {
        dispatch(updateActivePointApproach({
            id:id,
            approach: approach
        }));
    }
}

export function clearPoints() {
    return dispatch => {
        dispatch(clearActiveGesture());
    }
}


export function setGestureDummy(val) {
    console.log("setting dummy",val);
    return dispatch => {
        dispatch(setDummy(val));
    }
}

export function addNewGesture(gesture) {

    return dispatch => {
      dispatch(addGesture(gesture));
    }
}

export function replaceGesture(index,gesture) {
    return dispatch => {
        dispatch(updateGesture({
            index:index,
            gesture:gesture
        }));
    }
}

export function activateGesture(gesture) {
    return dispatch => {
        dispatch(setActiveGesture(gesture));
    }
}

export function focusOnPoint(pointIndex) {
    return dispatch => {
        dispatch(setFocusPoint(pointIndex));
    }
}

export function movePoint(indexToMove, newIndex) {
    return dispatch => {
        dispatch(reorderPoints({
            indexToMove: indexToMove,
            newIndex: newIndex
        }));
    }
}

export function updatePlaylistName(name) {
    return dispatch => {
        dispatch(setPlaylistName(name));
    }
}

export function savePlaylist(name,playlist) {
    return dispatch => {
        dispatch(addPlaylistToStore({
            name:name,
            playlist:playlist
        }));
    }
}

export function addGestureToPlaylist(gesture) {
    return dispatch => {
        dispatch(addToPlaylist(gesture));
    }
}

export function removeGestureFromPlaylist(index) {
    return dispatch => {
        dispatch(removeFromPlaylist(index));
    }
}

export function moveGestureInPlaylist(indexToMove, newIndex) {
    return dispatch => {
        dispatch(reorderPlaylist({
            indexToMove: indexToMove,
            newIndex: newIndex
        }));
    }
}

export function resetPlaylist() {
    return dispatch => {
        dispatch(clearPlaylist());
    }
}

export function loadPlaylistFromStore(name) {
    return dispatch => {
        dispatch(loadPlaylist(name));
    }
}