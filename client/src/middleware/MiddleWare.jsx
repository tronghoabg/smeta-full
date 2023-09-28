import Cookies from "js-cookie";



function MiddleWare({ children }) {
    let token = Cookies.get('datatoken')
    // useEffect(() => {
    //     const fetch = async () => {
    //       try {
    //         if (token) {
    //           const newDatatoken = await RefreshToken(dataToken);
    //           dispatch(setDataToken(newDatatoken));
    //           const datauser = await instace.get("/auth/profile", {
    //             headers: {
    //               Authorization: `Bearer ${
    //                 newDatatoken ? newDatatoken.accessToken : ""
    //               }`,
    //             },
    //           });
    //           dispatch(setUser(datauser.data));
    //         } else {
    //           const datauser = await instace.get("/auth/profile", {
    //             headers: {
    //               Authorization: `Bearer ${token ? dataToken.accessToken : ""}`,
    //             },
    //           });
    //           dispatch(setUser(datauser.data));
    //         }
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     };
    //     fetch();
    //   }, []);

    if(token ){
        return children
    }else{
        return  window.location.href = '/';
    }
}

export default MiddleWare