import Header from "../components/Header";
import SpecialtyMenu from "../components/SpecialtyMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <div className="space-y-16">
      <Header />
      <SpecialtyMenu />
      <TopDoctors />
      <Banner />
    </div>
  );
};

export default Home;