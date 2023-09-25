import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Logs from "../components/log";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import "../components/accsetss/sharePixels.css";
import Button from "@mui/material/Button";
import chromeTask from "../services/chrome";
import instace from "./customer_axios";
import { setDataToken } from "../redux/counterSlice";
import { useDispatch, useSelector } from "react-redux";
import RefreshToken from "./RefreshToken";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const CreateAccount = (props) => {
  const [error, setError] = useState("");

  const counter = useSelector((state) => state.counter);
  let { dataToken } = counter
  const dispatch=useDispatch()
  const { t } = useTranslation();
  const [options, setOptions] = useState([]);
  const [bmSelected, setBmSelected] = useState(null);
  const [accountName, setAccountName] = useState("sMeta");
  const [slot, setSlot] = useState(0);
  const [qty, setQty] = useState(slot);
  const [delay, setDelay] = useState(0);
  const [log, setLog] = useState([]);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    async function fetchData() {
      let res = await chromeTask.get_bm_select();
      const datas = res.map((item) => {
        return {
          id: item.id,
          label: item.id,
          currency: item.currency,
          lv: item.lv,
          adaccount: item.adaccount,
          timezone: item.timezone
        };
      });

      setOptions(datas);
      setBmSelected(datas[0]);
    }
    fetchData();
  }, []);

  const changeHandler = (e, bmCurrent) => {
    setSlot(bmCurrent.lv - bmCurrent.adaccount);
    setQty(bmCurrent.lv - bmCurrent.adaccount);
    setBmSelected(bmCurrent);
  };

  const handlerQty = (value) => {
    if (value > bmSelected.lv - bmSelected.adaccount) {
      setQty(bmSelected.lv - bmSelected.adaccount);
      return;
    }
    setQty(value);
  };

  const fDelay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handlerCreate = async () => {
    const newDatatoken = await RefreshToken(dataToken);
    dispatch(setDataToken(newDatatoken));
    setOpen(true)
    try {
      const data  = await instace.post('/buypackage/checkedaction', {
        product_name: "Create Ad Account"
      }, {
        headers: {
          Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""
              }`,
      },
      }
      )
      if(data.data.status === true){

      }
      setLog([])
      if (!bmSelected || !accountName || !qty) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
      }
  
      for (var i = 1; i <= qty; i++) {
        let create = await chromeTask.create_ad_account(
          bmSelected.id,
          `${accountName}_${i}`,
          bmSelected.currency,
          bmSelected.timezone
        )
        create = `${i}: ${create}`
        const newLog = (log) => {
          return [...log, create]
        }
  
        setLog(newLog)
        await fDelay(delay * 1000);
      }
  } catch (error) {
    setError(error.response.data.message)
  }
  };

  return (
    <>
      <div className="tool-bar">
        <div className="icon">
          <i className="fa-solid fa-shapes"></i>
          <span>{t("createAdAccount")}</span>
        </div>
      </div>
      <div className="tab-content">
        <div className="main-screen">
          <div className="screen">
            <div className="main">
              <div className="sharepixel text-front">
                <span className="txtelegantshadow">{t("business")}</span>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  defaultValue={options[0]}
                  value={bmSelected}
                  options={options}
                  getOptionLabel={(options) =>
                    `${options.label} | ${options.lv} | ${options.currency}` ||
                    ""
                  }
                  ListboxProps={{
                    style: { fontSize: "13px" },
                  }}
                  clearIcon={null}
                  onChange={(e, v) => changeHandler(e, v)}
                  sx={{ width: 200 }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
              <div className="sharepixel">
                <span className="txtelegantshadow ml_10">
                  {t("businessinfo")}
                </span>
                <ul className="business-info createaccount">
                  <li>{`ID: ${bmSelected ? bmSelected.id : ""}`}</li>
                  <li>{`${t("currency")}: ${bmSelected ? bmSelected.currency : ""
                    }`}</li>
                  <li>{`${t("limit")}: ${bmSelected ? bmSelected.lv : ""}`}</li>
                  <li>{`ID: ${bmSelected ? bmSelected.adaccount : ""}`}</li>
                  <li>{`Còn lại: ${bmSelected ? slot : ""}`}</li>
                </ul>
              </div>
              <div className="sharepixel">
                <span className="txtelegantshadow">{t("accountName")}</span>
                <TextField
                  id="outlined-number"
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  sx={{ width: 200 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div className="sharepixel">
                <span className="txtelegantshadow">{t("quantity")}</span>
                <TextField
                  id="outlined-number"
                  type="number"
                  disabled={slot < 1}
                  value={qty}
                  onChange={(e) => handlerQty(e.target.value)}
                  sx={{ width: 200 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>

              <div className="sharepixel">
                <span className="txtelegantshadow">Delay(s)</span>
                <TextField
                  id="outlined-number"
                  type="number"
                  value={delay}
                  onChange={(e) => setDelay(e.target.value)}
                  sx={{ width: 200 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div className="sharepixelbtn">
                <Button
                  className="sharepixel_btn"
                  variant="contained"
                  onClick={handlerCreate}
                >
                  {t("create")}
                </Button>
              </div>
              {error.length > 0 ? (
                  <Snackbar
                    open={open}
                    autoHideDuration={6000}
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
            </div>
          </div>
          <div className="screen">
            <Logs log={log} />
          </div>
        </div>
      </div>
    </>
  );
};
export default CreateAccount;
