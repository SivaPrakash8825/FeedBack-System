import { useEffect, useRef, useState } from "react";
import RadioField from "../components/RadioField";
import Button from "../components/Button";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";

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

  const { username, type, coursecode } = useParams<string>();
  console.log(username, type, coursecode);

  const getQuestions = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_ENDPOINT}/getQuestions/${type}`,
    );
    data.length > questions.length
      ? data.forEach((value) => {
          const val = JSON.parse(
            value.question.slice(1, value.question.length - 1),
          );
          setQuestion((pre) => {
            return [
              ...pre,
              {
                mark: 0,
                option: null,
                options: val.options,
                question: val.question,
              },
            ];
          });
        })
      : null;
  };

  const setOption = (opt: string, index?: number) => {
    if (index) {
      const isAnyNotSelect = questions.some(
        (data, ind) => data.option == null && ind != index - 1,
      );
      {
        !isAnyNotSelect && btnLock && setBtnLock(isAnyNotSelect);
      }

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
            username: username,
            marks: values,
            coursecode: coursecode,
            comments: ref.current.value,
            type: type,
          },
          { withCredentials: true },
        );
        console.log(data.msg);

        if (data.msg) {
          navigate(`/feedback/${username}`);
        }
      }
    }
  };

  useEffect(() => {
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
      <div className=" flex h-full   w-full flex-col gap-y-2   ">
        <div className=" flex gap-x-2">
          <p>{index}.</p>
          <p className=" text-justify font-medium">{questions.question}</p>
        </div>
        <div className=" ml-7">
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
      <div className=" ">
        <p>
          Suggestion and Comments<span className=" text-red-700">*</span>
        </p>
        <textarea
          ref={ref}
          className=" h-48 w-full resize-none rounded-md border-2 border-gray-600 p-3"
        />
      </div>
    );
  };

  return (
    <div className=" flex min-h-screen w-full flex-col items-center justify-center  ">
      <div className="my-3 flex w-2/3 flex-col gap-y-8 rounded-md border-2  border-black px-14 py-6">
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
        <Button title="submit" disable={btnLock} onClick={submitFeedback} />
      </div>
    </div>
  );
};

export default FeedbackPage;
