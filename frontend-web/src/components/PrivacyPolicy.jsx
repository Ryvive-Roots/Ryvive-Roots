import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 sm:p-12">
        
        {/* Title */}
        <h1 className="md:text-3xl text-2xl text-center font-cinzel uppercase font-semibold text-[#243E36] mb-12 text-center">
          Privacy Policy – Ryvive Roots LLP
        </h1>

        <p className="text-gray-600 font-roboto mb-8 leading-relaxed">
        Ryvive Roots is committed to safeguarding the privacy of its users. This Privacy Policy describes how we collect, use, disclose, and protect your information when you access our website, place orders, or use our services.</p>
         <p className="text-gray-600 font-roboto mb-8 leading-relaxed">
        By accessing or using our website or services, you agree to the collection and use of information in accordance with this Privacy Policy.
         </p>


        {/* Section */}
        <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
          1. Information We Collect
          </h2>
          <p className="text-gray-600 leading-relaxed">
           We may collect personal information such as name, contact details, delivery address, date of birth, subscription details, order history, and any dietary preferences or allergies disclosed by the user.
          </p>
          
        </section>

        {/* Section */}
        <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
          2. Payment Information
          </h2>
          <p className="text-gray-600 leading-relaxed">
         All payments are processed securely through easebuzz. Ryvive Roots does not store, process, or retain any card details, UPI IDs, banking credentials, or wallet information.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
          3. Technical & Usage Information
          </h2>
          <p className="text-gray-600 leading-relaxed">
          We may collect technical information such as IP address, browser type, device details, and website usage data through cookies or analytics tools.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            4. Purpose of Data Collection
          </h2>
          <p className="text-gray-600 leading-relaxed">
           Information is collected solely for order processing, subscription management, delivery coordination, customer support, grievance handling, internal analytics, and legal or regulatory compliance.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
           5. Disclosure of Information
          </h2>
          <p className="text-gray-600 leading-relaxed">
           User data may be shared only with delivery partners, service providers, payment gateways, or legal authorities when required by law. We do not sell or trade personal data.
          </p>
        </section>

         <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
           6. Data Security
          </h2>
          <p className="text-gray-600 leading-relaxed">
           We implement reasonable security practices to protect personal data from unauthorized access, misuse, or disclosure. However, no digital system is completely secure.
          </p>
        </section>

         <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
          7. Cookies & Tracking Technologies
          </h2>
          <p className="text-gray-600 leading-relaxed">
          Our website may use cookies to enhance user experience and analyze traffic. Users may disable cookies through browser settings, though some features may not function properly.</p>
        </section>

        <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
         8. User Obligations
          </h2>
          <p className="text-gray-600 leading-relaxed">
         Users must provide accurate information, update details when required, disclose allergies responsibly, and ensure availability at the delivery address.</p>
        </section>

         <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
         9. Data Retention
          </h2>
          <p className="text-gray-600 leading-relaxed">
         Personal data is retained only as long as necessary for service delivery, legal compliance, or dispute resolution, and to send marketing or offers.</p>
        </section>

         <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
        10. Third-Party Links
          </h2>
          <p className="text-gray-600 leading-relaxed">
        Our website may contain links to third-party websites. Ryvive Roots is not responsible for their privacy practices or content. </p>
        </section>

         <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
        11. Changes to Privacy Policy
          </h2>
          <p className="text-gray-600 leading-relaxed">
       We reserve the right to amend or update this Privacy Policy at any time. Any changes will be communicated to customers and will become effective <span className="font-medium text-black">48 hours after being posted or notified.</span> </p>
        </section>


      </div>
    </div>
  );
};

export default PrivacyPolicy;
