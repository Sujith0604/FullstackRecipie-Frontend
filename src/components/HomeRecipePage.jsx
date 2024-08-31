import axios from "../utils/axios";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

const HomeRecipePage = () => {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState([]);
  const [error, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showmore, setShowmore] = useState(true);

  ////filter functionality//////////////
  const [query, setQuery] = useState("");

  const filteredRecipe = useMemo(() => {
    return recipe.filter((recipes) =>
      recipes.title.toLowerCase().includes(query.toLowerCase())
    );
  });
  ///////////////////////////////////////////////

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await axios.get("/recipe");

      const data = await res.data.recipies;
      setRecipe(data);
      setLoading(false);
      if (data.length < 9) {
        setShowmore(false);
      }
    } catch (error) {
      console.log(error.message);
      setErrors(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [slug]);

  const handleShowmore = async () => {
    try {
      const res = await axios.get(`/recipe?startIndex=${recipe.length}`);
      const data = await res.data.blogs;
      console.log(data);
      setRecipe((prev) => [...prev, ...data]);
      if (data.length < 9) {
        setShowmore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" flex flex-col items-center justify-center gap-10">
      <div className=" text-4xl font-bold">RECIPE'S</div>{" "}
      <input
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search blog by title...."
        className=" text-black p-4"
      />
      {recipe.length > 0 ? (
        <>
          <div className=" flex flex-wrap gap-5 items-center justify-center md:justify-between ">
            {filteredRecipe.map((item) => (
              <div
                key={item._id}
                className=" border p-4 flex flex-col gap-5 items-center justify-center  "
              >
                <img className="h-[250px] w-[270px]" src={item.image} />
                <h2>Title: {item.title}</h2>
                <div className=" flex gap-2">
                  <h2>Preparation:</h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.preparation.substring(0, 30),
                    }}
                  ></div>
                </div>
                <h3>Ingrdiant: {item.ingrediant}</h3>

                <p>Publish: {new Date(item.createdAt).toLocaleDateString()}</p>
                <NavLink
                  to={`/recipe/${item.slug}`}
                  className="flex items-center justify-center p-4  bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500 text-black"
                >
                  Read more
                </NavLink>
              </div>
            ))}
          </div>
          {showmore && <button onClick={handleShowmore}>Load More</button>}
          {error && <p className="text-red-500">{error}</p>}
        </>
      ) : (
        <div>There is no recipe added.</div>
      )}
    </div>
  );
};

export default HomeRecipePage;
