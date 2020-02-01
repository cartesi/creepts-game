// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


declare var __GAME_ONLY__: boolean;
import React from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useRoutes } from "hookrouter";

import Index from "./Index";
import { TournamentsContainer } from "./TournamentsContainer";
import { TournamentContainer } from "./TournamentContainer";
import { Replay } from "./Replay";
import GameContainer from "./GameContainer";
import { TournamentPhase } from "../Tournament";
import '../styles/menu.css';

const routes = {
    "/": () => <Index />,
    "/play": () => <TournamentsContainer name="Play" me={true} phase={TournamentPhase.commit} />,
    "/join": () => <TournamentsContainer name="Join Tournament"  me={false} phase={TournamentPhase.commit} />,
    "/my": () => <TournamentsContainer name="My Tournaments" me={true} />,
    "/tournaments/:id": ({id}) => <TournamentContainer id={id} />,
    "/tournaments/:tournamentId/scores/:id": ({ tournamentId, id }) => <Replay tournamentId={ tournamentId } id={ id } />
};

export const App = () => {
    const theme = createMuiTheme({
        palette: {
          type: 'dark',
          primary: {
            light: '#534bae',
            main: '#1a237e',
            dark: '#000051',
            contrastText: '#ffffff',
          },
          secondary: {
            light: '#6ec6ff',
            main: '#2196f3',
            dark: '#0069c0',
            contrastText: '#000000',
          },
          background: {
              default: '#000000',
              paper: '#000018'
          }
        },
        overrides: {
            MuiPaper: {
                outlined: {
                    borderColor: '#0069c0'
                }
            }
        }
    });
    
    // TODO: create <NotFoundPage />
    const match = useRoutes(routes);
    const gameVisible = __GAME_ONLY__ || match.type === TournamentContainer || match.type === Replay;
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div>
                <div className={'menu-container'}>
                    {__GAME_ONLY__ ? <div/> : match}
                </div>
                <GameContainer visible={gameVisible} />
            </div>
        </ThemeProvider>
    );
}
