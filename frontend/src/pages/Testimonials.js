import React from 'react';
import TestimonialsImg from "../assets/Testimonials.png";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Zilla Parishad Sangli's initiatives in rural healthcare are truly life-changing.",
      author: "Dr. Meera Joshi, PHC Officer"
    },
    {
      quote: "The sanitation drive improved our village’s hygiene and environment significantly.",
      author: "Ramesh Patil, Village Sarpanch"
    },
    {
      quote: "Thanks to ZP's support, our school now has better facilities and learning tools.",
      author: "Sunita Desai, Teacher"
    },
    {
      quote: "Their transparent and inclusive planning process earned everyone's trust.",
      author: "Aarti Jadhav, Social Worker"
    },
    {
      quote: "Water supply improvements have solved long-standing issues in our taluka.",
      author: "Ganesh Pawar, Resident"
    },
    {
      quote: "Efforts toward women's empowerment in rural areas are really inspiring.",
      author: "Kavita Shinde, NGO Coordinator"
    }
  ];

  return (
    <div className="bg-white text-gray-800">
      <div className="w-full h-64 overflow-hidden relative">
        <img
          src={TestimonialsImg}
          alt="Zilla Parishad Office"
          className="w-full h-64 object-contain"
          />
      </div>

      <div className="p-6 md:p-12 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-800 text-center">What People Say</h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <p className="italic text-gray-700">"{item.quote}"</p>
              <p className="mt-4 font-semibold text-blue-700">- {item.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Testimonials;