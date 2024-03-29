import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { SubjectsByType, SubjectsWithName, UserDetails } from "../../types";
import Spinner from "../components/Spinner";
import useUserDetails from "../store/useUserDetails";

const FeedbackHomePage = ({goTopView}:{goTopView:()=>void}) => {
  const { username: userName } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { setUserDetails, userDetails } = useUserDetails();
  const location = useLocation();
  const [courses, setCourses] = useState<SubjectsWithName[]>([]);

  const convertData = (coursesData: UserDetails) => {
    // console.log(coursesData);

    const subjectsByType: SubjectsByType = {};

    for (let i = 0; i < coursesData?.courses.length; i++) {
      const subject = coursesData?.courses[i];

      const type = subject?.["Theory/Lab"]?.toLowerCase().trim();

      if (!subjectsByType[type as string]) {
        subjectsByType[type as string] = { name: type, subjects: [] };
      }

      subjectsByType[type as string].subjects.push(subject);
    }

    const result = Object.values(subjectsByType);
    console.log(result);

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
      const searchParams = new URLSearchParams(location.search);
      const stdType: string | null = searchParams.get("stdtype");
      if (stdType) {
        const res: { stdtype: string } = JSON.parse(
          decodeURIComponent(stdType),
        );
        coursesData["stdType"] = res.stdtype == "hosteller" ? "H" : "D";
      }
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
      goTopView()
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
                  className="border-primary/80 w-full overflow-hidden rounded-md border-2 "
                >
                  {/* head */}
                  <div className="bg-primary p-3 py-2 text-lg font-semibold capitalize text-white">
                    <h1 className="">{course.name}</h1>
                  </div>

                  {/*  */}
                  <div className="flex flex-col ">
                    {course.subjects.map((subject, ii) => {
                      return (
                        <NavLink
                          key={ii}
                          className={
                            "cursor-pointer p-5 transition-all hover:bg-gray-100"
                          }
                          to={`/feedback/${userName}/${subject["Theory/Lab"]}?subject=${encodeURIComponent(JSON.stringify({ coursecode: subject["Sub Code"], subgrouping: subject["Sub Grouping"] }))}`}
                        >
                          <div className="flex gap-3">
                            <h1 className="text-lg   font-semibold">
                              {subject["Sub Code"]}
                              {" - "}
                              {subject["Sub Name"]}{" "}
                            </h1>
                            {subject[
                              "Open Elective/Regular/Core Elective"
                            ]?.toLowerCase() != "reg" &&
                              subject[
                                "Open Elective/Regular/Core Elective"
                              ]?.trim() != "" && (
                                <h1 className="my-auto h-fit  rounded-full border-[2px] border-black bg-black  px-1.5 py-0.5 text-[0.65rem] font-bold uppercase leading-3 text-white">
                                  {
                                    subject[
                                      "Open Elective/Regular/Core Elective"
                                    ]
                                  }
                                </h1>
                              )}
                          </div>
                          <h1 className="text-sm font-medium">
                            {subject["Staff"]}
                          </h1>
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
