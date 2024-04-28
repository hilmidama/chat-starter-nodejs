import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Grid,
  Typography,
  Button,
  FormControl,
  TextField,
} from "@material-ui/core";

const Login = ({ user, login }) => {
  const history = useHistory();

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements;
    const username = formElements.username.value;
    const password = formElements.password.value;

    await login({ username, password });
  };

  useEffect(() => {
    if (user && user.id) history.push("/home");
  }, [user, history]);

  return (
    // <img id="chatbubble" src="/img/sidebanner.svg"></img>
    <Grid container items style={{ margin: 0 }} spacing={0} direction="row">
      <Grid item xs={5} spacing={0}>
        <img
          style={{ maxWidth: "100%" }}
          id="chatbubble"
          src="/img/sidebanner.svg"
        ></img>
      </Grid>
      <Grid
        container
        item
        xs={7}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <div id="float">
          <Grid container item>
            <Grid>
              <Typography>Dont have an account ? </Typography>
            </Grid>
            <Grid>
              <Link href="/register" to="/register">
                <Button color="primary" variant="outlined">Create account</Button>
              </Link>
            </Grid>
          </Grid>
        </div>

        <form onSubmit={handleLogin}>
          <h1> Welcome back!</h1>
          <Grid item container>
            <FormControl margin="normal" required>
              <TextField
                aria-label="E-mail address"
                label="username"
                name="username"
                type="text"
              />
            </FormControl>
          </Grid>
          <Grid>
            <FormControl margin="normal" required>
              <TextField
                label="password"
                aria-label="password"
                type="password"
                name="password"
              />
            </FormControl>
          </Grid>
          <Grid>
            <Button
              color="primary"
              type="submit"
              variant="contained"
              size="large"
            >
              Login
            </Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default Login;
