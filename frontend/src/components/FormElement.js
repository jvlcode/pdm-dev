import { useEffect, useState } from "react";
import { fetchOptions } from "../utils/template";

export default function FormElement(props) {
    return  <>
            <label className="block text-white text-sm  mb-2" htmlFor={props.label}>
				{props.label} 
			</label>
            <Element {...props}/>
            {props.error && <span className="text-red-500 text-xs italic">{props.error.message}</span>}
      </> 
}

function Element(props){
    const defaultValue = props.defaultValue;
    const errorClass = `shadow appearance-none border ${props.error ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`;
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (props.options) {
            const {collection, name, value} = props.options;
            fetchOptions(collection, name, value)
            .then((result) => {
                setOptions(result)
            })
        }
    }, [])
    
    if (props.type == 'textarea') {
        return <textarea 
            className={errorClass}
            placeholder={props.placeholder}
            {...props.register}
            defaultValue={defaultValue}
        />
    }
    else if (props.type == 'select') {
        return options.length > 0  ? <select 
            className={errorClass}
            placeholder={props.placeholder}
            {...props.register}
            defaultValue={defaultValue}
        >
            <option value="">Select</option>
            {options.map((obj,i) => <option value={obj.id}>{obj.name}</option>)}
        </select> : <label>Loading...</label>
    } else if (props.type === 'checkbox') {
        return <>
        <input 
            type="checkbox"
            
            {...props.register}
            defaultChecked={defaultValue}
        /></>
    }else  {
        return <input 
        className={errorClass}
        placeholder={props.placeholder}
            {...props.register}
            defaultValue={defaultValue}
        />
    }
}
function Textarea(){
    
}