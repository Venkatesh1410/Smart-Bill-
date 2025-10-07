import backgroundImage from "../../../assets/img/background.jpg";

const HeroImage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <img
        className="w-full h-full object-cover absolute inset-0 filter blur-md"
        src={backgroundImage}
        alt="Background"
      />
      <div className="text-center bg-opacity-80  text-white p-8 rounded-md relative z-10">
        <h1 className="text-6xl font-bold mb-4">
          Welcome to Cafe Management System
        </h1>
        <h3 className="text-gray-300 mb-8 text-2xl">
          Your one-stop solution for cafe management
        </h3>
      </div>
    </div>
  );
};

export default HeroImage;
