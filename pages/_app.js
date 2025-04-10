import { useEffect, useState, useRef } from 'react';
import '../src/styles/globals.css';
import AdminLayout from '../src/components/layout/AdminLayout';
import 'lightbox2/dist/css/lightbox.min.css';
import Head from "next/head";
import { ToastProvider } from "../src/context/ToastContext";
import { Download } from "lucide-react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRouter } from 'next/router';
import GlobalLoader from '../src/components/layout/GlobalLoader';

export default function MyApp({ Component, pageProps }) {
  const isAdminPage = Component.useAdminLayout || false;
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const router = useRouter();
  const isRoomPlannerPage = router.pathname === "/room-planner";
  // ✅ Mark component as hydrated (client-side)
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // ✅ Lightbox JS (only in browser)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('jquery').then(($) => {
        window.$ = window.jQuery = $;
        import('lightbox2').then((lightbox) => {
          lightbox.option({
            resizeDuration: 200,
            wrapAround: true,
            albumLabel: 'Image %1 of %2',
          });
        });
      });
    }
  }, []);

  // ✅ PWA install event listeners
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // ✅ Check if app is already installed (standalone)
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPwaInstalled(true);
    }
  }, []);

  useEffect(() => {
    let timeout;
    let startTime;
    let isLocked = false;
  
    const handleRouteChangeStart = (url) => {
      const nextPathname = new URL(url, location.origin).pathname;
  
      if (!isLocked) {
        isLocked = true;
        startTime = Date.now();
  
        // Show loader after 100ms (prevents flicker for fast routes)
        timeout = setTimeout(() => {
          setIsRouteLoading(true);
        }, 100);
      }
    };
  
    const handleRouteChangeEnd = (url) => {
      const nextPathname = new URL(url, location.origin).pathname;
  
      const elapsed = Date.now() - startTime;
      clearTimeout(timeout);
  
      if (elapsed < 100) {
        // Loader wasn’t shown yet, so no need to hide
        isLocked = false;
      } else {
        setIsRouteLoading(false);
        isLocked = false;
      }
    };
  
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeEnd);
    router.events.on('routeChangeError', handleRouteChangeEnd);
  
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
      router.events.off('routeChangeError', handleRouteChangeEnd);
      clearTimeout(timeout);
    };
  }, [router]);
  
    const installPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("PWA installed successfully");
          setIsPwaInstalled(true);
        } else {
          console.log("PWA installation declined");
        }
        setDeferredPrompt(null);
      });
    }
  };
  
  // ✅ SSR-safe rendering: Only render app after hydration
  if (!isHydrated) return null;

  return (
    <ToastProvider>
      
      <DndProvider backend={HTML5Backend}>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#990e15" />
          <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
          <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
        </Head>

        {typeof window !== 'undefined' && (
  <GlobalLoader show={isRouteLoading} />
)}


        {isAdminPage ? (
          <AdminLayout>
            <Component {...pageProps} />
          </AdminLayout>
        ) : (
          <Component {...pageProps} />
        )}

        {!isRoomPlannerPage && !isPwaInstalled && deferredPrompt && (
          <button
            onClick={installPWA}
            className="fixed bottom-8 right-8 px-6 py-3 flex items-center bg-[#990e15] text-white rounded-full shadow-lg hover:bg-[#7f0c12] transition-all"
            style={{ minWidth: '160px', borderRadius: '50px', textAlign: 'center' }}
          >
            <Download size={22} className="mr-2" />
            Install App
          </button>
        )}


      </DndProvider>
    </ToastProvider>
  );
}
