import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    requestMessage:null
};

export const requestMSlice = createSlice({
    name:"requestM",
    initialState,
    reducers:{
        updateRequestMessage: (state,action) => {
            state.requestMessage = action.payload
        }
    }
})

export const {updateRequestMessage} = requestMSlice.actions;
export default requestMSlice.reducer;