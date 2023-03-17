import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    userFriend:null,
    conversationID:""
}

export const conversationSlice = createSlice({
    name:"conversation",
    initialState,
    reducers:{
        changeConv: (state,action) => {
            state.userFriend = action.payload;
        },
        updateConvID :(state,action) => {
                state.conversationID = action.payload
        }
    }
});

export const {changeConv,updateConvID} = conversationSlice.actions;
export default conversationSlice.reducer;