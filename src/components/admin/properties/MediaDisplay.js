import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export default function MediaDisplay({ media = [], propertyName = "Property" }) {
  if (!media.length) {
    return <p className="text-sm text-gray-500">No media available</p>;
  }

  return (
    <PhotoProvider>
      <div className="flex flex-wrap gap-2 mt-4">
        {media.map((item, index) =>
          item.type === "video" ? (
            <video
              key={index}
              src={item.url}
              className="w-40 h-40 object-cover rounded"
              controls
            />
          ) : (
            <PhotoView key={index} src={item.url}>
              <img
                src={item.url}
                alt={`${propertyName} - Image ${index + 1}`}
                className="w-10 h-10 object-cover rounded cursor-pointer hover:opacity-80 transition"
              />
            </PhotoView>
          )
        )}
      </div>
    </PhotoProvider>
  );
}
