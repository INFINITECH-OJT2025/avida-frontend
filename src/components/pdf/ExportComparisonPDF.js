// components/pdf/ExportComparisonPDF.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportComparisonToPDF = async (selectedProperties = []) => {
  if (!selectedProperties || selectedProperties.length < 2) return;

  const doc = new jsPDF("landscape");
  const themeColor = [153, 14, 21];

  // Title and Header
  doc.setFontSize(22);
  doc.setTextColor(...themeColor);
  doc.text("Property Comparison Report", 15, 20);

  // Date and Company Name
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 30);
  doc.text("Company: Avida Land", 15, 36);

  // Watermark (super light and transparent)
  doc.setTextColor(230);
  doc.setFontSize(100);
  doc.text("AVIDA LAND", 80, 120, {
    angle: 45,
    opacity: 0.005,
  });

  // Table Head
  const head = [
    ["Feature", ...selectedProperties.map((p) => p.property_name)]
  ];

  // Table Body Generator
  const body = [];
  const addRow = (label, getValue) => {
    const row = [label];
    selectedProperties.forEach((property) => {
      row.push(getValue(property));
    });
    body.push(row);
  };

  addRow("Price", (p) => `Php ${Number(p.price).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`);
  addRow("Location", (p) => p.location);
  addRow("Unit Status", (p) => p.unit_status);
  addRow("Unit Type", (p) => p.unit_type);
  addRow("Square Meter", (p) => `${p.square_meter} sqm.`);
  addRow("Floor Number", (p) => `${p.floor_number} floor/s`);
  addRow("Parking", (p) => p.parking);
  addRow("Property Status", (p) => p.property_status);
  addRow("Features & Amenities", (p) => {
    try {
      const features = typeof p.features_amenities === "string" ? JSON.parse(p.features_amenities) : p.features_amenities;
      return features.map(f => `• ${f}`).join("\n");
    } catch (e) {
      return "Invalid Data";
    }
  });

  // Table
  autoTable(doc, {
    startY: 45,
    head,
    body,
    theme: "grid",
    headStyles: { fillColor: themeColor, textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    styles: { fontSize: 10, cellPadding: 3, cellWidth: 'wrap' },
    columnStyles: {
      0: { cellWidth: 60 },
    },
    margin: { top: 40 },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      const pageCount = doc.internal.getNumberOfPages();
      const pageSize = doc.internal.pageSize;
      doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`, pageSize.width - 40, pageSize.height - 10);
    },
  });

  doc.save("Avida_Property_Comparison.pdf");
};
