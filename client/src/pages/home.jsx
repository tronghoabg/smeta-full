import { useState, useEffect } from "react";
import TabList from "../components/tabList";
import chromeTask from "../services/chrome";

const Home = (props) => {
  const [isInstall, setInstall] = useState(true);
  // const [ setIsLoginFb] = useState(true);


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

  // const isNotLogin = () => {
  //   setIsLoginFb(true);
  // };

  return (
    <>
    {isInstall &&
          <TabList />
    }
    </>
  );
};

export default Home;
