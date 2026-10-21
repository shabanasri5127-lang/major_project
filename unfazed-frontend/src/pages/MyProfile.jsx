const MyProfile = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-5">

      <div className="bg-white shadow-md rounded-xl p-8">

        <div className="flex flex-col md:flex-row gap-8">

          <img
            src="https://via.placeholder.com/180"
            alt="Profile"
            className="w-44 h-44 rounded-xl object-cover"
          />

          <div className="flex-1">

            <h1 className="text-3xl font-bold">
              John Doe
            </h1>

            <p className="text-gray-500 mt-2">
              johndoe@gmail.com
            </p>

            <hr className="my-5" />

            <div className="space-y-3">

              <p><b>Phone :</b> +91 9876543210</p>

              <p><b>Address :</b> Chennai, Tamil Nadu</p>

              <p><b>Gender :</b> Male</p>

              <p><b>Date of Birth :</b> 01 Jan 2005</p>

            </div>

            <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-full">
              Edit Profile
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default MyProfile;