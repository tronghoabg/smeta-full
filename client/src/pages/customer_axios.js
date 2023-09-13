import axios from "axios";
import Cookies from 'js-cookie';
let token = Cookies.get('datatoken')

const instace = axios.create({
    baseURL:'/api'
})

// instace.defaults.headers.common['Authorization'] = `Bearer ${token ?  JSON.parse(token).accessToken : null}`;
// instace.interceptors.response.use(function(rep){
//     return rep
// },function(error){
//     return Promise.reject(error)
// })

export default instace