import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import instace from "../../pages/customer_axios";
import { useDispatch } from "react-redux";
import Loading from "../Loading";
import RefreshToken from "../../pages/RefreshToken";
import { setUser, setDataToken } from "../../redux/counterSlice";
import { Button } from "antd";
import { TablePagination,} from "@mui/material";


function Team(props) {
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
  const { darkmode, loading } = counter;
  const dispatch = useDispatch();
  let { dataToken } = counter
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [sttStart, setSttStart] = useState(0);

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

        const response = await instace.get('/admin/getalluser', {
          idpackage: "65082330bc28d754fa64ea2c"
        }, {
          headers: {
            Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""}`,
          },
        });

        const dataa = response.data?.data;
        setData(dataa)

      } catch (error) {
        console.error("Lỗi xảy ra khi gọi API:", error);
      }
    };

    fetchData();
  }, []);



  return (
    <div className="w-full">
      <Header />

      <div className="pt-12">
        <table className="w-full table-auto border border-collapse">
          <thead>
            <tr>
              {tablehead.map((value, index) => {
                return (
                  <th
                    className={`p-2 border text-sm cursor-pointer ${darkmode ? "text-white" : ""
                      }`}

                    onClick={value.key  !== "stt"  ? () => {
                      handleFilters(value);
                    } : null}
                    key={index}
                  >
                    <div className="flex justify-between items-center">
                      {value.label}
                      {selectsort.count === 0 ||
                        (selectsort.key === value.key && selectsort.count > 0) ? (
                        <div className={`flex flex-col ml-2  ${value.key === "stt" ? "hidden" : ""}`}>
                          <div
                            className={`text-[8px]  ${selectsort.count % 2 === 0 &&
                                selectsort.count > 0
                                ? "!text-red-600"
                                : ""
                              }`}
                          >
                            <BiSolidUpArrow />
                          </div>
                          <div
                            className={`text-[8px] -translate-y-[2px] ${selectsort.count % 2 === 1
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
                    className={`border text-sm ${darkmode ? "text-white" : ""}`}
                  >
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2 ">{value.username}</td>
                    <td className="border p-2 ">{value.email}</td>
                    <td className="border p-2">
                      {value.phone}
                    </td>
                    <td className="border p-2 text-center">
                      {value?.action?.length > 0 ? value.action.map(value=> value.key).join(", ") : "None" }
                    </td>
                    <td className="border p-2 text-center">
                      {value.role}
                    </td>
                    <td className="border p-2 text-center">
                      {value.createAt}
                    </td>
                    <td className="border p-2 text-center">
                      {value.totleMoney}
                    </td>
                    <td className="border p-2 text-center">
                      {value.usedMonney}
                    </td>
                    <td className="border p-2 text-center">
                      <Button style={{ background: '#66FF33', }}>xem chi tiet</Button>
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
        style={{ color: darkmode ? 'white ' : '' }}
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 15, 20]}
      />
    </div>
  );
}

export default Team;
