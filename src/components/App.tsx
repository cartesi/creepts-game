import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Index from "./Index";
import Game from "./Game";

interface IState { map: string }
interface IProps {}

export default class App extends Component<IProps, IState> {
    
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Route path="/" exact component={Index} />
                <Route path="/games/:map" component={Game} />
            </Router>
        );
    }
}
