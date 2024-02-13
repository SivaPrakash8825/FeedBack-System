import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { SubjectsByType, SubjectsWithName, UserDetails } from "../../types";
import Spinner from "../components/Spinner";
import useUserDetails from "../store/useUserDetails";

const FeedbackHomePage = () => {
  const { username: userName } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { setUserDetails, userDetails } = useUserDetails();
  const [courses, setCourses] = useState<SubjectsWithName[]>([]);

  const convertData = (coursesData: UserDetails) => {
    const subjectsByType: SubjectsByType = {};

    for (let i = 0; i < coursesData?.courses.length; i++) {
      const subject = coursesData?.courses[i];

      const type = subject?.["Theory/Lab"];

      if (!subjectsByType[type]) {
        subjectsByType[type] = { name: type, subjects: [] };
      }

      subjectsByType[type].subjects.push(subject);
    }

    const result = Object.values(subjectsByType);
    // console.log(result);

    setCourses(result);
    setIsLoading(false);
  };

  const getCourses = async () => {
    try {
      setIsLoading(true);
      const { data: coursesData } = await axios.post<UserDetails>(
        `${import.meta.env.VITE_ENDPOINT}/getCourses`,
        {
          username: userName,
        },
      );
      console.log(coursesData);
      setUserDetails(
        typeof coursesData === "string"
          ? ({ username: userName } as UserDetails)
          : coursesData,
      );
      convertData(coursesData);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, [userName]);

  return (
    <div className="mt-5 flex items-center justify-center p-5">
      {isLoading ? (
        <div>
          <Spinner size="lg" type="primary" />
        </div>
      ) : (
        <div className="flex w-10/12 flex-col  items-center  justify-center gap-7 md:w-1/2">
          {courses.length > 0 ? (
            courses.map((course, i) => {
              return (
                // Box
                <div
                  key={i}
                  className="w-full overflow-hidden rounded-md border-2 border-black"
                >
                  {/* head */}
                  <div className="bg-black p-2 px-3 font-semibold text-white">
                    <h1>{course.name}</h1>
                  </div>

                  {/*  */}
                  <div className="flex flex-col gap-3 p-3 font-medium text-black">
                    {course.subjects.map((subject, ii) => {
                      return (
                        <NavLink
                          key={ii}
                          className={
                            "hover:underline hover:underline-offset-[1px]"
                          }
                          to={`/feedback/${userName}/${subject["Theory/Lab"]}?subject=${encodeURIComponent(JSON.stringify({ coursecode: subject["Sub Code"] }))}`}
                        >
                          {subject["Sub Code"]} {subject["Sub Name"]} -{" "}
                          {subject["Staff"]}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-lg  bg-emerald-500 p-3 text-2xl font-semibold text-white">
              All feedback submissions have been completed.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackHomePage;
