import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Logs from "../components/log";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Grid } from "@mui/material";
import "../components/accsetss/sharePixels.css";
import Button from "@mui/material/Button";
import chromeTask from "../services/chrome";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import instace from "./customer_axios";
import RefreshToken from "./RefreshToken";
import { setUser, setDataToken } from "../redux/counterSlice";
import { useDispatch, useSelector } from "react-redux";

const SharePixel = (props) => {
  const counter = useSelector((state) => state.counter);
  let { dataToken, user } = counter
  const dispatch = useDispatch()
  const { t } = useTranslation();
  const [pixelValue, setPixelValue] = useState("");
  const [selectedValue, setSelectedValue] = useState('');
  const [tokens, settokens] = useState("");
  const [log, setLog] = useState([])
  const [options, setoptions] = useState([]);
  const [optionPixel, setOptionPixel] = useState([]);

  const [dataSharePixel, setdataSharePixel] = useState({});
  const [adlistValue, setAdlistValue] = useState([]);
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const bmid = async () => {
      const authFb = await chromeTask.getAuthFb();
      settokens(authFb.token);

      try {
        const abc = await chromeTask.getBusiness_id(authFb);
        const datas = abc.map((value) => {
          return { value: value.id, label: value.id };
        });
        setSelectedValue(datas[0].value);
        setoptions(datas);
      } catch (error) {
      }
    };
    bmid();
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      setdataSharePixel({ idBm: selectedValue });
      const res = await chromeTask.getpixelBM(selectedValue, tokens);
      if (res.owned_pixels?.data) {
        const datas = res.owned_pixels.data.map((value) => {
          return { value: value.id, label: `${value.id}|${value.name}` };
        });
        setPixelValue(datas[0]?.value);
        setOptionPixel(datas);
      } else {
        setPixelValue("Dose have an account!");
        setOptionPixel([{ value: "Dose have an account!", label: "Dose have an account!" }]);
      }
      setSelectedValue(selectedValue);
    };
    fetchdata();
  }, [selectedValue]);

  const handleChangeBM = async (event, newValue) => {
    setdataSharePixel({ idBm: newValue.value });
    const res = await chromeTask.getpixelBM(newValue.value, tokens);
    if (res.owned_pixels?.data) {
      const datas = res.owned_pixels.data.map((value) => {
        return { value: value.id, label: `${value.id}|${value.name}` };
      });
      setPixelValue(datas[0]?.value);
      setOptionPixel(datas);
    } else {
      setPixelValue("Dose have an account!");
      setOptionPixel([{ value: "Dose have an account!", label: "Dose have an account!" }]);
    }
    setSelectedValue(newValue.value);
  };


  const handleSharePixel = async () => {
    const newDatatoken = await RefreshToken(dataToken);
    dispatch(setDataToken(newDatatoken));
    // setOpen(true);
    // if (selectedValue.length === 0) {
    //   return setError('không phải tài khoản bm');
    // } else if (pixelValue === 'Dose have an account!') {
    //   return setError('không có tài khoản pixelValue');
    // } else if (selectedValue.length === 0 || adlistValue.length === 0 || pixelValue === '') {
    //   return setError('các trường không để trống');
    // } else {
    //   try {
    //     let option = {
    //       token: tokens,
    //       idBm: dataSharePixel.idBm,
    //       idPixel: pixelValue,
    //       listidAds: processedAdlist,
    //     };
    //     const btnsharepixel = async()=>{
    //       let Arraydata = [];
    //       await Promise.all(processedAdlist.map(async (value) => {
    //         const res = await chromeTask.SharePixel_one(tokens, dataSharePixel.idBm, pixelValue, value);
    //         Arraydata.push(res);
    //       }));
    //       return Arraydata
    //     }
    //     const kq = await btnsharepixel();
    //     const data = kq;
    //     let array = [];
    //     data.map((value) => {
    //         let messages = "";
    //         if (value.obj.success) {
    setOpen(true);

    try {
      const data = await instace.post('/buypackage/checkedaction', {
        product_name: "share pixel"
      }, {
        headers: {
          Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""
            }`,
        },
      })
      if (data.data.status === true) {
        if (selectedValue.length === 0) {
          return setError('không phải tài khoản bm');
        } else if (pixelValue === 'Dose have an account!') {
          return setError('không có tài khoản pixelValue');
        } else if (selectedValue.length === 0 || adlistValue.length === 0 || pixelValue === '') {
          return setError('các trường không để trống');
        } else {
          try {
            let option = {
              token: tokens,
              idBm: dataSharePixel.idBm,
              idPixel: pixelValue,
              listidAds: processedAdlist,
            };
            const btnsharepixel = async()=>{
              let Arraydata = [];
              await Promise.all(processedAdlist.map(async (value) => {
                const res = await chromeTask.SharePixel_one(tokens, dataSharePixel.idBm, pixelValue, value);
                Arraydata.push(res);
              }));
              return Arraydata
            }
            const kq = await btnsharepixel();
            const data = kq;
            let array = [];
            data.map((value) => {
                let messages = "";
                if (value.obj.success) {

                  messages = `${value.idBm} ---> ${value.idPixel} ---> ${value.idAds} Share thành công`;
                } else {
                  if (value.obj.error) {
                    messages = value.obj.error.message;
                  }
                }
                array.push(messages);

            });
            setLog(array);
          } catch (error) {
            console.error(error);
          }
        }
      }
    } catch (error) {
      setError(error.response.data.message)
    }
  };

  const [processedAdlist, setProcessedAdlist] = useState([]);

  const handleChangeAdlist = (e) => {
    const inputValue = e.target.value;
    setAdlistValue(inputValue);

    if (inputValue.length > 0) {
      const combinedArray = inputValue
        .split(/,\s|\s/)
        .filter((item) => item.trim() !== "");
      setProcessedAdlist(combinedArray);
    }
  };

  const handlechangePixel = (event, newValue) => {
    setPixelValue(newValue);
  };
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
        </div>
        <div className="link-text">{t("sharepixel")}</div>
      </div>
      <div className="tab-content">
        <div className="main-screen">
          <div className="screen">
            <div className="main">
              <div className="sharepixel">
                <span className="txtelegantshadow">{t("business")}</span>
                <Autocomplete
                  onChange={handleChangeBM}
                  value={selectedValue}
                  disablePortal
                  clearIcon={null}
                  id="combo-box-demo"
                  options={options}
                  // defaultValue={options[0]?.value}
                  disableClearable

                  sx={{ width: 200 }}
                  ListboxProps={{
                    style: { fontSize: '12px' },
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
              <div className="sharepixel">
                <span className="txtelegantshadow">Pixel</span>
                <Autocomplete
                  onChange={handlechangePixel}
                  disablePortal
                  clearIcon={null}
                  value={pixelValue}
                  disableClearable
                  id="combo-box-demo"
                  ListboxProps={{
                    style: { fontSize: '12px' },
                  }}
                  options={optionPixel}
                  sx={{ width: 200 }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
              <div className="sharepixel">
                <span className="txtelegantshadow">{t("enterAdList")}</span>
                <textarea
                  style={{ width: "202px", padding: "0px", fontSize: "12.6px", outline: "none", border: "1px solid #c4c4c4", resize: "none" }}

                  className="text-area"
                  value={adlistValue}
                  onChange={handleChangeAdlist}
                ></textarea>
              </div>
              <div className="sharepixelbtn">
                <Button
                  className="sharepixel_btn"
                  onClick={handleSharePixel}
                  variant="contained"
                >
                  {t("share")}
                </Button>
                {error.length > 0 ? (
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
              </div>
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
export default SharePixel;
