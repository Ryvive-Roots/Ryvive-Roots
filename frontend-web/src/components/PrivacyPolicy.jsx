import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 sm:p-12">
        
        {/* Title */}
        <h1 className="md:text-3xl text-2xl text-center font-cinzel uppercase font-semibold text-[#243E36] mb-12 text-center">
          Privacy Policy
        </h1>

        <p className="text-gray-600 font-roboto mb-8 leading-relaxed">
         Ryvive Roots  is committed to safeguarding the privacy of its users. This Privacy Policy describes how we collect, use, disclose, and protect your information when you access our website, place orders, or use our services.
        </p>
         <p className="text-gray-600 font-roboto mb-8 leading-relaxed">
          By accessing or using our website or services, you agree to the collection and use of information in accordance with this Privacy Policy.
         </p>


        {/* Section */}
        <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
           Information We Collect
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We may collect personal information such as name, contact details, delivery address, date of birth (if voluntarily provided), subscription details, order history, and any dietary preferences or allergies disclosed by the user..
          </p>
          
        </section>

        {/* Section */}
        <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
           Payment Information
          </h2>
          <p className="text-gray-600 leading-relaxed">
           All payments are processed securely through Razorpay. Ryvive Roots does not store, process, or retain any card details, UPI IDs, banking credentials, or wallet information.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
           Technical & Usage Information
          </h2>
          <p className="text-gray-600 leading-relaxed">
           We may collect technical information such as IP address, browser type, device details, and website usage data through cookies or analytics tools.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Purpose of Data Collection
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Information is collected solely for order processing, subscription management, delivery coordination, customer support, grievance handling, internal analytics, and legal or regulatory compliance.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Purpose of Data Collection
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Information is collected solely for order processing, subscription management, delivery coordination, customer support, grievance handling, internal analytics, and legal or regulatory compliance.
          </p>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
