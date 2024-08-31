import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../Firebase";
import axios from "../utils/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AddRecipie = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    preparation: "",
    ingrediant: "",
    image: "",
  });

  const navigate = useNavigate();

  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("No file selected");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress percentage
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError(error);
          console.error("Upload failed", error);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData({
              ...formData,
              image: downloadURL,
            });
            setImageUploadError(null);
            setImageUploadProgress(null);
          });
        }
      );
    } catch (error) {
      setImageUploadError(error);
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`/recipe/${currentUser._id}`, {
        title: formData.title,
        preparation: formData.preparation,
        ingrediant: formData.ingrediant,
        image: formData.image,
      });

      const data = res.data;
      if (!res.statusText === "OK") {
        console.log("Error creating blog");
        return;
      }
      navigate(`/recipe/${data.slug}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[100%] flex md:flex-row flex-col gap-10 md:gap-0 text-black">
      <div className=" flex flex-col items-center gap-5 justify-center  md:w-[50%]">
        <div className=" text-2xl font-semibold">CREATE RECIPE</div>
        <form onSubmit={handleSubmit} className=" flex flex-col gap-5">
          <div className=" flex flex-col gap-2">
            <input
              className=" p-2 border rounded-md "
              type="text"
              placeholder="Enter the blog title"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
            />
          </div>
          <div>
            <input
              className=" p-2 border rounded-md "
              type="text"
              placeholder="Enter the ingrediants"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ingrediant: e.target.value,
                })
              }
            />
          </div>
          <div>
            <ReactQuill
              theme="snow"
              required
              value={formData.preparation}
              onChange={(value) => {
                setFormData({ ...formData, preparation: value });
              }}
            />
          </div>

          {formData.image && (
            <img
              className=" h-[250px] w-[250px]"
              src={formData.image}
              alt="Blog Image"
            />
          )}
          <div className=" flex flex-col gap-2">
            <input
              className=" p-2 border rounded-md"
              type="file"
              accept="image/*"
              placeholder="Upload an image"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {imageUploadProgress && (
              <div>Image upload progress: {imageUploadProgress}%</div>
            )}
            {imageUploadError && <div>{imageUploadError}</div>}
            <button
              onClick={handleUploadImage}
              className=" bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500 text-black p-2 rounded-md"
              type="button"
            >
              Upload image
            </button>
          </div>
          <button
            className=" bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500 text-black p-2 rounded-md"
            type="submit"
          >
            Create Recipe
          </button>
        </form>
      </div>
      <div className=" md:w-[50%] flex flex-col justify-center md:items-start items-center p-4">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </div>
    </div>
  );
};

export default AddRecipie;
