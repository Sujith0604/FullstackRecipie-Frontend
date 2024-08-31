import { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";

const UpdateRecipe = () => {
  const { id } = useParams();

  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    preparation: "",
    ingrediant: "",
    image: "",
  });

  console.log(formData.title);

  const fetchData = async () => {
    try {
      const res = await axios.get(`/recipe/${id}`);
      setFormData({
        title: res.data.title,
        preparation: res.data.preparation,
        ingrediant: res.data.ingrediant,
        image: res.data.image,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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
      const res = await axios.put(`/recipe/${id}/${currentUser._id}`, {
        title: formData.title,
        preparation: formData.preparation,
        ingrediant: formData.ingrediant,
        image: formData.image,
      });

      const data = res.data;
      console.log(data);
      if (!res.statusText === "OK") {
        console.log("Error creating recipe");
        return;
      }
      navigate(`/recipe/${data.slug}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[100%] flex md:flex-row flex-col gap-10 md:gap-0  ">
      <div className=" flex flex-col items-center gap-5 justify-center  md:w-[50%] p-4">
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
      <div className=" flex flex-col items-center gap-5 justify-center  md:w-[50%] p-4">
        <div className=" uppercase text-3xl font-bold">Update blog</div>
        <form
          className=" flex flex-col gap-5 text-yellow-400"
          onSubmit={handleSubmit}
        >
          <div className=" flex flex-col gap-2">
            <label className="text-xl font-bold">Title:</label>
            <input
              className=" p-2 border rounded-md "
              type="text"
              placeholder="Enter the Recipe title"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
            />
          </div>
          <div className=" flex flex-col gap-2 mb-5">
            <label className="text-xl font-bold">Preparation:</label>
            <ReactQuill
              theme="snow"
              required
              value={formData.preparation}
              onChange={(value) => {
                setFormData({ ...formData, preparation: value });
              }}
            />
          </div>

          <div className=" flex flex-col gap-2">
            <label className="text-xl font-bold">Ingradiants:</label>
            <input
              className=" p-2 border rounded-md "
              type="text"
              placeholder="Enter the ingrediants"
              value={formData.ingrediant}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ingrediant: e.target.value,
                })
              }
            />
          </div>
          {formData.image && (
            <img
              src={formData.image}
              className=" h-[100px] w-[100px]"
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
            <div>
              <button
                className=" bg-blue-400 p-2 rounded-md"
                onClick={handleUploadImage}
                type="button"
              >
                Upload image
              </button>
            </div>
          </div>
          <button className=" bg-blue-400 p-2 rounded-md" type="submit">
            Update Recipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateRecipe;
