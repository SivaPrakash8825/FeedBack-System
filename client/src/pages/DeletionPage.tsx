import { useEffect, useState } from 'react'
import RadioField from '../components/RadioField'
import Button from '../components/Button'
import SelectTextField from '../components/SelectTextField'
import axios from 'axios'
import useToast from '../store/useToast'

type Props = {}

const DeletionPage = (props: Props) => {
    const [option, setOption] = useState("")
    const setToast = useToast((state) => state.setToast);
    const [value, setValue] = useState("Feedbacklogin")
    const [rows, setRows] = useState([]);
    const setOptionFun = (val:string) => {
    setOption(val)
        
    }

    const deleteRecords = async () => {
        const val = confirm("Are you sure to delete?");
        if (val) {
            const { data } = await axios.post(`${import.meta.env.VITE_ENDPOINT}/deleterecords`, {
                data: {
                    option: option,
                    table:value,
                },
                
            })
            if (data) {
                setToast({
                    msg: "deleted successfully",
                    variant:"success",
                })
                getDeletionData();
            }
        }
        
        
    }

    const getDeletionData = async() => {
        const { data } = await axios.get(`${import.meta.env.VITE_ENDPOINT}/getdeletiondata/${value}`);
        setRows(data);
    }

    useEffect(() => {
        getDeletionData();   
    },[])
  return (
      <div className='mx-auto flex min-h-[calc(100vh-6rem)] items-center justify-center gap-0 '>
          <div className='min-h-[80vh] '>
              <SelectTextField list={["Feedbacklogin", "theory", "lab", "infra"]} value={value } setValue={setValue}/>
              <table className=' border-collapse  ' border={3}>
              <tr className=' border'>
                  <th className=' border p-3'>select</th>
                  <th className=' border p-3'>academic year</th>
                  <th className=' border p-3'>department</th>
                  <th className=' border p-3'>semester</th>
                  <th className=' border p-3'>valid from</th>
                  <th className=' border p-3'>valid to</th>
                  <th className=' border p-3'>trash</th>
              </tr>
                  {rows.map((data, index) => {
                      return (
                        <tr className=' text-center' key={index}>
                        <td className=' border p-3'><RadioField options={[`${data.validto}/20${parseInt(data.username.substring(4, 6))}-${parseInt(data.username.substring(4, 6))+1}/${data.dept}/${data.sem}/${data.section}`]} invisible option={option} setOption={setOptionFun}/></td>
                              <td className=' border p-3'>{`20${parseInt(data.username.substring(4, 6))}-${parseInt(data.username.substring(4, 6))+1}` }</td>
                        <td className=' border p-3'>{data.dept}</td>
                        <td className=' border p-3'>{data.sem}</td>
                        <td className=' border p-3'>{data.validfrom}</td>
                        <td className=' border p-3'>{data.validto}</td>
                        <td onClick={deleteRecords} className={` border p-3 ${option==`${data.validto}/20${parseInt(data.username.substring(4, 6))}-${parseInt(data.username.substring(4, 6))+1}/${data.dept}/${data.sem}/${data.section}`?" cursor-pointer":" pointer-events-none opacity-[0.5]"}`} >🗑️</td>
                    </tr>
                  )
              })}
              
          </table></div>
    </div>
  )
}

export default DeletionPage