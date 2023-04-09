import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleClick = (event, pageNumber) => {
    event.preventDefault();
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i} className={currentPage === i ? "active" : ""}>
          <a href="/" onClick={(event) => handleClick(event, i)}>
            {i}
          </a>
        </li>
      );
    }

    return pageNumbers;
  };

  const handleAddCart = (productId) => {
    const quantity = 1; // set the quantity to 1
  const data = { productId, quantity };
  axios.post('https://localhost:7064/api/Baskets', data , {
    headers: {
        'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
}})
    .then(response => {
      console.log(response.data); // handle the response as needed
    })
    .catch(error => {
      console.error(error); // handle the error as needed
    });
  }
  
  useEffect(()=>{
    localStorage.getItem('token')
       axios.get('https://localhost:7064/api/Products' ,  {
               headers: {
                   'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
           }}).
       then(res=>{
           setProducts(res.data.products)
   
       }).catch(err=>{
         console.log(err)
       })
    },[])


    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {currentProducts.map((product) => (
          <Card key={product.id} style={{ width: 300, margin: 10 }}>
            {/* <CardMedia component="img" image={product.image} height={200} /> */}
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                ${product.price}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                ${product.stock}
              </Typography>
              <button
              onClick={() => handleAddCart(product.id)}>Add to Cart</button>
            </CardContent>
          </Card>
        ))}
           <ul className="pagination">{renderPageNumbers()}</ul>
      </div>
    );
  };

export default ProductList;