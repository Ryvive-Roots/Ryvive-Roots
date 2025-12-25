import React from "react";

const SubscriptionsForm = () => {
  return (
    <div className="max-w-3xl mx-auto mt-32 bg-white border rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Subscription Details
      </h2>

      <form className="grid grid-cols-1 md:grid-cols-2 text-left gap-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            placeholder="Enter first name"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Enter last name"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="Enter phone number"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email ID
          </label>
          <input
            type="email"
            placeholder="Enter email address"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Birth Date */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
    Birth Date
  </label>
  <input
    type="date"
    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
  />
</div>




        {/* Allergy */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Allergies (if any)
          </label>
          <input
            type="text"
            placeholder="Mention food allergies"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
 
 {/* Medical Conditions */}
<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
    Any Medical Conditions? (Optional)
  </label>
  <textarea
    rows="3"
    placeholder="Eg: Diabetes, BP, Thyroid, Lactose intolerance etc."
    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
  />
  <p className="text-xs text-gray-500 mt-1">
    This helps us customize your meals better. Your information is kept private.
  </p>
</div>

       
       {/* Delivery Slot */}
<div className="md:col-span-2">
  <label className="block text-lg font-medium text-gray-700 mb-2 text-left">
    Delivery Slot
  </label>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Morning Slot */}
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Morning
      </label>
      <select className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500">
        <option value="">Select morning slot</option>
        <option value="8-9">08:00 – 9:00 AM</option>
        <option value="9-10">09:00 – 10:00 AM</option>
        <option value="10-11">10:00 – 11:00 AM</option>
      </select>
    </div>

    {/* Evening Slot */}
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Evening
      </label>
      <select className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500">
        <option value="">Select evening slot</option>
        <option value="5-6">5:00 – 6:00 PM</option>
        <option value="6-7">6:00 – 7:00 PM</option>
        <option value="7-8">7:00 – 8:00 PM</option>
        <option value="8-9">8:00 – 9:00 PM</option>
      </select>
    </div>
  </div>
</div>


      {/* Delivery Address */}
<div className="md:col-span-2">
  <h3 className="text-lg font-semibold text-gray-800 mb-3">
    Delivery Address
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
    {/* House / Flat */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        House / Flat / Building
      </label>
      <input
        type="text"
        placeholder="Flat no, Building name"
        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    {/* Street / Area */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Street / Area
      </label>
      <input
        type="text"
        placeholder="Street name, Area"
        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    {/* Landmark */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Landmark (Optional)
      </label>
      <input
        type="text"
        placeholder="Near temple, mall, etc."
        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    {/* City */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        City
      </label>
      <input
        type="text"
        placeholder="Enter city"
        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    {/* State */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        State
      </label>
      <input
        type="text"
        placeholder="Enter state"
        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    {/* Pincode */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Pincode
      </label>
      <input
        type="text"
        placeholder="6-digit pincode"
        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  </div>
</div>


        {/* Submit Button */}
        <button
          type="submit"
          className="md:col-span-2 mt-4 bg-[#B38E6A] text-white py-3 rounded-xl font-medium hover:bg-[#B38E6A] transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubscriptionsForm;
