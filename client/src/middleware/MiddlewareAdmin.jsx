import React from 'react'
import Cookies from "js-cookie";
import Loading from '../components/Loading';


function MiddleWareAdmin({  user, children }) {

    // const counter = useSelector((state) => state.counter);
    // let { dataToken, user } = counter;
    let token = Cookies.get('datatoken')
    if(!token){
        return  window.location.href = '/';
    }
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