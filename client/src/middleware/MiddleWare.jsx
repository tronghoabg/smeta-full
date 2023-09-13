import React from 'react'
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";


function MiddleWare({   children }) {

    const counter = useSelector((state) => state.counter);
    let { dataToken, user } = counter;
    let token = Cookies.get('datatoken')
    if(token && user){
        return children
    }else{
        return  window.location.href = '/';
    }
}

export default MiddleWare