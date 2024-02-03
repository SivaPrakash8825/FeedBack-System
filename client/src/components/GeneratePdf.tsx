import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";
import logoImage from "/kcet.jpg";

const PdfGenerator: React.FC = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const generatePdf = () => {
    // Create a new jsPDF instance
    const pdf = new jsPDF();

    // Set font size and style
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imageWidth = 200; // Set your image width
    const xCoordinate = (pdfWidth - imageWidth) / 2;

    // Add the image at the calculated center coordinates
    pdf.addImage(logoImage, "JPEG", xCoordinate, 10, imageWidth, 50); // Change the coordinates and dimensions as needed

    const maxWidth = pdfWidth - 20; // Adjust the maximum width as needed
    const text =
      "Your long text that needs to be broken when overflow Your long text that needs to be broken when overflow Your long text that needs to be broken when overflow Your long text that needs to be broken when overflow ";
    const lines = pdf.splitTextToSize(text, maxWidth);

    pdf.text(lines, pdfWidth / 2, 70, { align: "center" });
    // Define table headers
    const headers = ["Column 1", "Column 2", "Column 3"];

    // Define table rows
    const data = [
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      [
        "Row 2, Cell 1",
        "Row 2, Cell 2",
        "Row 2, Cell 3 Row 2, Cell 3 Row 2, Cell 3 Row 2, Cell 3",
      ],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      [
        "Row 2, Cell 1 Row 2, Cell 3 Row 2, Cell 3 Row 2, Cell 3 Row 2, Cell 3",
        "Row 2, Cell 2",
        "Row 2, Cell 3",
      ],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      [
        "Row 3, Cell 1",
        "Row 3, Cell 2 Row 2, Cell 3 Row 2, Cell 3 Row 2, Cell 3 ",
        "Row 3, Cell 3",
      ],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
      ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
      ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
      ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
    ];

    // Set table properties
    const tableProps: UserOptions = {
      startY: 85,
      head: [headers],
      body: data,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 2,
        valign: "middle",
        halign: "center",
      },
    };

    // Add table to the PDF document
    autoTable(pdf, tableProps);

    // Save the PDF with a specific filename
    pdf.save("table.pdf");
  };

  return (
    <div>
      <div ref={componentRef}>
        <h1>Your PDF Content Goes Here</h1>
        <p>More content...</p>
      </div>
      <button onClick={handlePrint}>Print PDF</button>
      <button onClick={generatePdf}>Generate PDF</button>
    </div>
  );
};

export default PdfGenerator;
