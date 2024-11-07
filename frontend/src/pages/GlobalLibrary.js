import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


function GlobalLibrary() {
    const {cc} = useParams();
    const [contracts, setContracts] = useState([]);
    const [category, setCategory] = useState("TSA1");
    const commonHeadings = [
        "S_No",
        "New_SDRL_Code",
        "Status",
        "Final_Book",
        "Document_Category",
        "Document_Type_Description",
        "Document_Description",
        "LCI_Requirement_Reference",
        "SDRL_Reference",
        "Project_Code",
        "OrIginator_Code",
        "System_Code",
        "Discipline",
        "Document_Type",
        "Sequence_Number",
        "Prefix",
        "Meaningful_title_for_Document",
        "Module_Area_Location",
        "Definition_of_Quantity",
        "Accepted_Format",
        "Level 1-Project",
        "Level 2-Phases in Project",
        "Level 3-Category",
        "Level 4-Area",
        "Level 5-Discipline",
        "Level 6-System",
        "Level 7-SubSystem",
    ];
    const otherHeadings = [
        "Deliverable_Requirement",
        "Submit_with_Bid",
        "Submit_for_Review_Approval",
        "IFI",
        "As_Built",
        "Final_Data_Submission",
        "Document_Chain",
        "DFO",
        "IFS_DMS",
        "IFS_CMMS",
        "AVEVA_NET",
        "Native_Required",
        "Construction",
        "Quality_Assurance",
        "Mechanical_Completion",
        "Commissioning",
        "RLEC_Engg_Predecessor",
        "Priority_Phase"
    ];

    const [documents, setDocuments] = useState([]);
      
    const [dynamicHeadings, setDynamicHeadings] = useState([]);
    const [i, setTableData] = useState([]);

	

    const [error, setError] = useState(null); // State for error handling
    const [loading, setLoading] = useState(true); // Initially set to true
    const [contractCode, setContractCode] = useState(null); // Initially set to true

    const fetchContracts = async () => {
        setLoading(true); // Set loading to true when fetching starts
        setError(null); // Reset error state before fetching
        try {
            const data = await getContracts(cc); // Fetch data
            setContracts(data); // Update categories state
        } catch (err) {
            setError(err.message); // Update error state if there's an error
        } finally {
            setLoading(false); // Set loading to false when done
        }

    }

    const getContracts = async (contractCategory) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/gl/contracts/${contractCategory}`);
            return response.data; // Return the fetched data
        } catch (error) {
            console.error('Error fetching contract categories:', error);
            throw error; // Rethrow the error to handle it in the component
        }
    };
    const getDocuments = async (contractCode) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/gl/documents/${contractCode}`);
            setDocuments(response.data); // Return the fetched data
        } catch (error) {
            console.error('Error fetching contract categories:', error);
            throw error; // Rethrow the error to handle it in the component
        }
    };

    useEffect(() => {
        // Simulating fetching data from an API with a timeout
        fetchContracts();
    }, [cc]);

    function selectContract(contractCode) {
		getDocuments(contractCode);
		setContractCode(contractCode);
    }

    

    return <div className='flex p-2 text-xs'>
     <div class="w-2/5 bg-black rounded mr-3">
        {loading ? (
            <p className='text-white p-5'>Loading...</p>
        ) : (
        <ul class="">
            { contracts.map( item  =>
            <li class="relative">
                <a onClick={() => selectContract(item.contractCode)} href="#" className={`${contractCode == item.contractCode && 'bg-gray-200 text-gray-800'} block text-white hover:bg-gray-200 hover:text-gray-800 cursor-pointer py-2 px-4 transition-colors duration-200`}>{item.name}</a>
                <hr class="absolute bottom-0 w-full border-t-2 border-gray-300 "/>
            </li>
            )}
        
        </ul>
        )}
      </div>
    
      <div class="w-4/5">
        <div class="overflow-x-auto">
          { contractCode && <table class="bg-white border border-gray-300 ">
              <thead class="bg-black text-yellow-500 ">
                    <tr>
                        {commonHeadings.map( heading => <th class="border px-2 py-1 whitespace-nowrap">{heading}</th> )}
                        {otherHeadings.map( heading => <th class="border px-2 py-1 whitespace-nowrap">{contractCode} {heading}</th> )}
                    </tr>
              </thead>
              <tbody>
                    { documents.map (doc => 
                    (<tr>
                    <td className="border px-2 py-1">{doc.S_No}</td>
                    <td className="border px-2 py-1">{doc.New_SDRL_Code}</td>
                    <td className="border px-2 py-1">{doc.Status}</td>
                    <td className="border px-2 py-1">{doc.Final_Book}</td>
                    <td className="border px-2 py-1">{doc.Document_Category}</td>
                    <td className="border px-2 py-1">{doc.Document_Type_Description}</td>
                    <td className="border px-2 py-1">{doc.Document_Description}</td>
                    <td className="border px-2 py-1">{doc.LCI_Requirement_Reference}</td>
                    <td className="border px-2 py-1">{doc.SDRL_Reference}</td>
                    <td className="border px-2 py-1">{doc.Project_Code}</td>
                    <td className="border px-2 py-1">{doc.OrIginator_Code}</td>
                    <td className="border px-2 py-1">{doc.System_Code}</td>
                    <td className="border px-2 py-1">{doc.Discipline}</td>
                    <td className="border px-2 py-1">{doc.Document_Type}</td>
                    <td className="border px-2 py-1">{doc.Sequence_Number}</td>
                    <td className="border px-2 py-1">{doc.Prefix}</td>
                    <td className="border px-2 py-1">{doc.Meaningful_title_for_Document}</td>
                    <td className="border px-2 py-1">{doc.Module_Area_Location}</td>
                    <td className="border px-2 py-1">{doc.Definition_of_Quantity}</td>
                    <td className="border px-2 py-1">{doc.Accepted_Format}</td>
                    <td className="border px-2 py-1">{doc["Level 1-Project"]}</td>
                    <td className="border px-2 py-1">{doc["Level 2-Phases in Project"]}</td>
                    <td className="border px-2 py-1">{doc["Level 3-Category"]}</td>
                    <td className="border px-2 py-1">{doc["Level 4-Area"]}</td>
                    <td className="border px-2 py-1">{doc["Level 5-Discipline"]}</td>
                    <td className="border px-2 py-1">{doc["Level 6-System"]}</td>
                    <td className="border px-2 py-1">{doc["Level 7-SubSystem"]}</td>
                    <td className="border px-2 py-1">{doc.Deliverable_Requirement}</td>
                    <td className="border px-2 py-1">{doc.Submit_with_Bid}</td>
                    <td className="border px-2 py-1">{doc.Submit_for_Review_Approval}</td>
                    <td className="border px-2 py-1">{doc.IFI}</td>
                    <td className="border px-2 py-1">{doc.As_Built}</td>
                    <td className="border px-2 py-1">{doc.Final_Data_Submission}</td>
                    <td className="border px-2 py-1">{doc.Document_Chain}</td>
                    <td className="border px-2 py-1">{doc.DFO}</td>
                    <td className="border px-2 py-1">{doc.IFS_DMS}</td>
                    <td className="border px-2 py-1">{doc.IFS_CMMS}</td>
                    <td className="border px-2 py-1">{doc.AVEVA_NET}</td>
                    <td className="border px-2 py-1">{doc.Native_Required}</td>
                    <td className="border px-2 py-1">{doc.Construction}</td>
                    <td className="border px-2 py-1">{doc.Quality_Assurance}</td>
                    <td className="border px-2 py-1">{doc.Mechanical_Completion}</td>
                    <td className="border px-2 py-1">{doc.Commissioning}</td>
                    <td className="border px-2 py-1">{doc.RLEC_Engg_Predecessor}</td>
                    <td className="border px-2 py-1">{doc.Priority_Phase}</td>
                    </tr>)
                    )}
              </tbody>
          </table>}
        </div>
      </div>
    </div>
}

export default GlobalLibrary;
