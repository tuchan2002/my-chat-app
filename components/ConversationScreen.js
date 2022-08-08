import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../config/firebase";
import { useRecipient } from "../hooks/useRecipient";
import {
    convertFirestoreTimestampToString,
    generateQueryGetMessages,
    transformMessage,
} from "../utils/getMessageInConversation";
import Message from "./Message";
import { BiSend } from "react-icons/bi";
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

const defaultIconSize = "1.75rem";
const ConversationScreen = ({ conversation, messages }) => {
    const [newMessage, setNewMessage] = useState("");
    const [loggedInUser, _loading, _error] = useAuthState(auth);

    const conversationUsers = conversation.users;

    const { recipient, recipientEmail } = useRecipient(conversationUsers);

    const router = useRouter();
    const conversationId = router.query.id; // localhost:3000/conversations/:id
    const queryGetMessages = generateQueryGetMessages(conversationId);
    const [messagesSnapshot, messagesLoading, __error] =
        useCollection(queryGetMessages);

    const showMessages = () => {
        // if FE is loading msgs behind the scenes, display msgs retrived from Next SSR (passed down from [id].js)
        if (messagesLoading) {
            return messages.map((message) => (
                <Message key={message.id} message={message} />
            ));
        }

        // if FE has finished loading msgs, so now we have messagesSnapshot
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <Message key={message.id} message={transformMessage(message)} />
            ));
        }
        return null;
    };

    const addMessageToDbAndUpdateLastSeen = async () => {
        // update last seen in 'users' collection
        await setDoc(
            doc(db, "users", loggedInUser.email),
            {
                lastSeen: serverTimestamp(),
            },
            { merge: true }
        ); // just update what is changed

        // add new message to 'messages' collection
        await addDoc(collection(db, "messages"), {
            conversation_id: conversationId,
            sent_at: serverTimestamp(),
            text: newMessage,
            user: loggedInUser.email,
        });

        // reset input field
        setNewMessage("");

        // scroll to bottom
        scrollToBottom();
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage) return;
        addMessageToDbAndUpdateLastSeen();
    };

    const endOfMessagesRef = useRef(null);
    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div>
            <header className="py-2 px-4 sticky top-0 z-100 border-b flex items-center gap-4 bg-white">
                <img
                    src={
                        recipient
                            ? recipient.photoURL
                            : "https://i.pinimg.com/564x/3c/ae/07/3cae079ca0b9e55ec6bfc1b358c9b1e2.jpg"
                    }
                    alt="avatar"
                    className="avt"
                />
                <div>
                    <h3>{recipientEmail}</h3>
                    {recipient && (
                        <span>
                            Last Active:{" "}
                            {convertFirestoreTimestampToString(
                                recipient.lastSeen
                            )}
                        </span>
                    )}
                </div>
            </header>

            <div className="min-h-[90vh] p-3 bg-gray-100 z-0">
                {showMessages()}
                <div ref={endOfMessagesRef}></div>
            </div>

            <form
                onSubmit={sendMessage}
                className="py-3 px-5 sticky bottom-0 z-100 border-t flex items-center gap-1 bg-white"
            >
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    type="text"
                    placeholder="Aa"
                    className="py-2 px-3 flex-grow rounded-md outline-none bg-gray-200"
                />
                <button type="submit" className="btn">
                    <BiSend size={defaultIconSize} />
                </button>
            </form>
        </div>
    );
};

export default ConversationScreen;
