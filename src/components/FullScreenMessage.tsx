import React from "react";
import { Button, Dimmer, Grid, Message } from "semantic-ui-react";

interface IProps {
    title: string,
    message: string,
    buttonTitle: string,
    onClick: () => void,
    opacity?: number
};

export const FullScreenMessage: React.FC<IProps> = ({ title, message, buttonTitle, onClick, opacity = 1.0 }) => {
    return (
        <div style={{ height: "100vh", width: "100vw", position: "absolute", zIndex: 1, opacity: opacity }}>
            <Grid verticalAlign="middle">
                <Dimmer active>
                    <Message negative>
                        <Message.Header>{title}</Message.Header>
                        <p>{message}</p>
                        <Button negative fluid onClick={ onClick }>{buttonTitle}</Button>
                    </Message>
                </Dimmer>
            </Grid>
        </div>
    );
};
