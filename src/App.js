import { Space } from "antd";
import "./App.css";
import AppFooter from "./Components/AppFooter";
import AppHeader from "./Components/AppHeader";
import PageContent from "./Components/PageContent";
import SideMenu from "./Components/SideMenu";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import AuthContext from './AuthContext';
import { useState, useEffect } from "react";

function App() {

 const navigate = useNavigate()
// set interval to run every 15 minutes
setInterval(function() {
  // get the token from localStorage
  const refreshToken = localStorage.getItem('refresh-token');

  // check if token exists
  if (refreshToken) {
    // send the token to the API
    axios.post('https://localhost:7064/api/Auth/RefreshTokenLogin', { refreshToken } , {
      headers: {
          'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
  }}
    )
      .then(response => {
        console.log('Token sent successfully:', response.data);
        localStorage.removeItem('access-token')
        localStorage.setItem('access-token', response.data )
      })
      .catch(error => {
        navigate("/login")
      });
  }
}, 1200000); // 900000 milliseconds = 15 minutes



const [isAuthenticated, setIsAuthenticated] = useState(false);

useEffect(() => {
  const token = localStorage.getItem('access-token');
  if (token) {
    setIsAuthenticated(true);
  } else {
    setIsAuthenticated(false);
  }
}, []);


  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
    <div className="App">
      <AppHeader />
      <div className="SideMenuAndPageContent">
        <SideMenu></SideMenu>
        <PageContent></PageContent>
      </div>
      <AppFooter />
    </div>
    </AuthContext.Provider>
  );
}
export default App;
