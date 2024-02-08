import { useEffect, useState } from "react";
import RadioField from "../components/RadioField";
import Button from "../components/Button";

const FeedbackPage = () => {
  const [questions, setQuestion] = useState<{ question: string; options: string[]; option: string|null; }[]>([]);
  // const [answers, setAnswers] = useState([]);
  const setOption = (opt: string, index?: number) => {
    if (index) {
      setQuestion(prevState => {
        return prevState.map((obj, ind) => {
          if (ind === index-1) {
            return { ...obj, option: opt }; // Update only the age field
          }
          return obj; // Return unchanged object for other indices
        });
      });
    }
    
  }




  useEffect(() => {
    setQuestion(
        [{
          question: "what is name?",
          options: ["asi", "asdf", "adsf", "90%"],
          option:null
        },{
          question: "what is name?",
          options: ["asi", "asdf", "adsf", "90%"],
          option:null,
        }]
      )
    
  },[])
  
  
  const Frame = ({ questions, index, setOption }: { questions: { question: string; options: string[]; option: string|null; }, index: number, setOption: (opt: string,index?: number | undefined) => void }) => {
   
   
    return (
      <div className=" w-full h-full   flex flex-col   ">
        <p className=" font-medium text-justify"><span className=" font-normal">1.</span>{ questions.question}</p>
        <RadioField setOption={setOption} index={index} array option={questions.option} options={questions.options}/>
      </div>
    )
  }

  const TextArea = () => {
    return (
      <div className=" ">
        <p>Give your suggestion<span className=" text-red-700">*</span></p>
        <textarea className=" w-full h-48 border-2 rounded-md p-3 border-gray-600 resize-none"/>
      </div>
    )
  }

  return (
    <div className=" min-h-screen w-full flex flex-col items-center justify-center  ">
      <div className="w-2/3 flex flex-col gap-y-4 my-3 border-2 border-black  rounded-md px-14 py-6">
        {questions && questions.map((data,index) => {
          return (
    
            <Frame key={index} questions={data} index={index+1} setOption={setOption } />
  )
})}
        <TextArea />
        <Button title="submit" disable />
      </div>
     
    </div>
  );
};

export default FeedbackPage;
