import React, { useEffect, useState } from 'react'
import instace from '../../pages/customer_axios';
import RefreshToken from '../../pages/RefreshToken';
import { setDataToken } from '../../redux/counterSlice';
import { useSelector, useDispatch } from "react-redux";
import dateFormat from '../../config/dateFormat';
import Header from "./Header";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import Loading from "../Loading";
import { TablePagination,} from "@mui/material";
import './Invoice.css'
function Invoice() {
    const counter = useSelector(
        (state) => state.counter
      );
      let { dataToken } = counter

      const [page, setPage] = useState(0);
      const [data, setData] = useState([]);
      const [selectsort, setSelectsort] = useState({ key: "", count: 0 });
      const { darkmode, loading } = counter;
      const dispatch = useDispatch();
      const [rowsPerPage, setRowsPerPage] = useState(7);
      const [sttStart, setSttStart] = useState(0);

      const tablehead = [
        { label: "STT", key: "stt" },
        { label: "Name", key: "username" },
        { label: "Amount", key: "amount" },
        { label: "OrderCode", key: "orderCode" },
        { label: "Signature", key: "signature" },
        { label: "Date", key: "createdAt" },
      ];
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

            const response = await instace.get('/admin/getallpaymentadmin', {
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

      const [searchKeyword, setSearchKeyword] = useState("");
      const handleSearchChange = (event) => {
        setSearchKeyword(event.target.value);
      };
      const search_btn = async () => { 
        try {
          const newDatatoken = await RefreshToken(dataToken);
          dispatch(setDataToken(newDatatoken));
          const response = await instace.get(`/admin/searchPayment?searchbyname=${searchKeyword}`, {
            headers: {
              Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""}`,
            },
          });
      
          setData(response.data)
        } catch (error) {
          console.error("Lỗi xảy ra khi gọi API:", error);
        }
      };

      // useEffect(() => {
      //   search_btn();
      // }, [searchKeyword]);
    
      const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          search_btn();
        }
      }
  return (
    <div className="w-full">
    <Header />
    <p className={`text-3xl font-medium ${darkmode ? "text-white" : ""}`}>
        Invoice
      </p>
        <div id="searchbox">
        <input  type="text" size="15" placeholder="Enter keywords here..."  onChange={handleSearchChange}
              value={searchKeyword} onKeyPress={handleKeyPress}/>
        <input id="button-submit" type="submit" value=" "  onClick={search_btn}/>
        </div>

    <div className="pt-12">
      <table className="w-full table-auto border border-collapse max-h-[calc(100vh-200px)] overflow-y-auto">
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
                  <div className="flex justify-between items-center  ">
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
          <tbody className=''>
            {displayedData?.map((value, index) => {
              return (
                <tr
                  key={index}
                  className={`border text-sm ${darkmode ? "text-white" : ""}`}
                >
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{value.username}</td>
                  <td className="border p-2 ">{value.amount}</td>
                  <td className="border p-2">
                    {value.orderCode}
                  </td>
                  <td className="border p-2 text-start">
                    {value.signature}
                  </td>
                  <td className="border p-2 text-start">
                    {dateFormat(value.createdAt)}
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
  )
}

export default Invoice
