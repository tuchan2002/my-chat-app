import React from "react";
import { useRouter } from "next/router";
import { useRecipient } from "../hooks/useRecipient";

const ConversationSelect = ({ id, conversationUsers }) => {
    const { recipient, recipientEmail } = useRecipient(conversationUsers);

    const router = useRouter();
    const onSelectConversation = () => {
        router.push(`/conversations/${id}`);
    };

    return (
        <div
            className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={onSelectConversation}
        >
            <img
                src={
                    recipient
                        ? recipient.photoURL
                        : "https://i.pinimg.com/564x/3c/ae/07/3cae079ca0b9e55ec6bfc1b358c9b1e2.jpg"
                }
                alt="avatar"
                className="avt"
            />

            <span className="truncate">{recipientEmail}</span>
        </div>
    );
};

export default ConversationSelect;
