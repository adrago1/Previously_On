import axios from "axios";

class ShowlistService {
    listingOfShow(client_id, order, limit) {
        return axios.get("https://api.betaseries.com/shows/list", {
            params: {
                client_id,
                order,
                limit
            }
        }).then(res => {
            return res.data.shows;
        }).catch(error => {
            console.log(error.response);
        })
    }
}

export default new ShowlistService();