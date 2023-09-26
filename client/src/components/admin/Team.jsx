import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import instace from "../../pages/customer_axios";
import { useDispatch } from "react-redux";
import Loading from "../Loading";
import RefreshToken from "../../pages/RefreshToken";
import { setUser, setDataToken, setprofileId } from "../../redux/counterSlice";
import { Button } from "antd";
import { TablePagination } from "@mui/material";
import priceFormat from "../../config/priceFormat";
import dateFormat from "../../config/dateFormat";
import ViewProfileUser from "./ViewProfileUser";
import io from "socket.io-client";
import { Modal } from "antd";

function Team(props) {
  // const socket = io('http://localhost:5000'); // URL máy chủ WebSocket của bạn
  const tablehead = [
    { label: "STT", key: "stt" },
    { label: "Name", key: "username" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Package", key: "action" },
    { label: "Role", key: "role" },
    { label: "Date", key: "createAt" },
    { label: "Money", key: "totleMoney" },
    { label: "UseMoney", key: "usedMonney" },
  ];
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [selectsort, setSelectsort] = useState({ key: "", count: 0 });
  const counter = useSelector((state) => state.counter);
  const { darkmode, loading, profileId } = counter;
  const dispatch = useDispatch();
  let { dataToken } = counter;
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [sttStart, setSttStart] = useState(0);

  // const socket = io.connect('http://localhost:5000')

  // useEffect(()=>{
  //   socket.on('register_socket', function (data) {
  //     console.log(data, 12312313);
  //     setData(data.data)
  //   });
  // },[])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const newSttStart = page * rowsPerPage;
    setSttStart(newSttStart);
  }, [page, rowsPerPage]);

  const startIndex = sttStart;
  const endIndex = startIndex + rowsPerPage;
  const displayedData = data.slice(startIndex, endIndex);

  const handleFilters = (values) => {
    let dataclone = displayedData;
    var newSelect = { ...selectsort };
    if (values.key !== selectsort.key) {
      newSelect.key = values.key;
      newSelect.count = 1;
    } else {
      newSelect.count = selectsort.count + 1;
    }
    setSelectsort(newSelect);

    if (newSelect.count % 2 === 0) {
      let newdata = dataclone.sort(function (a, b) {
        var nameA = a[`${values.key}`].toString().toLowerCase();
        var nameB = b[`${values.key}`].toString().toLowerCase();
        if (!isNaN(nameA) && !isNaN(nameB)) {
          return parseInt(nameA) - parseInt(nameB);
        } else {
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }
      });
      setData(newdata);
    } else {
      let newdata = dataclone.sort(function (a, b) {
        var nameA = a[`${values.key}`].toString().toLowerCase();
        var nameB = b[`${values.key}`].toString().toLowerCase();
        if (!isNaN(nameA) && !isNaN(nameB)) {
          return parseInt(nameB) - parseInt(nameA);
        } else {
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          return 0;
        }
      });
      setData(newdata);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newDatatoken = await RefreshToken(dataToken);
        dispatch(setDataToken(newDatatoken));

        const response = await instace.get("/admin/getalluser", {
          headers: {
            Authorization: `Bearer ${
              newDatatoken ? newDatatoken.accessToken : ""
            }`,
          },
        });

        const dataa = response.data?.data;
        setData(dataa);
      } catch (error) {
        console.error("Lỗi xảy ra khi gọi API:", error);
      }
    };
    fetchData();
  }, []);

  const [searchKeyword, setSearchKeyword] = useState("");
  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const search_btn = async () => {
    try {
      const newDatatoken = await RefreshToken(dataToken);
      dispatch(setDataToken(newDatatoken));
      const response = await instace.get(
        `/admin/searchProduct?searchbyname=${searchKeyword}`,
        {
          headers: {
            Authorization: `Bearer ${
              newDatatoken ? newDatatoken.accessToken : ""
            }`,
          },
        }
      );

      setData(response.data);
    } catch (error) {
      console.error("Lỗi xảy ra khi gọi API:", error);
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      search_btn();
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idedit, setIdedit] = useState("");
  const [dataedit, setDataedit] = useState("");
  const [packagee, setPackagee] = useState([]);
  const showModal = async (id) => {
    setIsModalOpen(true);
    setIdedit(id);
    try {
      const newDatatoken = await RefreshToken(dataToken);
      dispatch(setDataToken(newDatatoken));
      console.log(idedit, "idedit");
      const response = await instace.get(`/admin/getuserbuyid/${id}`, {
        headers: {
          Authorization: `Bearer ${
            newDatatoken ? newDatatoken.accessToken : ""
          }`,
        },
      });
      setDataedit(response.data.userProfile);
      setUsername(response.data.userProfile.username);
      setEmail(response.data.userProfile.email);
      setPhone(response.data.userProfile.phone);
      setRole(response.data.userProfile.role);
      setMoney(response.data.userProfile.totleMoney);
    } catch (error) {
      console.error("Lỗi xảy ra khi gọi API:", error);
    }
  };
  const handleOk = async() => {
    setIsModalOpen(false);
    const selectedValues = packagee.filter(value => packagee.includes(value));
    try {
      const newDatatoken = await RefreshToken(dataToken);
      dispatch(setDataToken(newDatatoken));
      const response = await instace.patch(`/admin/updateoneuser/${idedit}`,{
          username:username,
          email:email,
          phone:phone,
          role:role,
          totalmoney:money,
          action:selectedValues
      }, {
        headers: {
          Authorization: `Bearer ${
            newDatatoken ? newDatatoken.accessToken : ""
          }`,
        },
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Lỗi xảy ra khi gọi API:", error);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [money, setMoney] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handlePackageChange = (e) => {
    const value = e.target.value;
    if (packagee.includes(value)) {
      setPackagee(packagee.filter((item) => item !== value));
    } else {
      setPackagee([...packagee, value]);
    }
  };
  useEffect(() => {
    if (dataedit.action) {
      setPackagee(dataedit.action.map((item) => item.key));
    }
  }, [dataedit.action]);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleMoneyChange = (e) => {
    setMoney(e.target.value);
  };


  return (
    <div className="w-full">
      <Header />
      <p className={`text-3xl font-medium ${darkmode ? "text-white" : ""}`}>
        User
      </p>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ background: "rgb(227 137 137)" }}
        closable={false}
      >
        <div style={{ marginTop: "20px", padding: "0px 30px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <label style={{ width: "20%" }}>Name</label>
            <input
            disabled={true}
              type="text"
              style={{ width: "80%" }}
              value={username}
              onChange={handleUsernameChange}
            ></input>
          </div>
          <div
            
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <label style={{ width: "20%" }}>Email</label>
            <input
            disabled={true}
              type="text"
              style={{ width: "80%" }}
              value={email}
              onChange={handleEmailChange}
            ></input>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <label style={{ width: "20%" }}>Phone</label>
            <input
              type="text"
              style={{ width: "80%" }}
              value={phone}
              onChange={handlePhoneChange}
            ></input>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <label style={{ width: "20%" }}>Package</label>
            <div style={{ width: "80%" }}>
              <label style={{ display: "block", marginRight: "20px" }}>
                <input
                  type="checkbox"
                  checked={packagee.includes("Share TKQC")}
                  onChange={handlePackageChange}
                  style={{ marginRight: "20px" }}
                  value='Share TKQC'
                />
                Share TKQC
              </label>
              <label style={{ display: "block", marginRight: "20px" }}>
                <input
                  type="checkbox"
                  value="Create Campaign"
                  checked={packagee.includes("Create Campaign")}
                  onChange={handlePackageChange}
                  style={{ marginRight: "20px" }}
                />
                Create Campaign
              </label>
              <label style={{ display: "block", marginRight: "20px" }}>
                <input
                  type="checkbox"
                  checked={packagee.includes("Create Ad Account")}
                  value='Create Ad Account'
                  onChange={handlePackageChange}
                  style={{ marginRight: "20px" }}
                />
                Create Ad Account
              </label>
              <label style={{ display: "block" }}>
                <input
                  type="checkbox"
                  value="All"
                  checked={packagee.includes("All")}
                  onChange={handlePackageChange}
                  style={{ marginRight: "20px" }}
                />
                All
              </label>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <label style={{ width: "20%" }}>Role</label>
            <label style={{ width: "40%" }}>
              <input
                type="radio"
                name="role"
                checked={role === "user"}
                onChange={handleRoleChange}
              />{" "}
              User
            </label>
            <label style={{ width: "40%" }}>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={handleRoleChange}
              />{" "}
              Admin
            </label>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <label style={{ width: "20%" }}>Money</label>
            <input
              type="text"
              style={{ width: "80%" }}
              value={money}
              onChange={handleMoneyChange}
            ></input>
          </div>
        </div>
      </Modal>
      {profileId ? (
        <ViewProfileUser />
      ) : (
        <>
          <div id="searchbox">
            <input
              type="text"
              size="15"
              placeholder="Enter keywords here..."
              onChange={handleSearchChange}
              value={searchKeyword}
              onKeyPress={handleKeyPress}
            />
            <input
              id="button-submit"
              type="submit"
              value=" "
              onClick={search_btn}
            />
          </div>
          <div className="pt-12">
            <table className="w-full table-auto border border-collapse">
              <thead>
                <tr>
                  {tablehead.map((value, index) => {
                    return (
                      <th
                        className={`p-2 border text-sm cursor-pointer ${
                          darkmode ? "text-white" : ""
                        }`}
                        onClick={
                          value.key !== "stt"
                            ? () => {
                                handleFilters(value);
                              }
                            : null
                        }
                        key={index}
                      >
                        <div className="flex justify-between items-center">
                          {value.label}
                          {selectsort.count === 0 ||
                          (selectsort.key === value.key &&
                            selectsort.count > 0) ? (
                            <div
                              className={`flex flex-col ml-2  ${
                                value.key === "stt" ? "hidden" : ""
                              }`}
                            >
                              <div
                                className={`text-[8px]  ${
                                  selectsort.count % 2 === 0 &&
                                  selectsort.count > 0
                                    ? "!text-red-600"
                                    : ""
                                }`}
                              >
                                <BiSolidUpArrow />
                              </div>
                              <div
                                className={`text-[8px] -translate-y-[2px] ${
                                  selectsort.count % 2 === 1
                                    ? "!text-red-600"
                                    : ""
                                }`}
                              >
                                <BiSolidDownArrow />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              {!loading ? (
                <tbody>
                  {displayedData?.map((value, index) => {
                    return (
                      <tr
                        key={index}
                        className={`border text-sm ${
                          darkmode ? "text-white" : ""
                        }`}
                      >
                        <td className="border p-2 text-center">{index + 1}</td>
                        <td className="border p-2 ">{value.username}</td>
                        <td className="border p-2 ">{value.email}</td>
                        <td className="border p-2">{value.phone}</td>
                        <td className="border p-2 text-start">
                          {value?.action?.length > 0
                            ? value.action.map((value) => value.key).join(", ")
                            : "None"}
                        </td>
                        <td className="border p-2 text-center">{value.role}</td>
                        <td className="border p-2 text-start">
                          {dateFormat(value.createAt)}
                        </td>
                        <td className="border p-2 text-start">
                          {`${priceFormat(value.totleMoney)} c`}
                        </td>
                        <td className="border p-2 text-start">
                          {`${priceFormat(value.usedMonney)} c`}
                        </td>
                        <td className=" p-2 text-center">
                          <Button
                            style={{ background: "#66FF33" }}
                            onClick={() => {
                              dispatch(setprofileId(value._id));
                            }}
                          >
                            view
                          </Button>
                        </td>
                        <td className=" p-2 text-center">
                          <Button
                            style={{ background: "#dfc7c7" }}
                            onClick={() => showModal(value._id)}
                          >
                            edit
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              ) : (
                <div className="w-full h-[500px] flex justify-center items-center">
                  <Loading />
                </div>
              )}
            </table>
          </div>
          <TablePagination
            component="div"
            style={{ color: darkmode ? "white " : "" }}
            count={data.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 15, 20]}
          />
        </>
      )}
    </div>
  );
}

export default Team;
