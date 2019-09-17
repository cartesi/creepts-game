import React, { Component } from "react";
import { A } from "hookrouter";
import { Button, Image, Menu } from "semantic-ui-react";

interface IState { }
interface IProps { }

export default class Index extends Component<IProps, IState> {
    render() {
        return (
            <div style={{ padding: "10px" }}>
                <Image src="https://place-hold.it/320x320" centered />
                <Menu vertical fluid>
                    <Menu.Item name='play' as={A} href={`/tournaments?phase=commit&me=true`}>Play</Menu.Item>
                    <Menu.Item name='join' as={A} href={`/tournaments?phase=commit&me=false`}>Join Tournament</Menu.Item>
                    <Menu.Item name='my' as={A} href={`/tournaments?me=true`}>My Tournaments</Menu.Item>
                </Menu>
            </div>
        );
    }
}