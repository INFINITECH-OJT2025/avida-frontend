export default function HeroSection({ companyName, companySlogan }) {
    return (
<div className="relative bg-[#990e15] dark:bg-800 text-white text-center py-16">

            {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}
            <div className="relative mt-10 z-10 max-w-3xl mx-auto">
                <h1 className="text-5xl font-extrabold uppercase">{companyName}</h1>
                <p className="mt-3 text-xl italic">{companySlogan}</p>
            </div>
        </div>
    );
}
