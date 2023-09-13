import axios from 'axios'
const login = (username, password) => {
    return axios.post(`/auth/login`, { username, password })
}

const getUser = (username, password) => {
    const accessToken = localStorage.getItem("accessToken");
    return axios.get(`/auth/user`,
        { headers: { "x-auth-token": accessToken } }
    )
}

const callapi = { login, getUser }

export default callapi