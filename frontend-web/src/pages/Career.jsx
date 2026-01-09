import React, { useRef } from "react";
import emailjs from "@emailjs/browser";

import CareerBg from "../assets/CareerBg.jpg";

const Career = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_oo5t5wf", 
        "Ytemplate_v2pver5", 
        form.current,
        "3AfFnBmZMg4f0Kq0I"
      )
      .then(
        (result) => {
          alert("Application Sent Successfully!");
          form.current.reset();
        },
        (error) => {
          console.log(error.text);
          alert("Failed to send. Please try again.");
        }
      );
  };

  return (
    <div className="">
      <div className="relative w-full">
        <img
          src={CareerBg}
          alt="Career Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="py-40">
          <div className="relative max-w-2xl mx-auto bg-white/75 
            rounded-2xl p-8 shadow-lg z-10">

            <h2 className="text-2xl font-semibold font-manrope mb-6 text-center text-[#895C40]">
              Join Ryvive Roots
            </h2>

            <form ref={form} onSubmit={sendEmail} className="space-y-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-black">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  className="mt-1 w-full border border-black p-3 rounded-lg"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-black">Email</label>
                <input
                  type="email"
                  name="email"
                  className="mt-1 w-full border border-black p-3 rounded-lg"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-black">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="mt-1 w-full border border-black p-3 rounded-lg"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Job Category */}
              <div>
                <label className="block text-sm font-medium text-black">Job Category</label>
                <select
                  name="job_category"
                  className="mt-1 w-full border border-black p-3 rounded-lg"
                  required
                >
                  <option value="">Select a role</option>
                   <option>Graphic designer</option>
                  <option>Management</option>
                  <option>Sales Executive</option>
                  <option>Head Chef</option>
                  <option>server </option>
                  <option>Cashier</option>
                  <option>Restaurant Manager</option>
                  <option>Delivery Executive</option>
                  <option>Kitchen Helper</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-black">Experience (in years)</label>
                <input
                  type="number"
                  name="experience"
                  className="mt-1 w-full border border-black p-3 rounded-lg"
                  placeholder="e.g. 1, 2, 3..."
                />
              </div>

              {/* Resume Upload (Base64) */}
              <div>
                <label className="block text-sm font-medium text-black">Upload Resume (PDF)</label>
                <input
                  type="file"
                  name="resume"
                  className="mt-2 border p-2 rounded-lg"
                  accept=".pdf"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-black">Message</label>
                <textarea
                  name="message"
                  className="mt-1 w-full border border-black p-3 rounded-lg"
                  placeholder="Tell us about yourself..."
                  rows="4"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#895C40] text-base font-semibold shadow-2xl cursor-pointer text-white p-3 rounded-full hover:bg-white hover:text-[#895C40] transition"
              >
                Submit Application
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
