/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AddBusiness from "./pages/AddBusiness";
import BusinessProfile from "./pages/BusinessProfile";
import AdminDashboard from "./pages/AdminDashboard";
import SearchResults from "./pages/SearchResults";
import TheProject from "./pages/TheProject";
import ContactUs from "./pages/ContactUs";
import Payment from "./pages/Payment";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="project" element={<TheProject />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="add-business" element={<AddBusiness />} />
          <Route path="business/:id" element={<BusinessProfile />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="payment" element={<Payment />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
