import React, { Component } from "react";
import { RouteComponentProps } from "react-router";

type TParams = { id: string };
type TProps = { onLoad: Function, onUnload: Function };
interface IProps<TParams> extends RouteComponentProps<TParams> { }
interface IState { }

class ComponentBase<TParams, TProps> extends Component<IProps<TParams> & TProps, IState> {}

export default class Tournament extends ComponentBase<TParams, TProps> {

    private maps = [
        "original",
        "waiting-line",
        "turn-round",
        "hurry",
        "civyshk_yard",
        "civyshk_2y",
        "civyshk_line5",
        "civyshk_labyrinth",
    ]

    componentDidMount() {
        const map = this.props.match.params.id;
        this.props.onLoad(this.maps.indexOf(map));
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        return (
            <div></div>
        );
    }
}