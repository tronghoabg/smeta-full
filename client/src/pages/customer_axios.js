import axios from "axios";

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