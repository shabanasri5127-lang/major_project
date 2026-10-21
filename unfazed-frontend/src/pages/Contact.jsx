const Contact = () => {
  return (
    <div className="max-w-6xl mx-auto px-5 py-12">

      <h1 className="text-4xl font-bold text-center">
        Contact Us
      </h1>

      <p className="text-center text-gray-600 mt-3">
        We'd love to hear from you. Feel free to contact us anytime.
      </p>

      <div className="grid md:grid-cols-2 gap-10 mt-12">

        <img
          src="https://via.placeholder.com/500x350"
          alt="Contact"
          className="rounded-xl shadow-md"
        />

        <div>

          <h2 className="text-2xl font-bold mb-5">
            Get in Touch
          </h2>

          <p className="text-gray-600 mb-3">
            <strong>Address:</strong><br />
            123 Medical Street,<br />
            Chennai, Tamil Nadu - 600001
          </p>

          <p className="text-gray-600 mb-3">
            <strong>Phone:</strong><br />
            +91 98765 43210
          </p>

          <p className="text-gray-600 mb-6">
            <strong>Email:</strong><br />
            support@medicare.com
          </p>

          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Contact Now
          </button>

        </div>

      </div>

    </div>
  );
};

export default Contact;