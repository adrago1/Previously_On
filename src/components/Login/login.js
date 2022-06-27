import React, { useState } from "react";
import AuthService from "../../services/auth-service";
import CryptoJS from "crypto-js";
import { Helmet, HelmetProvider } from 'react-helmet-async';

export default function Login() {

    let messageErreur;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [apiError, setApiError] = useState("");
    
    const handleSubmit = (e) => {
        e.preventDefault();
        let hashedPassword = CryptoJS.MD5(password).toString();
        AuthService.login(username, hashedPassword, "22f661bdce5c")
        .then (function (res) {
            window.location = "/home";
        })
        .catch(function (error) {
            //console.log(error.response.data.errors[0].text);
            setApiError(error.response.data.errors[0].text);
        })

        console.log(apiError);
    }

    if (apiError === "") {
        messageErreur = "";
    } else {
        messageErreur = <p className="text-red-500 text-xs italic">{apiError}</p>
    }

    return (
        <div className="container mx-auto text-center px-30 text-white sm:-mt-16">
            <HelmetProvider>
                <Helmet>
                    <meta name= "description" content="Connectez-vous à notre application grâce à votre compte Betaseries !"/>
                    <link rel="canonical" href= "http://localhost:3000/login"/>
                    <title>Previously On - Login</title>
                </Helmet>
            </HelmetProvider>
            <div className="flex flex-col sm:flex-row items-center justify-around h-screen">
                <div className="pr-0 sm:pr-24 xl:pr-48 flex-shrink-0 relative">
                    <div className="text-6xl font-cabin">
                        <p>CONNECTE-TOI</p>
                        <p className="mt-7">AVEC TON COMPTE</p>
                        <h6 className="mt-7">BETASERIES<span className="text-yellow-400">.</span></h6>
                    </div>
                    <>
                        <img className="hidden lg:block absolute inset-y-20 right-0 w-16 h-16" alt="right-arrow" src="./assets/right-arrow.svg" />
                    </>
                </div>
                <div className="sm:mt-0 -mt-36 flex font-roboto">
                    <div className="w-full max-w-xs">
                        <form onSubmit={handleSubmit} className="bg-white bg-opacity-95 shadow-2xl rounded px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4">
                                <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                    Pseudonyme
                                </label>
                                <input onChange={e => setUsername(e.target.value)}className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Pseudonyme ou e-mail" />
                            </div>
                            <div className="mb-6">
                                <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Mot de passe
                                </label>
                                <input onChange={e => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                            </div>
                            <div className="flex items-center justify-between mb-6">
                                <input type="submit" value="Valider" className="cursor-pointer bg-yellow-300 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" />
                                <a className="inline-block align-baseline font-bold text-sm text-yellow-300 hover:text-yellow-500" href="/series">
                                    Inscription
                                </a>
                            </div>
                            {messageErreur}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}