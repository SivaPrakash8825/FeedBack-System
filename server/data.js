const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});
const db = require("./db");

const questions = [
  {
    id: 1,
    question:
      '{"question":"Are you given adequate instructions/demonstrations for proceeding with lab work?","options":["Excellent","Very Good","Good","Fair","Poor"]}',
    type: "lab",
  },
  {
    id: 2,
    question:
      '{"question":"Assessment of the lab work regularly by the teacher?","options":["Excellent","Very Good","Good","Fair","Poor"]}',
    type: "lab",
  },
  {
    id: 3,
    question:
      '{"question":"Availability and maintenance of adequate equipment in Laboratories","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 4,
    question:
      '{"question":"Availability and maintenance of Fan/Lights/LCDs in Class Rooms","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 5,
    question:
      '{"question":"Availability of Grievances/Suggestion Box and action taken on Grievances lodged","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 6,
    question:
      '{"question":"Availability of Reprographic(Xerox) / Printing Facility in College Campus","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 7,
    question:
      '{"question":"Canteen Facilities (with respect to availability of quality/variety of items)","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 8,
    question:
      '{"question":"Cleanliness in Class Rooms","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 9,
    question:
      '{"question":"Cleanliness in Laboratories","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 10,
    question:
      '{"question":"Did the teacher teach the subject with suitable illustrations, case studies and applications?","options":["Everytime","Usually","Sometimes","Rarely","Never"]}',
    type: "theory",
  },
  {
    id: 11,
    question:
      '{"question":"Drinking water availability in campus","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 12,
    question:
      '{"question":"Efforts taken by the faculty to connect lab work with lectures?","options":["Excellent","Very Good","Good","Fair","Poor"]}',
    type: "lab",
  },
  {
    id: 13,
    question:
      '{"question":"Explanations given to relate lab work to actual field application?","options":["Excellent","Very Good","Good","Fair","Poor"]}',
    type: "lab",
  },
  {
    id: 14,
    question:
      '{"question":"Extent of explanation given by the teacher on the concepts underlying the experiment/practical","options":["Excellent","Very Good","Good","Fair","Poor"]}',
    type: "lab",
  },
  {
    id: 15,
    question:
      '{"question":"Extent of planning and instructions given for the experiments","options":["Excellent","Very Good","Good","Fair","Poor"]}',
    type: "lab",
  },
  {
    id: 16,
    question:
      '{"question":"Extent to which the lab work stimulates you to think?","options":["Excellent","Very Good","Good","Fair","Poor"]}',
    type: "lab",
  },
  {
    id: 17,
    question:
      '{"question":"Facilities in Hostel (Hostel Students) OR Transport Facilities provided by college (Dayscholars)","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 18,
    question:
      '{"question":"Has the teacher covered relevant topics beyond the syllabus?","options":["Everytime","Usually","Sometimes","Rarely","Never"]}',
    type: "theory",
  },
  {
    id: 19,
    question:
      '{"question":"How interesting are the lab sessions?","options":["Excellent","Very Good","Good","Fair","Poor"]}',
    type: "lab",
  },
  {
    id: 20,
    question:
      '{"question":"How is the content covered in the lab Manual/lab instructions?","options":["Excellent","Very Good","Good","Fair","Poor"]}',
    type: "lab",
  },
  {
    id: 21,
    question:
      '{"question":"How much portion of the syllabus was covered by the teacher?","options":["95 to 100%","85 to 94%","75 to 84%","74 to 65%","Below 65%"]}',
    type: "theory",
  },
  {
    id: 22,
    question:
      '{"question":"How well the teacher was able to communicate with the students?","options":["Always effective","Sometimes effective","Satisfactory","Generally ineffective","Very poor communication"]}',
    type: "theory",
  },
  {
    id: 23,
    question:
      '{"question":"Infrastructure for club activities","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 24,
    question:
      '{"question":"Infrastructure for Sports activities","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 25,
    question:
      '{"question":"Internet / wifi Facility in Laboratory/Campus","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 26,
    question:
      '{"question":"Level in which the difficulties are entertained during lab session?","options":["Excellent","Very Good","Good","Fair","Poor"]}',
    type: "lab",
  },
  {
    id: 27,
    question:
      '{"question":"Level in which the experiments were covered as per the schedule?","options":["Excellent","Very Good","Good","Fair","Poor"]}',
    type: "lab",
  },
  {
    id: 28,
    question:
      '{"question":"Library Timings and the System followed in issue of books in College Library","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 29,
    question:
      '{"question":"Medical Facility in campus","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 30,
    question:
      '{"question":"Mentoring System in College","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 31,
    question:
      '{"question":"Placement Guidance & Support given by TDP cell (Placement cell)","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 32,
    question:
      '{"question":"Quality of available books in College Library","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 33,
    question:
      '{"question":"Quality of inputs provided during the entire duration of the experiment session?","options":["Excellent","Very Good","Good","Fair","Poor"]}',
    type: "lab",
  },
  {
    id: 34,
    question:
      '{"question":"Quality of Training Programs organized by TDP cell","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 35,
    question:
      '{"question":"Support by Administrative Office","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 36,
    question:
      '{"question":"Teacher’s control and command over the laboratory class?","options":["Excellent","Very Good","Good","Fair","Poor"]}',
    type: "lab",
  },
  {
    id: 37,
    question:
      '{"question":"The percentage use of ICT tools by the teacher, such as LCD projector, Multimedia, etc. while teaching was,","options":["Above 90%","70 to 89%","50 to 69%","30 to 59%","Below 29%"]}',
    type: "theory",
  },
  {
    id: 38,
    question:
      '{"question":"The syllabus content was covered unit by unit in uniform way.","options":["Strongly agree","Agree","Neutral","Disagree","Strongly disagree"]}',
    type: "theory",
  },
  {
    id: 39,
    question:
      '{"question":"The teacher identifies your strengths and encourages you with providing right level of challenges.","options":["Fully","Reasonably","Partially","Slightly","Unable to"]}',
    type: "theory",
  },
  {
    id: 40,
    question:
      '{"question":"The teacher motivates the students to ask questions and clear their doubts?","options":["Strongly agree","Agree","Neutral","Disagree","Strongly disagree"]}',
    type: "theory",
  },
  {
    id: 41,
    question:
      '{"question":"The teacher values the answer scripts, gives the marks of the cycle tests in time and discusses the answers in the classroom?","options":["Strongly agree","Agree","Neutral","Disagree","Strongly disagree"]}',
    type: "theory",
  },
  {
    id: 42,
    question:
      '{"question":"Time given to perform the experiment? (in terms of adequacy)","options":["Excellent","Very Good","Good","Fair","Poor"]}',
    type: "lab",
  },
  {
    id: 43,
    question:
      '{"question":"Washroom facility within the campus (with respect to proximity and cleanliness)","options":["Excellent","Very Good","Good","Satisfactory","Not Satisfactory"]}',
    type: "infra",
  },
  {
    id: 44,
    question:
      '{"question":"Were practical demonstrations and hands-on training given for the relevant topics?","options":["Regularly","Often","Sometimes","Rarely","Never"]}',
    type: "theory",
  },
  {
    id: 45,
    question:
      '{"question":"Working condition of machinery at the time of performance?","options":["Excellent","Very Good","Good","Fair","Poor"]}',
    type: "lab",
  },
];

// Create Table questions & insert questions to it.
const createQuestions = () => {
  // Creates Table
  db.query(
    "CREATE TABLE IF NOT EXISTS `feedback`.`questions` (`id` INT NOT NULL ,`question` VARCHAR(250) PRIMARY KEY NULL,type TEXT);",
    (err, res) => {
      if (!err) {
        // Add Questions to table
        const values = questions
          .map(
            ({ id, type, question }) =>
              `(${id},'${type}','${JSON.stringify(question)}')`
          )
          .join(",");
        const query = `REPLACE INTO questions (id,type, question) VALUES ${values}`;

        db.query(query, (error, results) => {
          if (error) {
            console.log(error.message);
          } else {
            console.log("Questions Inserted :)");
          }
        });
      }
    }
  );
};

createQuestions();
