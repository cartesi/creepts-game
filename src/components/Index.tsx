import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Image, Menu } from "semantic-ui-react";

interface IState { }
interface IProps { }

export default class Index extends Component<IProps, IState> {
    render() {
        return (
            <div style={{ width: "320px" }}>
                <Image src="https://place-hold.it/320x320" />
                <Menu vertical fluid>
                    <Menu.Item name='play' as={Link} to={`/tournaments?phase=commit&me=true`}>Play</Menu.Item>
                    <Menu.Item name='join' as={Link} to={`/tournaments?phase=commit&me=false`}>Join Tournament</Menu.Item>
                    <Menu.Item name='my' as={Link} to={`/tournaments?me=true`}>My Tournaments</Menu.Item>
                </Menu>
            </div>
        );
    }
}