// components/home/WhyChooseUs.js
import { ShieldCheck, MapPin, Star, PiggyBank, Flower } from "lucide-react";

export default function WhyChooseUs({ about }) {
  const features = [
    {
      title: "Prime Locations",
      icon: <MapPin size={32} className="text-[#990e15] dark:text-white" />,
      content: "Strategically located in key cities and provinces.",
    },
    {
      title: "Secure & Safe",
      icon: <ShieldCheck size={32} className="text-[#990e15] dark:text-white" />,
      content: "Gated communities with 24/7 security.",
    },
    {
      title: "Premium Quality",
      icon: <Star size={32} className="text-[#990e15] dark:text-white" />,
      content: "Modern designs with top-notch amenities.",
    },
    {
      title: "Investment Opportunity",
      icon: <PiggyBank size={32} className="text-[#990e15] dark:text-white" />,
      content: "A great asset that increases in value over time.",
    },
    {
      title: "Sustainability",
      icon: <Flower size={32} className="text-[#990e15] dark:text-white" />,
      content:
        about?.sustainability ||
        "Eco-friendly communities that care for the future.",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#990e15] dark:text-white mb-12">
          Why Choose Avida Land?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {/* Top red bar inside card */}
              <div className="w-full h-[6px] bg-[#990e15] rounded-t-xl" />

              <div className="p-6">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-lg font-bold text-[#990e15] dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm mt-1">{feature.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
