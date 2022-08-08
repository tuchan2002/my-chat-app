import { collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../config/firebase";
import { getRecipientEmail } from "../utils/getRecipientEmail";

export const useRecipient = (conversationUsers) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth);

    // get recipient email
    const recipientEmail = getRecipientEmail(conversationUsers, loggedInUser);

    // get recipient avatar
    const queryGetRecipient = query(
        collection(db, "users"),
        where("email", "==", recipientEmail)
    );
    const [recipientsSnapshot, __loading, __error] =
        useCollection(queryGetRecipient);

    // recipientsSnapshot.docs could be an empty array
    const recipient =
        recipientsSnapshot &&
        recipientsSnapshot.docs[0] &&
        recipientsSnapshot.docs[0].data();
    console.log("RECIPIENT", recipient);

    return {
        recipient,
        recipientEmail,
    };
};
