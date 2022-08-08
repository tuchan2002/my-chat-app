import React from "react";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { getRecipientEmail } from "../../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import {
    generateQueryGetMessages,
    transformMessage,
} from "../../utils/getMessageInConversation";
import ConversationScreen from "../../components/ConversationScreen";

const Conversation = ({ conversation, messages }) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth);

    return (
        <div className="flex">
            <Head>
                <title>
                    Conversation with{" "}
                    {getRecipientEmail(conversation.users, loggedInUser)}
                </title>
            </Head>

            <Sidebar />

            <div className="h-screen flex-grow overflow-y-scroll">
                <ConversationScreen
                    conversation={conversation}
                    messages={messages}
                />
            </div>
        </div>
    );
};

export default Conversation;

export const getServerSideProps = async (context) => {
    const conversationId = context.params.id;

    // get conversation, to know who we are chatting with
    const conversationRef = doc(db, "conversations", conversationId);
    const conversationSnapshot = await getDoc(conversationRef);

    // get all msg between logged in uer and recipient in this conversation
    const queryMessages = generateQueryGetMessages(conversationId);
    const messagesSnapshot = await getDocs(queryMessages);

    const messages = messagesSnapshot.docs.map((messageDoc) =>
        transformMessage(messageDoc)
    );
    console.log("MESSAGES", messages); // nay la o server, nen no se log ra o trong terminal nay

    return {
        props: {
            conversation: conversationSnapshot.data(),
            messages,
        },
    };
};
