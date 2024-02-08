
import * as XLSX from "xlsx";

const JsonToExcel = ({data}:{data:any}) => {
    
    
        try {
        // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Save the workbook to an Excel file
    XLSX.writeFile(workbook, "data.xlsx");
        } catch (error) {
          console.log("convertJsonToSheet Error : ", error.message);
        }
    

    // useEffect(() => {
    //   convertJsonToSheet() 
    // },[])
    
 
}

export default JsonToExcel