{showComparison && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden relative">
            <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-4 mb-4">
            <h2 className="text-xl font-extrabold text-[#990e15] flex items-center gap-2">
  <span className="text-2xl">📊</span> Property Comparison
</h2>

              <button
                onClick={clearComparison}
                className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <X className="text-gray-800 dark:text-white w-5 h-5" />
              </button>
            </div>

            <table className="w-full border-collapse text-left text-sm dark:text-white">
              <thead className="bg-[#990e15] text-white">
                <tr>
                  <th className="p-3 text-left">Feature</th>
                  {selectedProperties.map((p) => (
                    <th key={p.id} className="p-3 text-center">{p.property_name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 dark:divide-gray-700">

                  {/* ✅ Media Comparison */}
                  <tr className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                    <td className="p-2 font-bold flex items-center">📷 Images / Media</td>

                    {selectedProperties.map((p) => (
                      <td key={p.id} className="p-2">
                        {/* ✅ Image Thumbnails (Up to 3) */}
                        <div className="flex justify-center gap-2">
                          {p.media
                            .filter(media => media.type === "image")
                            .slice(0, 3) // Show max 3 images
                            .map((media, index) => (
                              <a
                                key={index}
                                href={media.url}
                                data-lightbox={`property-gallery-${p.id}`}
                                className="rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition"
                              >
                                <Image
                                  src={media.url}
                                  alt={`Image ${index + 1}`}
                                  width={70}
                                  height={70}
                                  objectFit="cover"
                                  className="rounded-lg border border-gray-400 dark:border-gray-600"
                                />
                              </a>
                            ))}
                        </div>

                        {/* ✅ 360° Panorama (If Available) */}
                        {p.media.some(media => media.type === "360") && (
                          <div className="mt-2 flex justify-center">
                            {p.media
                              .filter(media => media.type === "360")
                              .slice(0, 1) // Show first panorama
                              .map((media, index) => (
                                <a key={index} href={media.url} data-lightbox={`property-360-${p.id}`} className="block">
                                  <Image
                                    src={media.url}
                                    alt="360° View"
                                    width={80}
                                    height={50}
                                    objectFit="cover"
                                    className="rounded-lg shadow-md border border-gray-400 dark:border-gray-600 cursor-pointer hover:shadow-xl transition"
                                  />
                                </a>
                              ))}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* ✅ Property Feature Comparison */}
                  {["price", "location", "unit_status", "unit_type", "square_meter", "floor_number", "parking", "property_status", "features_amenities"].map((key, index) => (
                    <tr
                      key={key}
                      className={`hover:bg-gray-200 dark:hover:bg-gray-700 transition ${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : ""
                        }`}
                    >
                      <td className="p-2 font-bold text-gray-700 dark:text-gray-300 capitalize">
                        {key.replace("_", " ")}
                      </td>

                      {selectedProperties.map((p) => (
                        <td key={p.id} className="p-2">
                          {key === "price" ? (
                            `₱${Number(p[key]).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
                          ) : key === "features_amenities" ? (
                            (() => {
                              try {
                                // ✅ Ensure features_amenities is parsed correctly
                                const amenities = typeof p[key] === "string" ? JSON.parse(p[key]) : p[key];

                                return (
                                  <ul className="list-disc list-inside">
                                    {amenities.map((amenity, i) => (
                                      <li key={i} className="text-gray-700 dark:text-gray-300">
                                        {amenity}
                                      </li>
                                    ))}
                                  </ul>
                                );
                              } catch (error) {
                                console.error("Error parsing amenities:", error);
                                return <span className="text-red-500">Invalid Data</span>;
                              }
                            })()
                          ) : (
                            p[key]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>
        )}