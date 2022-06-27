import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router";
import Moment from "moment";
import AuthService from "../../services/auth-service";
import Utilisateur from "../../images/utilisateur.svg";
import { Helmet, HelmetProvider } from 'react-helmet-async';

export default function EpisodeDetail() {

    const [loading, setLoading] = useState(true);
    const { state } = useLocation();
    const user = AuthService.getCurrentUser();

    const [episodeDetail, setEpisodeDetail] = useState([]);
    const [commentaire, setCommentaire] = useState("");
    const [listeCommentaires, setListeCommentaires] = useState([]);
    const [charged, setCharged] = useState(false);

    useEffect(() => {
        if (!charged) {
            let mounted = true;
            axios.get("https://api.betaseries.com/episodes/display", {
                params: {
                    client_id: "22f661bdce5c",
                    id: state,
                    token: user.token,
                }
            }).then(res => {
                if (mounted) {
                    setEpisodeDetail(res.data.episode);
                    console.log(res.data.episode);
                    setLoading(false);
                    setCharged(true);
                }
            }).catch(error => {
                console.log(error.response);
            })

            return function cleanup() {
                mounted = false;
            }
        }
    });

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        
        axios.post("https://api.betaseries.com/comments/comment", {
            client_id: "22f661bdce5c",
            type: "episode",
            id: state,
            token: user.token,
            text: commentaire
        }).then(res => {
            alert("Commentaire envoyé !");
        }).catch(res => {
            alert("Erreur, réessayez plus tard.");
        })
    }

    const handleChange = (e) => {
        setCommentaire(e.target.value);
    }

    const displayCommentaires = (e) => {
        e.preventDefault();
        axios.get("https://api.betaseries.com/comments/comments", {
            params: {
                client_id: "22f661bdce5c",
                type: "episode",
                id: state,
                replies: "0",
                order: "desc"
            }
        }).then(res => {
            setListeCommentaires(res.data.comments);
            console.log(res.data.comments)
        }).catch(error => {
            console.log(error.response);
        })
    }

    return (
        <div className="container mx-auto mt-28 text-white">
            <HelmetProvider>
                <Helmet>
                    <meta name= "description" content={"Details de l'épisode :" + episodeDetail.title}/>
                    <link rel="canonical" href= "http://localhost:3000/episode/details"/>
                    <title>{"Previously On - Details "+episodeDetail.title}</title>
                </Helmet>
            </HelmetProvider>
            {loading ? <p className="text-center mx-auto text-2xl font-cabin mt-28 uppercase font-bold">Chargement des informations...</p> :
            <div className="grid grid-cols-5 gap-20 text-xl">
                <div className="col-span-1 text-right">
                    <div className="mt-7">
                        <p>Nom de la série</p>
                        <p className="text-base text-gray-400">{episodeDetail.show.title}</p>
                    </div>
                    <div className="mt-7">
                        <p>Numéro de l'épisode</p>
                        <p className="text-base text-gray-400">{episodeDetail.episode}</p>
                    </div>
                    <div className="mt-7">
                        <p>Saison</p>
                        <p className="text-base text-gray-400">{episodeDetail.season}</p>
                    </div>
                    <div className="mt-7">
                        <p>Diffusion</p>
                        <p className="text-base text-gray-400">{Moment(episodeDetail.date).format("DD/MM/YYYY")}</p>
                    </div>
                    <div className="mt-7">
                        <p>Note</p>
                        <p className="text-base text-gray-400">{Math.round(episodeDetail.note.mean)}/5</p>
                    </div>
                    <div className="mt-7">
                        <p>Vu</p>
                        <p className="text-base text-gray-400">{episodeDetail.user.seen ? "Oui" : "Non"}</p>
                    </div>
                </div>
                <div className="col-span-2">
                    <h2 className="text-right -mt-12 text-yellow-400 font-roboto text-2xl uppercase font-bold"><span className="p-2 bg-gray-700 rounded-xl filter contrast-150 bg-opacity-80">{episodeDetail.title}</span></h2>
                    <p className="mt-11 mb-28">Résumé de l'épisode : <br /><br />
                        {episodeDetail.description}
                    </p>
                    <form onSubmit={handleCommentSubmit}>
                        <label htmlFor="comment" className="text-xl text-gray-200 font-cabin">Ecris un commentaire sur l'épisode !</label>
                        <textarea className="text-black" onChange={handleChange} name="comment" rows="5" cols="40"></textarea>
                        <input type="submit" className="cursor-pointer shadow bg-yellow-300 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" value="Envoyer" />
                    </form>
                </div>
                <div className="col-span-2">
                <img className="-mt-10 w-10/12 float-right" src={'https://api.betaseries.com/pictures/episodes?id=' + state + '&client_id=22f661bdce5c'} alt="Affiche episode" />
                </div>
            </div>
            }
            {loading ? <p></p> :
            <div className="container mx-auto mt-36 mb-9">
                <h2 onClick={displayCommentaires} className="cursor-pointer text-center -mt-12 text-yellow-400 font-roboto text-2xl uppercase font-bold"><span className="p-2 bg-gray-700 rounded-xl filter contrast-150 bg-opacity-80">Commentaires de l'épisode &#9660;</span></h2>
                {listeCommentaires.map(function(data) {
                return (
                    <div className="w-7/12 mt-10 mb-10 mx-auto bg-gray-400 bg-opacity-50 p-4">
                        <div className="flex items-center">
                            <img src={data.avatar === null ? Utilisateur : data.avatar} alt="avatar" className="w-1/12 rounded-full" />
                            <div className="flex flex-col -mt-5">
                                <p className="ml-5">{data.login}</p>
                                <p className="ml-5 text-sm text-gray-300">{Moment(data.date).format("DD-MM-YYYY h:mm:ss")}</p>
                            </div>
                        </div>
                        <div className="ml-24">
                            <p>{data.text}</p>
                        </div>
                    </div>
                )})}
            </div>
            }
        </div>
    );
}