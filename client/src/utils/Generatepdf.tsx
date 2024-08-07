import { jsPDF } from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";
import logoImage from "../assets/logo.jpg";
import { DepartmentName, DeptKey } from "./Constants";
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
  avgheader: string[],
  assType: string,
): ToastProp => {
  try {
    const pdf = new jsPDF("landscape");

    const createTable = (
      header: string[],
      marks: Array<any>,
      staffname: string,
      subname: string,
      coursecode: string,
      dept: string,
    ) => {
      const semType = semester % 2 == 0 ? "FINAL" : "MID";
      pdf.setFont("helvetica", "normal");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imageWidth = 120; // Set your image width
      const xCoordinate = (pdfWidth - imageWidth) / 2;

      // Add the image at the calculated center coordinates
      pdf.addImage(logoImage, "JPEG", xCoordinate, 10, imageWidth, 32); // Change the coordinates and dimensions as needed

      const maxWidth = pdfWidth - 20;
      let startY = 0; // Adjust the maximum width as needed
      if (subtype != "infra") {
        startY = 82;
        const text = `Department of ${DepartmentName[dept as keyof typeof DepartmentName]}`;
        const text1 = `Academic Year : ${academicyr} ${semType == "FINAL" ? "EVEN" : "ODD"} Semester`;
        const text2 = `${assType == "pre" ? "MID" : "END"} SEMESTER FEEDBACK ANALYSIS REPORT FOR ${subtype.toUpperCase()} SUB CODE - ${coursecode} SEM - ${semester} SEC - ${section} `;
        const text3 = `Academic Year:${academicyr} ${semester % 2 == 0 ? "ODD" : "EVEN"}-SEM `;
        const text4 = `Faculty Name : ${staffname}`;
        const text5 = `Course Name : ${subname}`;
        // const text1 = "test";
        const lines = pdf.splitTextToSize(text, maxWidth);

        pdf.setFontSize(12);
        pdf.text(lines, pdfWidth / 2, 50, { align: "center" });
        // Define table headers
        pdf.setFontSize(13);
        pdf.text(text1, pdfWidth / 2, 57, { align: "center" });
        pdf.setFontSize(13);
        pdf.text(text2, pdfWidth / 2, 66, { align: "center" });
        pdf.setFontSize(10);
        pdf.text(text3, 50, 78, { align: "center" });
        pdf.text(text4, 21, 73);
        pdf.text(text5, pdfWidth - 20, 79, { align: "right" });
      } else {
        startY = 65;
        const text2 = `${academicyr} Infrastructure  Analysis Report  For  ${DepartmentName[dept as DeptKey]}  `;
        pdf.setFontSize(15);
        pdf.text(text2, pdfWidth / 2, 60, { align: "center" });
      }

      // Set table properties

      const columnstyle: any =
        header.length == 2
          ? {
              0: { cellWidth: 50 },
            }
          : { auto: { cellWidth: "auto" } };
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
        columnStyles: columnstyle,
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

      const pdfWidth = pdf.internal.pageSize.getWidth();
      // Set your image width
      // const xCoordinate = (pdfWidth - imageWidth) / 2;
      const maxWidth = pdfWidth - 20;
      // const semType2 = semester % 2 == 0 ? "END" : "MID";

      // Define table rows
      //   const rowss = [["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"]];

      // Set font size and style
      createTable(
        header,
        data.marks,
        data.Staff,
        data[`Sub Name`],
        data.coursecode,
        data.dept,
      );

      if (avgheader) {
        // @ts-ignore
        const startYFirstTable = pdf.lastAutoTable.finalY + 20;
        pdf.setFontSize(15);
        //   const estimatedFirstTableHeight = (rows.length + 1) * 10; // Assuming each row height is 10
        if (startYFirstTable) {
          const lines = pdf.splitTextToSize(
            `${DepartmentName[data.dept as DeptKey]} Question Wise Average `,
            maxWidth,
          );

          const startYSecondTable = startYFirstTable + 5;
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
              fontSize: 9,
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
            `HOD/${data.dept}`,
            pdfWidth - 20,
            // @ts-ignore
            pdf.lastAutoTable.finalY + 20,
            {
              align: "right",
            },
          );
        }
      }
      pdf.addPage();
      pdf.setFontSize(10);
      createTable(
        ["username", "comments"],
        data.usercomments,
        data.Staff,
        data[`Sub Name`],
        data.coursecode,
        data.dept,
      );
    }

    department && subtype != "infra"
      ? pdf.save(`${subtype}_${department}__${semester}_${section}.pdf`)
      : pdf.save(`infra_${academicyr}.pdf`);
    return {
      msg: "created successfully",
      variant: "success",
    };
  } catch (e) {
    return {
      msg: e.response.data,
      variant: "error",
    };
  }
};

export default Generatepdf2;
