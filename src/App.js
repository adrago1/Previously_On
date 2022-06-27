import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "./style/tailwind.css";
import "./style/style.css";
import AuthService from "./services/auth-service";
import React from "react";

import Login from './components/Login/login';
import Navbar from './components/base/navbar';
import UserSeries from "./components/userData/userSeries";
import ShowList from "./components/showList/showList";
import ShowDetail from "./components/showDetail/showDetail";
import EpisodeDetail from "./components/episodeDetail/episodeDetail";
import Friends from "./components/friends/friends";
import NotFound from "./components/notFound/404";


class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            currentUser: undefined,
        }
    };

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
            });
        }
    }

    render() {
        const { currentUser } = this.state;

        return (
            <Router>
                <Navbar />
                <Switch>
                    <Route exact path="/"><Redirect to="/home" /></Route>
                    {currentUser === undefined && 
                    <Route exact path="/home" component={Login} />
                    }
                    {currentUser !== undefined &&
                    <Switch>
                        <Route exact path="/home" component={UserSeries} />
                        <Route exact path="/series" component={ShowList} />
                        <Route exact path="/serie/details" component={ShowDetail} />
                        <Route exact path="/episode/details" component={EpisodeDetail} />
                        <Route exact path="/friends" component={Friends} />
                        <Route component={NotFound} />
                    </Switch>
                    }
                </Switch>
            </Router>
        );
    }
}

export default App;