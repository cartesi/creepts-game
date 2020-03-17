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
import { A, useRoutes, HookRouter } from "hookrouter";

import { Index } from "./Index";
import { TournamentContainer } from "./TournamentContainer";
import { Replay } from "./Replay";
import { LocalReplay } from "./LocalReplay";
import GameContainer from "./GameContainer";
import '../styles/menu.css';

const routes = {
    "/": () => <Index />,
    "/tournaments/:id": ({id}) => <TournamentContainer id={id} />,
    "/tournaments/:tournamentId/scores/:id": ({ tournamentId, id }) => <Replay tournamentId={ tournamentId } id={ id } />,
    "/replay": () => <LocalReplay />
};

export class AWrapper extends React.Component<HookRouter.AProps> {
    render() {
        return (
            <A {...this.props} />
        )
    }
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
                root: {
                    backgroundColor: 'rgba(0,0,0,0.85)'
                },
                outlined: {
                    borderColor: '#0069c0'
                }
            },
            MuiStepConnector: {
                lineVertical: {
                    minHeight: '12px'
                }
            },
            MuiExpansionPanel: {
                root: {
                    backgroundColor: 'rgba(0,0,0,0)'
                }
            },
            MuiButton: {
                root: {
                    background: 'linear-gradient(45deg, rgba(0,0,0,0.7), rgba(26,35,126,0.7))',
                    color: '#2196f3',
                },
                outlined: {
                    borderColor: '#2196f3',
                    '&:hover': {
                        border: '3px solid',
                    }
                }
            }
        }
    });
    
    // TODO: create <NotFoundPage />
    const match = useRoutes(routes);
    const gameVisible = __GAME_ONLY__ || match.type === TournamentContainer || match.type === Replay || match.type === LocalReplay;
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
