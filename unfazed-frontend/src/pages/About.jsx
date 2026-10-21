const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-5 py-12">

      <h1 className="text-4xl font-bold text-center">
        About Us
      </h1>

      <p className="text-center text-gray-600 mt-4">
        We provide a simple and secure way to book doctor appointments online.
      </p>

      <div className="grid md:grid-cols-2 gap-10 mt-12">

        <img
          src="https://via.placeholder.com/500x350"
          alt="Hospital"
          className="rounded-xl shadow-md"
        />

        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Who We Are
          </h2>

          <p className="text-gray-600 leading-7">
            MediCare is an online doctor appointment platform that helps
            patients find experienced doctors, book appointments,
            and manage their healthcare from anywhere.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Why Choose Us?
          </h2>

          <ul className="space-y-3 text-gray-600">
            <li>✔ Easy Appointment Booking</li>
            <li>✔ Experienced Doctors</li>
            <li>✔ Secure Patient Records</li>
            <li>✔ Fast & Reliable Service</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
