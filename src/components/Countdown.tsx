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
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  countdown: {
      textAlign: 'center'
  }
}));

interface IProps {
  date: Date;
}

export const Countdown: React.FC<IProps> = ({ date }) => {
  const classes = useStyles();
  const format = (number) => number.toString().padStart(2, "0");
  return (
    <Timer
      initialTime={date.getTime() - new Date().getTime()}
      direction="backward"
      lastUnit="h"
    >
      {() => (
        <React.Fragment>
          <Grid container spacing={4}>
            <Grid item>
              <div>
                <Typography variant="h3" className={classes.countdown}>
                  <Timer.Hours formatValue={format} />
                </Typography>
              </div>
              <div>
                <Typography variant="h6" className={classes.countdown}>hours</Typography>
              </div>
            </Grid>
            <Grid item>
              <div>
                <Typography variant="h3" className={classes.countdown}>
                  <Timer.Minutes formatValue={format} />
                </Typography>
              </div>
              <div>
                <Typography variant="h6" className={classes.countdown}>minutes</Typography>
              </div>
            </Grid>
            <Grid item>
              <div>
                <Typography variant="h3" className={classes.countdown}>
                  <Timer.Seconds formatValue={format} />
                </Typography>
              </div>
              <div>
                <Typography variant="h6" className={classes.countdown}>seconds</Typography>
              </div>
            </Grid>
          </Grid>
        </React.Fragment>
      )}
    </Timer>
  );
};
