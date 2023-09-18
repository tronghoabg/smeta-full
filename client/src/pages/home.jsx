import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TableAdacounts from "../components/adaccounts";
import TableBusiness from "../components/business";
import TablePage from "../components/fanpages";
import chromeTask from "../services/chrome";
import Loading from "../components/Loading";
import InToLogin from "./intologin";
import * as XLSX from "xlsx";

const Home = (props) => {
  const { isNotLogin } = props;

  const [activeTab, setActiveTab] = useState(1);
  const [listAd, setListAd] = useState([]);
  const [listBM, setListBM] = useState([]);
  const [listPage, setListPage] = useState([]);
  const [isTabAd, setIsTabAd] = useState(true);
  const [isMix, setMix] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refe, setRefe] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      var res = await chromeTask.load_data();
      if (res.error === "201") {
        isNotLogin();
        return;
      } else {
        setToken(res.token);
        localStorage.setItem("tokensmeta", res.token);
        localStorage.setItem("facebookname", res.name);
        setListAd(res.listAd);
        setListBM(res.listBM);
        setListPage(res.listPage);
        setLoading(false);

        if (!res.isStorage) {
          var loadBM = await chromeTask.load_business(res);
          setListBM(loadBM);
        }
      }
    }
    fetchData();
    return () => {};
  }, [refe]);

  const handleTabClick = (index) => {
    if (index === 1) {
      setIsTabAd(true);
    } else {
      setIsTabAd(false);
    }
    setActiveTab(index);
  };

  const handleRefe = async () => {
    localStorage.removeItem("getAuth");
    setRefe(!refe);
  };

  const [searchKeyword, setSearchKeyword] = useState("");

  const normalizeKeyword = (keyword) => {
    return keyword
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  };

  const searchFullText = (keyword, dataList) => {
    if (!keyword) {
      return dataList;
    }

    const normalizedKeyword = normalizeKeyword(keyword);

    return dataList.filter((item) => {
      for (const key in item) {
        if (typeof item[key] === "string") {
          const normalizedItemValue = normalizeKeyword(item[key]);
          if (normalizedItemValue.includes(normalizedKeyword)) {
            return true;
          }
        }
      }
      return false;
    });
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleExport_ex = async () => {
    const ex = await chromeTask.export_ex();

    let dataBM = ex.objBM.map((value) => {
      return {
        STT: value.stt,
        "Trạng Thái": value.status,
        "Id Bm": value.id,
        "Tên BM": value.name,
        "BM level": value.levelBm,
        "Admin ẩn": value.admin,
        Limit: value.limit,
        "Ngày tạo": value.datecreate,
      };
    });

    let dataADs = ex.objAds.map((value) => {
      return {
        STT: value.stt,
        "Trạng Thái": value.status,
        "Id Tk": value.id,
        "Tên TK": value.name,
        "Dư nợ": value.balance,
        Ngưỡng: value.threshold,
        Limit: value.adtrust,
        "Chi tiêu": value.spent,
        Admin: value.admin,
        "Tiền tệ": value.currency,
        "Loại TK": value.acctype,
        Role: value.role,
        Bill: value.bills,
        "Id BM": value.bm,
        Payment: value.card,
        "Time Zone": value.timezone,
      };
    });

    const worksheet1 = XLSX.utils.json_to_sheet(dataADs);
    const worksheet2 = XLSX.utils.json_to_sheet(dataBM);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet1, "TKQC");
    XLSX.utils.book_append_sheet(workbook, worksheet2, "BM");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAsExcel(excelBuffer, "sMeta TKQC.xlsx");
  };

  const saveAsExcel = (buffer, fileName) => {
    const data = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(data);
    link.download = fileName;
    link.click();
  };

  return (
    <>
      <div className="tool-bar">
        <div className="left">
          <div className="tab-list">
            <div
              className={activeTab === 1 ? "tab active-tab" : "tabs"}
              onClick={() => handleTabClick(1)}
            >
              AD
            </div>
            <div
              className={activeTab === 2 ? "tab active-tab" : "tabs"}
              onClick={() => handleTabClick(2)}
            >
              BM
            </div>
            <div
              className={activeTab === 3 ? "tab active-tab" : "tabs"}
              onClick={() => handleTabClick(3)}
            >
              PAGE
            </div>
          </div>
          <div className="search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              onChange={handleSearchChange}
              placeholder="Tìm kiếm"
              value={searchKeyword}
            />
          </div>
        </div>
        <div className="right">
          {isTabAd && (
            <>
              <div className="btn" onClick={() => setMix(!isMix)}>
                <span>{isMix ? "MIX" : "USD"}</span>
              </div>
              <div className="btn" onClick={handleExport_ex}>
                <i className="fa-solid fa-download"></i>
              </div>
            </>
          )}

          <div className="btn" onClick={handleRefe}>
            <i className="fa-solid fa-rotate"></i>
          </div>
        </div>
      </div>
      <div className="tab-content relative">
        <div className={activeTab === 1 ? "content active-content" : "content"}>
          {loading ? <Loading /> : null}
          <TableAdacounts
            token={token}
            listAd={searchFullText(searchKeyword, listAd)}
            isMix={isMix}
          />
        </div>
        <div className={activeTab === 2 ? "content active-content" : "content"}>
          {loading ? <Loading /> : null}
          <TableBusiness listBm={searchFullText(searchKeyword, listBM)} />
        </div>
        <div className={activeTab === 3 ? "content active-content" : "content"}>
          {loading ? <Loading /> : null}
          <TablePage listPage={searchFullText(searchKeyword, listPage)} />
        </div>
      </div>
    </>
  );
};

export default Home;
