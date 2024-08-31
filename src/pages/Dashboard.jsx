import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashSidebar from "../components/DashSideBar";
import DashPost from "../components/DashPost";
import DashUsers from "../components/DashUsers";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tabUrl = query.get("tab");
    if (tabUrl) {
      setTab(tabUrl);
    }
  }, [location.search]);
  return (
    <div className=" flex md:flex-row flex-col w-[100%] gap-5 md:gap-0">
      <div className=" md:w-[15%] md:min-h-screen">
        <DashSidebar />
      </div>
      <div className="md:w-[85%] md:min-h-screen">
        {tab === "profile" && <DashProfile />}
        {tab === "posts" && <DashPost />}
        {tab === "users" && <DashUsers />}
      </div>
    </div>
  );
};

export default Dashboard;
