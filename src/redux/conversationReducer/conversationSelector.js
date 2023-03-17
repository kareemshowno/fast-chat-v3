import { createDraftSafeSelector } from "@reduxjs/toolkit";

const selectConversation = state => state.conversation;

export const selectUserFriend = createDraftSafeSelector(
    [selectConversation],
    (conversation) => conversation.userFriend
)

export const selectConversationID = createDraftSafeSelector(
    [selectConversation],
    (conversation) => conversation.conversationID
)