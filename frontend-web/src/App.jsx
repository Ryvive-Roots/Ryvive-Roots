import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/What'sApp";

// ✅ Lazy Pages
const Home = lazy(() => import("./pages/Home"));
const OurStory = lazy(() => import("./pages/OurStory"));
const Menu = lazy(() => import("./pages/Menu"));
const Subscription = lazy(() => import("./pages/Subscription"));
const Franchise = lazy(() => import("./pages/Francise"));
const Consultation = lazy(() => import("./pages/Consultation"));
const Career = lazy(() => import("./pages/Career"));
const Contact = lazy(() => import("./pages/Contact"));
const RyviveSilver = lazy(() => import("./pages/RyviveSilver"));
const RyviveGold = lazy(() => import("./pages/RyviveGold"));
const RyvivePlatinum = lazy(() => import("./pages/RyvivePlatinum"));

// ✅ Lazy Components Pages
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const Terms = lazy(() => import("./components/Terms"));
const SilversubForm = lazy(() => import("./components/SubSilverForm"));
const GoldsubForm = lazy(() => import("./components/SubGoldForm"));
const PlatinumsubForm = lazy(() => import("./components/SubPlatinumForm"));
const UserDashboard = lazy(() => import("./components/UserDashboard"));
const Login = lazy(() => import("./components/Login"));
const Shipping = lazy(() => import("./components/Shipping"));
const Cancellation = lazy(() => import("./components/Cancellation"));

// ✅ Loader UI
function PageLoader() {
  return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent" />
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <ScrollToTop />
      <WhatsAppButton />

      <main className="flex-1 overflow-hidden">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/franchise" element={<Franchise />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/career" element={<Career />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/subscription/silver" element={<RyviveSilver />} />
            <Route path="/subscription/gold" element={<RyviveGold />} />
            <Route path="/subscription/platinum" element={<RyvivePlatinum />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<Terms />} />
            <Route path="/subscription-silver" element={<SilversubForm />} />
            <Route path="/subscription-gold" element={<GoldsubForm />} />
            <Route path="/subscription-platinum" element={<PlatinumsubForm />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/shipping-delivery" element={<Shipping />} />
            <Route path="/cancellation-refund" element={<Cancellation />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default App;
