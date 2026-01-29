import { useEffect, useState } from "react";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/config";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.PROFILE);
        console.log("fetchUser res", res.data.data);
        setUser(res.data.data); // adjust based on your API response
      } catch (error) {
        console.error("User not logged in", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <h2 style={{ padding: "20px" }}>Loading...</h2>;

  return (
    <div style={{ padding: "20px", background: "lightgreen" }}>
      {user ? (
        <>
          <h1>Dashboard</h1>
          <p>Welcome, {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Gender: {user.gender}</p>
          <p>bio: {user.bio}</p>
          <p>phone: {user.phone}</p>
          <p>dateofbirth: {user.dateofbirth}</p>
        </>
      ) : (
        <p>Please login to see your dashboard.</p>
      )}
    </div>
  );
}

export default Dashboard;
