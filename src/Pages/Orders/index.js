import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function OrderTable() {
  const [orders, setOrders] = useState([]);

const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://localhost:7064/api/Orders",{
        headers: {
            'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token'),
            'Content-Type': 'application/json'
    }} )
      .then((response) => {
        setOrders(response.data.orders);
        console.log(response.data);
      })
      .catch((error) => {
        navigate("/mainpage")
        console.log(error);
      });
  }, []);
  const handleCompleteOrder = (orderId) => {
    axios
    .get(`https://localhost:7064/api/Orders/complete-order/${orderId}`,{
      headers: {
          'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token'),
          'Content-Type': 'application/json'
  }} )
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // Filter completed orders
  const completedOrders = orders.filter((order) => !order.completed);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>User</TableCell>
          <TableCell>Total Price</TableCell>
          <TableCell>Order Code</TableCell>
          <TableCell>Created Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {completedOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.userName}</TableCell>
            <TableCell>{order.totalPrice}</TableCell>
            <TableCell>{order.orderCode}</TableCell>
            <TableCell>{order.createdDate}</TableCell>
            <TableCell>
              <Button
              onClick={()=>handleCompleteOrder(order.id)}
              >Complete Order</Button>
              </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default OrderTable;