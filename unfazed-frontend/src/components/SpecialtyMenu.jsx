import { Link } from "react-router-dom";
import { specialityData } from "../assets/assets (1).js";

const SpecialtyMenu = () => {
  return (
    <section>
      <h2 className="text-3xl font-bold text-center">
        Find by Speciality
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mt-8">
        {specialityData.map(({ speciality, image }) => (
          <Link
            key={speciality}
            to={`/doctors/${encodeURIComponent(speciality)}`}
            className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg"
          >
            <img src={image} alt="" className="h-16 w-16 object-contain" />
            <span className="text-sm font-semibold text-slate-700">{speciality}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SpecialtyMenu;