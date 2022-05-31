import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {

    return(
    <div className="container mx-auto text-white text-3xl text-center">
        <div className="h-screen flex flex-col justify-center content-center -mt-24">
            <h1>404- Not Found</h1>
            <Link to="/" className="underline text-yellow-400">
                Go home
            </Link>
        </div>
    </div>
    );
};

export default NotFound;