import { BellFilled, MailOutlined } from "@ant-design/icons";
import { Badge, Drawer, Image, List, Space, Table, Typography } from "antd";
import { useEffect, useState, useContext } from "react";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Navigate, useNavigate } from "react-router-dom";
import { Button, IconButton, makeStyles } from "@material-ui/core";
import axios from "axios";
import AuthContext from "../../AuthContext";

const useStyles = makeStyles({
  button: {
    backgroundColor: '#f44336',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  },
});


function AppHeader() {

  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const[name, setName] = useState();
  const[username, setUsername] = useState();
  const[email, setEmail] = useState();
  const[userid, setUserID] = useState();

  const classes = useStyles();

  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem('access-token') !== null;

  function handleLogout() {
    // Remove token from local storage
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
    // Perform any other necessary logout logic
    navigate("/login")
    setIsAuthenticated(false)
  }



  useEffect(() => {
    const refreshToken = localStorage.getItem("refresh-token")
    const data = [refreshToken]
    axios.get(`https://localhost:7064/api/Users/${refreshToken}`, data,  {
        headers: {
            'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token'),
            'Content-Type': 'application/json'
    }})
      .then(res => {
          console.log(res.data)
      })
      .catch(error => {
        navigate("/login")
        console.log(error);
      });
  }, []);
 

  return (
    <div>
      {isLoggedIn ? (
        <Button variant="contained" className={classes.button} onClick={handleLogout}>Logout</Button>
      ) : (
        <Button variant="contained" className={classes.button} onClick={()=> navigate("/login")} >Login</Button>
      )}
    </div>
  );
}
export default AppHeader;
