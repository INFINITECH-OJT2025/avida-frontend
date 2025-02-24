import '@/styles/globals.css';
import { useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import 'lightbox2/dist/css/lightbox.min.css';

// React DnD imports
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function MyApp({ Component, pageProps }) {
  const useAdminLayout = Component.useAdminLayout || false;

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
      {useAdminLayout ? (
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </DndProvider>
  );
}
