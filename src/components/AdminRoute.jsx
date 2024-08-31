import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const AdminRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return currentUser.isAdmin ? <Outlet /> : navigate("/");
};

export default AdminRoute;
