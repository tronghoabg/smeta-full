import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import CreateAccount from "./pages/createAccount";
import Login from "./pages/login";
import Register from "./pages/register";
import SetCamp from "./pages/setcamp";
import ShareAccount from "./pages/shareAccount";
import SharePixel from "./pages/sharePixel";
import { useEffect, useState } from "react";
import Test from "./pages/test";
import Verifypassword from "./pages/verifypassword";
import instace from "./pages/customer_axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setDataToken } from "./redux/counterSlice";
import Cookies from "js-cookie";
import RefreshToken from "./pages/RefreshToken";
import Dashboard from "./components/admin/Dashboard";
import Profile from "./pages/profile";
import MiddleWare from "./middleware/MiddleWare";
import MiddleWareAdmin from "./middleware/MiddlewareAdmin";
import Payment from "./pages/payment";
import PaymentSuccess from "./pages/PaymentSuccess";


function App() {
  const [disable, setdisable] = useState(true);
  const [isShowHeader, setShowHeader] = useState(true)
  let token = Cookies.get("datatoken");
  // const checked = token ? JSON.parse(token).accessToken : null;
  const counter = useSelector((state) => state.counter);
  let { dataToken, user } = counter;

  const dispatch = useDispatch();


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
          // const datauser = await instace.get("/auth/profile", {
          //   headers: {
          //     Authorization: `Bearer ${checked ? checked.accessToken : ""}`,
          //   },
          // });
          // dispatch(setUser(datauser.data));
          dispatch(setUser(null));

        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  const handlerShowHeader = () => {
    setShowHeader(false)
  }
 
  return (
    <>
      <Routes>
        <Route path="/payment" element={<Payment />}></Route>
        <Route path="/paymentsuccess" element={<PaymentSuccess />}></Route>
        <Route
          path="/admin"
          element={
            <MiddleWareAdmin user={user}>
              <Dashboard setdisable={setdisable} />
            </MiddleWareAdmin>
          }
        />
        <Route path="/" element={<Test setdisable={setdisable} />} />
        <Route path="/login" element={<Login setdisable={setdisable} />} />
        <Route
          path="/verifypassword"
          element={<Verifypassword setdisable={setdisable} />}
        />
        <Route
          path="/register"
          element={<Register setdisable={setdisable} />}
        />
        <Route
          path="/profile"
          element={
            <MiddleWare>
              <Profile setdisable={setdisable} />
            </MiddleWare>
          }
        />
         {/* <Route
          path="/paymentoption"
          element={
            <MiddleWare>
              <Newpaymentpackage setdisable={setdisable} />
            </MiddleWare>
          }
        /> */}
      </Routes>

      {disable ? (
        <div className="app-container">
          <Header isShowHeader={isShowHeader}/>
          <div className="containers">
                <Routes>
                  <Route
                    path="/extention"
                    element={<Home handlerShowHeader={handlerShowHeader}/>}
                  />
                  <Route path="/createadaccount" element={<CreateAccount />} />
                  <Route path="/setcamp" element={<SetCamp />} />
                  <Route path="/shareadaccount" element={<ShareAccount />} />
                  <Route path="/sharepixel" element={<SharePixel />} />
                </Routes>
          </div>
          <Footer />
        </div>
      ) : null}
    </>
  );
}

export default App;
