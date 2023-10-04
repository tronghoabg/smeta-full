import React, { useEffect ,useState} from "react";
import { AiOutlineFieldTime } from "react-icons/ai";
import { Carousel } from 'antd';
import { FaGamepad } from 'react-icons/fa';
import { AiOutlineSearch }from 'react-icons/ai';
import { BsFileSpreadsheetFill} from 'react-icons/bs';
import HomeHeader from "../components/home/HomeHeader";
import HomeFooter from "../components/home/HomeFooter"
import '../components/accsetss/sharePixels.css'
import { useTranslation } from "react-i18next";
const contentStyle = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  // background: '#364d79',
};


const settings = {
  dots: true, 
  dotPosition: 'bottom', 
};


// downloadFromStore
function Test({setdisable}) {
  const downnow = () => {
    window.location.href = '/files/smetav4.zip';
  }
  const { t } = useTranslation();

  useEffect(()=>{
    setdisable(false)
  },[])
  const datawhy = [
    { icon: <AiOutlineFieldTime />, title: "Hiệu suất", desc: "Tăng hiệu quả công việc của bạn hơn gấp nhiều lần" },
    { icon: <AiOutlineFieldTime />, title: "Thời gian", desc: "Giúp khách hàng tiết kiệm thời gian quản lý tài khoản" },
    { icon: <AiOutlineFieldTime />, title: "Bảo mật", desc: "Chúng tôi cam kết không lấy thông tin khách hàng cho tất cả mục đích" },
    { icon: <AiOutlineFieldTime />, title: "Hỗ trợ", desc: "Luôn lắng nghe báo lỗi, góp ý của khách hàng và cải tiến" },
  ]

  const countwhy = [
    { count: 2000, title: "Customers" },
    { count: 1000, title: "User Register" },
    { count: 1000, title: "Customers Happy" },
  ]

  return (
    <div className="w-full">
      <HomeHeader/>
      {/* <div className="w-full fixed z-[9999] bg-[#004a99f5] flex justify-center items-center py-1 px-4" >
        <div className="w-[1280px]  flex justify-between items-center">
          <img src="/logo.png" alt="" className="w-[118px]" />
          <div className="text-base text-white opacity-80 font-medium">
            <button className="mr-8"> Đăng ký</button>
            <button onClick={handleRedirectLogin}>Đăng nhập</button>
          </div>
        </div>

      </div> */}

      <div className="w-full relative  flex justify-center items-center">
        <img className="absolute top-0 left-0 h-[750px] w-full z-10" src="/hero-bg.png" alt="" />
        <div className="w-[1280px] z-[999] mt-[160px] flex justify-center items-center">
     
          <div className="animation_text">
            <h1 className="text-white text-[48px] font-bold ">sMeta <br />
             {t("Manage advertising accounts fox")} {t("easily professional")} <br />
              </h1>

            <button className="text-white  text-base border-1 border font-bold mt-10 bg-[#007bff] py-[10px] px-[32px] !rounded-3xl  border-[#007bff] hover:border-white hover:bg-[#3c4b5c]" onClick={downnow} >{t('downloadFromStore')}</button>
          </div>            <img src="/pc.png" className="w-[648px] h-[438px] animation_show_banner" alt="" />
        </div>
      </div>
      <div className="w-full bg-[#fff] pb-[50px]  z-[9999] flex justify-center items-center">
        <div className=" w-[1280px] pt-[182px]">
          <div className="flex  justify-center items-center flex-col">
            <h1 className="text-[36px] font-base text-[#283d50]">{t('Feature')}</h1>
            <p className="text-[#556877] text-[15px] tracking-[0.1px] mt-3">{t("Browse the key features of the sMeta widget")}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-[54px] text-[#444] text-[16px]">
            <div>
              <div>{t("sMeta is a utility used to manage business accounts on the Facebook platform, users can easily install and use on most browsers!")}</div>
              <div className="mt-6 flex justify-between items-center">
                <div className="border-2  w-[68px] h-[68px] rounded-full flex justify-center items-center border-[#007bff] duration-300 hover:bg-[#007bff] cursor-default text-[#007bff] hover:text-white">
                <FaGamepad style={{ fontSize: '30px' }} />
                </div>
                <div>
                  <h1 className="font-bold text-xl mb-2">{t('Intuitive interface')}</h1>
                  <p className="text-[14px] w-[550px]">{t('Through the utilitys interface, customers can easily view all account accounts, BMs, FAN PAGES, and CAMPAIGNs of their accounts.')}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div className="border-2  w-[68px] h-[68px] rounded-full flex justify-center items-center border-[#007bff] duration-300 hover:bg-[#007bff] cursor-default text-[#007bff] hover:text-white">
                 <AiOutlineSearch style={{ fontSize: '30px' }}></AiOutlineSearch>
                </div>
                <div>
                  <h1 className="font-bold text-xl mb-2">{t('View hidden information')}</h1>
                  <p className="text-[14px] w-[550px]">{t("View hidden Customers will be able to view hidden information in the platform's manager such as ad account thresholds and limits")}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div className="border-2  w-[68px] h-[68px] rounded-full flex justify-center items-center border-[#007bff] duration-300 hover:bg-[#007bff] cursor-default text-[#007bff] hover:text-white">
                  <BsFileSpreadsheetFill style={{ fontSize: '30px' }}></BsFileSpreadsheetFill>
                </div>
                <div>
                  <h1 className="font-bold text-xl mb-2">{t('Export data')}</h1>
                  <p className="text-[14px] w-[550px]">{t('Through customer sMeta, businesses can export advertising account data for reporting purposes.')}</p>
                </div>
              </div>
            </div>
            <img src="/s1.png" alt="" className="rounded-xl" />
          </div>



          <div className="grid grid-cols-2 gap-6 mt-[54px] text-[#444] text-[16px]">
            <img src="/s2.png" alt="" className="rounded-xl" />
            <div>
              <h1 className="font-bold text-2xl mb-2">{t('Interact with the board')}</h1>
              <p className="text-[16px] mt-4">{t('On the information panel about Accounts, BM, FANPAGE, CAMPAIGN displays overview information about important fields of the advertising account')}</p>
              <p className="text-[16px] mt-8">{t('sMeta allows users to view and arrange data information in tables (A-Z) and vice versa, intelligent search feature across all data according to user keywords. At the same time, there are buttons on the data panel to help users quickly access pages such as campaigns and bills of that advertising account.')}</p>
            </div>
          </div>


          <div className="grid grid-cols-2 gap-6 mt-[54px] text-[#444] text-[16px]">

            <div>
              <h1 className="font-bold text-2xl mb-2">{t('Advanced features')}</h1>
              <p className="text-[16px] mt-4">{t("Users can easily share pixels quickly to one or more advertising accounts through the Share feature")}</p>
              <p className="text-[16px] mt-8">{t('Users can easily share accounts quickly to one or more Facebook accounts through the Share Accounts feature.')}</p>
              <p className="text-[16px] mt-4">{t('The feature to create advertising accounts in BM is quick and completely automatic')}</p>
              <p className="text-[16px] mt-4 bg-[#822a56] text-[#ffdb1d] p-1 rounded-md">{t('Hidden Admin deletion feature in Personal and business advertising accounts')}</p>


            </div>
            <img src="/s3.png" alt="" className="rounded-xl" />
          </div>
        </div>
      </div>
      <div className="w-full bg-[#dbf7fa]  pb-[80px] shadow-xl z-[9999] flex justify-center items-center">
        <div className="w-[1280px] ">
          <h1 className="text-[36px] text-center mt-8 mb-8">{t('Why choose us?')}</h1>
          <div className="grid grid-cols-4 gap-14">
            {datawhy.map(value => {
              return (
                <div key={value.title} className="text-center bg-[#1b444c] duration-500 hover:bg-[#007a66] px-4 py-8 rounded-[34px]">
                  <div className="text-[#d8eafe] flex justify-center items-center text-6xl p-4">{value.icon}</div>
                  <h1 className="text-[22px] font-bold text-white mb-2">{t(value.title)}</h1>
                  <p className="text-[#d8eafe] text-[15px]">{t(value.desc)}</p>
                </div>
              )
            })}

          </div>
          <div className="flex justify-evenly items-center mt-[70px] ">
            {countwhy.map(value => {
              return (
                <div key={value.title} className="text-center">
                  <h1 className="text-[#191e30] text-[48px] font-bold tracking-[0.2px]">{value.count}</h1>
                  <p className="text-[#212121] text-[14px] tracking-[0.2px]">{value.title}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="w-full bg-[#ecf5ff] pb-[80px] z-[9999] flex-col flex justify-center items-center">
        <div className="h-[10px] bg-[#dbf7fa] w-full shadow-lg"></div>
        <div className="">
          <h1 className="text-[36px] text-center my-8 mb-[72px]">{t('Reviews from customers')}</h1>
        <div className="flex justify-center items-center ">
        <div className="w-[800px]">
        <Carousel {...settings} className="custom-carousel">
            <div>
              <h3 style={contentStyle}>
                <img src="/comment1.png" alt="" />
              </h3>
            </div>  
            <div>
              <h3 style={contentStyle}>
              <img src="/comment2.png" alt="" />
              </h3>
            </div>
            <div>
              <h3 style={contentStyle}>
              <img src="/comment3.png" alt="" />
              </h3>
            </div>
          </Carousel>
        </div>
        </div>
        </div>
      </div>
<HomeFooter/>
      {/* <div className="w-full bg-[#004a99] pb-[80px] z-[9999]  flex justify-center items-center">
        <div className="w=[1280px] p-8  flex justify-start items-start">
          <div className="w-[360px]">
            <h1 className="text-white text-[34px] tracking-[1.5px]">SMETA.VN</h1>
            <p className="text-[#EEEEEE] text-[14px]">Một sản phẩm thuộc VenusTeam</p>
            <div className="border-t-[0.5px] w-ful border-gray-350 opacity-30 my-4"></div>
            <p className="text-[#EEEEEE] text-[16px] ">Chính sách</p>
          </div>
          <div className="w-[160px] mx-[30px]">
            <h1 className="text-white font-bold text-[14px] tracking-[1.5px] mb-[30px]">CONTACT US</h1>
            <p className="text-[#EEEEEE] text-[15px]">Vinhome OcenPark
              Đa Tốn, Gia Lâm, Hà Nội
              Việt Nam</p>
            <p className="text-[#EEEEEE] text-[14px] mt-2"><span className="font-bold">Phone:</span> 092.382.9999</p>
            <p className="text-[#EEEEEE] text-[14px] mt-2"><span className="font-bold">Email:</span>  admin@smeta.vn</p>

          </div>

          <div className="w-[280px] mx-[100px]">
            <h1 className="text-white font-bold text-[14px] tracking-[1.5px] mb-[30px]">MẠNG XÃ HỘI</h1>
            <p className="text-[#EEEEEE] text-[15px] mb-10">Theo dõi và đóng góp ý kiến với chúng tôi qua các kênh mạng xã hội</p>
            <p className="text-[#EEEEEE] text-[14px] mt-2 flex">
              <div className="p-2 bg-[#007bff] rounded-full mr-3  hover:bg-[#3f79b8] cursor-pointer flex justify-center items-center">
                <div className=" bg-[#fff] rounded-full p-1  cursor-pointer z-[99999] text-[#3f79b8]"><AiFillFacebook></AiFillFacebook></div>
              </div>
              <div className="p-2 bg-[#007bff] rounded-full hover:bg-[#3f79b8] cursor-pointer flex justify-center items-center">
                <div className=" bg-[#fff] rounded-full p-1  cursor-pointer z-[99999] text-[#3f79b8]"><AiOutlineSend></AiOutlineSend></div>
              </div>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#00428a]  z-[9999] p-8 text-white text-base  flex justify-center items-center">
      © Copyright <span className="font-bold">sMeta.vn</span>. All Rights Reserved
      </div> */}
         
    </div>
  )

}

export default Test;