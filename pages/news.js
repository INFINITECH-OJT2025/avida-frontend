import useSEO from "@/hooks/useSEO";
import { useRouter } from "next/router";

export default function NewsPage({ post }) {
  const router = useRouter();

  if (router.isFallback) return <p>Loading...</p>;

  return (
    <>
      {useSEO({
        title: `${post.title} - Avida News`,
        description: post.summary,
        url: `https://yourwebsite.com/news/${post.slug}`,
        image: post.image,
      })}
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </>
  );
}

export async function getStaticPaths() {
  const res = await fetch("https://your-api.com/news");
  const posts = await res.json();
  const paths = posts.map((post) => ({ params: { slug: post.slug } }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://your-api.com/news/${params.slug}`);
  const post = await res.json();

  return {
    props: { post },
    revalidate: 10,
  };
}
