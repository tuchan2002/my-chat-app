import React from "react";
import Head from "next/head";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

const login = () => {
    const [signInWithGoogle, _user, _loading, _error] =
        useSignInWithGoogle(auth);

    const signIn = () => {
        signInWithGoogle();
    };
    return (
        <div className="h-screen flex justify-center items-center">
            <Head>
                <title>Login</title>
            </Head>
            <div className="flex flex-col items-center p-20 rounded-lg shadow-lg">
                <BsFillChatQuoteFill size={200} className="mb-5 text-primary" />
                <button className="btn" onClick={signIn}>
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default login;
