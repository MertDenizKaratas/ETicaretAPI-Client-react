import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "../../layouts/Notification";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(3),
  },
  textField: {
    margin: theme.spacing(1),
    width: "25ch",
  },
  button: {
    margin: theme.spacing(3),
  },
}));

const RegisterForm = () => {
  
const navigate = useNavigate()

  const [notify, setNotify] = useState({ isOpen: false })
  const classes = useStyles();
  const [formData, setFormData] = useState({
    nameSurname : "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

   const { nameSurname , username, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = (e) => { 
  e.preventDefault();
  console.log(formData)
  axios.post('https://localhost:7064/api/Users', formData)
  .then(response => {
    console.log(response.data);
     setNotify({isOpen:true,  message : response.data.message});
  })
  .catch(error => {
    console.error(error);
  });
}
  
  return (
    <><form className={classes.form} onSubmit={handleSubmit}>
      <TextField
        className={classes.textField}
        label="Name"
        name="nameSurname"
        value={formData.nameSurname}
        onChange={handleChange}
        required />
      <TextField
        className={classes.textField}
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required />
      <TextField
        className={classes.textField}
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required />
      <TextField
        className={classes.textField}
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required />
      <TextField
        className={classes.textField}
        label="Confirm Password"
        name="passwordConfirm"
        type="password"
        value={formData.passwordConfirm}
        onChange={handleChange}
        required />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        type="submit"
      >
        Register
      </Button>
    </form><Notification
        {...{ notify, setNotify }} /></>
  );
};

export default RegisterForm;