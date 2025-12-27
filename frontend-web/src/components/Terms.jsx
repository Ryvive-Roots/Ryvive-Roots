import React from 'react'

const Terms = () => {
  return (
   <>        <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 sm:p-12">

        {/* Title */}
        <h1 className="md:text-3xl text-2xl text-center font-cinzel uppercase font-semibold text-[#243E36] mb-12">
          Terms & Conditions
        </h1>

        <p className="text-gray-600 font-manrope mb-8 leading-relaxed">
          By accessing and using <span className="font-semibold">RYVIVE ROOTS</span> website
          and subscribing to our services, you agree to comply with the following
          Terms & Conditions.
        </p>

        {/* Services */}
        <section className="mb-8 font-manrope">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Services
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We offer healthy food and beverage options including soups, salads,
            sandwiches, wraps, pasta, and fresh juices through one-time orders
            and monthly subscriptions.
          </p>
        </section>

        {/* Subscription Plans */}
        <section className="mb-8 font-manrope">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Subscription Plans
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Subscription plans are billed in advance on a monthly basis.</li>
            <li>Meals are delivered according to the selected plan and schedule.</li>
            <li>Subscription benefits are non-transferable.</li>
            <li>
              All subscription plans are non-cancellable and non-transferable once activated.
            </li>
            <li>
              Subscriptions are valid only for the registered customer and delivery address.
            </li>
            <li>
              Missed deliveries due to customer unavailability will not be compensated or rescheduled.
            </li>
          </ul>
        </section>

        {/* User Responsibilities */}
        <section className="mb-8 font-manrope">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            User Responsibilities
          </h2>
          <p className="text-gray-600 leading-relaxed">
            You agree to provide accurate information during registration and checkout
            and to use our website lawfully.
          </p>
        </section>

        {/* Pricing & Payments */}
        <section className="mb-8 font-manrope">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Pricing & Payments
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              All prices are listed in INR and are inclusive of applicable taxes unless stated otherwise.
            </li>
            <li>Payments are processed securely via Razorpay.</li>
          </ul>
        </section>

        {/* Service Modifications */}
        <section className="mb-8 font-manrope">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Service Modifications
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to modify or discontinue any service without prior notice.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="font-manrope">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Limitation of Liability
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We are not responsible for delays or service disruptions caused by
            circumstances beyond our control.
          </p>
        </section>

      </div>
    </div></>
  )
}

export default Terms;