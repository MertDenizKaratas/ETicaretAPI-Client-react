import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useEffect } from "react";
import axios from "axios";

const ProductTable = ({  }) => {
  const [cartItems, setCartItems] = useState([]);

  const handleSubmitCart = () => {
    axios.post('https://localhost:7064/api/Baskets' ,  {
        headers: {
            'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
    }}).
then(res=>{
 console.log(res.data)
         setCartItems(res.data)
}).catch(err=>{
  console.log(err)
})
  }

  useEffect(()=>{
       axios.get('https://localhost:7064/api/Baskets' ,  {
               headers: {
                   'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
           }}).
       then(res=>{
        console.log(res.data)
                setCartItems(res.data)
       }).catch(err=>{
         console.log(err)
       })
    },[])

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cartItems?.map((product, index) => (
            <><TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                      <Box display="flex" alignItems="center">
                          <IconButton
                              aria-label="decrease"


                          >
                              <Remove />
                          </IconButton>

                          <IconButton
                              aria-label="increase"


                          >
                              <Add />
                          </IconButton>
                      </Box>
                  </TableCell>
                  <TableCell>
                  </TableCell>
              </TableRow><button type="submit" onClick={() => handleSubmitCart()}></button></>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;