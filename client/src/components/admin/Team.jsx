import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Main from "./Main";
import { useSelector } from "react-redux";
import Header from "./Header";
import axios from "axios";
import { AiFillCloseCircle } from "react-icons/ai";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { BsCheckCircleFill } from "react-icons/bs";


import { useDispatch } from "react-redux";
import { setloading } from "../../redux/counterSlice";
import Loading from "../Loading";
function Team(props) {
  const tablehead = [
    { label: "STT", key: "stt" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Premium", key: "status" },
    { label: "Email Send Total", key: "email_messenger_length" },
    { label: "Email Send in month", key: "send_total" },
    { label: "Voice total", key: "voice_length" },
    { label: "Amount Purchasing", key: "purchasing_length" },
    { label: "Purchasing total", key: "count_length" },
  ];

  const [data, setData] = useState([]);
  const [selectsort, setSelectsort] = useState({ key: "", count: 0 });

  const counter = useSelector((state) => state.counter);
  const { darkmode, loading } = counter;
  const dispatch = useDispatch();



  const handleFilters = (values) => {
    let dataclone = data;
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
                    className={`p-2 border text-sm cursor-pointer ${
                      darkmode ? "text-white" : ""
                    }`}
                    onClick={() => {
                      handleFilters(value);
                    }}
                    key={index}
                  >
                    <div className="flex justify-between items-center">
                      {value.label}
                      {selectsort.count === 0 ||
                      (selectsort.key === value.key && selectsort.count > 0) ? (
                        <div className="flex flex-col ml-2 ">
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
              {data.map((value, index) => {
                return (
                  <tr
                    key={index}
                    className={`border text-sm ${darkmode ? "text-white" : ""}`}
                  >
                    <td className="border p-2 text-center">{value.stt}</td>
                    <td className="border p-2 ">{value.name}</td>
                    <td className="border p-2 ">{value.email}</td>
                    <td className="border p-2">
                      {/* {value.status == UserStatus.BUY ? (
                        <BsCheckCircleFill className="text-green-500 ml-8" />
                      ) : (
                        <AiFillCloseCircle />
                      )} */}
                    </td>
                    <td className="border p-2 text-center">
                      {value.email_messenger_length}
                    </td>
                    <td className="border p-2 text-center">
                      {value.send_total}
                    </td>
                    <td className="border p-2 text-center">
                      {value.voice_length}
                    </td>
                    <td className="border p-2 text-center">
                      {value.purchasing_length}
                    </td>
                    <td className="border p-2 text-center">
                      {value.count_length}
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
    </div>
  );
}

export default Team;
