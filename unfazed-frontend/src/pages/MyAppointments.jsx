const MyAppointments = () => {
  const appointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      speciality: "General Physician",
      date: "22 Oct 2026",
      time: "10:00 AM",
      status: "Confirmed",
    },
    {
      id: 2,
      doctor: "Dr. David Wilson",
      speciality: "Dermatologist",
      date: "25 Oct 2026",
      time: "02:30 PM",
      status: "Pending",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-8">
        My Appointments
      </h1>

      <div className="space-y-5">
        {appointments.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-6 flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">
                {item.doctor}
              </h2>

              <p>{item.speciality}</p>

              <p className="mt-2">
                📅 {item.date}
              </p>

              <p>
                🕒 {item.time}
              </p>

              <p className="mt-2 text-green-600">
                {item.status}
              </p>
            </div>

            <button className="mt-5 md:mt-0 bg-red-500 text-white px-5 py-2 rounded-lg">
              Cancel Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;