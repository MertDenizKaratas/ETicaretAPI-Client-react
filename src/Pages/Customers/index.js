// import React from 'react'
// import { useForm } from '../../hooks/useForm';
// import { Grid } from '@material-ui/core';
// import Customers from './indextir';


// // const generateOrderNumber = () => Math.floor(100000 + Math.random() * 900000).toString();

// const getFreshModelObject = () => ({

//     studentName : ''

// })


// export default function Order() {

//     const {
//         values,
//         setValues,
//         errors,
//         setErrors,
//         handleInputChange,
//         resetFormControls
//     } = useForm(getFreshModelObject);
//     console.log(`values`)
//     console.log(values)
//     return (
//         <Grid container spacing={2}>
//             <Grid item xs={12}>
//                 <Customers
//                     {...{
//                         values,
//                         setValues,
//                         errors,
//                         setErrors,
//                         handleInputChange,
//                         resetFormControls
//                     }}
//                 />
//             </Grid>
//         </Grid>
//     )
// }
