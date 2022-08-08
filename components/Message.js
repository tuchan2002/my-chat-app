import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

const Message = ({ message }) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth);

    return (
        <div
            className={`w-fit max-w-[80%] min-w-[30%] p-3 pb-8 mb-3 relative rounded-sm break-all ${
                loggedInUser.email === message.user
                    ? "ml-auto bg-primary text-white"
                    : "bg-gray-200"
            }`}
        >
            {message.text}
            <span className="absolute bottom-0 right-0 text-xs p-2">
                {message.sent_at}
            </span>
        </div>
    );
};

export default Message;
