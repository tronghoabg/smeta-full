
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import instace from "./customer_axios";
async function RefreshToken(dataToken) {
  try {
    const decode = jwt_decode(dataToken.accessToken);
    const day = new Date();
    if (decode.exp < (day.getTime() / 1000)) {
      const response = await instace.post("/auth/refresh", {
        refreshToken: dataToken.refreshToken,
      });
      Cookies.set("datatoken", JSON.stringify(response.data), {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      return response.data; //Trả về dữ liệu từ phản hồi API
    } else {
      return dataToken;
    }
  } catch (error) {
    return false;
  }
}

export default RefreshToken;
