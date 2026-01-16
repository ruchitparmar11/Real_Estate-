import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Properties from './pages/Properties';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AddProperty from './pages/AddProperty';
import MyListings from './pages/MyListings';
import Wishlist from './pages/Wishlist';
import RoleSelection from './pages/RoleSelection';
import Inquiries from './pages/Inquiries';
import Analytics from './pages/Analytics';
import Applications from './pages/Applications';
import SellerProfile from './pages/SellerProfile';

import PropertyDetails from './pages/PropertyDetails';
import Payment from './pages/Payment';

import MyPurchases from './pages/MyPurchases';
import MySales from './pages/MySales';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-dark text-text-main font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/seller/:id" element={<SellerProfile />} />
            <Route path="/my-purchases" element={<MyPurchases />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/edit-property/:id" element={<AddProperty />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/inquiries" element={<Inquiries />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/my-sales" element={<MySales />} />
            <Route path="/role-selection" element={<RoleSelection />} />
          </Routes>
        </main>
        <footer className="bg-card py-8 text-center border-t border-border mt-auto">
          <div className="container mx-auto px-4 text-text-muted text-sm">
            © {new Date().getFullYear()} EstateAI. All rights reserved.
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App