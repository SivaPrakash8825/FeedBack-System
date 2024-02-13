import { jsPDF } from "jspdf";
import autoTable, { UserOptions, RowInput } from "jspdf-autotable";
import logoImage from "../assets/logo.jpg";
import { DepartmentName } from "./Constants";

const Generatepdf2 = (
  header: string[],
  rows: Array<any>,
  type: string,
  department: string,
  academicyr: string,
  semester: number,
  subtype: string,
  section: string,
  avgheader: string[],
) => {
  const pdf = new jsPDF("landscape");

  const createTable = (header, marks, staffname) => {
    const semType = semester % 2 == 0 ? "FINAL" : "MID";
    pdf.setFont("helvetica", "normal");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imageWidth = 120; // Set your image width
    const xCoordinate = (pdfWidth - imageWidth) / 2;

    // Add the image at the calculated center coordinates
    pdf.addImage(logoImage, "JPEG", xCoordinate, 10, imageWidth, 32); // Change the coordinates and dimensions as needed

    const maxWidth = pdfWidth - 20; // Adjust the maximum width as needed
    const text = `Department of ${DepartmentName[department]}`;
    const text1 = `Academic Year : ${academicyr} ${semType} Semester`;
    const text2 = `${semType} SEMESTER FEEDBACK ANALYSIS REPORT FOR ${subtype.toUpperCase()} SUBJECTS FOR SEM - ${semester} SECTION - ${section} `;
    const text3 = `Academic Year:${academicyr} ${semester % 2 == 0 ? "ODD" : "EVEN"}-SEM `;
    const text4 = `Faculty Name : ${staffname}`;
    const text5 = `Course Name : ${staffname}`;
    // const text1 = "test";
    const lines = pdf.splitTextToSize(text, maxWidth);

    pdf.setFontSize(12);
    pdf.text(lines, pdfWidth / 2, 50, { align: "center" });
    // Define table headers
    pdf.setFontSize(13);
    pdf.text(text1, pdfWidth / 2, 57, { align: "center" });
    pdf.setFontSize(15);
    pdf.text(text2, pdfWidth / 2, 66, { align: "center" });
    pdf.setFontSize(8);
    pdf.text(text3, 40, 76, { align: "center" });
    pdf.text(text4, pdfWidth / 2, 76, { align: "center" });
    pdf.text(text5, pdfWidth - 100, 76, { align: "center" });

    // Set table properties
    const startY = 85;
    const tableProps: UserOptions = {
      startY,
      head: [header],
      body: marks,
      theme: "grid",
      tableLineColor: "white",
      styles: {
        fontSize: 9,
        cellPadding: 2,
        valign: "middle",
        halign: "center",
      },
      headStyles: {
        fillColor: "black",
      },
    };

    return autoTable(pdf, tableProps);
  };
  for (const [index, data] of rows.entries()) {
    index != 0 ? pdf.addPage() : null;
    // const semType = semester % 2 == 0 ? "EVEN" : "ODD";
    pdf.setFont("helvetica", "normal");
    console.log(data);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    // Set your image width
    // const xCoordinate = (pdfWidth - imageWidth) / 2;
    const maxWidth = pdfWidth - 20;
    // const semType2 = semester % 2 == 0 ? "END" : "MID";

    // Define table rows
    //   const rowss = [["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"]];

    // Set font size and style
    createTable(header, data.marks, data.Staff);

    if (avgheader) {
      const startYFirstTable = pdf.lastAutoTable.finalY + 20;
      //   const estimatedFirstTableHeight = (rows.length + 1) * 10; // Assuming each row height is 10
      if (startYFirstTable) {
        const lines = pdf.splitTextToSize(
          `${DepartmentName[department]} Question Wise Average `,
          maxWidth,
        );

        const startYSecondTable = startYFirstTable + 10;
        pdf.text(lines, pdfWidth / 2, startYSecondTable - 2, {
          align: "center",
        });
        const tableProps2: UserOptions = {
          startY: startYSecondTable,
          head: [avgheader],
          body: [data.avgrow],
          theme: "grid",
          tableLineColor: "white",
          styles: {
            fontSize: 5,
            cellPadding: 2,
            valign: "middle",
            halign: "center",
          },
          headStyles: {
            fillColor: "black",
          },
        };
        pdf.setFontSize(10);
        autoTable(pdf, tableProps2);

        pdf.text(
          `HOD/${department}`,
          pdfWidth - 20,
          pdf.lastAutoTable.finalY + 20,
          {
            align: "right",
          },
        );
      }
    }
    pdf.addPage();
    createTable(["username", "comments"], data.usercomments);
  }
  // Save the PDF with a specific filename
  pdf.save("table.pdf");
};

export default Generatepdf2;
