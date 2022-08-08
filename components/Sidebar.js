import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BiLogOut } from "react-icons/bi";
import { auth, db } from "../config/firebase";
import * as EmailValidator from "email-validator";
import { addDoc, collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import ConversationSelect from "./ConversationSelect";

const defaultIconSize = "1.75rem";
const Sidebar = () => {
    const [loggedInUser, loading, _error] = useAuthState(auth);
    console.log(loggedInUser);

    const [recipientEmail, setRecipientEmail] = useState("");

    // check if conversation a already exists between the current logged in user and recipient
    const queryGetConversationsForCurrentUser = query(
        collection(db, "conversations"),
        where("users", "array-contains", loggedInUser.email) // la array co chua email nay
    );
    const [conversationsSnapshot, __loading, __error] = useCollection(
        queryGetConversationsForCurrentUser
    );
    const isConversationAlreadyExists = (recipientEmail) => {
        return conversationsSnapshot.docs.find((conversation) =>
            conversation.data().users.includes(recipientEmail)
        );
    };

    const isInvitingSelf = recipientEmail === loggedInUser.email;
    const createConversation = async () => {
        if (
            EmailValidator.validate(recipientEmail) &&
            !isInvitingSelf &&
            !isConversationAlreadyExists(recipientEmail)
        ) {
            await addDoc(collection(db, "conversations"), {
                users: [loggedInUser.email, recipientEmail],
            });
        }
        console.log(conversationsSnapshot);
        setRecipientEmail("");
    };
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log(error);
        }
    };

    console.log(conversationsSnapshot);
    return (
        <div className="h-screen max-w-sm border-r">
            <header className="flex justify-between items-center px-4 py-2">
                <img
                    src={
                        loggedInUser.photoURL ||
                        "https://i.pinimg.com/564x/3c/ae/07/3cae079ca0b9e55ec6bfc1b358c9b1e2.jpg"
                    }
                    alt="avatar"
                    className="avt"
                />
                <button
                    className="btn flex gap-2 items-center"
                    onClick={logout}
                >
                    <BiLogOut size={defaultIconSize} />
                    Logout
                </button>
            </header>
            <div className="px-4 py-2 border-y">
                <h3>Create a new conversation with:</h3>
                <div className="flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Email Address"
                        className="outline-none"
                        value={recipientEmail}
                        onChange={(e) => {
                            setRecipientEmail(e.target.value);
                        }}
                    />
                    <button
                        className="btn"
                        onClick={createConversation}
                        disabled={!recipientEmail}
                    >
                        Create
                    </button>
                </div>
            </div>

            {conversationsSnapshot &&
                conversationsSnapshot.docs.map((conversation) => (
                    <ConversationSelect
                        key={conversation.id}
                        id={conversation.id}
                        conversationUsers={conversation.data().users}
                    />
                ))}
        </div>
    );
};

export default Sidebar;
