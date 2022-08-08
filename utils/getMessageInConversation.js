import { collection, orderBy, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const generateQueryGetMessages = (conversationId) => {
    return query(
        collection(db, "messages"),
        where("conversation_id", "==", conversationId),
        orderBy("sent_at", "asc")
    );
};

export const transformMessage = (messageDoc) => {
    return {
        id: messageDoc.id,
        ...messageDoc.data(), // conversation_id, text, sent_at, user
        sent_at: messageDoc.data().sent_at
            ? convertFirestoreTimestampToString(messageDoc.data().sent_at)
            : null,
    };
};

export const convertFirestoreTimestampToString = (timestamp) => {
    return new Date(timestamp.toDate().getTime()).toLocaleString();
};
