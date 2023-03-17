import { createDraftSafeSelector } from "@reduxjs/toolkit";

const selectchat = (state) => state.chats;

export const selectChats = createDraftSafeSelector(
    [selectchat],
    (chats) =>  chats.chats ? Object.entries(chats.chats).sort((a,b) => b[1].date - a[1].date) : []
        
)