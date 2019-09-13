import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Index from "./Index";
import Tournaments from "./Tournaments";
import Tournament from "./Tournament";
import Game from "./Game";
import { GameManager } from "../GameManager";

interface IState { gameOn: boolean }
interface IProps {}

export default class App extends Component<IProps, IState> {
    
    constructor(props: any) {
        super(props);
        this.state = {
            gameOn: false
        }
    }

    play(mapIndex: number) {
        GameManager.mapSelected(mapIndex);
        this.setState({ gameOn: true });
    }

    menu() {
        this.setState({ gameOn: false });
    }

    render() {
        return (
            <Router>
                <Route path="/" exact component={Index} />
                <Route path="/tournaments" exact component={Tournaments} />
                <Route path="/tournaments/:id" exact render={routeProps =>
                    <Tournament {...routeProps} onLoad={this.play.bind(this)} onUnload={this.menu.bind(this)} />}
                />
                <Game visible={this.state.gameOn} />
            </Router>
        );
    }
}
