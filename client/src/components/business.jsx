import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import chromeTask from "../services/chrome";
import { FaUserEdit } from "react-icons/fa";
import { Table } from "antd";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Loading from "./Loading";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import {  setDataToken } from "../redux/counterSlice";
import { useDispatch, useSelector } from "react-redux";
import instace from "../pages/customer_axios";
import RefreshToken from "../pages/RefreshToken";

const TableBusiness = (props) => {
  const dispatch = useDispatch()
  const { listBm } = props;
  const { t } = useTranslation();
  const listAdclone = listBm ? listBm : [];
  const [dataAD, setDataAD] = useState([]);
  const [selectsort, setSelectsort] = useState({ key: "", count: 0 });
  const [loading, setloading] = useState(false);
  const counter = useSelector((state) => state.counter);
  let { dataToken } = counter
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    setloading(true);
    setDataAD(listBm);
    setloading(false);
  }, [listBm]);

  const handleFilters = (values) => {
    var newSelect = { ...selectsort };
    if (values.key !== selectsort.key) {
      newSelect.key = values.key;
      newSelect.count = 1;
    } else {
      newSelect.count = selectsort.count + 1;
    }
    setSelectsort(newSelect);
    if (newSelect.count % 2 === 0) {
      let newdata = listAdclone.sort(function (a, b) {
        var nameA = a[`${values.key}`].toString().toLowerCase();
        var nameB = b[`${values.key}`].toString().toLowerCase();
        if (!isNaN(nameA) && !isNaN(nameB)) {
          // Nếu cả hai là số, sắp xếp theo giá trị số
          return parseInt(nameA) - parseInt(nameB);
        } else {
          // Cả hai không phải số, sắp xếp theo thứ tự từ điển
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }
      });
      setDataAD(newdata);
    } else {
      let newdata = listAdclone.sort(function (a, b) {
        var nameA = a[`${values.key}`].toString().toLowerCase();
        var nameB = b[`${values.key}`].toString().toLowerCase();
        if (!isNaN(nameA) && !isNaN(nameB)) {
          // Nếu cả hai là số, sắp xếp theo giá trị số (ngược lại)
          return parseInt(nameB) - parseInt(nameA);
        } else {
          // Cả hai không phải số, sắp xếp theo thứ tự từ điển (ngược lại)
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          return 0;
        }
      });
      setDataAD(newdata);
    }
    // if (values.interface === "string") {
    //   if (newSelect.count % 2 === 0) {
    //     let newdata = listAdclone.sort((a, b) =>
    //       b[`${values.key}`].localeCompare(a[`${values.key}`])
    //     );
    //     setDataAD(newdata);
    //   } else {
    //     let newdata = listAdclone.sort((a, b) =>
    //       a[`${values.key}`].localeCompare(b[`${values.key}`])
    //     );
    //     setDataAD(newdata);
    //   }
    // }
    // if (values.interface === "number") {
    //   if (newSelect.count % 2 === 0) {
    //     let datas = listAdclone.sort(
    //       (a, b) => b[`${values.key}`] - a[`${values.key}`]
    //     );
    //     setDataAD(datas);
    //   } else {
    //     let datas = listAdclone.sort(
    //       (a, b) => a[`${values.key}`] - b[`${values.key}`]
    //     );
    //     setDataAD(datas);
    //   }
    // }
  };

  const thTable = [
    { value: t("no"), interface: "number", key: "stt" },
    { value: t("status"), interface: "string", key: "status" },
    { value: t("id"), interface: "string", key: "id" },
    { value: t("name"), interface: "string", key: "name" },
    { value: "Level", interface: "string", key: "levelBm" },
    { value: "Limit", interface: "string", key: "limit" },
    { value: t("verified"), interface: "string", key: "verified" },
    { value: t("admin"), interface: "string", key: "admin" },
    { value: t("createDate"), interface: "string", key: "datecreate" },
  ];

  const [datamodal, setdatamodal] = useState({});
  const [open, setOpen] = useState(false);
  const [selectRemove, setselectRemove] = useState([]);
  const [messagestatus, setmessagestatus] = useState({
    type: "success",
    mess: "",
  });

  const handleClose = () => {
    setOpen(false);
    setdatamodal({});
  };
  const handleOpen = async (data) => {
    setloading(true);
    setOpen(true);
    setselectRemove([]);
    try {
      const res = await chromeTask.getListAdminBmHide(data.ID);
      setdatamodal({ ID: data.ID, array: res, bm: data.ID });
      setloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveAdminAD = async (userID) => {
    setloading(true);
    if (selectRemove.length <= 1) {
      try {
        const deletes = await chromeTask.deleteAdminBM(userID);
        if (deletes.success) {
          setloading(false);
          setmessagestatus({ type: "success", mess: "Xoa thanh cong" });
          setOpenSnackbar(true);
        } else {
          setloading(false);
          setmessagestatus({ type: "error", mess: deletes.error.message });
          setOpenSnackbar(true);
        }
        const res = await chromeTask.getListAdminBmHide(datamodal.ID);
        setdatamodal({ ...datamodal, array: res });
        setloading(false);
      } catch (error) {
        setmessagestatus({ type: "error", mess: "Xoa that bai" });
        console.log(error);
      }
    }
  };

  const handleRemoveAdminADarray = async () => {
    setloading(true);
    // const token = localStorage.getItem("tokensmeta");
    const deletesarray = async () => {
      let datas = selectRemove.map(async (value, index) => {
        let deletes = await chromeTask.deleteAdminBM(value.remove);
        return deletes;
      });
      return await Promise.all(datas);
    };
    let checked = await deletesarray();
    if (checked) {
      setloading(false);
      setmessagestatus({ type: "success", mess: "Xoa thanh cong" });
      setOpenSnackbar(true);
      const res = await chromeTask.getListAdminBmHide(
        datamodal.ID,
        datamodal.bm
      );
      setdatamodal({ ...datamodal, array: res });
    } else {
      setloading(false);
      setmessagestatus({ type: "error", mess: "Xoa that bai" });
      setOpenSnackbar(true);
    }
  };

  const [deleteone, setdeleteone] = useState(null);

  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      render: (text) => (
        <div>
          <div className="items__table">{text.split("-")[0]}</div>
          <div className="items__table">{text.split("-")[1]}</div>
        </div>
      ),
    },
    {
      title: t("role"),
      dataIndex: "role",
    },
    {
      title: t("status"),
      dataIndex: "status",
    },
    {
      title: (
        <div
          className="remove__btn"
          onClick={() => {
            setmodalConfirm(true);
          }}
        >{`${t("removeAll")}( ${selectRemove.length})`}</div>
      ),
      dataIndex: "remove",
      render: (text) => (
        <button
          disabled={selectRemove.length >= 2}
          className={` btn_remove_style ${selectRemove.length >= 2 ? "remove__btn__disable" : "remove__btn"
            }`}
          onClick={() => {
            setdeleteone(text);
            setmodalConfirm(true);
            // handleRemoveAdminAD(text);
          }}
        >
          {t("remove")}
        </button>
      ),
    },
  ];

  const data = datamodal.array?.map((value, index) => {
    return {
      key: `${index}`,
      name: `${value.name}-${value.id}`,
      role: t(value.role.toLowerCase()),
      status: value.isAdminHide ? t("hiddenAdmin") : "Active",
      remove: value.id,
    };
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 650,
    bgcolor: "background.paper",
    border: "2px solid #0a2e61",
    boxShadow: 24,
    borderRadius: 2,
    overflow: "hidden",
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setselectRemove(selectedRows);
    },
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const [modalconfirm, setmodalConfirm] = useState(false);

  const handleClosemodalConfirm_close = () => {
    setmodalConfirm(false);
  };

  const handleClosemodalConfirm_delete = async () => {
    setOpenSnackbar(true);
    setOpen(true)
    const newDatatoken = await RefreshToken(dataToken);
    dispatch(setDataToken(newDatatoken));
    try {
      const data = await instace.post('/buypackage/checkedaction', {
        product_name: "remove admin hidden"
      }, {
        headers: {
          Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""
            }`,
        },
      })
      if (data.data.status === true) {
        if (deleteone) {
          setmodalConfirm(false);
          handleRemoveAdminAD(deleteone);
        } else {
          setmodalConfirm(false);
          handleRemoveAdminADarray();
        }
      }
    } catch (error) {
      setmessagestatus({ type: "error", mess: error.response.data.message });

    }

  };

  return (
    <table>
      {messagestatus.mess ? <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={messagestatus.type}
          sx={{ width: "100%" }}
        >
          {messagestatus.mess}
        </Alert>
      </Snackbar> : null}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="relative" style={{ height: 400, width: "100%" }}>
            {modalconfirm ? (
              <div className="absolute modal_confirm flex_s">
                <div className="bg-white">
                  <h3 className="m-0">{t("delete")}</h3>
                  <p>{t("Are you sure you want to delete ?")}</p>
                  <div className="modal_confirm__btns">
                    <button
                      onClick={handleClosemodalConfirm_close}
                      className="modal_confirm__btn__close"
                    >
                      {t("delete")}
                    </button>
                    <button
                      onClick={handleClosemodalConfirm_delete}
                      className="modal_confirm__btn__delete"
                    >
                      {t("delete")}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            <h3 className="header__modal">{`Account Id: ${datamodal.ID ? datamodal.ID : "..."
              } - ${t("admin")} (${datamodal.array?.length ? datamodal.array?.length : 0
              })`}</h3>
            {loading ? <Loading loadingoption="loading__modal" /> : null}
            <Table
              className="over"
              pagination={false}
              size="small"
              rowSelection={{
                ...rowSelection,
              }}
              columns={columns}
              dataSource={data}

            />
          </div>
        </Box>
      </Modal>
      <thead>
        <tr>
          {thTable.map((value, index) => {
            return (
              <th
                key={index}
                className="btn_header_table"
                onClick={() => {
                  handleFilters(value);
                }}
                style={{
                  minWidth: `${index > 5 && index < 11 ? "70px" : "10px"}`,
                  maxWidth: `${index === 1 ? "40px" : ""}`,
                }}
              >
                <div className="flex_s header_flex">
                  <span>{value.value}</span>
                  <div
                    className={`flex_s header_flex icon_header ${selectsort.count === 0 ||
                        (selectsort.key === value.key && selectsort.count > 0)
                        ? "visible"
                        : "invisible"
                      }`}
                  >
                    <div
                      className={`icon_header1 mb-0.5 ${selectsort.count % 2 === 0 && selectsort.count > 0
                          ? "icon_header_action"
                          : ""
                        }`}
                    >
                      <i className="fa-solid fa-caret-up" />
                    </div>
                    <div
                      className={`icon_header2 ${selectsort.count % 2 === 1 ? "icon_header_action" : ""
                        }`}
                    >
                      <i className="fa-solid fa-caret-down"></i>
                    </div>
                  </div>
                </div>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {dataAD &&
          dataAD?.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.stt}</td>
                <td>
                  <div
                    className={
                      item.status === "active"
                        ? "status g-status"
                        : " status r-status"
                    }
                  >
                    {t(item.status)}
                  </div>
                </td>
                <td>
                  <a
                    className="under_text"
                    href={`https://business.facebook.com/settings/ad-accounts?business_id=${item.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.id}
                  </a>
                </td>
                <td>{item.name}</td>
                <td>{item.levelBm}</td>
                <td>{item.limit}</td>
                <td>
                  {
                    <i
                      className="fa-solid fa-circle-check"
                      style={{
                        color: `${item.verified ? "#0091ff" : "#bebfc1"}`,
                      }}
                    ></i>
                  }
                </td>
                <td>
                  <div className="flex_s">
                    {item.admin}{" "}
                    <FaUserEdit
                      onClick={() => {
                        handleOpen({
                          ID: item.id,
                          array: item.adminarray,
                          bm: item.bm,
                        });
                      }}
                      className="icon3 "
                    />
                  </div>
                </td>
                <td>{item.datecreate}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default TableBusiness;
