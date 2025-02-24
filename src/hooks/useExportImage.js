import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

export default function useExportImage() {
  const exportAsImage = (element, imageName = 'layout.png') => {
    html2canvas(element, { scale: 2 }).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, imageName);
      });
    });
  };

  return { exportAsImage };
}
