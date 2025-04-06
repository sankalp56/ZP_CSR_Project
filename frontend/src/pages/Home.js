import React from "react";
import HomeGIF from "../assets/Home_1.gif";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination,  Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import image1 from "../assets/Image1.jpeg";
import image2 from '../assets/Image2.jpeg';
import image3 from '../assets/Image3.jpeg';
import image4 from '../assets/Image4.jpeg';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-white text-gray-900">
      {/* Hero Section */}
      <div className="w-full h-100 overflow-hidden relative">
        <img
          src={HomeGIF}
          alt="Zilla Parishad Sangli Building"
          className="w-full h-[500px] object-cover"
        />
      </div>

      {/* Vision & Mission Section */}
      <section className="py-12 text-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-8">
            <div className="bg-white/80 shadow-lg rounded-2xl p-8 w-full max-w-3xl h-[300px]">
              <h2 className="text-3xl font-semibold mb-4 text-indigo-700">
                Our Vision
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                To create empowered, self-sustaining rural Zila Parishad, Sangli
                institutions through inclusive development, access to
                opportunities, and a better quality of life for every
                individual.
              </p>
            </div>
            <div className="bg-white/80 shadow-lg rounded-2xl p-8 w-full max-w-3xl h-[300px]">
              <h2 className="text-3xl font-semibold mb-4 text-indigo-700">
                Our Mission
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                To implement sustainable and impactful CSR initiatives in rural
                areas by focusing on education, healthcare, livelihood,
                infrastructure, and environmental stewardship, in collaboration
                with Zila Parishad Sangli, local communities and stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 text-center">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-semibold mb-8 text-blue-800">Success Stories</h2>
    
    {/* Add margin to give space between Swiper and testimonial cards */}
    <div className="my-6">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        pagination={{ clickable: true }}
        navigation={true}
        spaceBetween={30}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {[
          {
            quote: "A truly remarkable initiative that has not only addressed local issues but has also inspired countless individuals in our community to take action. The dedication and sincerity behind this effort are clearly visible in the results.",
            author: "Resident A",
            image: image1
          },
          {
            quote: "Their consistent and innovative work in rural development has brought real change to our villages. It's rare to see such a focused and transparent effort that truly puts people first.",
            author: "Resident B",
            image: image2
          },
          {
            quote: "This project marks a significant step forward in transforming Sangli into a more inclusive, sustainable, and vibrant place to live. The impact on everyday life has been both visible and meaningful.",
            author: "Resident C",
            image: image3
          },
          {
            quote: "An inspiring example of what can be achieved with a clear vision and genuine commitment to community welfare. Their approach is not only effective but also deeply rooted in transparency and innovation.",
            author: "Resident D",
            image: image4
          },
        ].map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="p-6 bg-white/80 text-gray-900 rounded-lg shadow hover:shadow-lg transition-all duration-300 mx-2 h-full">
              <img  
                src={testimonial.image}
                alt={testimonial.author}
                className="w-full h-48 rounded-lg mx-auto mb-4 shadow-md hover:shadow-lg transition-shadow duration-300 object-cover"
              />
              <p className="mt-2 font-semibold text-xl">- {testimonial.author}</p>
              <p className="italic">"{testimonial.quote}"</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    
  </div>
</section>
    </div>
  );
};

export default Home;
