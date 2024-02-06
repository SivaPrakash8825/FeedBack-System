const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});
const db = require("./db");

const questions = [
  {
    question: "How much portion of the syllabus was covered by the teacher?",
    options: ["95 to 100%", "85 to 94%", "75 to 84%", "74 to 65%", "Below 65%"],
    type: "theory",
  },
  {
    question: "Has the teacher covered relevant topics beyond the syllabus?",
    options: ["Everytime", "Usually", "Sometimes", "Rarely", "Never"],
    type: "theory",
  },
  {
    question:
      "Did the teacher teach the subject with suitable illustrations, case studies and applications?",
    options: ["Everytime", "Usually", "Sometimes", "Rarely", "Never"],
    type: "theory",
  },
  {
    question: "How well the teacher was able to communicate with the students?",
    options: [
      "Always effective",
      "Sometimes effective",
      "Satisfactory",
      "Generally ineffective",
      "Very poor communication",
    ],
    type: "theory",
  },
  {
    question:
      "The percentage use of ICT tools by the teacher, such as LCD projector, Multimedia, etc. while teaching was,",
    options: ["Above 90%", "70 to 89%", "50 to 69%", "30 to 59%", "Below 29%"],
    type: "theory",
  },
  {
    question: "The syllabus content was covered unit by unit in uniform way.",
    options: [
      "Strongly agree",
      "Agree",
      "Neutral",
      "Disagree",
      "Strongly disagree",
    ],
    type: "theory",
  },
  {
    question:
      "The teacher motivates the students to ask questions and clear their doubts?",
    options: [
      "Strongly agree",
      "Agree",
      "Neutral",
      "Disagree",
      "Strongly disagree",
    ],
    type: "theory",
  },
  {
    question:
      "Were practical demonstrations and hands-on training given for the relevant topics?",
    options: ["Regularly", "Often", "Sometimes", "Rarely", "Never"],
    type: "theory",
  },
  {
    question:
      "The teacher identifies your strengths and encourages you with providing right level of challenges.",
    options: ["Fully", "Reasonably", "Partially", "Slightly", "Unable to"],
    type: "theory",
  },
  {
    question:
      "The teacher values the answer scripts, gives the marks of the cycle tests in time and discusses the answers in the classroom?",
    options: [
      "Strongly agree",
      "Agree",
      "Neutral",
      "Disagree",
      "Strongly disagree",
    ],
    type: "theory",
  },
  {
    question: "Mentoring System in College",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question: "Cleanliness in Class Rooms",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question: "Availability and maintenance of Fan/Lights/LCDs in Class Rooms",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question: "Cleanliness in Laboratories",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question:
      "Availability and maintenance of adequate equipment in Laboratories",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question: "Quality of available books in College Library",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question:
      "Library Timings and the System followed in issue of books in College Library",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question: "Internet / wifi Facility in Laboratory/Campus",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question:
      "Availability of Reprographic(Xerox) / Printing Facility in College Campus",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question: "Placement Guidance & Support given by TDP cell (Placement cell)",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question: "Quality of Training Programs organized by TDP cell",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question: "Drinking water availability in campus",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question: "Medical Facility in campus",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question: "Infrastructure for club activities",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question: "Infrastructure for Sports activities",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question:
      "Canteen Facilities (with respect to availability of quality/variety of items)",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question: "Support by Administrative Office",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question:
      "Washroom facility within the campus (with respect to proximity and cleanliness)",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question:
      "Availability of Grievances/Suggestion Box and action taken on Grievances lodged",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question:
      "Facilities in Hostel (Hostel Students) OR Transport Facilities provided by college (Dayscholars)",
    options: [
      "Excellent",
      "Very Good",
      "Good",
      "Satisfactory",
      "Not Satisfactory",
    ],
    type: "infra",
  },
  {
    question:
      "Extent of explanation given by the teacher on the concepts underlying the experiment/practical",
    options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    type: "lab",
  },
  {
    question: "How interesting are the lab sessions?",
    options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    type: "lab",
  },
  {
    question: "Extent of planning and instructions given for the experiments",
    options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    type: "lab",
  },
  {
    question: "Extent to which the lab work stimulates you to think?",
    options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    type: "lab",
  },
  {
    question: "Time given to perform the experiment? (in terms of adequacy)",
    options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    type: "lab",
  },
  {
    question: "Efforts taken by the faculty to connect lab work with lectures?",
    options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    type: "lab",
  },
  {
    question:
      "Explanations given to relate lab work to actual field application?",
    options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    type: "lab",
  },
  {
    question:
      "Are you given adequate instructions/demonstrations for proceeding with lab work?",
    options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    type: "lab",
  },
  {
    question: "How is the content covered in the lab Manual/lab instructions?",
    options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    type: "lab",
  },
  {
    question: "Working condition of machinery at the time of performance?",
    options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    type: "lab",
  },
  {
    question: "Assessment of the lab work regularly by the teacher?",
    options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    type: "lab",
  },
  {
    question:
      "Quality of inputs provided during the entire duration of the experiment session?",
    options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    type: "lab",
  },
  {
    question: "Teacher’s control and command over the laboratory class?",
    options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    type: "lab",
  },
  {
    question:
      "Level in which the difficulties are entertained during lab session?",
    options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    type: "lab",
  },
  {
    question:
      "Level in which the experiments were covered as per the schedule?",
    options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    type: "lab",
  },
];

// Create Table questions & insert questions to it.
const createQuestions = () => {
  // Creates Table
  db.query(
    "CREATE TABLE IF NOT EXISTS `feedback`.`questions` (`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,`question` TEXT NULL,type TEXT);",
    (err, res) => {
      if (!err) {
        // Add Questions to table
        const parameters = questions.reduce(
          (acc, { options, question, type }) => [
            ...acc,
            JSON.stringify({ question, options }),
            type,
          ],
          []
        );

        const placeholder = questions.map(() => "(?, ?)");
        console.log(placeholder, parameters);

        db.query(
          `INSERT INTO questions (question,type) VALUES ${placeholder}`,
          parameters,
          (err, res) => {
            console.log(err, res);
          }
        );
      }
    }
  );
};

createQuestions();
