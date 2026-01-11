
import { Route, Routes } from "react-router-dom"
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




function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden ">
      <Navbar />
      <ScrollToTop />
      <WhatsAppButton />
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/franchise" element={<Franchise />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/career" element={<Career />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="subscription/silver" element={<RyviveSilver />} />
          <Route path="subscription/gold" element={<RyviveGold />} />
          <Route path="subscription/platinum" element={<RyvivePlatinum />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<Terms />} />
          <Route path="/subscription-silver" element={<SilversubForm />} />
          <Route path="/subscription-gold" element={<GoldsubForm />} />
          <Route path="/subscription-platinum" element={<PlatinumsubForm />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

