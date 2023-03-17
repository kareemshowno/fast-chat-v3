import { configureStore } from "@reduxjs/toolkit";


import userReducer from './userReducer/userSlice';
import chatsReducer from './chatsReducer/chatsSlice';
import conversationReducer from "./conversationReducer/conversationSlice";
import requestMessageReducer from './requestReducer/requestMSlice'


export const store = configureStore({
    reducer:{
        user:userReducer,
        chats:chatsReducer,
        conversation:conversationReducer,
        requestM:requestMessageReducer
    }
})