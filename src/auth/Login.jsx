import { useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../slices/userSlice";
import axios from "../utils/axios";

const Login = () => {
  const emaiRef = useRef();
  const passwordRef = useRef();

  const { error, loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emaiRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    try {
      dispatch(signInStart());
      if (!email || !password) {
        dispatch(signInFailure("Please fill all the fields"));
        return;
      }
      const res = await axios.post("/user/login", {
        email,
        password,
      });
      const data = res.data;

      if (!res.statusText === "OK") {
        dispatch(signInFailure("Invalid email or password"));
        return;
      }

      dispatch(signInSuccess(data));
      emaiRef.current.value = "";
      passwordRef.current.value = "";
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className=" w-[100%] s flex flex-col md:flex-row items-center justify-around ">
      <div className="md:w-[50%] px-4 flex flex-col gap-5 items-center md:items-start justify-center md:justify-start">
        <h1 className=" text-5xl font-bold">Recipie website</h1>
        <p className=" text-xl font-thin text-center md:text-start">
          This is sample website to view recipe.
        </p>
      </div>
      <div className=" flex items-center justify-center md:w-[50%] px-2">
        <div className="flex flex-col gap-5 p-4 rounded-md md:w-[500px]">
          <div className=" flex flex-col gap-5 items-center justify-center md:items-start md:justify-start">
            <div className=" font-bold text-3xl">BLOG WEBSITE</div>
            <div className=" flex flex-col gap-2 items-center justify-center md:items-start md:justify-start">
              <h2 className=" text-xl font-semibold">Welcome back!</h2>
              <p className=" font-thin">
                Please enter your email and password to login.
              </p>
            </div>
          </div>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className=" flex flex-col">
              <label className=" font-semibold">Email</label>
              <input
                className=" p-2 border rounded-md"
                type="email"
                ref={emaiRef}
                placeholder="Enter your Email"
              />
            </div>

            <div className=" flex flex-col">
              <label className=" font-semibold">Password:</label>
              <input
                className=" p-2 border rounded-md"
                type="password"
                ref={passwordRef}
                placeholder="Enter your password"
              />
            </div>

            <button
              className=" bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500 text-black  p-2 rounded-md"
              type="submit"
            >
              Login
            </button>
          </form>

          <OAuth />

          <div className="flex justify-center gap-2 font-bold">
            <p className=" text-blue-600">or Dont have an account?</p>
            <NavLink to="/register" className=" text-blue-600">
              Register
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
