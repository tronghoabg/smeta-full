import { useTranslation } from "react-i18next";
import { useState } from "react";
import Logs from "../components/log";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import "../components/accsetss/sharePixels.css";
import Button from "@mui/material/Button";
import chromeTask from "../services/chrome";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import RefreshToken from "./RefreshToken";
import { setDataToken } from "../redux/counterSlice";
import { useDispatch, useSelector } from "react-redux";
import instace from "./customer_axios";

const SharePixel = (props) => {
  const { t } = useTranslation();
  const [listTKQC, setListTKQC] = useState([]);
  const [listUser_id, setListUser_id] = useState([]);
  const [listrole, setListrole] = useState("");
  const [apilisttkqc, setApilisttkqc] = useState([]);
  const [apilistUser_id, setApilistUser_id] = useState([]);
  const [apirole, setApirole] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [log, setLog] = useState([]);
  const counter = useSelector((state) => state.counter);
  let { dataToken } = counter;
  const dispatch = useDispatch();
  const options = [
    { value: "281423141961500", label: t("admin") },
    { value: "461336843905730", label: t("advertisers") },
    { value: "498940650138739", label: t("analyst") },
  ];

  const handlelisttkqc = (e) => {
    const inputValue = e.target.value;
    setListTKQC(e.target.value);
    if (inputValue.length > 0) {
      const combinedArray = inputValue
        .split(/,\s|\s/)
        .filter((item) => item.trim() !== "");
      setApilisttkqc(combinedArray);
    }
  };

  const handlelistuser_id = (e) => {
    const inputValueuser = e.target.value;
    setListUser_id(e.target.value);
    if (inputValueuser.length > 0) {
      const combinedArray = inputValueuser
        .split(/,\s|\s/)
        .filter((item) => item.trim() !== "");
      setApilistUser_id(combinedArray);
    }
  };
  const hanlderole = (event, newValue) => {
    if (newValue) {
      setListrole(newValue.label);
      setApirole(newValue.value);
    } else {
      setListrole("vui lòng chọn quyền");
      setApirole("");
    }
  };

  async function btnsharetkqc() {
    setError("");
    setOpen(true);
    const tokensmeta = localStorage.getItem("tokensmeta");
    if (
      listTKQC.length === 0 ||
      listUser_id.length === 0 ||
      listrole.length === 0
    ) {
      return setError("Vui lòng nhập đầy đủ thông tin");
    } else if (listrole === "vui lòng chọn quyền") {
      return setError("Vui lòng chọn quyền");
    } else {
      const newDatatoken = await RefreshToken(dataToken);
      dispatch(setDataToken(newDatatoken));
      try {
        const dataa = await instace.post(
          "/buypackage/checkedaction",
          {
            product_name: "Share TKQC",
          },
          {
            headers: {
              Authorization: `Bearer ${
                newDatatoken ? newDatatoken.accessToken : ""
              }`,
            },
          }
        );
        if (dataa.data.status === true) {
        }
        const btnsharepixel = async () => {
          const tasks = apilisttkqc.map(async (tk) => {
            let Arraydata = [];
            for (let i = 0; i < apilistUser_id.length; i++) {
              let user = apilistUser_id[i];
              const res = await chromeTask.ShareTKQC_one(
                tokensmeta,
                tk,
                user,
                apirole
              );
              Arraydata.push(res);
            }
            return Arraydata;
          });
          return await Promise.all(tasks);
        };
        const kq = await btnsharepixel();
        setListTKQC("");
        setListUser_id("");
        const data = kq;
        let array = [];
        data.map((item) => {
          item.map((value) => {
            let messages = "";
            if (value.obj.success) {
              messages = `${value.adacc} ---> ${value.user_id} Share thành công`;
            } else {
              if (value.obj.error) {
                messages = value.obj.error.message;
              }
            }
            array.push(messages);
          });
        });
        setLog(array);
      } catch (error) {
        setError(error.response.data.message);
      }
    }
  }
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <div className="tool-bar">
        <div className="icon">
          <i className="fa-solid fa-shapes"></i>
          <span>{t("shareAdAccount")}</span>
        </div>
      </div>

      <div className="tab-content">
        <div className="main-screen">
          <div className="screen">
            <form className="main">
              <div className="sharepixel">
                <span className="txtelegantshadow">{t("enterAdList")}</span>
                <textarea
                  style={{
                    width: "202px",
                    padding: "0px",
                    fontSize: "12.6px",
                    outline: "none",
                    border: "1px solid #c4c4c4",
                    resize: "none",
                  }}
                  className="text-area"
                  value={listTKQC}
                  onChange={handlelisttkqc}
                ></textarea>
              </div>
              <div className="sharepixel">
                <span className="txtelegantshadow">{t("enterUserList")}</span>
                <textarea
                  style={{
                    width: "202px",
                    padding: "0px",
                    fontSize: "12.6px",
                    outline: "none",
                    border: "1px solid #c4c4c4",
                    resize: "none",
                  }}
                  className="text-area"
                  value={listUser_id}
                  onChange={handlelistuser_id}
                ></textarea>
              </div>
              <div className="sharepixel">
                <span className="txtelegantshadow">{t("role")}</span>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={options}
                  onChange={hanlderole}
                  ListboxProps={{
                    style: { fontSize: "12px" },
                  }}
                  clearIcon={null}
                  value={listrole}
                  sx={{ width: 200 }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
              <div className="sharepixelbtn">
                <Button
                  className="sharepixel_btn"
                  variant="contained"
                  onClick={() => btnsharetkqc()}
                >
                  {t("share")}
                </Button>
              </div>
              {error ? (
                <Snackbar
                  open={open}
                  autoHideDuration={1000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "left" }}
                >
                  <Alert
                    onClose={handleClose}
                    severity="error"
                    sx={{ width: "100%" }}
                  >
                    {error}
                  </Alert>
                </Snackbar>
              ) : (
                <p>{null}</p>
              )}
            </form>
          </div>
          <div className="screen">
            <Logs log={log} />
          </div>
        </div>
      </div>
    </>
  );
};
export default SharePixel;
