import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import Header from "./Header";
import { useSelector } from "react-redux";
function Acctionadmin() {
  const counter = useSelector((state) => state.counter);
  const { darkmode } = counter;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [sttStart, setSttStart] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const data = [
    {
      id: 1,
      field1: "Dữ liệu 1-1",
      field2: "Dữ liệu 1-2",
      field3: "Dữ liệu 1-3",
      field4: "Dữ liệu 1-4",
      field5: "Dữ liệu 1-5",
    },
    {
      id: 2,
      field1: "Dữ liệu 2-1",
      field2: "Dữ liệu 2-2",
      field3: "Dữ liệu 2-3",
      field4: "Dữ liệu 2-4",
      field5: "Dữ liệu 2-5",
    },
    {
      id: 3,
      field1: "Dữ liệu 3-1",
      field2: "Dữ liệu 3-2",
      field3: "Dữ liệu 3-3",
      field4: "Dữ liệu 3-4",
      field5: "Dữ liệu 3-5",
    },
    {
      id: 4,
      field1: "Dữ liệu 4-1",
      field2: "Dữ liệu 4-2",
      field3: "Dữ liệu 4-3",
      field4: "Dữ liệu 4-4",
      field5: "Dữ liệu 4-5",
    },
    {
      id: 5,
      field1: "Dữ liệu 5-1",
      field2: "Dữ liệu 5-2",
      field3: "Dữ liệu 5-3",
      field4: "Dữ liệu 5-4",
      field5: "Dữ liệu 5-5",
    },
    {
      id: 6,
      field1: "Dữ liệu 6-1",
      field2: "Dữ liệu 6-2",
      field3: "Dữ liệu 6-3",
      field4: "Dữ liệu 6-4",
      field5: "Dữ liệu 6-5",
    },
    {
      id: 7,
      field1: "Dữ liệu 7-1",
      field2: "Dữ liệu 7-2",
      field3: "Dữ liệu 7-3",
      field4: "Dữ liệu 7-4",
      field5: "Dữ liệu 7-5",
    },
    {
      id: 8,
      field1: "Dữ liệu 8-1",
      field2: "Dữ liệu 8-2",
      field3: "Dữ liệu 8-3",
      field4: "Dữ liệu 8-4",
      field5: "Dữ liệu 8-5",
    },
    {
      id: 9,
      field1: "Dữ liệu 9-1",
      field2: "Dữ liệu 9-2",
      field3: "Dữ liệu 9-3",
      field4: "Dữ liệu 9-4",
      field5: "Dữ liệu 9-5",
    },
    {
      id: 10,
      field1: "Dữ liệu 10-1",
      field2: "Dữ liệu 10-2",
      field3: "Dữ liệu 10-3",
      field4: "Dữ liệu 10-4",
      field5: "Dữ liệu 10-5",
    },
    {
      id: 11,
      field1: "Dữ liệu 11-1",
      field2: "Dữ liệu 11-2",
      field3: "Dữ liệu 11-3",
      field4: "Dữ liệu 11-4",
      field5: "Dữ liệu 11-5",
    },
    {
      id: 12,
      field1: "Dữ liệu 12-1",
      field2: "Dữ liệu 12-2",
      field3: "Dữ liệu 12-3",
      field4: "Dữ liệu 12-4",
      field5: "Dữ liệu 12-5",
    },
    {
      id: 13,
      field1: "Dữ liệu 13-1",
      field2: "Dữ liệu 13-2",
      field3: "Dữ liệu 13-3",
      field4: "Dữ liệu 13-4",
      field5: "Dữ liệu 13-5",
    },
  ];

  useEffect(() => {
    const newSttStart = page * rowsPerPage;
    setSttStart(newSttStart);
  }, [page, rowsPerPage]);

  const startIndex = sttStart;
  const endIndex = startIndex + rowsPerPage;
  const displayedData = data.slice(startIndex, endIndex);

  return (
    <div className="w-full">
      <Header />
      <p className={`text-3xl font-medium ${darkmode ? "text-white" : ""}`}>
        Nhật Ký Hoạt Động
      </p>
      <TableContainer
        component={Paper}
        className="mt-10"
        style={{
          height: "430px",
          border: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'',
          background: darkmode ? '#141b2d ':'',
        }}
      >
        <Table aria-label="simple table ">
          <TableHead style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':''}}>
            <TableRow style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
              <TableCell style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
                STT
              </TableCell>
              <TableCell style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
                Tên Tk
              </TableCell>
              <TableCell style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
                Tính Năng
              </TableCell>
              <TableCell style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
                Quốc Gia
              </TableCell>
              <TableCell style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
                Ip
              </TableCell>
              <TableCell style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
                Thời Gian
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map((row, index) => (
              <TableRow key={index}>
                <TableCell style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
                  {sttStart + index + 1}
                </TableCell>
                <TableCell style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
                  {row.field1}
                </TableCell>
                <TableCell style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
                  {row.field2}
                </TableCell>
                <TableCell style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
                  {row.field3}
                </TableCell>
                <TableCell style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
                  {row.field4}
                </TableCell>
                <TableCell style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
                  {row.field5}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        style={{color: darkmode ? 'white ':''}}
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[7, 15, 20]}
      />
    </div>
  );
}

export default Acctionadmin;
