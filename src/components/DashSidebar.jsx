import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

const DashSidebar = () => {
  const { currentUser } = useSelector((state) => state.user);

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
    <div>
      <aside className=" bg-gray-700 flex flex-col items-center justify-center text-white h-[100px] md:min-h-screen">
        <ul className=" flex md:flex-col items-center justify-center gap-5 md:h-[100%] uppercase font-bold text-xl">
          <li>
            <NavLink to={"/dashboard?tab=profile"}>
              {tab === "profile" ? (
                <p className=" bg-slate-400">
                  Profile{" "}
                  {currentUser.isAdmin ? <span>Admin</span> : <span>User</span>}
                </p>
              ) : (
                <p>Profile</p>
              )}
            </NavLink>
          </li>
          {currentUser.isAdmin && (
            <li>
              <NavLink to={"/dashboard?tab=posts"}>Post</NavLink>
            </li>
          )}
          {currentUser.isAdmin && (
            <li>
              <NavLink to={"/dashboard?tab=users"}>Users</NavLink>
            </li>
          )}
        </ul>
      </aside>
    </div>
  );
};

export default DashSidebar;
