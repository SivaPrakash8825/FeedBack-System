import React from "react";
import Logo from "C:/Users/ACER/Desktop/Feedback System/FeedBack-System/client/src/assets/logo.jpg"
type Props = {};

const FeedbackPage = (props: Props) => {
  return <div className="head">
  <div className="header" >
    <nav>
      <img src={Logo} alt="Image"></img>
      <ul className="img-header">Feedback Report</ul>
      <ul className="style-ul1">Home   </ul>
      <ul className="style-ul2">
        <li className="style-li1">Report  </li>
        <li className="style-li1">Dept  </li>
        <li className="style-li1">Infra  </li>
        <li className="style-li1">Gen  </li>
        <li className="style-li1">Download  </li>
        <li className="style-li1">Upload  </li>
        <li className="style-li1">Logout  </li>
      </ul>
    </nav>
  </div><br/>
  <div className="box">
    <ul className="Details" >ReportDetails</ul>
    <ul id="Parts">
      <li id="li2">Dept</li><select id="s1" name = "dropdown">
            <option value = "Select" selected>Select</option>
            <option value = "CSE">CSE</option>
            <option value = "ECE">ECE</option>
            <option value = "IT">IT</option>
            <option value = "ADS">ADS</option>
            <option value = "EEE">EEE</option>
            <option value = "MECH">MECH</option>
            <option value = "BT">BT</option>
         </select>
         <br/>
      <li>SubjectType </li><select id="s2" name = "dropdown">
            <option value = "Theory" selected>Theory</option>
            <option value = "Labaratory">Labaratory</option>
         </select><br/>
      <li>Academic Year </li><input type="date"></input><br/>
      <li>Semester </li><select id="s3" name = "dropdown">
            <option value = "Select" selected>Select</option>
            <option value = "1">1</option>
            <option value = "2">2</option>
            <option value = "3">3</option>
            <option value = "4">4</option>
            <option value = "5">5</option>
            <option value = "6">6</option>
            <option value = "7">7</option>
            <option value = "8">8</option>
         </select><br/>
      <li>Section </li><select id="s4"name = "dropdown">
            <option value = "Select" selected>Select</option>
            <option value = "A">A</option>
            <option value = "B">B</option>
            <option value = "C">C</option>
         </select><br/>
      <li>Subject Code </li><select id="s5"name = "dropdown">
            <option value = "Select" selected>Select</option>
            <option value = "CS2252">CS2252</option>
            <option value = "GE2201">GE2201</option>
         </select><br/>
      <li>Report Type </li><input placeholder="Markwise"></input><br />
    </ul>
    </div><br/>
    <footer><p>&copy;Copyrights KCET</p></footer>
  </div>;
};

export default FeedbackPage;
