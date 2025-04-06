import React from "react";

const data = [
  {
    name: "Dr. Vijaykumar Wagh",
    designation: "District Health Officer",
    phone: "9867356734",
    office: "233-2371005",
    email: "zpdhosan@yahoo.co.in",
  },
  {
    name: "Shri. Mohan Gaikawad",
    designation: "Education Officer",
    phone: "9834916754",
    office: "233-2371935",
    email: "eoprisang@gmail.com",
  },
  {
    name: "Dr. K. G. Mali",
    designation: "District Animal Husbandry Officer",
    phone: "9421224791",
    office: "233-2371936",
    email: "adceozpsangli1@gmail.com",
  },
  {
    name: "Shri. Sandip Yadav",
    designation: "Project Officer",
    phone: "7745078087",
    office: "233-2371937",
    email: "icdsdyceo@gmail.com",
  },
  
];

const Contact = () => {
  return (
    <div className="bg-white py-10 px-4 md:px-12">
  <h2 className="text-4xl font-bold text-center text-blue-800 mb-10">
    Contact Our Institution Heads
  </h2>
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {data.map((person, index) => (
      <div
        key={index}
        className="bg-gray-100 rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:scale-105"
      >
        <h3 className="text-xl font-semibold text-indigo-700 mb-1">{person.name}</h3>
        <p className="text-gray-700 font-medium mb-2">{person.designation}</p>
        <p className="text-sm text-gray-600">📞 Mobile: {person.phone}</p>
        <p className="text-sm text-gray-600">☎️ Office: {person.office}</p>
        <p className="text-sm text-blue-600 mt-2">
          ✉️ <a href={`mailto:${person.email}`} className="underline">{person.email}</a>
        </p>
      </div>
    ))}
  </div>
</div>
  );
};

export default Contact;