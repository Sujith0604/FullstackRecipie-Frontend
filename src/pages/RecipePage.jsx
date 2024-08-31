import axios from "../utils/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";

const RecipePage = () => {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState([]);
  const [error, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      setErrors(null);
      const res = await axios.get(`/recipe?slug=${slug}`);
      const data = await res.data.recipies[0];
      setRecipe(data);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setErrors(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" flex flex-col items-center justify-center gap-5">
      <h1 className=" text-4xl font-bold">BLOG</h1>

      {recipe && (
        <div className=" flex flex-col gap-5 items-center justify-center px-4">
          <img className="h-[350px] w-[350px]" src={recipe.image} />
          <h2 className=" text-2xl font-bold">Title: {recipe.title}</h2>
          <h2 className=" text-2xl font-bold">
            Ingrediants: {recipe.ingrediant}
          </h2>
          <div dangerouslySetInnerHTML={{ __html: recipe.preparation }}></div>

          <p>Publish: {new Date(recipe.createdAt).toLocaleDateString()}</p>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      <CallToAction />
    </div>
  );
};

export default RecipePage;
