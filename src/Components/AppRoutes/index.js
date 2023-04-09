import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectRoutes } from "../../hooks";
import Customers from "../../Pages/Customers/indextir";
import Dashboard from "../../Pages/Dashbaord";
import Inventory from "../../Pages/Inventory";
import Login from "../../Pages/Login";
import Orders from "../../Pages/Orders";
import RegisterForm from "../../Pages/Register";
import EcommerceTemplate from '../../Userpage/index'
import ProductTable from "../../Pages/Shopping-cart/shoppingcart";
import DropdownList from "../../Pages/Rolespage/index";
import UserTable from "../../Pages/Userpage/index"
import ProductShowcase from "../../Ecommerceside/index"


function AppRoutes() {
  return (
    <Routes>
    <Route element={<ProtectRoutes/>}>
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/inventory" element={<Inventory />}></Route>
      <Route path="/orders" element={<Orders />}></Route>
      <Route path="/customers" element={<Customers />}></Route>
      <Route path="/shoppingcart" element={<ProductTable />}></Route>
     </Route>
      <Route path="/register" element={<RegisterForm />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/homepage" element={<EcommerceTemplate />}></Route>
      <Route path="/rolepage" element={<DropdownList />}></Route>
      <Route path="/userpage" element={<UserTable />}></Route>
      <Route path="/mainpage" element={<ProductShowcase />}></Route>
    </Routes>
  );
}
export default AppRoutes;
