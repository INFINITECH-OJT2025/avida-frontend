import '../src/styles/globals.css';
import { useEffect } from 'react';
import AdminLayout from '../src/components/layout/AdminLayout';
import 'lightbox2/dist/css/lightbox.min.css';
<meta name="apple-mobile-web-app-title" content="Avida Land PWA" />
import Head from "next/head";

// React DnD imports
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function MyApp({ Component, pageProps }) {
  const isAdminPage = Component.useAdminLayout || false;
  const useHeaderFooter = Component.useHeaderFooter || false;

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

  return (
    
    <DndProvider backend={HTML5Backend}>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#990e15" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
      </Head>
      {isAdminPage ? (
        // ✅ Admin Layout (No Header & Footer)
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      ) : (
        // ✅ Page Component decides if Header & Footer should be included
        <Component {...pageProps} />
      )}
    </DndProvider>
  );
}
