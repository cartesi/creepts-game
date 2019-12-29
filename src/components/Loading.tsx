import React from "react";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * Full screen loading with a 1 z-index
 */

interface LoadingProps { opacity?: number };

export const Loading: React.FC<LoadingProps> = ({ opacity = 1.0 }) => {
    return (
        <div style={{
            height: "100vh",
            width: "100vw",
            position: "absolute",
            opacity: opacity,
            zIndex: 1
            }}>
            <Backdrop open={true}>
                <CircularProgress color="secondary" />
            </Backdrop>
        </div>
    );
};
