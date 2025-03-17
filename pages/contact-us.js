import Head from "next/head";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer"; 
import ContactForm from "../src/components/user/services/contact-us";

export default function ContactUs() {
    return (
        <>
            <Head>
                <title>Contact Us | Avida</title>
            </Head>
            <Header />
            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col items-center py-28">
                <ContactForm />
            </div>
            <Footer />
        </>
    );
}