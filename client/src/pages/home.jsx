import { useState, useEffect } from "react";
import TabList from "../components/tabList";
import InToLogin from "./intologin";
import Install from './install'
import chromeTask from "../services/chrome";

const Home = (props) => {
  const {handlerShowHeader} = props
  const [isInstall, setInstall] = useState(true);
  const [isLoginFb, setIsLoginFb] = useState(true);


  useEffect(() => {
    async function fetchData() {
      let checkInstall = await chromeTask.sendTask("checkinstall");
      if (checkInstall === "not install") {
        handlerShowHeader()
        setInstall(false);
        return;
      }
    }
    fetchData();
  }, []);

  const isNotLogin = () => {
    setIsLoginFb(false);
    handlerShowHeader()
  };
  // const isNotLogin = () => {
  //   setIsLoginFb(true);
  // };

  return (
    <>
        {isInstall ?
          <>    
          {!isLoginFb ?
                <InToLogin/>
              :
                <TabList isNotLogin={isNotLogin}/>
              }
              </>
              :
              <Install/>
        }
    </>
  );
};

export default Home;
