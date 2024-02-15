import { jsPDF } from "jspdf";
import autoTable, { UserOptions, RowInput } from "jspdf-autotable";
import logoImage from "../assets/logo.jpg";
import { DepartmentName } from "./Constants";
import { ToastProp } from "../store/useToast";

const Generatepdf2 = (
  header: string[],
  rows: Array<any>,
  type: string,
  department: string,
  academicyr: string,
  semester: number,
  subtype: string,
  section: string,
  avgheader?: string[],
  avgrows?: RowInput[],
): ToastProp => {
  try {
    console.log(type);
    const semType = semester % 2 == 0 ? "EVEN" : "ODD";
    // const semType2 = semester % 2 == 0 ? "END" : "MID";

    let headers =
      type == "subjectwise"
        ? [
            "Sub Code",
            "Subject Name",
            "Staffname",
            "Dept",
            "Mark",
            "Assessment",
          ]
        : header;

    // Define table rows
    const rowss = [["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"]];
    console.log(rowss.length);

    const pdf = new jsPDF("landscape");

    // Set font size and style
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
    // const text1 = "test";
    const lines = pdf.splitTextToSize(text, maxWidth);

    pdf.setFontSize(12);
    pdf.text(lines, pdfWidth / 2, 50, { align: "center" });
    // Define table headers
    pdf.setFontSize(13);
    pdf.text(text1, pdfWidth / 2, 57, { align: "center" });
    pdf.setFontSize(15);
    pdf.text(text2, pdfWidth / 2, 66, { align: "center" });

    // Set table properties
    const startY = 72;
    const tableProps: UserOptions = {
      startY,
      head: [headers],
      body: rows,
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

    autoTable(pdf, tableProps);

    if (avgheader && avgrows) {
      const startYFirstTable = tableProps.startY;
      const estimatedFirstTableHeight = (rows.length + 1) * 10; // Assuming each row height is 10
      if (startYFirstTable && estimatedFirstTableHeight) {
        const lines = pdf.splitTextToSize(
          "ARTIFICIALINTELLIGENCE &DATASCIENCEDEPARTMENT Question Wise Average ",
          maxWidth,
        );

        const startYSecondTable =
          startYFirstTable + estimatedFirstTableHeight + 10;
        pdf.text(lines, pdfWidth / 2, startYSecondTable - 2, {
          align: "center",
        });
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

        pdf.text(sign, pdfWidth - 50, startYSecondTable + 30);
      }
    }

    pdf.setFontSize(10);
    pdf.text(
      `HOD/${department}`,
      pdfWidth - 20,
      // @ts-ignore
      pdf.lastAutoTable.finalY + 20,
      {
        align: "right",
      },
    );

    // Save the PDF with a specific filename
    pdf.save("table.pdf");
    return { msg: "Report Generated :)", variant: "success" };
  } catch (error) {
    console.log(error.message);
    return { msg: error.message as string, variant: "error" };
  }
};

export default Generatepdf2;
