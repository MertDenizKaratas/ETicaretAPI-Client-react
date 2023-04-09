import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,  Checkbox, List,
  ListItem, FormControlLabel } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

function App() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false); // state to track whether the dialog is open or not
  const [roles, setRoles] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [code , setCode] = useState("")
  const [menu , setMenu] = useState("")
  const [selectedRoles, setSelectedRoles] = useState([]);

  const navigate = useNavigate()

  useEffect(() => {
    // Fetch the initial items
    axios.get( 'https://localhost:7064/api/ApplicationServices', {
        headers: {
            'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
    }}).then((res) => {
       setData(res.data)


    }).catch((err)=>{

      navigate("/mainpage")
    })
  }, []);

  function handleButtonClick(itemCode, ItemMenu) {
    setOpen(true);
    setCode(itemCode)
    setMenu(ItemMenu)
    const aboo = {
      'code':itemCode,
      'menu':ItemMenu,
    };
    axios.get( 'https://localhost:7064/api/Roles', {
        headers: {
            'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
    }}).then((res) => {
       setRoles(res.data.datas)
    });

    axios.post( 'https://localhost:7064/api/AuthorizationEndpoints/GetRolesToEndpoint', aboo, {
        headers: {
            'Authorization' : 'Bearer'+' ' + localStorage.getItem('access-token')
    }}).then((res)=>{
      res.data.roles?.map((item)=>{
        setCheckedItems([...checkedItems , item])
      })
      setSelectedRoles(res.data);
    }).catch((err)=>{
      navigate("/login")
    })
  }

  
  
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
      'code':code,
      'menu':menu,
      'roles':checkedItems
    };
   
    axios
      .post("https://localhost:7064/api/AuthorizationEndpoints/AssignRoleEndpoint", formData  , {
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
  

  return (
    <div>
    {data.map((person) => (
      <div key={person.name}>
        <h2>{person.name}</h2>
        <ul>
          {person.actions.map((item, idx) => (
            <li key={idx}>{item.definition}
            <Button 
            onClick={() => handleButtonClick(item.code, person.name)} color="primary" >Assign Role</Button>
            </li>
          ))}
        </ul>
      </div>
    ))}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Items</DialogTitle>
        <DialogContent>
          <List>
            {roles.map((item) => (
              <ListItem key={item.id}>
                <FormControlLabel
                  control={<Checkbox checked={checkedItems.includes(item.name)} value={item.name} onChange={handleCheck} />}
                  label={item.name}
                />
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
      </Dialog>
  </div>
  );
          }

export default App;




















