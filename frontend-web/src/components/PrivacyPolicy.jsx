import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 sm:p-12">
        
        {/* Title */}
        <h1 className="md:text-3xl text-2xl text-center font-cinzel uppercase font-semibold text-[#243E36] mb-12 text-center">
          Privacy Policy
        </h1>

        <p className="text-gray-600 font-manrope mb-8 leading-relaxed">
          At <span className="font-semibold">RYVIVE ROOTS</span>, we value your privacy
          and are committed to protecting your personal information. This Privacy
          Policy explains how we collect, use, and safeguard your data when you visit
          our website or subscribe to our services.
        </p>

        {/* Section */}
        <section className="mb-8 font-manrope">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Information We Collect
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Name, email address, phone number</li>
            <li>Delivery address</li>
            <li>Payment details (processed securely via Razorpay)</li>
            <li>Subscription preferences and order history</li>
          </ul>
        </section>

        {/* Section */}
        <section className="mb-8 font-manrope">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            How We Use Your Information
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Process subscriptions and orders</li>
            <li>Deliver food and beverages to your address</li>
            <li>Communicate updates, offers, or service-related information</li>
            <li>Improve our website and customer experience</li>
          </ul>
        </section>

        {/* Section */}
        <section className="mb-8 font-manrope">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Payment Security
          </h2>
          <p className="text-gray-600 leading-relaxed">
            All payments for monthly subscriptions are securely processed through
            <span className="font-medium"> Razorpay</span>. We do not store or have
            access to your card or banking information.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8 font-manrope">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Data Protection
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We take appropriate security measures to protect your personal data
            against unauthorized access, alteration, or disclosure.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8 font-manrope">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Third-Party Sharing
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We do not sell or rent your personal information. Data may be shared
            only with trusted partners for order fulfillment and payment processing.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8 font-manrope">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Changes to This Policy
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to update this Privacy Policy at any time. Any
            changes will be posted on this page.
          </p>
        </section>

        {/* Contact */}
        <section className="border-t pt-6 font-manrope">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600">
            For questions regarding this Privacy Policy, contact us at:
          </p>
          <p className="mt-2 text-green-700 font-medium">
            📧 contact@ryviveroots.com
          </p>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
