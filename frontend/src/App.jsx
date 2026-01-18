import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Loading from './components/Loading'; // We might need to create this, or use a simple div
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Properties = lazy(() => import('./pages/Properties'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const AddProperty = lazy(() => import('./pages/AddProperty'));
const MyListings = lazy(() => import('./pages/MyListings'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const RoleSelection = lazy(() => import('./pages/RoleSelection'));
const Inquiries = lazy(() => import('./pages/Inquiries'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Applications = lazy(() => import('./pages/Applications'));
const SellerProfile = lazy(() => import('./pages/SellerProfile'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const Payment = lazy(() => import('./pages/Payment'));
const MyPurchases = lazy(() => import('./pages/MyPurchases'));
const MySales = lazy(() => import('./pages/MySales'));

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-dark text-text-main font-sans">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<Loading />}>
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
          </Suspense>
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