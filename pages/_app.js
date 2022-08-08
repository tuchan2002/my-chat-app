import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "../components/Loading";
import { auth, db } from "../config/firebase";
import "../styles/globals.css";
import Login from "./login";

function MyApp({ Component, pageProps }) {
    const [loggedInUser, loading, _error] = useAuthState(auth);

    useEffect(() => {
        const setUserInDb = async () => {
            try {
                await setDoc(
                    doc(db, "users", loggedInUser.email),
                    {
                        email: loggedInUser.email,
                        lastSeen: serverTimestamp(),
                        photoURL: loggedInUser.photoURL,
                    },
                    { merge: true }
                );
            } catch (error) {
                console.log("ERROR SETTING USER INFO IN DB", error);
            }
        };
        if (loggedInUser) {
            setUserInDb();
        }
    }, [loggedInUser]);

    if (loading) return <Loading />;

    if (!loggedInUser) return <Login />;

    return <Component {...pageProps} />;
}

export default MyApp;
