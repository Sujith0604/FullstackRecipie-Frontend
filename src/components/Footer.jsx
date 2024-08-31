import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className=" bg-black text-white items-center justify-center flex flex-col gap-5 px-4">
      <div className=" h-[50px] flex  text-2xl font-bold items-center">
        RECIPIE WEBSITE{" "}
      </div>
      <div className=" flex items-center justify-center h-[50px]">
        <ul className=" flex gap-5  text-sm font-semibold">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="#">About</NavLink>
          </li>
          <li>
            <NavLink to="#">Contact</NavLink>
          </li>
        </ul>
      </div>

      <div className=" flex items-center justify-center h-[50px]">
        <p className="text-sm font-semibold">
          &copy; {new Date().getFullYear()} MERN-STACK BLOG. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
