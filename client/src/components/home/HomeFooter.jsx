import React from "react";
import { AiOutlineFieldTime,AiFillFacebook,AiOutlineSend } from "react-icons/ai";

function HomeFooter() {
  return (
    <div className="">
      <div className=" w-full bg-[#004a99] pb-[80px] z-[9999]   flex justify-center items-center">
        <div className="max-w-[950px] py-8  flex justify-start items-start">
          <div className="w-[360px] pl-8">
            <h1 className="text-white text-[34px] tracking-[1.5px]">
              SMETA.VN
            </h1>
            <p className="text-[#EEEEEE] text-[14px]">
              Một sản phẩm thuộc VenusTeam
            </p>
            <div className="border-t-[0.5px] w-ful border-gray-350 opacity-30 my-4"></div>
            <p className="text-[#EEEEEE] text-[16px] ">Chính sách</p>
          </div>
          <div className="w-[160px] mx-[30px]">
            <h1 className="text-white font-bold text-[14px] tracking-[1.5px] mb-[30px]">
              CONTACT US
            </h1>
            <p className="text-[#EEEEEE] text-[15px]">
              Vinhome OcenPark Đa Tốn, Gia Lâm, Hà Nội Việt Nam
            </p>
            <p className="text-[#EEEEEE] text-[14px] mt-2">
              <span className="font-bold">Phone:</span> 092.382.9999
            </p>
            <p className="text-[#EEEEEE] text-[14px] mt-2">
              <span className="font-bold">Email:</span> admin@smeta.vn
            </p>
          </div>

          <div className="w-[280px] mx-[100px]">
            <h1 className="text-white font-bold text-[14px] tracking-[1.5px] mb-[30px]">
              MẠNG XÃ HỘI
            </h1>
            <p className="text-[#EEEEEE] text-[15px] mb-10">
              Theo dõi và đóng góp ý kiến với chúng tôi qua các kênh mạng xã hội
            </p>
            <p className="text-[#EEEEEE] text-[14px] mt-2 flex">
              <div className="p-2 bg-[#007bff] rounded-full mr-3  hover:bg-[#3f79b8] cursor-pointer flex justify-center items-center">
                <div className=" bg-[#fff] rounded-full p-1  cursor-pointer z-[99999] text-[#3f79b8]">
                  <AiFillFacebook></AiFillFacebook>
                </div>
              </div>
              <div className="p-2 bg-[#007bff] rounded-full hover:bg-[#3f79b8] cursor-pointer flex justify-center items-center">
                <div className=" bg-[#fff] rounded-full p-1  cursor-pointer z-[99999] text-[#3f79b8]">
                  <AiOutlineSend></AiOutlineSend>
                </div>
              </div>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#00428a]  z-[9999] p-8 text-white text-base  flex justify-center items-center">
        © Copyright <span className="font-bold">sMeta.vn</span>. All Rights
        Reserved
      </div>
    </div>
  );
}

export default HomeFooter;
