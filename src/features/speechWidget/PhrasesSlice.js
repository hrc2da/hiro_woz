import { createSlice } from "@reduxjs/toolkit";

const phrasesSlice = createSlice({
    name:  'phrases',
    initialState: [],
    reducers: {
        addPhrase: (state, action) => {
            state.push(action.payload);
        },
        deletePhrase: (state, action) => {
            state.splice(action.payload,1);
        },
        setPhrases: (state, action) => action.payload
    }
});

export default phrasesSlice;

export const selectPhrases = (state) => state.phrases;
const {addPhrase, deletePhrase, setPhrases} = phrasesSlice.actions;

export function addToPhraseList(phrase){
    return dispatch => {
        dispatch(addPhrase(phrase));
    }
}
export function removeFromPhraseList(phrase){
    return dispatch => {
        dispatch(deletePhrase(phrase));
    }
}
export function setPhraseList(phrases){
    return dispatch => {
        dispatch(setPhrases(phrases));
    }
}