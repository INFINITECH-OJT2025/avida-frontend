import SEOComponent from "../../src/hooks/useSEO";
import { useRouter } from "next/router";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { callAPI } from "../../src/utils/api"; // ✅ Reuse API call utility

export default function NewsDetails({ post }) {
  const router = useRouter();
  if (router.isFallback) return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  if (!post) return <p className="text-center text-gray-600 mt-10">Post not found</p>;

  return (
    <>
      <SEOComponent />
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-[500px] flex items-center justify-center bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${post.images && post.images.length > 0 ? post.images[0] : "/placeholder.jpg"})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#990e15] opacity-90" />
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">{post.title}</h1>
          <div className="flex items-center justify-center space-x-4 text-gray-200">
            <span className="flex items-center">
              <CalendarDays className="w-5 h-5 mr-2" />
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              {Math.ceil(post.content.split(' ').length / 60)} min read
            </span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <div className="bg-white shadow-2xl rounded-lg p-8 -mt-24 md:-mt-32 z-10 relative">

          {/* Image Gallery */}
          {post.images && post.images.length > 0 && (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              slidesPerView={1}
              className="rounded-lg overflow-hidden shadow-md mb-8"
            >
              {post.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`News Image ${index + 1}`}
                    className="w-full h-[400px] object-cover rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {/* Content Body */}
          <div className="text-gray-800 text-lg leading-relaxed space-y-6">
            {post.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="first-letter:text-4xl first-letter:font-bold first-letter:text-[#990e15] first-letter:mr-1 first-letter:float-left">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Read More Link */}
          {post.readMore && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <Link href={post.readMore} className="inline-flex items-center text-[#990e15] font-semibold hover:underline group">
                Read More
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

// ✅ getStaticPaths using callAPI
export async function getStaticPaths() {
  try {
    const posts = await callAPI("get", "/news");
    const paths = posts.map((post) => ({
      params: { id: post.id.toString() },
    }));
    return { paths, fallback: true };
  } catch (error) {
    console.error("Error loading static paths:", error.message);
    return { paths: [], fallback: true };
  }
}

// ✅ getStaticProps using callAPI
export async function getStaticProps({ params }) {
  try {
    const post = await callAPI("get", `/news/${params.id}`);
    return {
      props: { post },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Error loading news detail:", error.message);
    return {
      notFound: true,
    };
  }
}
