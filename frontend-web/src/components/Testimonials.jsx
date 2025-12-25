import React from "react";
import Slider from "react-slick";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import Coma from "../assets/quote.png"
// LEFT ARROW
function PrevArrow(props) {
  const { onClick } = props;
  return (
   <div
  className="z-20 absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 cursor-pointer"
  onClick={onClick}
>
  <FiChevronLeft className="text-black text-3xl md:text-4xl" />
</div>

  );
}

// RIGHT ARROW
function NextArrow(props) {
  const { onClick } = props;
  return (
    <div
  className="z-20 absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 cursor-pointer"
  onClick={onClick}
>
  <FiChevronRight className="text-black text-3xl md:text-4xl" />
</div>

  );
}

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "—Vishal Shah",
     
      text: "Revive Roots is a hidden gem for health enthusiasts! I tried the Clean Green juice (spinach, celery, carrot, cucumber, apple, lemon), and it was hands down one of the tastiest healthy juices I’ve had recently—super refreshing, fulfilling, and top-notch in quality. I also had the avocado grill, and even though I’m not usually an avocado fan, this toast completely won me over! I could genuinely eat it daily. What sets this cafe apart is its affordability. Unlike other natural juice cafes with sky-high prices, Revive Roots offers juices starting at just ₹69. Highly recommend it for anyone looking for delicious and pocket-friendly organic food options.",
    },
    {
      name: "—Teju More",
      job: "Job Title Goes Here",
      text: "Loved the crispy texture and healthy, delicious taste.. quality and quantity were impressive!",
    },
  
    {
      name: "—Aditya Wadekar",
      job: "Job Title Goes Here",
      text: "Good Initiative. Food is tasty. Ambience is hygenic. Service is good. Best place for people on diet and people on medication.",
    },
    {
      name: "—Madhuri Kale",
      job: "Job Title Goes Here",
      text: "Today I visited the Revive roots...i had Hungcurd grill sandwitch and Avacado smoothy...such a tasty sandwich i had ever...really great place to monitor your health with super taste..along with good hygiene.",
    },
    {
      name: "—Shriram Thakur",
      job: "Job Title Goes Here",
      text: "Very nice. Quality, Quantity and Hygiene. I liked the atmosphere and testy food. Good Job Revive Roots. We thank you for bringing such a authentic option for us. Tried High protein salad, Sprouts chaat, Corn Sandwich and Immunity booster.",
    },
  ];

  const settings = {
    dots: false,
    arrows: true, // only our custom arrows will show
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2200,
    speed: 900,
    slidesToShow: 2,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  return (
    <div className="w-full bg-[#FEF7F0]">
      <div className="py-26 md:px-20  relative">

        <h3 className="text-4xl text-center font-cinzel uppercase font-semibold text-[#895C40] pb-10">
          What Our Customers Are Saying
        </h3>

        <Slider {...settings}>
          {testimonials.map((item, index) => (
            <div key={index} className="px-2 py-10">
              <div className="relative flex flex-col items-center">
                {/* IMAGE + TEXT + NAME + JOB */}
                <div className="relative">
                  <img
  src="https://res.cloudinary.com/dvugjpjoj/image/upload/f_auto,q_auto/v1765349846/Testimonials_c7f8qf.png"
  alt="testimonial"
  className="w-full max-w-[500px] h-auto aspect-[5/6] shadow-md hover:shadow-[0_8px_30px_rgba(137,92,64,0.35)] rounded-full object-cover"
/>


                  {/* CENTER TEXT BLOCK */}
                  <div
                    className="
                      absolute top-1/2 left-1/2
                      -translate-x-1/2 -translate-y-1/2
                      w-[80%] rounded-full  text-center space-y-3
                    "
                  >
                    {/* TEXT */}
                    <div className=" flex items-center justify-center">
                    <img src={Coma} className="w-10 h-10" alt="" />
                    </div>
                   <p className="text-[#895C40] font-semibold text-center text-sm leading-relaxed font-merriweather font-light 
              max-h-[120px] md:max-h-none overflow-y-auto px-2">
  {item.text}
</p>

                      <div className="flex justify-center gap-1">
    {[...Array(5)].map((_, i) => (
      <FaStar key={i} className="text-yellow-400 text-xl" />
    ))}
  </div>

                    {/* NAME */}
                    <h3 className="text-[#895C40] font-manrope font-semibold mb-12 text-lg drop-shadow-xl">
                      {item.name}
                    </h3>

                   
                  </div>
                </div>

              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
