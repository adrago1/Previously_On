import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthService from "../../services/auth-service";

export default function Friends() {

    const [loading, setLoading] = useState(true);
    const user = AuthService.getCurrentUser();
    const [friendList, setFriendList] = useState([]);
    const [friendInput, setFriendInput] = useState("");
    const [friendRequest, setFriendRequest] = useState([]);
    const [blocked, setBlocked] = useState(false);
    const [charged, setCharged] = useState(false);


    useEffect(() => {
        if (!charged) {
            let mounted = true;
            axios.get("https://api.betaseries.com/friends/list", {
                params: {
                    client_id: "22f661bdce5c",
                    id: user.user.id,
                    token: user.token
                }
            }).then(res => {
                if (mounted) {
                    setFriendList(res.data.users);
                    console.log(res.data.users);
                    setLoading(false);
                    setCharged(true);
                }
            }).catch(error => {
                console.log(error.response);
            })

            axios.get("https://api.betaseries.com/friends/requests", {
                params: {
                    client_id: "22f661bdce5c",
                    token: user.token,
                }
            }).then(res => {
                if (mounted) {
                    setFriendRequest(res.data.users);
                    console.log(res.data.users);
                    setLoading(false);
                }
            }).catch(error => {
                console.log(error.response);
                console.log(friendRequest);
            })

            return function cleanup() {
                mounted = false;
            }
        }
    })


    const handleChange = (e) => {
        setFriendInput(e.target.value);
        console.log(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.get("https://api.betaseries.com/friends/find", {
            params: {
                client_id: "22f661bdce5c",
                type: "emails",
                token: user.token,
                emails: friendInput
            }
        }).then(res => {
            return axios.post("https://api.betaseries.com/friends/friend", {
                token: user.token,
                client_id: "22f661bdce5c",
                id: res.data.users[0].id
            }).then(response => {
                alert("Ami ajouté !")
            }).catch(error => {
                console.log(res.data.users.id);
                console.log(error.response);
            })
        }).catch(err => {
            console.log(err.response);
        })
    }

    const handleBlock = (idUser) => {

        axios.post("https://api.betaseries.com/friends/block", {
            client_id: "22f661bdce5c",
            token: user.token,
            id: idUser
        }).then(res => {
            alert("Utilisateur bloqué");
            setBlocked(true);
        }).catch(error => {
            console.log(error.response);
        })
    }

    /*
    const handleUnblock = (idUser) => {
        axios.delete("https://api.betaseries.com/friends/block", {
            params: {
                client_id: "22f661bdce5c",
                token: user.token,
                id: idUser
            }
        }).then(res => {
            alert("Utilisateur débloqué");
            setBlocked(false);
        }).catch(error => {
            console.log(error.response);
        })
    }
    */

    const handleDelete = (idUser) => {
        axios.delete("https://api.betaseries.com/friends/friend", {
            params: {
                client_id: "22f661bdce5c",
                token: user.token,
                id: idUser
            }
        }).then(res => {
            alert("Utilisateur supprimé");
            setBlocked(true);
        }).catch(error => {
            console.log(error.response);
        }) 
    }

    return (
        <div className="container mx-auto mt-24 border w-3/4 text-white text-xl">
            {loading ? <p className="text-center mx-auto text-2xl font-cabin mt-28 uppercase font-bold">Chargement des informations...</p> :
            <div className="grid grid-cols-6 gap-16">
                <div className="col-span-2">
                    <p className="mb-10 text-center">AMIS</p>
                    {friendList.map(function(data) {
                    return(
                        <div className="flex items-center flex-row">
                            {blocked &&
                            <p className="mr-16 line-through">{data.login}</p> 
                            }
                            {!blocked &&
                            <p className="mr-16">{data.login}</p>
                            }
                            <button onClick={(e) => handleBlock(data.id)} className="border p-1 text-right mr-3">BLOCK</button>
                            <button onClick={(e) => handleDelete(data.id)} className="border p-1 text-right">SUPPR</button>
                        </div>
                    )  
                    })}
                </div>
                <div className="col-span-2">
                    <p className="mb-8 text-center">ENVOYER UNE DEMANDE</p>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email :</label>
                        <input name="email" id="email" className="text-black w-full" type="text" onChange={handleChange} />
                        <input aria-label="Envoyer le formulaire" className="mt-5 cursor-pointer shadow bg-yellow-300 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit" value="Envoyer" />
                    </form>
                </div>
                <div className="col-span-2">
                    <p className="mb-10 text-center">DEMANDES D'AMI</p>
                </div>
            </div>
            }
        </div>
    )
}