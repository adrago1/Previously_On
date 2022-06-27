import axios from "axios";
import React, { useState } from "react";
import AuthService from "../../services/auth-service";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";

export default function UserSeries() {

    const [seriesList, setSeriesList] = useState([]);
    const user = AuthService.getCurrentUser();

    if (user !== null || user !== undefined) {
        axios.get("https://api.betaseries.com/shows/member", {
            params : {
                id: user.user.id,
                client_id: "22f661bdce5c",
            }
        }).then(res => {
            //console.log(response.data.shows);
            setSeriesList(res.data.shows);
        }).catch((error) => {
            console.log(error.response);
        })  
    }

    return(
        <div className="container mx-auto mt-24">
            <Helmet>
                <meta name= "description" content="Vos séries"/>
                <link rel="canonical" href= "http://localhost:3000/home"/>
                <title>Previously On - Vos séries</title>
            </Helmet>
            <div className="grid place-items-center content-center lg:grid-cols-3 gap-5 gap-y-40 text-">
                {seriesList.map(function(data) {
                    return(
                        <div className="serie-grid">
                            <Link to={{pathname: '/serie/details', state: data.id}}>
                            <img src={data.images.poster} alt={"Série "+data.title} className="w-8/12 mx-auto" />
                            <p className="text-center pt-5 pb-5 bg-gradient-to-r from-transparent to-gray-500 rounded-b-lg w-2/3 mx-auto text-xl text-white uppercase font-roboto">{data.title}</p>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}