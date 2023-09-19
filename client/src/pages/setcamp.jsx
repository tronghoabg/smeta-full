import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import "../components/accsetss/sharePixels.css";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Checkbox from "@mui/material/Checkbox";
import chromeTask from "../services/chrome";
import { Modal } from "antd";
import instace from "./customer_axios";
import { useDispatch, useSelector } from "react-redux";
import { setDataToken } from "../redux/counterSlice";
import RefreshToken from "./RefreshToken"; 

const SetCamp = (props) => {
  const counter = useSelector((state) => state.counter);
  let { dataToken } = counter
  const dispatch =useDispatch()
  const { t } = useTranslation();
  const [page, setPage] = useState({});
  const [checkQC, setCheckQC] = useState(true);
  const [quangcao, setQuangcao] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [phannhom, setPhannhom] = useState(10);
  const [tu, setTu] = useState(25);
  const [den, setDen] = useState(65);
  const [money, setMoney] = useState(20);
  const [checkedpost, setCheckedpost] = useState(false);
  const [optionID, setOptionId] = useState([]);
  const [idtkqc, setIdtkqc] = useState("");
  const [listpost, setlistPost] = useState([]);
  const [logs, setlogs] = useState([]);

  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const [valueSetcampAll, setvalueSetcampAll] = useState({
    TYPE: true,
    isDRAFT: true,
    name: "New Sales Campaign",
    min_age: 25,
    max_age: 65,
    gender: "0",
    posistion: "female",
    currency: "USD",
    budget: 20,
    defaultGroup: 1,
    copyGroup: false,
    numberGroup: 10,
    act_bm: "",
    // page_id: null,
    // post_id: null,
  });

  const gender = [
    { label: t('all'), value: "0" },
    { label: t('Male'), value: "1" },
    { label: t('Female'), value: "2" },
  ];
  const [arrayPage, setArrayPage] = useState([]);
  const [arrayPageValue, setArrayPageValue] = useState({});

  useEffect(() => {
    const fetch = async () => {
      var res = await chromeTask.load_data();
      if (!res || !res.listPage || res.listPage.length === 0) {
        setArrayPageValue({ label: "Chọn Page" });
        return;
      }
      let arrpage = res.listPage;
      const kq = arrpage.map((value) => {
        return { img: value.img, label: value.name, id: value.id };
      });
      setArrayPage(kq);
      setArrayPageValue({ label: " -" });
    };
    fetch();
  }, []);

  const handleCheckboxChange = (event) => {
    setvalueSetcampAll({ ...valueSetcampAll, copyGroup: event.target.checked });
    setIsChecked(event.target.checked);
  };
  // const handephannhom = (e) => {
  //   setPhannhom(e.target.value);
  // };
  // const handletu = (e) => {
  //   setTu(e.target.value);
  // };
  // const handleden = (e) => {
  //   setDen(e.target.den);
  // };
  // const haldemoney = (e) => {
  //   setMoney(e.target.value);
  // };

  const handleSwitchChange = (event) => {
    setCheckedpost(event.target.checked);
  };
  const [checkdarff, setCheckdarff] = useState(true);

  const handledarff = (e) => {
    setvalueSetcampAll({ ...valueSetcampAll, isDRAFT: e.target.checked });
    setCheckdarff(e.target.checked);
  };
  const [tokens, setTokens] = useState("");

  useEffect(() => {
    const tkqcid = async () => {
      const authFb = await chromeTask.getAuthFb();
      setTokens(authFb?.token);
      const res = await chromeTask.getidtkqc(authFb.token);
      const listaccountId = res.data?.map(function (value, index) {
        return { value: value.account_id, label: value.account_id };
      });
      console.log(listaccountId, "listaccountId");
      setIdtkqc(listaccountId ?  listaccountId[0]?.value : "");
      setOptionId(listaccountId ?listaccountId : [] );
    };
    tkqcid();
  }, []);

  const handleIDtkqc = async (e, selectedOption) => {
    if (selectedOption) {
      setIdtkqc(selectedOption.value);

      const res = await chromeTask.renderPixeltkqc(idtkqc, tokens);
      setvalueSetcampAll({
        ...valueSetcampAll,
        currency: res.usd.currency,
        account_currency_ratio_to_usd: res.usd.account_currency_ratio_to_usd,
      });
      // setDatacurency(res.usd);
      if (res.obj.data) {
        const datas = res.obj.data.map((value) => {
          return { value: value.id, label: value.name };
        });
        setvaluePixel(datas[0]);
        setOptionsPixel(datas);
      } else {
        setvaluePixel("no Pixel!");
        setOptionsPixel([{ value: "no Pixel!", label: "No Pixel!!" }]);
      }
    }
  };

  const [optionsPixel, setOptionsPixel] = useState([]);
  const [valuePixel, setvaluePixel] = useState({});

  useEffect(() => {
    const fetchdata = async () => {
      const res = await chromeTask.renderPixeltkqc(idtkqc, tokens);
      setvalueSetcampAll({
        ...valueSetcampAll,
        act_id: idtkqc,
        currency: res.usd.currency,
        account_currency_ratio_to_usd: res.usd.account_currency_ratio_to_usd,
      });
      if (res.obj.data?.length) {
        const datas = res.obj.data.map((value) => {
          return { value: value.id, label: value.name };
        });
        setvaluePixel(datas.length >= 0 ? datas[0] : "no Pixel!");
        setOptionsPixel(datas);
      } else {
        setvaluePixel("no Pixel!");
        setOptionsPixel([{ value: "no Pixel!", label: "No Pixel!!" }]);
      }
     
    };
    fetchdata();
  }, [idtkqc]);

  useEffect(() => {
    setArrayPageValue(page);
    setvalueSetcampAll({ ...valueSetcampAll, page_id: page.id });
    const fetch = async () => {
      const res = await chromeTask.renderpostcamp(page.id, checkedpost);
      const kq = res.data?.map((value) => {
        const idkq = value.promotable_id.split("_")[1];
        return {
          link: value.attachments?.data[0]?.url,
          actionType: value.call_to_action?.type,
          media: value.attachments?.data[0].media.image.src,
          message: value.message,
          id: idkq,
          likes: value.likes.summary.total_count,
          comments: value.comments.summary.total_count,
          share: value.shares ? value.shares.count : 0,
        };
      });
      if (kq) {
        setlistPost(kq);
      }
    };
    fetch();
  }, [page, checkedpost]);

  const [disableSelect, setdisableSelect] = useState(false);

  const handleChangePost = (e, selectedOption) => {
    setvalueSetcampAll({
      ...valueSetcampAll,
      title: "khong co tieu de",
      content: selectedOption?.message || "khong co noi dung",
      action: selectedOption.actionType || "none",
      action_link: selectedOption.link,
      post_id: selectedOption.id,
    });
    setdisableSelect(true);
  };

  const handleChangePixel = (e, selectedOption) => {
    setvaluePixel(selectedOption);
  };
  useEffect(() => {
    setvalueSetcampAll({ ...valueSetcampAll, pixel: valuePixel?.value });
  }, [valuePixel]);

  const handleChangeInput = (e, key) => {
    setvalueSetcampAll({ ...valueSetcampAll, [`${key}`]: e.target.value });
  };

  const handleSelected = (select, key) => {
    setvalueSetcampAll({ ...valueSetcampAll, [`${key}`]: select.value });
  };

  // FUNCTION SETCAMP

  const setCampPostDraft = async (clonedata) => {
    const checked = validationPost(clonedata);
    if (!checked) {
      handleCancel();
      return;
    }
    showModal();
    let logsnew = [];

    // getDraftId
    logsnew.push({ message: `${clonedata.act_id}:Đang khởi tạo` });
    setlogs([...logsnew]);
    const draft_id = await chromeTask.get_Draft_Id(
      clonedata.act_id,
      clonedata.act_bm
    );
    if (draft_id === "error") {
      logsnew.push({ message: `${clonedata.act_id}:Khởi tạo camp draft lỗi` });
      setlogs([...logsnew]);
      return;
    }
    logsnew.push({ message: `${clonedata.act_id}:Khởi tạo thành công` });
    setlogs([...logsnew]);

    // createCampDraft
    const campaign_id = await chromeTask.create_Camp_Draft(draft_id, clonedata);
    if (campaign_id === "error") {
      logsnew.push({ message: `${clonedata.act_id}:Tạo campain sảy ra lỗi` });
      setlogs([...logsnew]);
      return;
    }
    logsnew.push({ message: `${clonedata.act_id}:Tạo campain thành công` });
    setlogs([...logsnew]);

    //createAdGroupDraft
    const adset_id = await chromeTask.create_AdGroup_Draft(
      draft_id,
      campaign_id,
      clonedata
    );
    if (adset_id === "error") {
      logsnew.push({ message: `$${clonedata.act_id}:Tạo nhóm sảy ra lỗi` });
      setlogs([...logsnew]);
      return;
    }
    logsnew.push({ message: `${clonedata.act_id}:Tạo nhóm thành công` });
    setlogs([...logsnew]);

    // createAdsDraft
    const ads = await chromeTask.create_Ads_Draft(
      draft_id,
      campaign_id,
      adset_id,
      clonedata
    );
    if (ads === "error") {
      logsnew.push({ message: `${clonedata.act_id}:Tạo nhóm sảy ra lỗi` });
      setlogs([...logsnew]);
      return;
    }
    logsnew.push({ message: `${clonedata.act_id}:Hoàn tất` });
    setlogs([...logsnew]);
  };

  const setCampUploadDraft = async (clonedata) => {
    let checked = validationUpload(clonedata);
    if (!checked) {
      handleCancel();
      return;
    }
    showModal();
    let logsnew = [];

    // getDraftId
    logsnew.push({ message: `${clonedata.act_id}:Đang khởi tạo` });
    setlogs([...logsnew]);
    const draft_id = await chromeTask.get_Draft_Id(
      clonedata.act_id,
      clonedata.act_bm
    );
    if (draft_id === "error") {
      logsnew.push({ message: `${clonedata.act_id}:Khởi tạo camp draft lỗi` });
      setlogs([...logsnew]);
      return;
    }
    logsnew.push({ message: `${clonedata.act_id}:Khởi tạo thành công` });
    setlogs([...logsnew]);

    // createCampDraft
    const campaign_id = await chromeTask.create_Camp_Draft(draft_id, clonedata);
    if (campaign_id === "error") {
      logsnew.push({ message: `${clonedata.act_id}:Tạo campain sảy ra lỗi` });
      setlogs([...logsnew]);
      return;
    }
    logsnew.push({ message: `${clonedata.act_id}:Tạo campain thành công` });
    setlogs([...logsnew]);

    //createAdGroupDraft
    const adset_id = await chromeTask.create_AdGroup_Draft(
      draft_id,
      campaign_id,
      clonedata
    );
    if (adset_id === "error") {
      logsnew.push({ message: `$${clonedata.act_id}:Tạo nhóm sảy ra lỗi` });
      setlogs([...logsnew]);
      return;
    }
    logsnew.push({ message: `${clonedata.act_id}:Tạo nhóm thành công` });
    logsnew.push({ message: `${clonedata.act_id}:Đang tải lên media` });
    setlogs([...logsnew]);

    // upLoadVideo
    const AdVideo = await chromeTask.upLoad_Video(clonedata);
    if ("error" in AdVideo) {
      logsnew.push({
        message: `${clonedata.act_id}:Media: ${AdVideo.error.error_user_msg}`,
      });
      setlogs([...logsnew]);
      return;
    }
    logsnew.push({ message: `${clonedata.act_id}:Tải lên video thành công` });
    setlogs([...logsnew]);

    //uploadThumb
    const AdThumb = await chromeTask.upload_Thumb(clonedata);
    if (AdThumb === "error") {
      logsnew.push({
        message: `${clonedata.act_id}:Có lỗi khi tải lên thumbnail vui lòng kiểm tra lại`,
      });
      setlogs([...logsnew]);
      return;
    }
    logsnew.push({
      message: `${clonedata.act_id}:Tải lên thumbnail thành công`,
    });
    setlogs([...logsnew]);

    // createAdsUploadDraft
    const ads = await chromeTask.create_Ads_Upload_Draft(
      draft_id,
      campaign_id,
      AdVideo.id,
      AdThumb,
      clonedata
    );
    if (ads === "error") {
      logsnew.push({
        message: `${clonedata.act_id}:Ads: Sảy ra lỗi`,
      });
      setlogs([...logsnew]);
      return;
    }
    logsnew.push({
      message: `${clonedata.act_id}:Hoàn tất`,
    });
    setlogs([...logsnew]);
  };

  const setCampPost = async (clonedata) => {
    const checked = validationPost(clonedata);
    if (!checked) {
      handleCancel();
      return;
    }
    showModal();
    let logsnew = [];
    const now = new Date();
    const time = now.toLocaleTimeString("vi-VN", {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    });
    const date = now.toLocaleDateString("vi-VN", {
      month: "numeric",
      day: "numeric",
    });
    var timeNow = time + ", " + date;
    if (clonedata.copyGroup) {
      if (clonedata.numberGroup > 1 && clonedata.numberGroup <= 10) {
        clonedata.defaultGroup = clonedata.numberGroup;
        clonedata.budget = Math.round(clonedata.budget / clonedata.numberGroup);
      } else {
        logsnew.push({ message: `Chỉ cho phép nhân nhóm từ 2-10 nhóm` });
        setlogs([...logsnew]);
        return;
      }
    }
    // createCamp
    const campaign = await chromeTask.create_Camp(clonedata);
    if ("error" in campaign) {
      logsnew.push({
        message: `${clonedata.act_id}:Camp: ${campaign.error.error_user_msg}`,
      });
      setlogs([...logsnew]);
      return;
    }
    logsnew.push({ message: `${clonedata.act_id}: Tạo camp thành công` });
    setlogs([...logsnew]);

    // createAdcreative
    const adcreative = await chromeTask.create_Ad_creative(clonedata);
    if ("error" in adcreative) {
      logsnew.push({
        message: `${clonedata.act_id}: Creative=> ${adcreative.error.message}, ${adcreative.error.error_user_msg}`,
      });
      setlogs([...logsnew]);
      return;
    }
    logsnew.push({
      message: `${clonedata.act_id}: Tạo nội dung qc thành công`,
    });
    setlogs([...logsnew]);

    for (let n = 1; n <= clonedata.defaultGroup; n++) {
      let AdSet = await chromeTask.create_Ad_Group(campaign.id, clonedata);
      if ("error" in AdSet) {
        logsnew.push({
          message: `${clonedata.act_id}:Adset: ${AdSet.error.error_user_msg}`,
        });
        setlogs([...logsnew]);
        return;
      }
      logsnew.push({
        message: `${clonedata.act_id}: Tạo nhóm thành công *${n}`,
      });
      setlogs([...logsnew]);

      let ads = await chromeTask.create_Ads(AdSet.id, adcreative.id, clonedata);
      if ("error" in ads) {
        logsnew.push({
          message: `${clonedata.act_id}: ADS=> ${ads.error.message}, ${ads.error.error_user_msg}`,
        });
        setlogs([...logsnew]);
        return;
      }
      logsnew.push({
        message: `${clonedata.act_id}: Tạo ads thành công *${n}`,
      });
      setlogs([...logsnew]);
    }

    const ruleResult = await chromeTask.create_Rule(
      clonedata.act_id,
      campaign.id
    );
    logsnew.push({ message: `${clonedata.act_id}: ${ruleResult}` });
    setlogs([...logsnew]);
  };

  const setCampUpload = async (clonedata) => {
    let checked = validationUpload(clonedata);
    if (!checked) {
      handleCancel();
      return;
    }
    showModal();
    let logsnew = [];
    if (clonedata.copyGroup) {
      if (clonedata.numberGroup > 1 && clonedata.numberGroup <= 10) {
        clonedata.defaultGroup = clonedata.numberGroup;
        clonedata.budget = Math.round(clonedata.budget / clonedata.numberGroup);
      } else {
        logsnew.push({ message: `Chỉ cho phép nhân nhóm từ 2-10 nhóm` });
        setlogs([...logsnew]);
        return;
      }
    }

    const campaign = await chromeTask.create_Camp(clonedata);
    if ("error" in campaign) {
      logsnew.push({
        message: `${clonedata.act_id}:Camp: ${campaign.error.error_user_msg}`,
      });
      setlogs([...logsnew]);
      return;
    }
    logsnew.push({ message: `${clonedata.act_id}: Tạo camp thành công` });
    logsnew.push({ message: `${clonedata.act_id}: Đang tải lên media` });
    setlogs([...logsnew]);

    const AdVideo = await chromeTask.upLoad_Video(clonedata);
    if ("error" in AdVideo) {
      logsnew.push({
        message: `${clonedata.act_id}:Media: ${AdVideo.error.error_user_msg}`,
      });
      setlogs([...logsnew]);
      return;
    }
    logsnew.push({ message: `${clonedata.act_id}:Tải lên video thành công` });
    setlogs([...logsnew]);

    // createAdcreativeUpload
    const AdCreative = await chromeTask.create_Ad_creative_Upload(
      clonedata,
      AdVideo.id
    );
    if ("error" in AdCreative) {
      logsnew.push({
        message: `${clonedata.act_id}: Creative=> ${AdCreative.error.message}, ${AdCreative.error.error_user_msg}`,
      });
      setlogs([...logsnew]);
      return;
    }
    logsnew.push({
      message: `${clonedata.act_id}: Tạo nội dung qc thành công`,
    });
    setlogs([...logsnew]);

    for (let n = 1; n <= clonedata.defaultGroup; n++) {
      let AdSet = chromeTask.create_Ad_Group(campaign.id, clonedata);
      if ("error" in AdSet) {
        logsnew.push({
          message: `${clonedata.act_id}:Adset: ${AdSet.error.error_user_msg}`,
        });
        setlogs([...logsnew]);
        return;
      }
      logsnew.push({
        message: `${clonedata.act_id}: Tạo nhóm thành công *${n}`,
      });
      setlogs([...logsnew]);

      let ads = await chromeTask.create_Ads(AdSet.id, AdCreative.id, clonedata);
      if ("error" in ads) {
        logsnew.push({
          message: `${clonedata.act_id}: ADS=> ${ads.error.message}, ${ads.error.error_user_msg}`,
        });
        setlogs([...logsnew]);
        return;
      }
      logsnew.push({
        message: `${clonedata.act_id}: Tạo ads thành công *${n}`,
      });
      setlogs([...logsnew]);
    }

    const ruleResult = await chromeTask.create_Rule(
      clonedata.act_id,
      campaign.id
    );
    logsnew.push({ message: `${clonedata.act_id}: ${ruleResult}` });
    setlogs([...logsnew]);
  };

  const HandleUploadCamp = async () => {
    const newDatatoken = await RefreshToken(dataToken);
    dispatch(setDataToken(newDatatoken));
    const data  = await instace.post('/buypackage/checkedaction', {
      idpackage: "650945da05dfe70ebcbd1983"
    }, {
      headers: {
        Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""
            }`,
    },
    }
    )
    console.log(data,'data')
    setOpen(true);
    const authFb = await chromeTask.getAuthFb();
    let clonedata = {
      ...valueSetcampAll,
      budget: (
        Number(valueSetcampAll.account_currency_ratio_to_usd) *
        Number(valueSetcampAll.budget)
      ).toFixed(0),
      token: authFb.token,
    };

    if (clonedata.isDRAFT) {
      if (clonedata.TYPE) {
        setCampPostDraft(clonedata);
      } else {
        setCampUploadDraft(clonedata);
      }
    } else {
      if (clonedata.TYPE) {
        setCampPost(clonedata);
      } else {
        setCampUpload(clonedata);
      }
    }

    // const data = await chromeTask.HandleSetCamp(clonedata);
  };

  const validationUpload = (data) => {
    if (!data.page_id) {
      setError("Vui lòng chọn một Page");
      return false;
    }
    if (!data.pixel || data.pixel === "" || data.pixel === "No Pixel") {
      setError("Vui lòng chọn data.pixel");
      return false;
    }
    if (
      data.url_video === "" ||
      !data.url_video ||
      !data.url_thumb ||
      data.url_thumb === "" ||
      !data.title ||
      data.title === "" ||
      !data.content ||
      data.content === "" ||
      !data.action_link ||
      data.action_link === ""
    ) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return false;
    }
    if (data.name === "" || !data.name) {
      setError("Vui lòng nhập tên chiến dịch");
      return false;
    }
    return true;
  };

  const validationPost = (data) => {
    if (!data.page_id || data.page_id === "") {
      setError("Vui lòng chọn một Page");
      return false;
    }
    if (!data.post_id) {
      setError("Vui lòng chọn một Post");
      return false;
    }
    if (!data.pixel || data.pixel === "" || data.pixel === "No Pixel") {
      setError("Vui lòng chọn data.pixel");
      return false;
    }
    if (!data.action_link || data.action_link === "") {
      setError("Vui lòng nhập link website");
      return false;
    }
    if (!data.name || data.name === "") {
      setError("Vui lòng nhập tên chiến dịch");
      return false;
    }
    return true;
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setlogs([]);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setlogs([]);
    setIsModalOpen(false);
  };

  return (
    <>
      {error.length > 0 ? (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      ) : (
        <p>{null}</p>
      )}
      <Modal
        width={450}
        className="border overflow-hidden	"
        centered
        open={isModalOpen}
        footer={null}
        onOk={handleOk}
        closable={false}
        onCancel={handleCancel}
      >
        <div className="modal__css bg-[#1e3e64] flex justify-center flex-col items-center">
          <div className=" bg-[#fff] w-[432px] px-1 h-[198px] mt-2 rounded-md">
            {logs?.map((value) => {
              return (
                <p className="text-[12.6px] text-[#1e3e64] border-b border-b-[#578ccc]">
                  {value.message}{" "}
                </p>
              );
            })}
          </div>
          <button
            onClick={handleCancel}
            className="text-base text-black rounded-md bg-[#fff1e7] px-16 mt-2"
          >
            Ok
          </button>
        </div>
      </Modal>
      <div className="tool-bar">
        <div className="icon">
          <i className="fa-solid fa-shapes"></i>
          <span>{t("setCamp")}</span>
        </div>
      </div>
      <div className="tab-content">
        <div className="main-screen">
          <div className="screen">
            <div className="main">
              <div className="sharepixel setcamp slect_post_1">
                <span className="txtelegantshadow">
                  {t("Select Adaccount")}
                </span>
                <Autocomplete
                  disablePortal
                  onChange={handleIDtkqc}
                  value={idtkqc}
                  id="combo-box-demo"
                  ListboxProps={{
                    style: { fontSize: "12px" },
                  }}
                  clearIcon={null}
                  options={optionID}
                  sx={{ width: 250 }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
              <div className="sharepixel setcamp slect_post_1">
                <span className="txtelegantshadow">Pixel</span>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  ListboxProps={{
                    style: { fontSize: "12px" },
                  }}
                  clearIcon={null}
                  value={valuePixel}
                  options={optionsPixel}
                  onChange={handleChangePixel}
                  sx={{ width: 250 }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
              <div className="sharepixel setcamp slect_post">
                <span className="txtelegantshadow">{t("Select page")}</span>
                <Autocomplete
                  disablePortal
                  value={arrayPageValue}
                  clearIcon={null}
                  id="combo-box-demo"
                  options={arrayPage}
                  sx={{ width: 250 }}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setPage(newValue);
                    }
                  }}
                  ListboxProps={{
                    style: { maxHeight: 130, overflowY: "auto" },
                  }}
                  renderOption={(props, option) => (
                    <li
                      {...props}
                      style={{
                        padding: "4px 2px",
                        listStyleType: "none",
                      }}
                    >
                      <div className="option-container">
                        <img
                          src={option.img}
                          alt={option.label}
                          className="option-image"
                        />
                        <span className="option-text">{option.label}</span>
                      </div>
                    </li>
                  )}
                  getOptionLabel={(option) => option.label}
                />
              </div>
              <div className="sharepixel ">
                <span className="txtelegantshadow">AdCretive</span>
                <RadioGroup
                  sx={{ width: 250 }}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={quangcao}
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    setQuangcao(selectedValue);
                    setvalueSetcampAll({
                      ...valueSetcampAll,
                      TYPE: selectedValue === "true" ? true : false,
                    });
                    if (selectedValue === "true") {
                      setCheckQC(true);
                    } else if (selectedValue === "flase") {
                      setCheckQC(false);
                    }
                  }}
                >
                  <div className="setcamp_radio">
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label={t("Select post")}
                      className="setcamp_radio-label"
                    />
                    <FormControlLabel
                      value="flase"
                      control={<Radio />}
                      label={t("Upload")}
                    />
                  </div>
                </RadioGroup>
              </div>
              {checkQC ? (
                <div>
                  <div className="sharepixel">
                    <span className="txtelegantshadow">{t("Hidden post")}</span>
                    <div className="setcamp_post--an">
                      <Switch
                        checked={checkedpost}
                        onChange={handleSwitchChange}
                      />
                    </div>
                  </div>
                  <div className="sharepixel setcamp slect_post">
                    <span className="txtelegantshadow">{t("Select post")}</span>
                    <Autocomplete
                      disablePortal
                      clearIcon={null}
                      id="combo-box-demo"
                      options={listpost}
                      onChange={handleChangePost}
                      sx={{ width: 250 }}
                      ListboxProps={{
                        style: { maxHeight: 130, overflowY: "auto" },
                      }}
                      renderOption={(props, option) => (
                        <li
                          {...props}
                          style={{
                            padding: "4px 2px",
                            listStyleType: "none",
                          }}
                        >
                          <div className="option-container pdr">
                            <img className="option-image" src={option.media} alt="img"/>
                            <div className="changepost_title">
                              <span className="option-text block-ellipsis">
                                {option.message}
                              </span>
                              <span className="option-text">{option.id}</span>
                              <div className="changepost_btn">
                                <span>
                                  like:{option.likes} | cmt:{option.comments} |
                                  share:{option.share}
                                </span>
                              </div>
                            </div>
                          </div>
                        </li>
                      )}
                      getOptionLabel={(option) => option.id}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="sharepixel setcamp">
                    <span className="txtelegantshadow mb_10">{t('Video link')}</span>
                    <TextField
                      InputProps={{
                        style: { fontSize: "12.6px", padding: "2px" }, // Đặt kích thước chữ ở đây
                      }}
                      onChange={(e) => {
                        handleChangeInput(e, "url_video");
                      }}
                      id="outlined-number"
                      type="text"
                      sx={{ width: 250 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                  <div className="sharepixel setcamp">
                    <span className="txtelegantshadow mb_10">
                      {t('Thumbnail link')}
                    </span>
                    <TextField
                      InputProps={{
                        style: { fontSize: "12.6px", padding: "2px" }, // Đặt kích thước chữ ở đây
                      }}
                      onChange={(e) => {
                        handleChangeInput(e, "url_thumb");
                      }}
                      id="outlined-number"
                      type="text"
                      sx={{ width: 250 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="sharepixel setcamp">
                <span className="txtelegantshadow mb_10">{t('Title')}</span>
                <TextField
                  InputProps={{
                    style: { fontSize: "12.6px", padding: "2px" }, // Đặt kích thước chữ ở đây
                  }}
                  onChange={(e) => {
                    handleChangeInput(e, "title");
                  }}
                  disabled={!checkQC ? false : disableSelect ? true : false}
                  value={valueSetcampAll.title}
                  id="outlined-number"
                  type="text"
                  sx={{ width: 250 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div className="sharepixel setcamp">
                <span className="txtelegantshadow">{t('Content')}</span>

                <textarea
                  style={{
                    width: "250px",
                    padding: "0px",
                    fontSize: "12.6px",
                    outline: "none",
                    border: "1px solid #c4c4c4",
                    resize: "none",
                  }}
                  className="text-area"
                  disabled={!checkQC ? false : disableSelect ? true : false}
                  value={valueSetcampAll.content}
                  onChange={(e) => {
                    handleChangeInput(e, "content");
                  }}
                ></textarea>
              </div>
              <div className="sharepixel setcamp">
                <span className="txtelegantshadow">{t('Action')}</span>
                <TextField
                  InputProps={{
                    style: { fontSize: "12.6px", padding: "2px" }, // Đặt kích thước chữ ở đây
                  }}
                  onChange={(e) => {
                    handleChangeInput(e, "action");
                  }}
                  disabled={!checkQC ? false : disableSelect ? true : false}
                  value={valueSetcampAll.action}
                  id="outlined-number"
                  type="text"
                  sx={{ width: 250 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div className="sharepixel setcamp">
                <span className="txtelegantshadow">{t('Link')}</span>
                <TextField
                  InputProps={{
                    style: { fontSize: "12.6px", padding: "2px" }, // Đặt kích thước chữ ở đây
                  }}
                  onChange={(e) => {
                    handleChangeInput(e, "action_link");
                  }}
                  value={valueSetcampAll.action_link}
                  id="outlined-number"
                  type="text"
                  sx={{ width: 250 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="screen ali-baseline">
            <div className="sharepixel">
              <span className="txtelegantshadow">{t('Draft')}</span>
              <div className="setcamp_post--an -translate-x-2.5">
                <Switch checked={checkdarff} onChange={handledarff} />
              </div>
            </div>
            <div className="sharepixel setcamp">
              <span className="txtelegantshadow ">{t('Campaign name')}</span>
              <TextField
                InputProps={{
                  style: { fontSize: "12.6px", padding: "2px" }, // Đặt kích thước chữ ở đây
                }}
                onChange={(e) => {
                  handleChangeInput(e, "name");
                }}
                value={valueSetcampAll.name}
                id="outlined-number"
                type="text"
                sx={{ width: 250, fontSize: "12.6px" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div className="sharepixel setcamp mt-5">
              <span className="txtelegantshadow">{t('Duplicate group')}</span>
              <div className="setcamp_post--an d-flex -translate-x-2.5">
                <Checkbox
                  checked={valueSetcampAll.copyGroup}
                  onChange={handleCheckboxChange}
                ></Checkbox>
                <input
                  type="number"
                  value={valueSetcampAll.numberGroup}
                  onChange={(e) => {
                    if (e.target.value >= 0) {
                      handleChangeInput(e, "numberGroup");
                    }
                  }}
                  disabled={valueSetcampAll.copyGroup ? false : true}
                  style={{
                    width: "40px",
                    marginLeft: "2px",
                    backgroundColor: "#e8e9eb",
                    padding: "1px",
                  }}
                ></input>
              </div>
            </div>
            <div className="sharepixel setcamp !mt-1">
              <span className="txtelegantshadow">{t('Daily budget')}</span>
              <div className="setcamp_post--an d-flex ">
                <input
                  type="number"
                  value={valueSetcampAll.budget}
                  onChange={(e) => {
                    if (e.target.value >= 0) {
                      handleChangeInput(e, "budget");
                    }
                  }}
                  style={{
                    width: "100px",
                    marginRight: "10px",
                    padding: "1px",
                  }}
                ></input>
                <p className="money flex_s">
                  <span> USD~</span>
                  <span>
                    {" "}
                    {Number(
                      (
                        Number(valueSetcampAll.account_currency_ratio_to_usd) *
                        Number(valueSetcampAll.budget)
                      ).toFixed(0)
                    )
                      .toLocaleString("en-US")
                      .replace(".", ".")}
                    {valueSetcampAll.currency}
                  </span>
                </p>
              </div>
            </div>
            <div className="sharepixel setcamp mt-4">
              <span className="txtelegantshadow">{t('Country')}</span>
              <div className="d-flex ">
                <p style={{ fontSize: "13px" }}>
                  United State({t('exclude')} Alaska, Hawai)
                </p>
              </div>
            </div>
            <div className="sharepixel !mt-1">
              <span className="txtelegantshadow">{t('Posistion')}</span>
              <RadioGroup
                onChange={(e) => {
                  handleChangeInput(e, "posistion");
                }}
                value={valueSetcampAll.posistion}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <div className="setcamp_radio">
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label={t('Auto')}
                    className="setcamp_radio-label"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="FB(Feed,Video Feed, Reels)"
                  />
                </div>
              </RadioGroup>
            </div>
            <div className="sharepixel slect_post_1 setcamp mt-5">
              <span className="txtelegantshadow">{t('Gender')}</span>
              <Autocomplete
                onChange={(e, select) => {
                  handleSelected(select, "gender");
                }}
                value={
                  valueSetcampAll.gender === "0"
                    ? "Tất cả"
                    : valueSetcampAll.gender === "1"
                    ? "Nam"
                    : "Nữ"
                }
                disablePortal
                ListboxProps={{
                  style: { fontSize: "12px" },
                }}
                clearIcon={null}
                id="combo-box-demo"
                options={gender}
                // getOptionLabel={(option) => option.label}
                sx={{ width: 250 }}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <div className="sharepixel setcamp">
              <span className="txtelegantshadow">{t('Age')}</span>
              <div className="setcamp_post--an d-flex ">
              {t('From')}
                <input
                  type="number"
                  value={valueSetcampAll.min_age}
                  onChange={(e) => {
                    if (e.target.value >= 0) {
                      handleChangeInput(e, "min_age");
                    }
                  }}
                  style={{
                    width: "50px",
                    marginLeft: "10px",
                    marginRight: "10px",
                    padding: "1px",
                  }}
                ></input>
                {t('To')}
                <input
                  type="number"
                  value={valueSetcampAll.max_age}
                  onChange={(e) => {
                    if (e.target.value > valueSetcampAll.min_age) {
                      handleChangeInput(e, "max_age");
                    }
                  }}
                  style={{ width: "50px", marginLeft: "10px", padding: "1px" }}
                ></input>
              </div>
            </div>
            <div className="sharepixelbtn">
              <Button
                onClick={HandleUploadCamp}
                className="sharepixel_btn"
                variant="contained"
                style={{ marginLeft: "145px" }}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SetCamp;
