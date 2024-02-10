import { useEffect, useRef, useState } from "react";
import RadioField from "../components/RadioField";
import Button from "../components/Button";
import axios from "axios";
import { useParams } from 'react-router-dom'
import { Navigate } from "react-router-dom";

const FeedbackPage = () => {
  const ref=useRef< HTMLTextAreaElement | null >(null);
  const [questions, setQuestion] = useState<{ question: string; options: string[]; option: string | null; mark: number }[]>([]);
  const [btnLock, setBtnLock] = useState(true);
 
  const { type } = useParams<string>();

  const getQuestions = async () => { 
    const { data } = await axios.get(`${import.meta.env.VITE_ENDPOINT}/getQuestions/${type}`);
    data.length > questions.length ? (data.forEach((value) => {
    
      const val = JSON.parse(value.question.slice(1, value.question.length - 1));
      setQuestion((pre) => {
        return (
          [
            ...pre,
            {
              mark:0,
              option: null,
              options: val.options,
              question: val.question
            }
          ]
        )
      })
    })) : null;
  }

  const setOption = (opt: string, index?: number) => {
    
    if (index) {
      const isAnyNotSelect = questions.some((data, ind) => data.option == null && ind != index - 1)
      {!isAnyNotSelect && btnLock && setBtnLock(isAnyNotSelect)}
      
      setQuestion(prevState => {
        return prevState.map((obj, ind) => {
          if (ind === index - 1) {
            // setAnswer((pre) => {
            //   pre[ind] = mark;
              
            //   return pre;
            // })
            const mark = obj.options.length - obj.options.indexOf(opt);
            return { ...obj, option: opt, mark: mark }; // Update only the object feild
          }  
          return obj; // Return unchanged object for other indices
        });
      });
    }
    // console.log(flag);
    
    // !flag?setBtnLock(true):null
  }
  
  

  const submitFeedback = async() => {
    if (ref.current) {
      if (!ref.current.value) {
        ref.current.focus();
      }
      else {
        const marks = questions.map(data => data.mark)
        const values=JSON.stringify({answers:marks});
        const { data } = await axios.post(`${import.meta.env.VITE_ENDPOINT}/storeanswer`, {
          username:"CS2222U200",
          marks: values,
          coursecode: "VAI223",
          comments:ref.current.value
        },{withCredentials:true})
        console.log(data.msg);
        
        if (data.msg) {
          alert("afd");
           <Navigate to={"/feedback"}/>
        }
      }
    }

    
    
  }

  useEffect(() => {

    getQuestions();    
  },[])
  
  
  const Frame = ({ questions, index, setOption }: { questions: { question: string; options: string[]; option: string|null; }, index: number, setOption: (opt: string,index?: number | undefined) => void }) => {
   
   
    return (
      <div className=" w-full h-full   flex flex-col gap-y-2   ">
        <div className=" flex gap-x-2">
          <p>{index}.</p>
          <p className=" font-medium text-justify">{questions.question}</p>
        </div>
        <div className=" ml-7"><RadioField setOption={setOption} index={index} array option={questions.option} options={questions.options}/></div>
      </div>
    )
  }

  const TextArea = () => {
    return (
      <div className=" ">
        <p>Suggestion and Comments<span className=" text-red-700">*</span></p>
        <textarea ref={ref} className=" w-full h-48 border-2 rounded-md p-3 border-gray-600 resize-none"/>
      </div>
    )
  }

  return (
    <div className=" min-h-screen w-full flex flex-col items-center justify-center  ">
      <div className="w-2/3 flex flex-col gap-y-8 my-3 border-2 border-black  rounded-md px-14 py-6">
        {questions && questions.map((data,index) => {
          return (
    
            <Frame key={index} questions={data} index={index+1} setOption={setOption } />
  )
})}
        <TextArea />
        <Button title="submit" disable={btnLock} onClick={submitFeedback} />
      </div>
     
    </div>
  );
};

export default FeedbackPage;
