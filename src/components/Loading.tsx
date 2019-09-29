import React from "react";
import { Dimmer, Loader, Grid } from "semantic-ui-react";

/**
 * Full screen loading with a 1 z-index
 */

interface LoadingProps { opacity?: number };

export const Loading: React.FC<LoadingProps> = ({ opacity = 1.0 }) => {
    return (
        <div style={{
            backgroundColor: "white",
            height: "100vh",
            width: "100vw",
            position: "absolute",
            opacity: opacity,
            zIndex: 1
            }}>
            <Grid verticalAlign="middle">
                <Dimmer active>
                    <Loader size='massive'>Loading</Loader>
                </Dimmer>
            </Grid>
        </div>
    );
}
