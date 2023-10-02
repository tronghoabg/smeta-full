import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "./sidebar";
import { NavLink } from "react-router-dom";
import "../components/accsetss/header.css";
const Header = (props) => {
  const { isShowHeader } = props;
  const { t } = useTranslation();
  const [sidebarOpen, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebarOpen);
  const [fbname, setFbname] = useState("");
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const sidebarElement = document.querySelector(".sidebar");

      if (
        sidebarElement &&
        !sidebarElement.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setSidebar(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const Facebookname = localStorage.getItem("facebookname");
    setFbname(Facebookname);
  }, []);

  return (
    <header>
      <div className="header-left">
        {isShowHeader &&
          <div className="btnMenu" ref={buttonRef} onClick={showSidebar}>
            <i className="fa-solid fa-bars"></i>
          </div>
        }
      </div>
      <div className="header-mid">
        <NavLink to="/extention">
          <img className="logo" src="/logo.png" alt="sMeta.vn"></img>
        </NavLink>
      </div>
      <div className="header-right">
        <i className="fa-brands fa-facebook"></i>
        <div className="header-right--name">
          {fbname !== "undefined" ? fbname : t("-")}
        </div>
      </div>
      {sidebarOpen && <Sidebar active={setSidebar} />}
    </header>
  );
};

export default Header;
