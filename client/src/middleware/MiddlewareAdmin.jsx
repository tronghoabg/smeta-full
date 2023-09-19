import React from 'react'
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import Loading from '../components/Loading';


function MiddleWareAdmin({  user, children }) {

    // const counter = useSelector((state) => state.counter);
    // let { dataToken, user } = counter;
    let token = Cookies.get('datatoken')
    console.log(user, "check admin");
    if(user === null){
        return  <Loading/>
    }
    if(token && user && user?.role == "admin"){
        return children
    }else{
        return  window.location.href = '/';
    }
}

export default MiddleWareAdmin