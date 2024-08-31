import HomeHeroSection from "../components/HomeHeroSection";
import HomeRecipePage from "../components/HomeRecipePage";

const Home = () => {
  return (
    <div className=" flex flex-col gap-5 p-4 w-[100%]">
      <HomeHeroSection />
      <HomeRecipePage />
    </div>
  );
};

export default Home;
