import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core';

const Showcase = () => {
  const [products, setProducts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cartitems, setCartItems] = useState([]);
  const [valuedescription, setValueDescription] = useState('');
  const [valueadress, setValueAdress] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('https://localhost:7064/api/Products');
      setProducts(response.data.products);
    };

    fetchProducts();
  }, []);

  const handleButtonClick = () => {
    setDialogOpen(true);
    axios.get("https://localhost:7064/api/Baskets", {
      headers: {
          'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
  }}).then(response => {
    console.log(response.data); // handle the response as needed
    setCartItems(response.data);
  })
  .catch(error => {
    console.error(error); // handle the error as needed
  });
  };

  const handleInputChangeAdress = (event) => {
    setValueAdress(event.target.value);
  };

  
  const handleInputChangeDescription = (event) => {
    setValueDescription(event.target.value);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };



  const handleAddCart = (productId) => {
   const quantity = 1; // set the quantity to 1
   const data = { productId, quantity };
    axios.post('https://localhost:7064/api/Baskets', data , {
    headers: {
        'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
}})
    .then(res => {
      console.log(res.data); // handle the response as needed
    })
    .catch(error => {
      console.error(error); // handle the error as needed
    });
  }
  const handleSubmitOrder = (description, adress)=> {
    const data = {

      "description": description,
      "address" : adress

    }

    axios.post('https://localhost:7064/api/Orders', data , {
      headers: {
          'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
  }})
      .then(res => {
        console.log(res.data); // handle the response as needed
      })
      .catch(error => {
        console.error(error); // handle the error as needed
      });
  }
  const handleRemoveItem = (itemId)=>{
    
    axios.post(`https://localhost:7064/api/Orders/${itemId}`, {
      headers: {
          'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
  }})
      .then(res => {
        console.log(res.data); // handle the response as needed
      })
      .catch(error => {
        console.error(error); // handle the error as needed
      });
  }



  return (
    <>
      <Button  style={{ position: "fixed", top: 10, right: 10, zIndex: 9999 }} variant="contained" color="primary" onClick={handleButtonClick}>
        Open Dialog
      </Button>

      {products.map(product => (
        <Card key={product.id} style={{ width: '300px', display: 'inline-block', margin: '10px' }}>
          <CardMedia
            style={{ height: '0', paddingTop: '56.25%' }}
            image="https://img.freepik.com/free-photo/cardboard-box-isolated_125540-652.jpg"
            title={product.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {product.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              ${product.price}
            </Typography>
            <Button onClick={()=>handleAddCart(product.id)} variant="contained" color="secondary">
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}

      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Cart Items</DialogTitle>
        <DialogContent>
          {cartitems.map((item,idx)=>(
             <DialogContentText
             key={idx}>
               <span>{item.name} ${item.price}</span>
               <Button onClick={()=>handleRemoveItem(item.basketItemId)} >Remove</Button>
             </DialogContentText>
          ))}
        </DialogContent>
        <TextField value={valuedescription}
      onChange={handleInputChangeDescription} id="my-input" label="Description" variant="outlined" />
        <TextField value={valueadress}
      onChange={handleInputChangeAdress} id="my-input" label="Address" variant="outlined" />

        <Button onClick={()=>handleSubmitOrder(valuedescription, valueadress)}>Buy them</Button>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Showcase;