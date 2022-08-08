import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

const Message = ({ message }) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth);

    return (
        <div
            className={`w-fit max-w-[80%] min-w-[30%] p-3 pb-2 m-3 rounded-sm break-all ${
                loggedInUser.email === message.user
                    ? "ml-auto bg-primary text-white"
                    : "bg-gray-200"
            }`}
        >
            {message.text}
            <p className="text-xs ml-auto mt-3 w-fit">{message.sent_at}</p>
        </div>
    );
};

export default Message;
