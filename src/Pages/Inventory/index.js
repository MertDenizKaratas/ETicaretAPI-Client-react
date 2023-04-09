import { Avatar, Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { Grid, List, ListItem, ListItemText,ListItemSecondaryAction,makeStyles,InputBase,Paper } from "@material-ui/core";
import Form from "../../layouts/Form";
import Input from '../../controls/Input'
import { useForm } from "../../hooks/useForm";
import Button from "../../controls/Button";
import Notification from "../../layouts/Notification";
import * as React from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  myCustomStyle: {
    margin: "10px",
    padding: "10px",
    backgroundColor: "#f0f0f0",
    
  },
  
});

const ModelObjectInventory = () => ({

  name : '',
  price : 0,
  stock: 0

})

const columns = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Name' },
  { id: 'stock', label: 'Stock' },
  { id: 'price', label: 'Price' },
  { id: 'createdDate', label: 'CreatedDate' },
  { id: 'updatedDate', label: 'UpdatedDate' }
];


function Inventory() {

  const [connection, setConnection] = useState(null);
  const [inputText, setInputText] = useState("");

 const navigate = useNavigate();

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl("https://localhost:7064/products-hub")
      .withAutomaticReconnect()
      .build();

    setConnection(connect);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("receiveProductAddedMessage", (message) => {
            notification.open({
              message: "New Notification",
              description: message,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [connection]);

  const sendMessage = async () => {
    if (connection) await connection.send("SendMessage", inputText);
    setInputText("");
  };
/////////////////////////
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetFormControls
} = useForm(ModelObjectInventory);


  const [notify, setNotify] = useState({ isOpen: false })
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchList, setSearchList] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  // const [currentPage, setCurrentPage] = useState(1);

  // const itemsPerPage = 25;
  // const totalPages = Math.ceil(dataSource.length / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;

  const handleOpenDialog = (productId) => {
    try {
      setSelectedProductId(productId);
      const response =  axios.get(`https://localhost:7064/api/Products/GetProductImages/${productId}`);
      if (response.data) {
        setOpen(true);
        setProductImages(response.data);
      } else {
        setOpen(true);
      }
    } catch (error) {
      console.log(error);
      // Handle error
    }
  }

  // const handleOpenDialog = (productId) => {
  //   setSelectedProductId(productId);
  //   setOpen(true);
  //   axios.get(`/products/${productId}/images`)
  //     .then((response) => {
  //       setProductImages(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleAddImage = (productId) => {
    
  };

  const handleDeleteImage = (imageId) => {
    // handle deleting the selected image
  };


 useEffect(()=>{
 localStorage.getItem('token')
    axios.get('https://localhost:7064/api/Products' ,  {
            headers: {
                'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
        }}).
    then(res=>{
        setData(res.data.products)
        setSearchList(res.data.products)

    }).catch(err=>{
      console.log(err)
      navigate("/mainpage")
    })
 },[])

 useEffect(() => {
  let x = [...data];
  x = x.filter(y => {
      return y.name.toLowerCase().includes(searchKey.toLocaleLowerCase())
         
  });
  setSearchList(x);
}, [searchKey])



 
 const submitProduct = e => {
  e.preventDefault();
    axios.post('https://localhost:7064/api/Products',values , {
      headers: {
          'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
  }})
    .then(res=>{
      resetFormControls();
        setNotify({isOpen:true, message:'New order is created.'});
    })
    .catch(function (error) {
      if (error.response) {
        
        error.response.data.map((item,idx)=>{
          resetFormControls();
          setNotify({isOpen:true, message: item.value});
        })
 
    }})
  }

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setDeleteConfirmationOpen(true);
  };

  const handleCancelDelete = () => {
    setSelectedItem(null);
    setDeleteConfirmationOpen(false);
  };

  const handleConfirmDelete = async () => {
    setDeleteConfirmationOpen(false);
    try {
      await axios.delete(`https://localhost:7064/api/Products/${selectedItem.id}`);
      setData(data.filter((item) => item.id !== selectedItem.id));
      setSelectedItem(null);
    } catch (error) {
      console.log(error);
    }
  };

  const renderTableHeader = () => {
    return (
      <tr>
        <th>ID</th>
        <th>NAME</th>
        <th>STOCK</th>
        <th>PRICE</th>
        <th>CREATEDDATE</th>
        <th>UPDATEDDATE</th>
      </tr>
    );
  };

  const renderTableData = () => {
    const startIndex = currentPage * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, data.length);
    return searchList.slice(startIndex, endIndex).map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.stock}</td>
          <td>{item.price}</td>
          <td>{item.createdDate}</td>
          <td>{item.updatedDate}</td>
          <td>
            <Button variant="contained" color="primary">
              Edit
            </Button>
          </td>
          <td>
             <Button variant="outlined" color="primary" onClick={() => handleOpenDialog(item.id)}>
              Images
             </Button>
          </td>
          <td>
             <Button variant="outlined" color="primary" onClick={() => handleUploadFile(item.id)}>
              Add Image
             </Button>
             <input type="file" multiple  onChange={handleFileInput} />

          </td>
          <td>
            <Button variant="contained" color="secondary" onClick={() => handleDelete(item)}>
              Delete
            </Button>
          </td>
        </tr>
      );
    });
  };
//////////////////////////

const [selectedFile, setSelectedFile] = useState(null);

const handleFileInput = (event) => {
  setSelectedFile(event.target.files[0]);
};

const handleUploadFile = (productId)  => {
  const formData = new FormData();
  formData.append(selectedFile.name, selectedFile);
  formData.append('id', productId);
  debugger;
  axios.post(`https://localhost:7064/api/Products/Upload/`, formData , {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((response) => {
      console.log(response);
      alert('File uploaded successfully!');
    })
    .catch((error) => {
      console.error(error);
      alert('Failed to upload file!');
    });
};


  return (
    <>
     
      <Typography.Title level={4}>Inventory</Typography.Title>
     
      <Form onSubmit={submitProduct}>
        <Grid container>
          <Grid item xs={6}>
            <Input
              value={values.name}
              onChange={e => setValues({ ...values, name: e.target.value })} />
            <Input
              value={values.price}
              onChange={e => setValues({ ...values, price: e.target.value })} />
            <Input
              value={values.stock}
              onChange={e => setValues({ ...values, stock: e.target.value })} />
            <Button
              type="submit">
              Submit Order
            </Button>

          </Grid>
        </Grid>
      </Form>
      <br/>
      <Paper>
                <InputBase
              
                    value={searchKey}
                    onChange={e => setSearchKey(e.target.value)}
                    placeholder="Search For Book" />
               
            </Paper>
            <br/>

          <Paper className={classes.myCustomStyle}>
            <div>
            <table style={{ width: '800px' }}>
              <thead>{renderTableHeader()}</thead>
              <tbody>{renderTableData()}</tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
                    <div>
                      <span>Rows per page:</span>
                      <select value={rowsPerPage} onChange={handleChangeRowsPerPage}>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <div>
                      <span>{currentPage}</span>
                      <button onClick={(event) => handleChangePage(event, currentPage - 1)} disabled={currentPage === 0}>
                    Previous
                  </button>
                  <span>
                    {currentPage * rowsPerPage + 1}-{Math.min((currentPage + 1) * rowsPerPage, data.length)} of {data.length}
                  </span>
                  <button onClick={(event) => handleChangePage(event, currentPage + 1)} disabled={currentPage === Math.floor(data.length / rowsPerPage)}>
                    Next
                  </button>
                </div>
              </div>
              <Dialog open={deleteConfirmationOpen} onClose={handleCancelDelete}>
                <DialogTitle>Delete Confirmation</DialogTitle>
                <DialogContent>
                  <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCancelDelete} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmDelete} color="secondary">
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
              <Dialog open={open} onClose={handleCloseDialog}>
                
        <DialogTitle>Images of Product {selectedProductId}</DialogTitle>
        <DialogContent>
          <div className={classes.root}>
            {productImages.map((image) => (
              <div key={image.id}>
                <img src={image.url} alt={`Product ${selectedProductId} Image`} />
                <Button variant="outlined" color="secondary" onClick={() => handleDeleteImage(image.id)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="secondary" onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
        </div>
        </Paper>
        <Input
        value={inputText}
        onChange={(input) => {
          setInputText(input.target.value);
        }}
      />
      <Button onClick={sendMessage} type="primary">
        Send
      </Button>
    <Notification
        {...{ notify, setNotify }} /></>
    
  );
}
export default Inventory;
