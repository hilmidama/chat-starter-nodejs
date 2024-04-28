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
    <Grid container items style={{ margin: 0 }} spacing={0}>
      <Grid item xs={5} spacing={0}>
        <img id="chatbubble" src="/img/sidebanner.svg"></img>
      </Grid>
      <Grid container item xs={7} direction="column" justifyContent="center" alignItems="center">
        <Grid alignItems="flex-end">
          <Typography>Need to register?</Typography>
          <Link href="/register" to="/register">
            <Button>Register</Button>
          </Link>
        </Grid>
        <Grid>
          <form onSubmit={handleLogin}>
              <Grid>
                <FormControl margin="normal" required>
                  <TextField
                    aria-label="username"
                    label="Username"
                    name="username"
                    type="text"
                  />
                </FormControl>
              </Grid>
              <FormControl margin="normal" required>
                <TextField
                  label="password"
                  aria-label="password"
                  type="password"
                  name="password"
                />
              </FormControl>
              <Grid>
                <Button type="submit" variant="contained" size="large">
                  Login
                </Button>
              </Grid>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Login;
