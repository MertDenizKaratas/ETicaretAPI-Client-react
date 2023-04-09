import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  makeStyles,
  Container,
} from '@material-ui/core';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../AuthContext';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {

  const navigate = useNavigate();
  const classes = useStyles();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    usernameOrEmail : "",
 
    password: "",

  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  function handleCallbackResponse(response) {
      console.log("JWT TOKEN IS :" + response.credential);
      localStorage.setItem("access-token",response.credential)
  }
  
  useEffect(()=>{
    /* global google */
    google.accounts.id.initialize({
      client_id:"755080961641-1sgfhs41h766hqcltmaqlblajm0v925o.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {theme : "outline" , size: "large"}
    );
  }, [])

 

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData)
  axios.post('https://localhost:7064/api/Auth/Login', formData)
  .then(response => {
    console.log(response.data);
    localStorage.setItem("access-token",response.data.token.accessToken)
    localStorage.setItem("refresh-token",response.data.token.refreshToken)
    setIsAuthenticated(true)
    navigate("/mainpage")
  })
  .catch(error => {
    console.error(error);
  });
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>

        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="usernameOrEmail"
            label="Email Address"
            name="usernameOrEmail"
            autoFocus
            value={formData.usernameOrEmail}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Typography variant="body2" color="textSecondary" align="center">
          {'© '}
          <Link color="inherit" href="https://www.example.com/">
            Your Website
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Box>
      <div id='signInDiv'></div>
    </Container>
  );
}