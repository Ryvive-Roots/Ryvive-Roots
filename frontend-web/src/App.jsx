
import { Route, Routes, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import OurStory from "./pages/OurStory"
import Menu from "./pages/Menu"
import Subscription from "./pages/Subscription"
import Franchise from "./pages/Francise"
import Consultation from "./pages/Consultation"
import Career from "./pages/Career"
import Contact from "./pages/Contact"
import Footer from "./components/Footer"


import PrivacyPolicy from "./components/PrivacyPolicy"
import RyviveSilver from "./pages/RyviveSilver"
import RyviveGold from "./pages/RyviveGold"
import RyvivePlatinum from "./pages/RyvivePlatinum"

import ScrollToTop from "./components/ScrollToTop"
import Terms from "./components/Terms"
import WhatsAppButton from "./components/What'sApp"

import SilversubForm from "./components/SubSilverForm"
import GoldsubForm from "./components/SubGoldForm"
import PlatinumsubForm from "./components/SubPlatinumForm"
import UserDashboard from "./components/UserDashboard"
import Login from "./components/Login"
import Shipping from "./components/Shipping"
import Cancellation from "./components/Cancellation"
import DashboardPage from "./components/DashboardPage"
import PaymentSuccess from "./pages/PaymentSuccess"
import MealPlanLayout from "./components/SubscriptionPlans"
import SubscriptionPlans from "./components/SubscriptionPlansF"
import RyviveDashboard from "./components/ryvive-dashboard"




function App() {

  const location = useLocation();

  // ✅ Check if current route is dashboard
  const isDashboard = location.pathname.startsWith("/dashboard");
  return (
    <div className="   overflow-x-hidden ">
     {!isDashboard && <Navbar />}
      <ScrollToTop />
      <WhatsAppButton />
      
      <main className=" overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/subscriptionPlans" element={<SubscriptionPlans />} />
          <Route path="/franchise" element={<Franchise />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/career" element={<Career />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="subscription/silver" element={<RyviveSilver />} />
          <Route path="subscription/gold" element={<RyviveGold />} />
          <Route path="subscription/platinum" element={<RyvivePlatinum />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<Terms />} />
          <Route path="/subscription-silver" element={<SilversubForm />} />
          <Route path="/subscription-gold" element={<GoldsubForm />} />
          <Route path="/subscription-platinum" element={<PlatinumsubForm />} />
          <Route path="/dashboard" element={<RyviveDashboard />} />
          <Route path="/shipping-delivery" element={<Shipping/>} />
          <Route path="/cancellation-refund" element={<Cancellation />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
                 
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

