import useToast from "../store/useToast";

type Props = {};

const useReportGenerator = () => {
  const setToast = useToast((state) => state.setToast);
  function ForInfra(data: any) {
    const allfields: any = {};
    const header = [];
    const avgheader = [];
    console.log(data);

    header.push(
      ...Object.keys(data[0]).filter(
        (val) =>
          ![
            "marks",
            "Staff",
            "coursecode",
            "academicyear",
            "degreetype",
            "comments",
            "Sub Name",
            "dept",

            "assessmenttype",
          ].includes(val.trim()),
      ),
    );
    JSON.parse(data[0].marks).answers.forEach((val: any, index: number) => {
      header.push(`Q${index + 1}`);
      avgheader.push(`Q${index + 1}`);
    });
    header.push("Total");
    avgheader.push("AVG");
    const parseanswer = (val: any) => {
      const arr: any[] = [];
      let total = 0;
      JSON.parse(val.marks).answers.map((mark: number, index: number) => {
        total += mark;
        arr[index] = mark;
        if (JSON.parse(val.marks).answers.length - 1 == index) {
          arr[index + 1] = total;
        }
      });
      return arr;
    };
    data.forEach((val: any) => {
      const key = val.dept;
      if (!allfields[key]) {
        allfields[key] = {
          ...val,
          dept: val.dept,
          marks: [
            [
              val.username,
              val.stdtype,
              val.section,
              val.sem,
              ...parseanswer(val),
            ],
          ],
          usercomments: [[val.username, val.comments]],
        };
      } else {
        const usercom = [val.username, val.comments];

        allfields[key].marks.push([
          val.username,
          val.stdtype,
          val.section,
          val.sem,
          ...parseanswer(val),
        ]);
        allfields[key].usercomments.push(usercom);
      }
    });

    const newallfield = Object.values(allfields);
    const transpose = (matrix: any[]) => {
      return matrix[0]
        .map((_: any, colIndex: number) => matrix.map((row) => row[colIndex]))
        .slice(4);
    };

    const calculateAverage = (column: any) => {
      const sum = column.reduce((acc: any, value: any) => acc + value, 0);
      return (sum / column.length).toFixed(4);
    };
    // const newallfield.
    // console.log(newallfield);

    newallfield.forEach((data: any) => {
      const transposedData = transpose(data.marks);

      // Calculate average for each column
      const columnAverages = transposedData.map((column: any) =>
        calculateAverage(column),
      );

      data.avgrow = columnAverages;
    });

    return {
      header,
      newallfield,
      avgheader,
    };
  }
  function ForTheoryAndLab(data: any): {
    header: any;
    newallfield: any;
    avgheader: any;
  } {
    console.log(data.newallfield);
    const allfields: any = {};
    const header = [];
    const avgheader = [];

    header.push(
      ...Object.keys(data[0]).filter(
        (val) =>
          ![
            "marks",
            "Staff",
            "coursecode",
            "academicyear",
            "degreetype",
            "comments",
            "Sub Name",
            "dept",
            "Board",
            "Sub Grouping",
          ].includes(val),
      ),
    );

    JSON.parse(data[0].marks).answers.forEach((val: any, index: number) => {
      header.push(`Q${index + 1}`);
      avgheader.push(`Q${index + 1}`);
    });
    header.push("Total");
    avgheader.push("AVG");
    const parseanswer = (val: any) => {
      const arr: any[] = [];
      let total = 0;
      JSON.parse(val.marks).answers.map((mark: number, index: number) => {
        total += mark;
        arr[index] = mark;
        if (JSON.parse(val.marks).answers.length - 1 == index) {
          arr[index + 1] = total;
        }
      });
      return arr;
    };

    data.forEach((val: any) => {
      const key = val["coursecode"];

      if (!allfields[key]) {
        allfields[key] = {
          ...val,
          dept: val.dept,
          marks: [[val.username, ...parseanswer(val)]],
          usercomments: [[val.username, val.comments]],
        };
      } else {
        const usercom = [val.username, val.comments];

        allfields[key].marks.push([val.username, ...parseanswer(val)]);
        allfields[key].usercomments.push(usercom);
      }
    });
    const newallfield = Object.values(allfields);
    const transpose = (matrix: any[]) => {
      return matrix[0]
        .map((_: any, colIndex: number) => matrix.map((row) => row[colIndex]))
        .slice(1);
    };

    const calculateAverage = (column: any) => {
      const sum = column.reduce((acc: any, value: any) => acc + value, 0);
      return (sum / column.length).toFixed(2);
    };
    // const newallfield.
    // console.log(newallfield);

    newallfield.forEach((data: any) => {
      const transposedData = transpose(data.marks);

      // Calculate average for each column
      const columnAverages = transposedData.map((column: any) =>
        calculateAverage(column),
      );

      data.avgrow = columnAverages;
    });
    return { header, newallfield, avgheader };
  }

  return { ForTheoryAndLab, ForInfra };
};

export default useReportGenerator;
