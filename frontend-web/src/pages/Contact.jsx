import React, { useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FaStore, FaPhoneAlt } from "react-icons/fa";
import { RiWhatsappFill } from 'react-icons/ri';
import { MdEmail } from 'react-icons/md';

const Contact = () => {
  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);

    // 📅 Date & Time
    const now = new Date();

    const submissionDate = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const submissionTime = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Append date & time to SheetDB
    formData.append("data[Date]", submissionDate);
    formData.append("data[Time]", submissionTime);

    try {
      // 1️⃣ Send to SheetDB
      const response = await fetch("https://sheetdb.io/api/v1/81mxcr1k0ouf7", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Submission to SheetDB failed. Please try again.");
        return;
      }

      // 2️⃣ Send Email via EmailJS
      const emailParams = {
        name: formData.get("data[Name]"),
        email: formData.get("data[Email]"),
        subject: formData.get("data[Subject]"),
        message: formData.get("data[Message]"),
        date: submissionDate,
        time: submissionTime,
      };

      await emailjs.send(
        "service_oo5t5wf",
        "template_sorwe7i",
        emailParams,
        "3AfFnBmZMg4f0Kq0I"
      );

      alert(
        `Thank you ${emailParams.name}, your inquiry has been submitted successfully!`
      );

      await emailjs.send(
  "service_oo5t5wf",
  "template_j0bsfe4", // Auto-reply template
  {
    name: emailParams.name,
    email: emailParams.email,
    message: emailParams.message,
  },
  "3AfFnBmZMg4f0Kq0I"
);


      formRef.current.reset();
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div> <div className="relative">
  <img
    src="https://res.cloudinary.com/dvugjpjoj/image/upload/v1767086692/Gemini_Generated_Image_ge3zz0ge3zz0ge3z_zwlqft.png"
    alt="Contact Us" 
    className="w-full h-[50vh] md:h-[60vh] object-cover"
  />

  {/* Centered Animated Title */}
  <motion.h1
    className="absolute text-[#895C40] font-semibold font-cinzel uppercase text-5xl md:text-7xl text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[70%]"
    initial={{ x: -150, y: -150, opacity: 0 }}
    animate={{ x: 0, y: 0, opacity: 1 }}
    transition={{
      duration: 1.2,
      ease: "easeOut",
    }}
  >
    Contact
  </motion.h1>

  {/* Subtitle Line */}
  <motion.p
    className="absolute text-black font-manrope mt-10 font-semibold font-light text-center text-lg md:text-xl top-1/2 left-1/2 transform -translate-x-1/2 translate-y-[20%] w-[90%] md:w-[60%]"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 1.3,
      delay: 0.5,
      ease: "easeOut",
    }}
  >
    You’re just one conversation away from starting your transformation.
  </motion.p>
</div>

           <div className="w-full bg-white md:py-20 py-5 px-4 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* Contact Info Grid */}
          <div className="grid md:grid-cols-2 font-manrope grid-cols-1 gap-4">
            
            {/* Phone */}
            <div className="bg-[#FEF7F0] rounded-xl p-7 flex flex-col items-center shadow-md">
              <FaPhoneAlt  size={30} className="text-[#895C40]" />
              <h3 className="font-semibold mt-3">Phone</h3>
              <p className="text-sm text-gray-600 mt-3">+91 9076000468</p>
            </div>

            {/* WhatsApp */}
            <div className="bg-[#FEF7F0] rounded-xl p-7 flex flex-col items-center shadow-md">
              <RiWhatsappFill size={30} className="text-[#895C40]" />
              <h3 className="font-semibold mt-3">Whatsapp</h3>
              <p className="text-sm text-gray-600 mt-3">97656 00701</p>
            </div>

            {/* Email */}
            <div className="bg-[#FEF7F0] rounded-xl p-7 flex flex-col items-center shadow-md">
              <MdEmail size={30} className="text-[#895C40]" />
              <h3 className="font-semibold mt-2">Email</h3>
              <p className="text-sm text-gray-600 mt-3"> customersupport@ryviveroots.com, management@ryviveroots.com</p>
            </div>

            {/* Shop */}
            <div className="bg-[#FEF7F0] rounded-xl p-7 flex flex-col items-center shadow-md">
              <FaStore size={30} className="text-[#895C40]" />
              <h3 className="font-semibold mt-3">Our Shop</h3>
               <div className="text-black/75 font-semibold">
               
                <p className=' text-center'>Dombivli (East), Maharashtra 421201.</p>
              </div>
            </div>

          </div>

          {/* Google Map */}
          <div className="w-full h-70 rounded-xl overflow-hidden shadow-md">
            <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.466816479228!2d73.0912687!3d19.2184767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be795ced2c032b3%3A0x2f8d9decfaf7712e!2sRevive%20Roots!5e0!3m2!1sen!2sin!4v1762864329336!5m2!1sen!2sin"
          width="100%"
          height="100%"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0 }}
        ></iframe>
          </div>

        </div>

        {/* RIGHT SIDE (FORM) */}
        <div>
          <h2 className="text-3xl font-bold text-gray-700 font-merriweather">Get In Touch</h2>
          <p className="text-gray-600 mt-2 font-manrope mb-5">
            Reach out, ask us anything, and take
your first step toward feeling amazing.
Whether you prefer a quick chat or detailed guidance, we’ve got you covered.
          </p>


  <form  ref={formRef}
              onSubmit={handleSubmit} className="space-y-6 font-manrope">

  {/* Name */}
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-semibold text-gray-700">Name</label>
    <input
      name="data[Name]"
      type="text"
      placeholder="Enter your name"
      className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#895C40]"
    />
  </div>

  {/* Email */}
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-semibold text-gray-700">Email</label>
    <input
      type="email"
       name="data[Email]"
      placeholder="Enter your email"
      className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#895C40]"
    />
  </div>

  {/* Subject */}
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-semibold text-gray-700">Subject</label>
    <input
      type="text"
      name="data[Subject]"
      placeholder="Enter subject"
      className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#895C40]"
    />
  </div>

  {/* Message */}
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-semibold text-gray-700">Message</label>
    <textarea
      name="data[Message]"
      rows="5"
      placeholder="Write your message here..."
      className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#895C40]"
    />
  </div>

  {/* Button */}
  <button
    type="submit"
    className="w-full bg-[#895C40] text-[#FEF7F0] py-3 rounded-full font-semibold hover:opacity-90 transition"
  >
    Send Now
  </button>

</form>

        </div>

      </div>
    </div>
          </div>
  )
}

export default Contact;