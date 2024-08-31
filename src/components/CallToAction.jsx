const CallToAction = () => {
  return (
    <div className=" flex flex-col md:flex-row items-center justify-center md:justify-between p-4 w-[100%] border">
      <div className=" flex flex-col items-center justify-center md:items-start gap-5 p-4 md:w-[50%]">
        <h1 className=" md:text-2xl text-xl font-bold text-center">
          Want to learn about the Mern-stack Development?
        </h1>
        <h2 className="font-semibold">Check out this website</h2>
        <button className=" flex items-center justify-center p-4 bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500 text-black">
          Click here
        </button>
      </div>
      <div className="flex flex-col items-center justify-center gap-5  p-4 md:w-[50%]">
        <img src="https://codingbytes.com/wp-content/uploads/2022/03/full-stack-web-development.jpg" />
      </div>
    </div>
  );
};

export default CallToAction;
