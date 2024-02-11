
import { jsPDF } from "jspdf";
import autoTable, { UserOptions,RowInput } from "jspdf-autotable";
import logoImage from "../assets/logo.jpg";
import { Sign } from "crypto";
type props = {
  header: string[];
  rows: RowInput[];
  avgheader?: string[];
  avgrows?: RowInput[];
}
const Generatepdf2 = ({header, rows,avgheader,avgrows}:props) => {
    
    
    
    const pdf = new jsPDF('landscape');

    // Set font size and style
    pdf.setFontSize(6);
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
    
    // Set table properties
  const tableProps: UserOptions = {
    
      startY: 85,
      head: [header],
      body: rows,
      theme: "grid",
      styles: {
        fontSize: 5,
        cellPadding: 2,
        valign: "middle",
        halign: "center",
      },
    };

    // Add table to the PDF document
  autoTable(pdf, tableProps);
  if (avgheader && avgrows) {
    const startYFirstTable = tableProps.startY;
  const estimatedFirstTableHeight = (rows.length + 1) * 10; // Assuming each row height is 10
    if (startYFirstTable && estimatedFirstTableHeight) {
      const lines = pdf.splitTextToSize("ARTIFICIALINTELLIGENCE &DATASCIENCEDEPARTMENT Question Wise Average ", maxWidth);

      const startYSecondTable = startYFirstTable + estimatedFirstTableHeight + 10;
      pdf.text(lines, pdfWidth / 2,  startYSecondTable-2 , { align: "center" });
      const tableProps2: UserOptions = {
        startY: startYSecondTable,
        head: [avgheader],
        body: [avgrows],
        theme: "grid",
        styles: {
          fontSize: 5,
          cellPadding: 2,
          valign: "middle",
          halign: "center",
        },
      };
      autoTable(pdf, tableProps2);
      const sign = pdf.splitTextToSize("HOD Signature", maxWidth);

      
      pdf.text(sign, pdfWidth -50,  startYSecondTable+30 );
    } 

    
  
    
   }

    // Save the PDF with a specific filename
    pdf.save("table.pdf");
};

export default Generatepdf2;
