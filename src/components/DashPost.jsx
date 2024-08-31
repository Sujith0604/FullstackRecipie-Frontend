import { useSelector } from "react-redux";
import axios from "../utils/axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const DashPost = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [recipe, setRecipe] = useState([]);
  const [showmore, setShowmore] = useState(true);

  const getAllRecipes = async () => {
    const res = await axios.get(`/recipe?userId=${currentUser._id}`);
    const data = await res.data.recipies;

    setRecipe(data);
    if (data.length < 9) {
      setShowmore(false);
    }
  };

  useEffect(() => {
    if (currentUser.isAdmin) {
      getAllRecipes();
    }
  }, [currentUser._id]);

  const handleShowmore = async () => {
    try {
      const res = await axios.get(
        `/recipe?userId=${currentUser._id}&startIndex=${recipe.length}`
      );
      const data = await res.data.recipes;
      console.log(data);
      setRecipe((prev) => [...prev, ...data]);
      if (data.length < 9) {
        setShowmore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async (recipeId, id) => {
    alert("Are you sure you want to delete the posts?");
    try {
      const res = await axios.delete(`/recipe/${recipeId}/${id}`);
      alert("Deleted successfully");
      setRecipe((prev) => prev.filter((recipe) => recipe._id !== recipeId));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      {currentUser.isAdmin && recipe.length > 0 ? (
        <>
          {" "}
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3">
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Preparation
                </th>
                <th scope="col" className="px-6 py-3">
                  Ingradiants
                </th>
                <th scope="col" className="px-6 py-3">
                  Image
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {recipe.map((rec) => (
                <tr
                  key={rec._id}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 text-black"
                >
                  <td className="px-6 py-4">{rec.title}</td>
                  <td className="px-6 py-4">
                    {new Date(rec.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className="px-6 py-4"
                    dangerouslySetInnerHTML={{
                      __html: rec.preparation,
                    }}
                  ></td>
                  <td className="px-6 py-4">{rec.ingrediant}</td>
                  <td className="px-6 py-4">
                    <NavLink to={`/recipe/${rec.slug}`}>
                      <img className="h-[50px] w-[50px]" src={rec.image} />
                    </NavLink>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <NavLink to={`/updateRecipe/${rec._id}`}>Update</NavLink>
                    <button
                      onClick={() => handleDelete(rec._id, currentUser._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showmore && <button onClick={handleShowmore}>Load More</button>}
        </>
      ) : null}
    </div>
  );
};

export default DashPost;
