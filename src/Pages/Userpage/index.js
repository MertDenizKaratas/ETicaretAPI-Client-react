import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,  Checkbox, List,
  ListItem, FormControlLabel } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  head: {
    backgroundColor: "#3f51b5",
  },
  headCell: {
    color: "#fff",
    fontWeight: "bold",
  },
  body: {
    backgroundColor: "#f5f5f5",
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#f2f2f2',
    },
  },
});

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false); 
  const [userno, setUserNo] = useState(""); 
  const [roles, setRoles] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

  const navigate = useNavigate()

  const classes = useStyles();

  useEffect(() => {
    axios.get("https://localhost:7064/api/Users",  {
        headers: {
            'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
    }})
      .then(res => {
        setUsers(res.data.users);
      })
      .catch(error => {
        navigate("/mainpage")
      });
  }, []);



 
  const handleClose = () => {
    setOpen(false); // set the state to close the dialog
    setCheckedItems([])
  };
    
    
  const handleCheck = (event) => {
    const item = event.target.value;
    const isChecked = event.target.checked;
    if (isChecked) {
      setCheckedItems([...checkedItems, item]);
    } else {
      setCheckedItems(checkedItems.filter((checkedItem) => checkedItem !== item));
    }
  };

  const handlePostCheckedItems = () => {
    const formData = {
      "userId":userno,
      'roles':checkedItems
    };
   
    axios
      .post('https://localhost:7064/api/Users/assign-role-to-user', formData  , {
        headers: {
            'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token'),
            'Content-Type': 'application/json'
    }})
      .then((response) => {
        handleClose();
        setCheckedItems([])
      })
      .catch((error) => {
        navigate("/login")
      });
  };

  function handleButtonClick(userId) {
    setOpen(true);
    setUserNo(userId)

    axios.get( 'https://localhost:7064/api/Roles', {
        headers: {
            'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
    }}).then((res) => {
       setRoles(res.data.datas)
    });

    axios.get( `https://localhost:7064/api/Users/get-roles-to-user/${userId}`, {
        headers: {
            'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
    }}).then((res)=>{
      res.data.userRoles.map((item)=>{
        setCheckedItems([...checkedItems , item])
      })
    })
  }






  return (
    <><TableContainer component={Paper}>
      <Table className={classes.table} aria-label="user table">
        <TableHead>
          <TableRow className={classes.head}>
            <TableCell className={classes.headCell}>Name</TableCell>
            <TableCell className={classes.headCell}>Username</TableCell>
            <TableCell className={classes.headCell}>Email</TableCell>
            <TableCell className={classes.headCell}>Assign Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className={classes.body}>
          {users.map((user) => (
            <TableRow key={user.id} className={classes.row}>
              <TableCell>{user.nameSurname}</TableCell>
              <TableCell>{user.userName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button  onClick={() => handleButtonClick(user.id)} variant="contained" color="primary">Role</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer><Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Items</DialogTitle>
        <DialogContent>
          <List>
            {roles.map((item) => (
              <ListItem key={item.id}>
                <FormControlLabel
                  control={<Checkbox checked={checkedItems.includes(item.name)} value={item.name} onChange={handleCheck} />}
                  label={item.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePostCheckedItems} color="primary">
            Post Checked Items
          </Button>
        </DialogActions>
      </Dialog></>
  );
};

export default UserTable;