const HomeHeroSection = () => {
  return (
    <section className="flex md:h-[600px] h-[500px] items-center justify-center  md:px-11 ">
      <div className=" flex flex-col items-center justify-center  gap-5">
        <h1 className=" md:text-4xl text-2xl font-bold text-center ">
          Welcome to the Mernstack Development Blog Website
        </h1>
        <p className=" md:text-xl text-center ">
          This website will provide all the information about MERN satck
          development
        </p>
        <p className=" md:text-xl text-center ">
          We have all the resources that you need to learn from basic to advance
        </p>
        <div>
          <button className="flex items-center text-black justify-center p-4 bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500 ">
            Learn more
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
