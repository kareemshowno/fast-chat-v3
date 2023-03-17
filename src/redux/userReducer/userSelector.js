import { createDraftSafeSelector } from "@reduxjs/toolkit";

const selectUser = state => state.user;

export const selectCurrentUser = createDraftSafeSelector(
    [selectUser],
    (user) => user.currentUser
)