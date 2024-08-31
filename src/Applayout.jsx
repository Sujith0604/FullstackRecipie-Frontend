import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";

const Applayout = () => {
  return (
    <div className=" flex flex-col ">
      <Header />
      <main className="mt-[100px] min-h-screen flex ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Applayout;
