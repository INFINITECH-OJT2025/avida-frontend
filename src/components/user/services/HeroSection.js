export default function HeroSection() {
  return (
    <div
      className="relative bg-cover bg-center h-80 flex items-center justify-center text-center text-white"
      style={{ backgroundImage: "url('/images/real-estate-hero.jpg')" }}
    >
      <div className="bg-black bg-opacity-50 p-10 rounded-lg">
        <h1 className="text-4xl font-bold">Professional Real Estate Services</h1>
        <p className="text-lg mt-2">Explore our wide range of real estate solutions designed for you.</p>
      </div>
    </div>
  );
}
