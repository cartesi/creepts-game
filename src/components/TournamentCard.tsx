import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Image } from "semantic-ui-react";
import { MapThumbnail } from "./MapThumbnail";

export default ({ tournament }) => {
    return (
        <Card key={tournament.id} raised fluid>
            <Card.Content>
                <MapThumbnail map={tournament.name} width={50} height={60} />
                <Card.Header>{tournament.name}</Card.Header>
                <Card.Meta>12 players</Card.Meta>
                <Card.Description>My Highscore: 21,242,919</Card.Description>
                <Card.Description>Wave: 56</Card.Description>
                <Card.Description>Time Left: 02d 05h</Card.Description>
            </Card.Content>            
            <Card.Content extra>
                <Button as={Link} to={`/tournaments/${tournament.id}`} fluid>Improve!</Button>
            </Card.Content>
        </Card>
    );
}