import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Pagination from '../base/pagination';
import { Link } from "react-router-dom";
import Helmet from "react-helmet";

let PageSize = 12;

export default function ShowList() {

    const [loading, setLoading] = useState(true);

    const [showListing, setShowListing] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchByName, setSearchByName] = useState("");

    useEffect(() => {

        let mounted = true;
        axios.get("https://api.betaseries.com/shows/list", {
            params: {
                client_id: "22f661bdce5c",
                order: "popularity",
                limit: "200",
            }
        }).then(res => {
            if (mounted) {
                setShowListing(res.data.shows);
                setCurrentPage(1);
                setLoading(false);
            }
        }).catch(error => {
            console.log(error.response);
            console.log(searchByName);
        })

        return function cleanup() {
            mounted = false;
        }
        
    });


    const currentShowArray = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return showListing.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, showListing]);
    
    return (
        <div className="container mx-auto text-white mt-7 mb-10">
            <Helmet>
                <meta name= "description" content="Recherche de séries"/>
                <link rel="canonical" href= "http://localhost:3000/series"/>
                <title>Previously On - Recherche de séries</title>
            </Helmet>
            {loading ? <p className="text-center mx-auto text-2xl font-cabin mt-28 uppercase font-bold">Chargement des séries...</p> : 
            <div className="grid grid-cols-3">
                <div className="col-span-1">
                    <label className="block mb-2 font-cabin text-2xl" htmlFor="nameInput">Rechercher une série</label>
                    <input type="text" className="text-black" name="name" aria-label="Champ pour recherche de séries" id="nameInput" onChange={(e) => {setSearchByName(e.target.value)}} />
                </div>
                <div className="grid gap-x-8 gap-y-8 gap col-span-2 grid-cols-2">
                    {currentShowArray.map(function(data) {
                        return(
                            <div className="font-roboto rounded-r-lg bg-gray-500 bg-opacity-30">
                                <Link to={{pathname: '/serie/details', state: data.id}}><img src={data.images.poster} alt={"Affiche de la série "+data.title} href="Affiche de série" className="float-left w-2/5 mr-2"/></Link>
                                <div className="infos-thumb-show my-1">
                                    <Link to={{pathname: '/serie/details', state: data.id}} aria className="text-xl text-yellow-400 font-bold filter contrast-150">{data.title}</Link>
                                    <div className="mt-5">
                                        <p>Saisons : {data.seasons}</p>
                                        <p>Episodes : {data.episodes}</p>
                                        <p className="text-gray-300">{data.creation}</p>
                                        <p className="mt-4 font-cabin text-sm description-shrink text-left">{data.description}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <Pagination
                        className="pagination-bar col-span-2 mx-auto"
                        currentPage={currentPage}
                        totalCount={showListing.length}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>
            </div>
            }
        </div>
    );
}