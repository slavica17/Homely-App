import { BrowserRouter, Route, Routes } from "react-router";

import Home from "@/pages/home";
import Properties from "@/pages/properties";
import Admin from "@/pages/admin";
import PropertyDetails from "@/pages/property-details";
import MyReservations from "@/pages/my-reservations";
import ReservationRequests from "@/pages/reservation-requests";
import Roommates from "@/pages/roommates";
import RoommateDetails from "@/pages/roommate-details";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route path="/reservation-requests" element={<ReservationRequests />} />
        <Route path="/roommates" element={<Roommates />} />
        <Route path="/roommates/:id" element={<RoommateDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;