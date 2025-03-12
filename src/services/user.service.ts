import axios from "axios";
import { initializeApp } from '@firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import user, { role } from "../types/user";
import eventBus from "../common/eventBus";
import googleSignIn from "../types/googleSignIn";
import api from "../JWTInterceptor";

const firebaseConfig = {
    apiKey: "AIzaSyAt_s6twBTnakR508WwXXmd67VqM6P0LkY",
    authDomain: "zimozi-ac7c3.firebaseapp.com",
    projectId: "zimozi-ac7c3",
    storageBucket: "zimozi-ac7c3.firebasestorage.app",
    messagingSenderId: "410437032374",
    appId: "1:410437032374:web:faefb042ada5c9cc0fc917",
    measurementId: "G-2TJWCQ7XBZ"
};

const register = (fullName: string, email: string, password: string, confirmPassword: string, userRole?: role) => {
    return api.post("/users/register", {
        fullName,
        email,
        password,
        confirmPassword,
        userRole
    });
};

const login = (email: string, password: string) => {
    return api
        .post("/users/login", {
            email,
            password,
        })
        .then((response) => {
            if (response.data.id) {
                setCurrentUser(response.data)
            }
            eventBus.dispatch("login", response.data)
            return response.data;
        });
};

const logout = () => {
    return api.get("/users/logout").then(() => {
        localStorage.removeItem("user");
    });
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider()


const userGoogleSignIn = () => {
    signInWithPopup(auth, provider).then(async (result) => {
        const idToken = await result.user.getIdToken();
        const googleSignIn: googleSignIn = {
            idToken: idToken
        }
        api
            .post("/users/googleSignIn", googleSignIn).then((response) => {
                setCurrentUser(response.data)
                eventBus.dispatch("login", response.data);
            })
    });
};

const setCurrentUser = (user: user) => {
    localStorage.setItem("user", JSON.stringify(user));
}

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user") as string) as user;
};

const updateUser = (user: user) => {
    return api.put("/users/updateUser", user).then(() => {
        setCurrentUser(user);
        eventBus.dispatch("updateUser", user);
    });
}

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
    userGoogleSignIn,
    updateUser,
    setCurrentUser
}

export default AuthService;