import { Avatar,  Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import Form from "./Form";
import { useForm } from "../../hooks/useForm";


const getFreshModelObject = () => ({

  studentName : ''

})

function Customers() {

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetFormControls
} = useForm(getFreshModelObject);

  // const [studentName,SetStudentName] = useState("")

    const submitOrder = e => {
      debugger;
        console.log(values.studentName)

        //write your post method in here
        //dont forget create model object
        }
        
     



  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Customers</Typography.Title>
      <Form onSubmit={submitOrder}>
        <input 
        value={values.studentName}
        onChange={e=>setValues({...values, studentName : e.target.value})}/>
        <button
        type="submit"
        className="btn btn-primary"
        >Deneme</button>
      </Form>
      
    </Space>
  );
}
export default Customers;
