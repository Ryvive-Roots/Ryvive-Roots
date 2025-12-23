
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
import RyviveFlow from "./pages/RyviveFlow"
import RyviveStart from "./pages/RyviveStart"
import RyvivePrime from "./pages/RyvivePrime"
import SignupForm from "./components/SignUp"
import PrivacyPolicy from "./components/PrivacyPolicy"




function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

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
          <Route path="subscription/start" element={<RyviveStart />} />
          <Route path="subscription/flow" element={<RyviveFlow />} />
          <Route path="subscription/prime" element={<RyvivePrime />} />
          <Route path="/sign-up" element={<SignupForm />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

