import { useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';


export const ProtectRoutes = () => {
    const token = localStorage.getItem('access-token')
    if(token){
            return <Outlet/>
    }
    else{
        <Navigate to='/login' exact />
    }
    // return token ? <Outlet/> : <Navigate to='/login' exact />
   
};

