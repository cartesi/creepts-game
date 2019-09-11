import React, { Component } from "react";
import { Link } from "react-router-dom";

interface IState { }
interface IProps { }

export default class Index extends Component<IProps, IState> {
    render() {
        return (
            <div>
                <ul>
                    <li><Link to={`/tournaments?phase=commit&me=true`}>Play</Link></li>
                    <li><Link to={`/tournaments?phase=commit&me=false`}>Join Tournament</Link></li>
                    <li><Link to={`/tournaments?me=true`}>My Tournaments</Link></li>
                </ul>
            </div>
        );
    }
}