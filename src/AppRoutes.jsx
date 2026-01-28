import { Routes, Route } from "react-router-dom";

import Home from "./page/home";
import Login from "./page/login";
import Register from "./page/registration";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AppRoutes;
