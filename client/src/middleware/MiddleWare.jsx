import React , {useEffect}from 'react'
import Cookies from "js-cookie";
import { useDispatch, useSelector  } from "react-redux";
import RefreshToken from "../pages/RefreshToken";
import {setDataToken , setUser} from "../redux/counterSlice"
import instace from '../pages/customer_axios';


function MiddleWare({ children }) {
    const dispatch  = useDispatch()
    const counter = useSelector((state) => state.counter);
    let { dataToken, user } = counter;
    let token = Cookies.get('datatoken')
    useEffect(() => {
        const fetch = async () => {
          try {
            if (token) {
              const newDatatoken = await RefreshToken(dataToken);
              dispatch(setDataToken(newDatatoken));
              const datauser = await instace.get("/auth/profile", {
                headers: {
                  Authorization: `Bearer ${
                    newDatatoken ? newDatatoken.accessToken : ""
                  }`,
                },
              });
              dispatch(setUser(datauser.data));
            } else {
              const datauser = await instace.get("/auth/profile", {
                headers: {
                  Authorization: `Bearer ${token ? dataToken.accessToken : ""}`,
                },
              });
              dispatch(setUser(datauser.data));
            }
          } catch (error) {
            console.log(error);
          }
        };
        fetch();
      }, []);

    console.log(dataToken, user);
    if(token ){
        return children
    }else{
        return  window.location.href = '/';
    }
}

export default MiddleWare