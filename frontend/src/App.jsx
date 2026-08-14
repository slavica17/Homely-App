import { BrowserRouter, Route, Routes } from "react-router";

import Home from "@/pages/home";
import Properties from "@/pages/properties";
import Admin from "@/pages/admin";
  import PropertyDetails from "@/pages/property-details";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;