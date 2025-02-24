import useLayouts from '@/components/roomplanner/useLayouts';

export default function SavedLayouts({ onSelectLayout }) {
  const { layouts, loading } = useLayouts();

  if (loading) return <p>Loading layouts...</p>;

  return (
    <div>
      <h3 className="font-bold mb-4">Saved Layouts:</h3>
      {layouts.length ? (
        layouts.map(layout => (
          <button
            key={layout.id}
            onClick={() => onSelectLayout(JSON.parse(layout.layout_data))}
            className="block w-full px-3 py-2 my-2 bg-gray-200 hover:bg-gray-300"
          >
            {layout.layout_name}
          </button>
        ))
      ) : (
        <p>No saved layouts available.</p>
      )}
    </div>
  );
}
