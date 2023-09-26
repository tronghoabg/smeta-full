import { useState, useEffect } from "react";
import TabList from "../components/tabList";
import Install from "./install";
import InToLogin from "./intologin";
import chromeTask from "../services/chrome";

const Home = (props) => {
  const [isInstall, setInstall] = useState(false);
  const [isLoginFb, setIsLoginFb] = useState(true);


  useEffect(() => {
    async function fetchData() {
      let checkInstall = await chromeTask.sendTask("checkinstall");
      if (checkInstall === "not install") {
        setInstall(false);
        return;
      }
    }
    fetchData();
  }, []);

  const isNotLogin = () => {
    setIsLoginFb(true);
    console.log("not login");
  };

  return (
    <>
    {isInstall &&
          <TabList />
    }
    </>
  );
};

export default Home;
