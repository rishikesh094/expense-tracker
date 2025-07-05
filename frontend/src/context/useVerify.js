import { useContext, useEffect } from "react";
import { AuthContext } from "./authContext";
import axios from "axios";
import url from "../services/service";
import { useNavigate } from "react-router-dom";

function useVerfy() {
  const Navigate = useNavigate();
  const { setLogin } = useContext(AuthContext);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(`${url}/verify`, { withCredentials: true });

        if (res.status == 200) {
          const data = res.data;
          setLogin(data);
        } else {
          alert("You Are Not Otherize Person");
          setLogin(null);
          Navigate("/login");
        }
      } catch (err) {
        console.error("User verification failed:", err);
        setLogin(null);
        Navigate("/login");
      }
    };

    verifyUser();
  },[]);
}

export default useVerfy;
