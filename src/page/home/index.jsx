import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "20px" , background: "lightblue" }}>
      <h1>Home Page</h1>

      <p>Welcome to our app</p>

      <div style={{ marginTop: "20px" }}>
        <Link to="/register" style={{ marginRight: "15px" , background: "orange" }}>
          Register
        </Link>

        <Link to="/login" style={{marginRight: "15px", background: "lightpink"}}>
          Login
        </Link>

      
      </div>
    </div>
  );
}

export default Home;
