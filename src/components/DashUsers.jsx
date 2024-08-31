import { useSelector } from "react-redux";
import axios from "../utils/axios";
import { useEffect, useState } from "react";

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [showmore, setShowmore] = useState(true);

  console.log(users);

  const getAllUsers = async () => {
    const res = await axios.get("/user");
    const data = await res.data.Allusers;

    setUsers(data);
    if (data.length < 9) {
      setShowmore(false);
    }
  };

  useEffect(() => {
    if (currentUser.isAdmin) {
      getAllUsers();
    }
  }, [currentUser._id]);

  const handleShowmore = async () => {
    try {
      const res = await axios.get(`/user?startIndex=${users.length}`);
      const data = await res.data.users;
      console.log(data);
      setUsers((prev) => [...prev, ...data]);
      if (data.length < 9) {
        setShowmore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async (userId, id) => {
    alert("Are you sure you want to delete the posts?");
    try {
      const res = await axios.delete(`/user/${userId}/${id}`);
      alert("Deleted successfully");
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          {" "}
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Username
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Admin
                </th>
                <th scope="col" className="px-6 py-3">
                  User Image
                </th>
                <th scope="col" className="px-6 py-3">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.isAdmin ? "Admin" : "User"}
                  </td>
                  <td className="px-6 py-4">
                    <img
                      className="h-[50px] w-[50px]"
                      src={user.profileImage}
                    />
                  </td>
                  <td className="px-6 py-4 ">
                    <button
                      onClick={() => handleDelete(user._id, currentUser._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showmore && <button onClick={handleShowmore}>Load More</button>}
        </>
      ) : null}
    </div>
  );
};

export default DashUsers;
