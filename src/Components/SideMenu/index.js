import {
  AppstoreOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../AuthContext";
import { ListGroup } from 'react-bootstrap';


function SideMenu() {
  
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");
  const [adminName, setAdminName] = useState("");

  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const handleLogin = () => {
    // Simulate a user login and store a token in localStorage
    localStorage.setItem('token', 'some_token_value');
    setIsAuthenticated(true);
  };


  const isLoggedIn = localStorage.getItem('access-token') !== null;


  useEffect(() => {
    const refreshToken = localStorage.getItem("refresh-token")
    const data = [refreshToken]
    axios.get(`https://localhost:7064/api/Users/${refreshToken}`, data,  {
        headers: {
            'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token'),
            'Content-Type': 'application/json'
    }})
      .then(res => {
          console.log(res.data.user.userName)
          setAdminName(res.data.user.userName);
      })
      .catch(error => {
        navigate("/login")
        console.log(error);
      });
  }, []);


  function handleLogout() {
    // Remove token from local storage
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
    // Perform any other necessary logout logic
    navigate("/login")
  }

  const navigate = useNavigate();
  return (
     <aside className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
      <ListGroup>
        <ListGroup.Item action href="#">
        </ListGroup.Item>
        {isAuthenticated && (
          <>
           <Menu
        className="SideMenuVertical"
        mode="vertical"
        onClick={(item) => {
          //item.key
          navigate(item.key);
        }}
        selectedKeys={[selectedKeys]}
        items={[
          
          {
            label: "Inventory",
            key: "/inventory",
            icon: <ShopOutlined />,
          },
          {
            label: "Orders",
            key: "/orders",
            icon: <ShoppingCartOutlined />,
          },

          {
            label: "Users",
            icon: <AppstoreOutlined />,
            key: "/userpage",
          },
          {
            label: "Roles",
            icon: <AppstoreOutlined />,
            key: "/rolepage",
          },
        ]}
      ></Menu>
          </>
        )}
      </ListGroup>
      {!isAuthenticated && (
        <Menu
        className="SideMenuVertical"
        mode="vertical"
        onClick={(item) => {
          //item.key
          navigate(item.key);
        }}
        selectedKeys={[selectedKeys]}
        items={[
          {
            label: "Products",
            icon: <AppstoreOutlined />,
            key: "/mainpage",
          },
        ]}
      ></Menu>
      )}
    </aside>
  );
}
export default SideMenu;

