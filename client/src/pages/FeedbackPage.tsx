import { useEffect, useRef, useState } from "react";
import RadioField from "../components/RadioField";
import Button from "../components/Button";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useUserDetails from "../store/useUserDetails";
import Spinner from "../components/Spinner";

const FeedbackPage = () => {
  const navigate = useNavigate();
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [questions, setQuestion] = useState<
    {
      question: string;
      options: string[];
      option: string | null;
      mark: number;
    }[]
  >([]);
  const [btnLock, setBtnLock] = useState(true);
  const [subject, setSubject] = useState<{ coursecode: string }>();
  const { userDetails } = useUserDetails();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const { type } = useParams<string>();

  const getQuestions = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_ENDPOINT}/getQuestions/${type}`,
    );
    let quesarr: any[] = [];
    for (const value of data) {
      const val = JSON.parse(
        value.question.slice(1, value.question.length - 1),
      );
      quesarr = [
        ...quesarr,
        {
          mark: 0,
          option: null,
          options: val.options,
          question: val.question,
        },
      ];
    }
    setQuestion(quesarr);
  };

  const setOption = (opt: string, index?: number) => {
    if (index) {
      const isAnyNotSelect = questions.some(
        (data, ind) => data.option == null && ind != index - 1,
      );
      {
        !isAnyNotSelect && btnLock && setBtnLock(isAnyNotSelect);
      }
      // const question = [];
      setQuestion((prevState) => {
        return prevState.map((obj, ind) => {
          if (ind === index - 1) {
            const mark = obj.options.length - obj.options.indexOf(opt);
            return { ...obj, option: opt, mark: mark }; // Update only the object feild
          }
          return obj; // Return unchanged object for other indices
        });
      });
    }
  };

  const submitFeedback = async () => {
    if (ref.current) {
      if (!ref.current.value) {
        ref.current.focus();
      } else {
        const marks = questions.map((data) => data.mark);
        const values = JSON.stringify({ answers: marks });
        const { data } = await axios.post(
          `${import.meta.env.VITE_ENDPOINT}/storeanswer`,
          {
            username: userDetails?.username,
            marks: values,
            type: type,
            coursecode: subject?.coursecode,
            comments: ref.current.value,
          },
          { withCredentials: true },
        );
        console.log(data);

        if (data) {
          navigate(-1);
        }
      }
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const subjectString: string | null = searchParams.get("subject");
    if (subjectString) {
      const res: { coursecode: string } = JSON.parse(
        decodeURIComponent(subjectString),
      );
      setSubject(res);
    }
    getQuestions();
  }, []);

  const Frame = ({
    questions,
    index,
    setOption,
  }: {
    questions: { question: string; options: string[]; option: string | null };
    index: number;
    setOption: (opt: string, index?: number | undefined) => void;
  }) => {
    return (
      <div className=" flex h-full  w-full flex-col gap-y-2 border-b border-gray-300 pb-4 ">
        <div className=" flex gap-x-2">
          <p className="font-medium">{index}.</p>
          <p className=" text-justify font-medium">{questions.question}</p>
        </div>
        <div className="ml-7">
          <RadioField
            setOption={setOption}
            index={index}
            array
            option={questions.option}
            options={questions.options}
          />
        </div>
      </div>
    );
  };

  const TextArea = () => {
    return (
      <div className="flex flex-col gap-3 font-semibold">
        <p>
          Suggestion and Comments<span className=" text-red-500"> *</span>
        </p>
        <textarea
          ref={ref}
          className=" h-48 w-full resize-none rounded-md border-2 border-gray-300 p-3 outline-gray-500"
        />
      </div>
    );
  };

  return (
    <div className=" flex min-h-screen w-full flex-col items-center justify-center  ">
      {!loading ? (
        <div className=" flex w-2/3 flex-col gap-y-5 rounded-md  border-black p-10">
          {questions &&
            questions.map((data, index) => {
              return (
                <Frame
                  key={index}
                  questions={data}
                  index={index + 1}
                  setOption={setOption}
                />
              );
            })}
          <TextArea />
          <Button title="Submit" disable={btnLock} onClick={submitFeedback} />
        </div>
      ) : (
        <Spinner size="lg" />
      )}
    </div>
  );
};

export default FeedbackPage;
