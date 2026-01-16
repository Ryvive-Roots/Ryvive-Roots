import React from 'react'

const Cancellation = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 sm:p-12">
        
        {/* Title */}
        <h1 className="md:text-3xl text-2xl text-center font-cinzel uppercase font-semibold text-[#243E36] mb-12 text-center">
        CANCELLATION & REFUND POLICY
        </h1>


        {/* Section */}
        <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
          1. Cancellation
          </h2>
          <p className="text-gray-600 leading-relaxed">
           All subscription plans and one-time orders placed with <span className="font-medium text-black/80">Ryvive Roots LLP are non-cancellable</span>  once payment has been successfully completed.
          </p>
           <p className="text-gray-600 leading-relaxed">
          Subscription plans are billed in advance and shall be deemed <span className="font-medium text-black/80"> activated after 48 hours </span> from the confirmation of successful payment.
          </p>
             <p className="text-gray-600 leading-relaxed">
         Once a subscription is activated, the Customer shall not be entitled to <span className="font-medium text-black/80">cancel, transfer, suspend, or terminate</span> the subscription.
          </p>
           <p className="text-gray-600 leading-relaxed">
        Missed or unsuccessful deliveries resulting from customer unavailability, incorrect or incomplete delivery address, incorrect contact details, refusal to accept delivery, or absence at the registered delivery location shall be considered as <span className="font-medium text-black/80">successfully fulfilled deliveries</span> and shall not be eligible for any refund, replacement, or compensation.
          </p>
        </section>

        {/* Section */}
        <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
          2. Delivery Schedule
          </h2>
          <p className="text-gray-600 leading-relaxed">
          Delivery slot and delivery location selection is completed by the Customer at the time of initiating the subscription plan. The Customer may request a change in delivery location and/or delivery slot only on a weekly basis. Such requests must be submitted exclusively on Saturdays, on or before 5:00 PM, by emailing  <span className="font-medium text-black">customersupport@ryviveroots.com</span>. Any approved change shall be applicable for the immediately following subscription week only. Requests received after the stipulated timeline shall not be considered.
          </p>
          <br />
           <p className="text-gray-600 leading-relaxed">The Customer is required to ensure availability at the registered delivery address during the assigned delivery window.</p>
          
        </section>

        {/* Section */}
        <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
          3. Delivery Conditions
          </h2>
          <p className="text-gray-600 leading-relaxed">
           The Customer is required to ensure availability at the registered delivery address during the assigned delivery window.
          </p>
             <br />
           <p className="text-gray-600 leading-relaxed">
            In case of customer unavailability, incorrect address, unreachable contact number, or refusal to accept delivery, the order shall be treated as delivered and <span className="font-medium text-black">shall not be eligible for any refund or redelivery.</span>
           </p>
              <br />
            <p className="text-gray-600 leading-relaxed">Delays due to traffic, weather conditions, government restrictions, or unforeseen operational circumstances shall not entitle the Customer to any refund or compensation.</p>
        </section>

        {/* Section */}
        <section className="mb-8 font-roboto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
       4. Fresh Food Disclaimer
          </h2>
          <p className="text-gray-600 leading-relaxed">
            All meals are freshly prepared and intended for immediate consumption.
          </p>
             <br />
           <p className="text-gray-600 leading-relaxed">Ryvive Roots LLP shall not be responsible for any deterioration in food quality caused by delayed consumption, improper storage, or mishandling by the Customer after delivery.</p>
        </section>

   

      </div> 
    </div>
  )
}

export default Cancellation;