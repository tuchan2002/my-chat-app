export const getRecipientEmail = (conversationUsers, loggedInUser) => {
    return conversationUsers.find(
        (userEmail) => userEmail !== loggedInUser.email
    );
};
