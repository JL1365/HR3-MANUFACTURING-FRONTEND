import axios from "axios";

import { useState } from "react";
import { useNavigate} from "react-router-dom";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import InputComponents from "../components/InputComponents";
import jjmLogo from "../assets/jjmlogo.jpg";

const AUTH_URL = process.env.NODE_ENV === "development" 
? "http://localhost:7687/api/auth" 
: "https://backend-hr3.jjm-manufacturing.com/api/auth";


function Login() {

    const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();


  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${AUTH_URL}/testLog`, formData, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        toast.success(response.data.message);
        console.log("Login Successful:", response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        // May response galing sa backend
        if (error.response.status === 400) {
          toast.error(error.response.data.message);
        } else if (error.response.status === 500) {
          toast.error("Internal Server Error. Please try again later.");
        } else {
          toast.error("Login failed. Please try again.");
        }
      } else {
        // Walang response (network error, backend down, etc.)
        toast.error("Network error. Please check your connection.");
      }
    }
  };
  

  return (
    <div className="hero bg-base-200 min-h-screen flex justify-center items-center">
        <ToastContainer/>
      <div className="hero-content flex-col lg:flex-row-reverse">
        {/* Left Side: Text Content */}
        <div className="text-center lg:text-left">
          <div className="flex justify-center py-6">
            <img src={jjmLogo} alt="Manufacturing Logo" className="w-32 h-32 object-contain" />
          </div>
          <h1 className="text-5xl font-bold">Login to HR3</h1>
          <p className="py-6">Welcome to JJM Manufacturing! Basta Best Quality and Best Brand, JJM na yan!</p>
        </div>

        {/* Right Side: Login Form */}
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl p-6">
          <form className="card-body" onSubmit={handleSubmit}>
            <h1 className="text-2xl text-center font-extrabold text-gray-900">LOGIN</h1>

            {/* Identifier Input (Email or Username) */}
            <div className="form-control">
              <InputComponents
                icon={User}
                type="text"
                name="email"
                placeholder="Enter your email or username"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <InputComponents
                icon={Lock}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="input input-bordered w-full pr-10"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {/* Show/Hide Password Button */}
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* Show Password Checkbox */}
            <div className="form-control mt-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <span className="label-text">Show Password</span>
              </label>
            </div>

            {/* Login Button */}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;
