import React from "react";
import { BsFillChatQuoteFill } from "react-icons/bs";

const Loading = () => {
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="flex flex-col items-center p-20 rounded-lg shadow-lg">
                <BsFillChatQuoteFill size={200} className="mb-5 text-primary" />
                <div className="text-xl font-semibold">LOADING...</div>
            </div>
        </div>
    );
};

export default Loading;
