import React from "react";
import Logo from "/Users/srifamily/Desktop/untitled folder/FeedBack-System/client/src/assets/logo.jpg"

type Props = {};

const FeedbackPage = (props: Props) => {
  return <div>
    <div>
  <nav>
  <ul id="header"><li><img src={Logo} alt="image" >
  </img></li>
    <li id="feedback">Feedback Report</li>
    <li id="home">Home</li>
    </ul>
  <ul>
    <li id="li1">Report</li>
    <li id="li1">Dept</li>
    <li id="li1">Infra</li>
    <li id="li1">Gen</li>
    <li id="li1">Download</li>
    <li id="li1">Upload</li>
    <li id="li1">Logout</li>
  </ul>
  </nav>
  </div>
  <div id="Details">
    <ul id="boxname">ReportDetails</ul>
  <ul id="reports">
    <li id="li2">Department</li>
    <select name="dropdown" id="select">
      <option value="NIL" selected>NIL</option>
      <option value="cse">CSE</option>
      <option value="it">IT</option>
      <option value="ads">ADS</option>
      <option value="bt">BT</option>
      <option value="mtr">MTR</option>
      <option value="eie">EIE</option>
      <option value="ece">ECE</option>
      <option value="eee">EEE</option>
   </select>
   <br />
    <li id="li2">Subject Type</li>
    <select name="dropdown" id="select">
      <option value="NIL" selected>NIL</option>
      <option value="TH">Theory</option>
      <option value="PR">Practical</option>
      </select>
      <br />
    <li id="li2">Academic Year</li>
    <input type="date" id="select" name="academic year"></input>
    <br />
    <li id="li2">Semester</li>
    <select name="dropdown" id="select">
      <option value="NIL" selected>NIL</option>
      <option value="sem1">sem-1</option>
      <option value="sem2">sem-2</option>
      <option value="sem3">sem-3</option>
      <option value="sem4">sem-4</option>
      <option value="sem5">sem-5</option>
      <option value="sem6">sem-6</option>
      <option value="sem7">sem-7</option>
      <option value="sem8">sem-8</option>
   </select>
   <br />
    <li id="li2">Section</li>
    <select name="dropdown" id="select">
      <option value="NIL" selected>NIL</option>
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
      </select>
    <br />
    <li id="li2">Subject Code</li>
    <select name="dropdown" id="select">
      <option value="NIL" selected>NIL</option>
      <option value="CS2203">CS2203</option>
      <option value="CS2201">CS2201</option>
      <option value="ETC">etc</option>
      </select><br />
    <li id="li2">Report Types</li>
    <select name="dropdown" id="select">
      <option value="NIL" selected>NIL</option>
      <option value="5">Excellent</option>
      <option value="4">Very good</option>
      <option value="3">Good</option>
      <option value="2">Fair</option>
      <option value="1">Poor</option>
      </select>
    <br />
  </ul>
  </div>
  <footer><p>&copy; copyright KCET</p></footer>
  </div>
};

export default FeedbackPage;
