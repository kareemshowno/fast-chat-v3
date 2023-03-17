import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats:null
}

export const chatsSlice = createSlice({
    name:"chats",
    initialState,
    reducers:{
        updateChats:(state,action) => {
            state.chats = action.payload
        }
    }
})

export const {updateChats} = chatsSlice.actions;
export default chatsSlice.reducer