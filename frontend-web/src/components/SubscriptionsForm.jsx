import React from "react";

/* 🇮🇳 Indian States */
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

/* 🌿 Modern Input Style */
const inputStyle = `
  w-full rounded-xl
  border border-gray-200
  bg-white p-3
  text-gray-800
  shadow-sm
  transition-all duration-300
  focus:outline-none
  focus:border-green-500
  focus:ring-2 focus:ring-green-500/30
  hover:border-gray-300
`;

const SubscriptionsForm = () => {
  return (
    <div className="max-w-4xl mx-auto my-32 px-4">
      <div className="bg-[#FEF7F0] backdrop-blur border border-gray-100 rounded-3xl shadow-xl p-8 md:p-10">
        
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Subscription Details
        </h2>
        <p className="text-gray-500not-only-of-type: font-manrope text-center mb-8">
          Help us personalize your wellness journey 🌿
        </p>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input type="text" placeholder="Enter first name" className={inputStyle} />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input type="text" placeholder="Enter last name" className={inputStyle} />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input type="tel" placeholder="Enter phone number" className={inputStyle} />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email ID
            </label>
            <input type="email" placeholder="Enter email address" className={inputStyle} />
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Date
            </label>
            <input type="date" className={inputStyle} />
          </div>

          {/* Allergies */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allergies (if any)
            </label>
            <input
              type="text"
              placeholder="Mention food allergies"
              className={inputStyle}
            />
          </div>

          {/* Medical Conditions */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Any Medical Conditions? (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Eg: Diabetes, BP, Thyroid, Lactose intolerance etc."
              className={inputStyle}
            />
            <p className="text-xs text-gray-500 mt-1">
              Your information is kept private.
            </p>
          </div>

          {/* Delivery Slot */}
          <div className="md:col-span-2 bg-gray-50 rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Delivery Slot
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className={inputStyle}>
                <option value="">Morning Slot</option>
                <option>08:00 – 09:00 AM</option>
                <option>09:00 – 10:00 AM</option>
                <option>10:00 – 11:00 AM</option>
              </select>

              <select className={inputStyle}>
                <option value="">Evening Slot</option>
                <option>05:00 – 06:00 PM</option>
                <option>06:00 – 07:00 PM</option>
                <option>07:00 – 08:00 PM</option>
                <option>08:00 – 09:00 PM</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Delivery Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="House / Flat / Building" className={inputStyle} />
              <input placeholder="Street / Area" className={inputStyle} />
              <input placeholder="Landmark (Optional)" className={inputStyle} />
              <input placeholder="City" className={inputStyle} />

              {/* State */}
              <select defaultValue="Maharashtra" className={inputStyle}>
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              <input placeholder="Pincode" className={inputStyle} />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="
              md:col-span-2 cursor-pointer mt-6 font-fredoka
              bg-gradient-to-r from-[#B38E6A] to-[#8C6848]
              text-white py-4 rounded-2xl
               text-lg
              shadow-lg hover:shadow-2xl
              hover:-translate-y-1
              transition-all duration-300
            "
          >
            Submit & Start My Plan 🌱
          </button>

        </form>
      </div>
    </div>
  );
};

export default SubscriptionsForm;
