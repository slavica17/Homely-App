import { BrowserRouter, Route, Routes } from "react-router";

import Home from "@/pages/home";
import Properties from "@/pages/properties";
import Admin from "@/pages/admin";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;