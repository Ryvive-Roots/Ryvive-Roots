import React from 'react';

const Cancellation = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 sm:p-12">
        
        {/* Title */}
        <h1 className="md:text-3xl text-2xl text-center font-cinzel uppercase font-semibold text-[#243E36] mb-12">
          Cancellation & Refund Policy
        </h1>

        {/* Section 1: Cancellation */}
        <section className="mb-12 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            1. Cancellation
          </h2>

          <p className="text-gray-600 leading-relaxed mb-3">
            <span className="font-medium text-black/80">1.1</span> All subscription plans and one-time orders placed with{' '}
            <span className="font-medium text-black/80">Ryvive Roots LLP</span> are  <span className="font-medium text-black/80"> non-cancellable </span> once payment has been successfully completed.
          </p>

          <p className="text-gray-600 leading-relaxed mb-3">
            <span className="font-medium text-black/80">1.2</span> Subscription plans are billed in advance and shall be deemed{' '}
            <span className="font-medium text-black/80">activated after 48 hours</span> from the confirmation of successful payment.
          </p>

          <p className="text-gray-600 leading-relaxed mb-3">
            <span className="font-medium text-black/80">1.3</span> Once a subscription is activated, the Customer shall not be entitled to{' '}
            <span className="font-medium text-black/80">cancel, transfer, suspend, or terminate</span> the subscription.
          </p>

          <p className="text-gray-600 leading-relaxed">
            <span className="font-medium text-black/80">1.4</span> Missed or unsuccessful deliveries resulting from customer unavailability, incorrect or incomplete delivery address, incorrect contact details, refusal to accept delivery, or absence at the registered delivery location shall be considered as{' '}
            <span className="font-medium text-black/80">successfully fulfilled deliveries</span> and shall not be eligible for any refund, replacement, or compensation.
          </p>
        </section>

        {/* Divider */}
        <hr className="my-10 border-gray-200" />

        {/* Section 2: Refund */}
        <section className="font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            2. Refund
          </h2>

          <p className="text-gray-600 leading-relaxed mb-4">
            <span className="font-medium text-black/80">2.1</span> Refunds shall be considered only under the following limited circumstances:
          </p>

          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-6 space-y-2">
            <li>Duplicate payment made for the same order</li>
            <li>Amount debited but the order was not successfully placed</li>
            <li>Inability of Ryvive Roots LLP to provide the subscribed service</li>
            <li>Delivery of an incorrect item, subject to verification</li>
            <li>Valid quality-related complaints raised within <span className="font-medium text-black/80"> 24 hours of delivery </span> and verified by Ryvive Roots LLP</li>
          </ul>

          <p className="text-gray-600 leading-relaxed mb-4">
            <span className="font-medium text-black/80">2.2</span> Refunds shall <span className="font-medium text-black/80">not</span> be provided for the following:
          </p>

          <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-6 space-y-2">
            <li>Partial consumption of meals or products</li>
            <li>Early discontinuation or non-utilization of subscription plans</li>
            <li>Paused days within a subscription</li>
            <li>Natural variations in taste, texture, appearance, or portion size</li>
            <li>Complaints raised after the stipulated complaint window</li>
          </ul>

          <p className="text-gray-600 leading-relaxed">
            <span className="font-medium text-black/80">2.3</span> All approved refunds shall be processed within{' '}
            <span className="font-medium text-black/80">7 to 10 business days</span> to the original mode of payment through <span className="font-medium text-black/80">EaseBuzz,</span> subject to banking timelines.
          </p>
        </section>

      </div>
    </div>
  );
};

export default Cancellation;
