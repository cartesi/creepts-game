import React, { Component } from "react";
import { A } from "hookrouter";
import { Image, Menu } from "semantic-ui-react";

interface IState { }
interface IProps { }

export default class Index extends Component<IProps, IState> {
    render() {
        return (
            <div style={{ padding: "10px" }}>
                <Image src="https://place-hold.it/320x320" centered />
                <Menu vertical fluid>
                    <Menu.Item name='play' as={A} href="/play">Play</Menu.Item>
                    <Menu.Item name='join' as={A} href="/join">Join Tournament</Menu.Item>
                    <Menu.Item name='my' as={A} href="/my">My Tournaments</Menu.Item>
                </Menu>
            </div>
        );
    }
}