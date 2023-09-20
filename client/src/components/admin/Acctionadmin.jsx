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
import { useSelector,useDispatch } from "react-redux";
import RefreshToken from "../../pages/RefreshToken";
import instace from "../../pages/customer_axios";
import { setDataToken } from "../../redux/counterSlice";
function Acctionadmin() {
  const counter = useSelector((state) => state.counter);
  const { darkmode,dataToken } = counter;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [sttStart, setSttStart] = useState(0);
  const dispatch = useDispatch();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [data,setData] =useState([])
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newDatatoken = await RefreshToken(dataToken);
        dispatch(setDataToken(newDatatoken));
        
        const response = await instace.get('/admin/getallacction', {
          idpackage: "65082330bc28d754fa64ea2c"
        }, {
          headers: {
            Authorization: `Bearer ${newDatatoken ? newDatatoken.accessToken : ""}`,
          },
        });
  
        const dataa = response.data?.data; 
        setData(dataa)
        console.log(dataa,'dataa')
  
      } catch (error) {
        console.error("Lỗi xảy ra khi gọi API:", error);
      }
    };
  
    fetchData();
  }, []); 
  


  useEffect(() => {
    const newSttStart = page * rowsPerPage;
    setSttStart(newSttStart);
  }, [page, rowsPerPage]);

  const startIndex = sttStart;
  const endIndex = startIndex + rowsPerPage;
  const displayedData = data.slice(startIndex, endIndex);
  console.log("displayedData:", displayedData);

  
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
                  {row.name}
                </TableCell>
                <TableCell style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
                  {row.acction}
                </TableCell>
                <TableCell style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
                  {row.language}
                </TableCell>
                <TableCell style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
                  {row.ip}
                </TableCell>
                <TableCell style={{ borderBottom: "1px solid #4CCEAC" ,color: darkmode ? 'white ':'' }}>
                  {row.date}
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
