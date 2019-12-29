import React from "react";
import { Backdrop, Button } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

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
            <Backdrop open={true}>
                <Alert variant="outlined" severity="error" action={
                    <Button color="inherit" size="small" onClick={ onClick }>{buttonTitle}</Button>
                }>
                    <AlertTitle>{title}</AlertTitle>
                    {message}                    
                </Alert>
            </Backdrop>
        </div>
    );
};
