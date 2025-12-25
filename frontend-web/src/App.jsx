
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

import SignupForm from "./components/SignUp"
import PrivacyPolicy from "./components/PrivacyPolicy"
import RyviveSilver from "./pages/RyviveSilver"
import RyviveGold from "./pages/RyviveGold"
import RyvivePlatinum from "./pages/RyvivePlatinum"
import SubscriptionsForm from "./components/SubscriptionsForm"
import ScrollToTop from "./components/ScrollToTop"




function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
     <ScrollToTop />
      <main className="flex-1 ">
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
          <Route path="/sign-up" element={<SignupForm />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
           <Route path="/subscription-form" element={<SubscriptionsForm />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

