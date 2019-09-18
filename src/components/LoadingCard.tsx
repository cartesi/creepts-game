import React from "react";
import { Card, Placeholder } from "semantic-ui-react";

export const LoadingCard: React.FC<{}> = () => {
    return (
        <Card raised fluid>
            <Card.Content>
                <Placeholder>
                    <Placeholder.Paragraph>
                        <Placeholder.Line length="short" />
                        <Placeholder.Line length="very long" />
                        <Placeholder.Line length="medium" />
                        <Placeholder.Line length="very long" />
                        <Placeholder.Line length="long" />
                        <Placeholder.Line length="medium" />
                        <Placeholder.Line length="short" />
                    </Placeholder.Paragraph>
                </Placeholder>
            </Card.Content>
        </Card>
    );
}
