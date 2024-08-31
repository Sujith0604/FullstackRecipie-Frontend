import GoogleIcon from "@mui/icons-material/Google";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../Firebase";
import axios from "../utils/axios";
import { useDispatch } from "react-redux";
import { signInFailure, signInSuccess } from "../slices/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider).catch(
        (err) => console.log(err)
      );

      const res = await axios.post("/user/google", {
        username: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        googlePhoto: resultsFromGoogle.user.photoURL,
      });
      console.log(res);
      if (!res.statusText === "OK") {
        dispatch(signInFailure("Invalid email or password"));
        return;
      }
      const data = res.data;
      console.log("Data:", data);
      navigate("/");

      dispatch(signInSuccess(data));
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <button
      className=" bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500 text-black  py-2 flex gap-2 items-center justify-center rounded-lg"
      type="button"
      onClick={handleClick}
    >
      <GoogleIcon />
      Continue with Google
    </button>
  );
};

export default OAuth;
