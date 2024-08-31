import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../Firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import axios from "../utils/axios";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logoutSuccess,
} from "../slices/userSlice";
import { NavLink } from "react-router-dom";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});

  const [imageFile, setImageFile] = useState("");
  const [imageURL, setImageURL] = useState("");
  const filePickerRef = useRef();
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageSucceeded, setImageSucceeded] = useState(false);

  const [uploadSucess, setUploadSucess] = useState("");
  const [uploadError, setUploadError] = useState("");

  console.log(imageFileUploadError, imageFileUploadProgress);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageURL(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      updateImage();
    }
  }, [imageFile]);

  const updateImage = async () => {
    setImageSucceeded(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;

    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress percentage
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Upload error: ", error);
        setImageFileUploadError(error.message);
        setImageFileUploadProgress(null);
        setImageSucceeded(false);
        setImageURL(null);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("Image uploaded to: ", downloadURL);
          setImageURL(downloadURL);
          setFormData({ ...formData, profileImage: imageURL });
          setImageSucceeded(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError("");
    setUploadSucess("");
    if (Object.keys(formData).length === 0) {
      setUploadError("No changes in the field");
      return;
    }
    if (imageSucceeded) {
      setUploadError("Image is uploading");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await axios.put(`/user/${currentUser._id}`, formData);
      console.log(res);
      if (!res.statusText === "OK") {
        dispatch(updateFailure("Error updating"));
        setUploadError("Error updating");
      }
      const data = await res.data;
      dispatch(updateSuccess(data.rest));
      setUploadSucess("Uploaded the changes");
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleDelete = async (id) => {
    dispatch(deleteUserStart());
    try {
      const res = await axios.delete(`/user/${id}`);
      console.log(res);
      if (!res.statusText === "OK") {
        dispatch(deleteUserFailure("Error deleting"));
      }
      const data = await res.data;
      dispatch(deleteUserSuccess(data));
      alert("User deleted successfully");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post("/user/logout");
      console.log(res);
      const data = await res.data;
      if (!res.statusText === "OK") {
        console.log("Error logging out");
      }
      dispatch(logoutSuccess());
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="md:min-h-screen flex flex-col gap-5 items-center justify-center">
      <form onClick={handleSubmit} className=" flex flex-col gap-2 text-black">
        <input
          type="file"
          accept="image/*"
          onClick={handleImageChange}
          ref={filePickerRef}
          className=" hidden"
        />
        <div>
          <img
            onClick={() => filePickerRef.current.click()}
            className=" h-[200px] rounded-full"
            src={imageURL || currentUser.profileImage}
          />
          {/* )} */}
        </div>

        <div className=" flex flex-col">
          <label className=" font-semibold">Username</label>

          <input
            type="text"
            placeholder="Enter your name"
            className=" p-2 border rounded-md"
            defaultValue={currentUser.username}
            name="username"
            onChange={handleChange}
          />
        </div>
        <div className=" flex flex-col">
          <label className=" font-semibold">Email</label>
          <input
            type="email"
            className=" p-2 border rounded-md"
            placeholder="Enter your email"
            defaultValue={currentUser.email}
            name="email"
            onChange={handleChange}
          />
        </div>
        <div className=" flex flex-col">
          <label className=" font-semibold">Password</label>
          <input
            type="password"
            className=" p-2 border rounded-md"
            placeholder="Enter your password"
            name="password"
            onChange={handleChange}
          />
        </div>
        <button
          className=" bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500 text-black px-4 py-2"
          type="submit"
        >
          Update Profile
        </button>
      </form>
      <div className=" flex flex-col gap-5">
        <button
          className=" bg-red-400 px-4 py-2"
          onClick={() => handleDelete(currentUser._id)}
        >
          Delete Account
        </button>
        <button className=" bg-red-400 px-4 py-2" onClick={handleLogout}>
          Logout Account
        </button>
      </div>
      {currentUser.isAdmin && (
        <NavLink to="/addblog">
          <button className=" bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500 text-black px-4 py-2">
            Create Blog
          </button>
        </NavLink>
      )}
      {uploadSucess && (
        <p className="bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500 text-black">
          {uploadSucess}
        </p>
      )}
      {uploadError && <p className="text-red-500">{uploadError}</p>}
    </div>
  );
};

export default DashProfile;
