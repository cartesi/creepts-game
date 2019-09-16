import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Index from "./Index";
import Tournaments from "./Tournaments";
import Tournament from "./Tournament";
import GameContainer from "./GameContainer";
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
        // XXX: depending on the opening route the game may not be ready yet
        // XXX: we need some asynchronou way to do this
        GameManager.mapSelected(mapIndex);
        this.setState({ gameOn: true });
    }

    menu() {
        this.setState({ gameOn: false });
    }

    render() {
        return (
            <Router>
                <div>
                    <Route path="/" exact component={Index} />
                    <Route path="/tournaments" exact component={Tournaments} />
                    <Route path="/tournaments/:id" exact render={routeProps =>
                        <Tournament {...routeProps} onLoad={this.play.bind(this)} onUnload={this.menu.bind(this)} />}
                    />
                    <GameContainer visible={this.state.gameOn} />
                </div>
            </Router>
        );
    }
}
