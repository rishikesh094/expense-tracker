import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import url from "../services/service";
import { AuthContext } from "../context/authContext";

function Login() {
  const { setLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/auth/login`, formData,
        { withCredentials: true }
      );


      if (res.status == 200) {
        const data = res.data;
        setLogin(data);
        alert("Login Successfully");
        navigate("/");
      } else {

        alert("Login failed");
      }



    } catch (err) {
      console.error(err)
      alert("Login failed")
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border px-4 py-2 rounded-md"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border px-4 py-2 rounded-md"
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">Login</button>
        </form>
        <p className="mt-4 text-center">
          Don’t have an account? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
