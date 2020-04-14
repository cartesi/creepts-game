// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.

import React from "react";
import Timer from "react-compound-timer";
import { Grid, Typography } from "@material-ui/core";

interface IProps {
  date: Date;
}

export const Countdown: React.FC<IProps> = ({ date }) => {
  const format = (number) => number.toString().padStart(2, "0");
  return (
    <Timer
      initialTime={date.getTime() - new Date().getTime()}
      direction="backward"
      lastUnit="h"
    >
      {() => (
        <React.Fragment>
          <Grid container spacing={8}>
            <Grid item>
              <div>
                <Typography variant="h2">
                  <Timer.Hours formatValue={format} />
                </Typography>
              </div>
              <div>
                <Typography variant="h6">hours</Typography>
              </div>
            </Grid>
            <Grid item>
              <div>
                <Typography variant="h2">
                  <Timer.Minutes formatValue={format} />
                </Typography>
              </div>
              <div>
                <Typography variant="h6">minutes</Typography>
              </div>
            </Grid>
            <Grid item>
              <div>
                <Typography variant="h2">
                  <Timer.Seconds formatValue={format} />
                </Typography>
              </div>
              <div>
                <Typography variant="h6">seconds</Typography>
              </div>
            </Grid>
          </Grid>
        </React.Fragment>
      )}
    </Timer>
  );
};
