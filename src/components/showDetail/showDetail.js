import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AuthService from "../../services/auth-service";
import { Link } from "react-router-dom";

export default function ShowDetail() {

    const [loading, setLoading] = useState(true);
    const user = AuthService.getCurrentUser();

    const { state } = useLocation();

    const [showDetails, setShowDetails] = useState([]);
    const [addShowMsg, setAddShowMsg] = useState("");
    const [episodes, setEpisodes] = useState([]);
    const [marked, setMarked] = useState(false);
    

    useEffect(() => {
        
        let mounted = true;
        axios.get("https://api.betaseries.com/shows/display", {
            params: {
                client_id: "22f661bdce5c",
                id: state
            }
        }).then(res => {
            if (mounted) {
                setShowDetails(res.data.show);
                setLoading(false);
            }
        }).catch(error => {
            console.log(error.response);
        })

        return function cleanup() {
            mounted = false;
        }

    })

    const addShowToUser = (e) => {
        e.preventDefault();
        axios.post("https://api.betaseries.com/shows/show", {
            client_id: "22f661bdce5c",
            token: user.token,
            id: state
        }).then(res => {
            setAddShowMsg("Ajouté à votre liste !");
        }).catch(error => {
            setAddShowMsg("Vous suivez déjà cette serie...");
            console.log(error.response);
        })
    }

    const removeShowToUser = (e) => {
        e.preventDefault();
        axios.delete("https://api.betaseries.com/shows/show", {
            params: {
                client_id: "22f661bdce5c",
                token: user.token,
                id: state
            }
        }).then(res => {
            setAddShowMsg("Série retirée de votre liste !");
        }).catch(error => {
            setAddShowMsg("Vous ne suivez pas serie...");
            console.log(error.response);
        })
    }

    const displayEpisodes = (e) => {
        e.preventDefault();
        /*
        axios.get("https://api.betaseries.com/episodes/list", {
            params: {
                client_id: "22f661bdce5c",
                token: user.token,
                userId: user.user.id,
                showId: state
            }
        }).then(res => {
            setEpisodes(res.data.shows[0].unseen);
            console.log(res.data.shows[0].unseen);
        }).catch(error => {
            console.log(error.response);
        })
        */
        axios.get("https://api.betaseries.com/shows/episodes", {
            params: {
                client_id: "22f661bdce5c",
                id: state,
                token: user.token
            }
        }).then(res => {
            //console.log(res.data.episodes);
            setEpisodes(res.data.episodes);
            if (res.data.episodes.user.seen) {
                setMarked(false);
            } else {
                setMarked(true);
            }
        }).catch(error => {
            console.log(error.response);
            console.log(marked);
        })
    }

    const markAsSeen = (idEpisode) => {
        axios.post("https://api.betaseries.com/episodes/watched", {
            bulk: true,
            client_id: "22f661bdce5c",
            token: user.token,
            delete: true,
            id: idEpisode
        }).then(res => {
        }).catch(error => {
            console.log(error.response);
        })
    }

    const markAsUnseen = (idEpisode) => {
        axios.delete("https://api.betaseries.com/episodes/watched", {
            params: {
                client_id: "22f661bdce5c",
                token: user.token,
                id: idEpisode
            }
        }).then(res => {

        }).catch(error => {
            console.log(error.response);
        })
    }


    return(
        <>
        <div className="container mx-auto mt-28 text-white">
            {loading ? <p className="text-center mx-auto text-2xl font-cabin mt-28 uppercase font-bold">Chargement des informations...</p> :
            <div className="grid grid-cols-5 gap-20 text-xl">
                <div className="col-span-1 text-right">
                    <div className="mb-7">
                        <p>Genre</p>
                        <p className="text-base text-gray-400">{Object.values(showDetails.genres).join(", ")}</p>
                    </div>
                    <div className="mb-7">
                        <p>Saisons</p>
                        <p className="text-base text-gray-400">{showDetails.seasons}</p>
                    </div>
                    <div className="mb-7">
                        <p>Episodes</p>
                        <p className="text-base text-gray-400">{showDetails.episodes}</p>
                    </div>
                    <div className="mb-7">
                        <p>Durée des épisodes</p>
                        <p className="text-base text-gray-400">{showDetails.length} min</p>
                    </div>
                    <div className="mb-7">
                        <p>Note</p>
                        <p className="text-base text-gray-400">{Math.round(showDetails.notes.mean)}/5</p>
                    </div>
                    <div className="mb-7">
                        <p>Archiver / Retirer la série</p>
                        <button onClick={addShowToUser} className="text-base text-gray-400 text-4xl mt-3"><span className="border px-3 pb-1">+</span></button>
                        <button onClick={removeShowToUser} className="text-base text-gray-400 text-4xl ml-6 mt-3"><span className="border px-4 pb-1">-</span></button>
                        <p className="text-red-400 italic text-sm mt-3">{addShowMsg}</p>
                    </div>
                </div>
                <div className="col-span-2">
                    <h2 className="text-right -mt-12 text-yellow-400 font-roboto text-2xl uppercase font-bold"><span className="p-2 bg-gray-700 rounded-xl filter contrast-150 bg-opacity-80">{showDetails.title}</span></h2>
                    <p className="mt-4">Résumé : <br /><br /> 
                    {showDetails.description}
                    </p>
                </div>
                <div className="col-span-2">
                    <img className="-mt-10 w-10/12 float-right" src={showDetails.images.poster} alt={"Affiche de "+showDetails.title} />
                </div>
            </div>
            }
        {loading ? <p></p> :
            <div className="container mx-auto mt-36 mb-9">
                <h2 onClick={displayEpisodes} className="cursor-pointer text-center -mt-12 text-yellow-400 font-roboto text-2xl uppercase font-bold"><span className="p-2 bg-gray-700 rounded-xl filter contrast-150 bg-opacity-80">Episodes &#9660;</span></h2>
                <div className="grid grid-cols-7 gap-12 mt-12">
                    {episodes.map(function(data) {
                        return (
                            <div className="col-span-1">
                                {data.user.seen &&
                                <>
                                    <Link to={{pathname: '/episode/details', state: data.id}}><img className="cursor-pointer" src={'https://api.betaseries.com/pictures/episodes?id=' + data.id + '&client_id=22f661bdce5c'} alt="Affiche episode" /></Link>
                                    <p className="text-center font-roboto mt-2">{data.code}</p>
                                    <p onClick={(e) => {markAsUnseen(data.id);displayEpisodes(e)}} className="text-red-300 cursor-pointer underline text-sm text-center -mt-1">marquer comme non-vu</p>
                                </>
                                }
                                {!data.user.seen &&
                                <>
                                    <Link to={{pathname: '/episode/details', state: data.id}}><img className="cursor-pointer filter blur" src={'https://api.betaseries.com/pictures/episodes?id=' + data.id + '&client_id=22f661bdce5c'} alt="Affiche episode" /></Link>
                                    <p className="text-center font-roboto mt-2">{data.code}</p>
                                    <p onClick={(e) => {markAsSeen(data.id);displayEpisodes(e)}} className="text-gray-400 cursor-pointer underline text-sm text-center -mt-1">marquer comme vu</p>
                                </>
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        }
        </div>
        </>
    )
}