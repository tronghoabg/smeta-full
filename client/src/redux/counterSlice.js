import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

let token = Cookies.get("datatoken");
const counterSlice = createSlice({
  name: "counter",
  initialState: {
    dataToken: token ? JSON.parse(token) : null,
    test: true,
    user: null,
    loading: false,
    payment: false,
    isSidebar:true,
    payFocus: false,
    selectedDashboard: 'main'
  },
  reducers: {
    setDataToken: (state, data) => {
      state.dataToken = data.payload;
    },
    setPayFocus: (state, data) => {
      state.payFocus = data.payload;
    },
    setUser: (state, data) => {
      state.user = data.payload;
    },
    settest: (state, data) => {
      state.test = data.payload;
    },
    setdarkmode: (state, action) =>{
      state.darkmode = action.payload
     },
     setloading: (state, action) =>{
      state.loading = action.payload
     },
     setpayment: (state, action) =>{
      state.payment = action.payload
     },
     setisSidebar: (state, action) =>{
      state.isSidebar = action.payload
     },
     setSelectedDashboard: (state, action) => {
      state.selectedDashboard = action.payload;
    },
  },
});

export const { setDataToken, settest,setPayFocus, setUser,setdarkmode ,setloading,setpayment,setisSidebar,setSelectedDashboard} = counterSlice.actions;
export default counterSlice.reducer;
