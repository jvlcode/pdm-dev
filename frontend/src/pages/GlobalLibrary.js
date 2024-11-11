import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function GlobalLibrary() {
    const { cc } = useParams();
    const [contracts, setContracts] = useState([]);
    const [docs, setDocs] = useState([]);
    const [contractCode, setContractCode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(null); // Track the cell being edited
    const [editedValue, setEditedValue] = useState(""); // Store edited value

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10); // Default page size

    const commonHeadings = [
        "S_No", "New_SDRL_Code", "Status", "Final_Book", "Document_Category",
        "Document_Type_Description", "Document_Description", "LCI_Requirement_Reference",
        "SDRL_Reference", "Project_Code", "OrIginator_Code", "System_Code", "Discipline",
        "Document_Type", "Sequence_Number", "Prefix", "Meaningful_title_for_Document",
        "Module_Area_Location", "Definition_of_Quantity", "Accepted_Format", "Level 1-Project",
        "Level 2-Phases in Project", "Level 3-Category", "Level 4-Area", "Level 5-Discipline",
        "Level 6-System", "Level 7-SubSystem"
    ];
    
    const otherHeadings = [
        "Deliverable_Requirement", "Submit_with_Bid", "Submit_for_Review_Approval", "IFI", "As_Built",
        "Final_Data_Submission", "Document_Chain", "DFO", "IFS_DMS", "IFS_CMMS", "AVEVA_NET", "Native_Required",
        "Construction", "Quality_Assurance", "Mechanical_Completion", "Commissioning", "RLEC_Engg_Predecessor", "Priority_Phase"
    ];

    const fetchContracts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getContracts(cc);
            setContracts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getContracts = async (contractCategory) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/gl/contracts/${contractCategory}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching contracts:', error);
            throw error;
        }
    };

    const getDocs = async (contractCode, page = 1, pageSize = 10) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/gl/docs/${contractCode}`, {
                params: {
                    page,
                    pageSize
                }
            });
            setDocs(response.data.docs);
            setTotalPages(response.data.totalPages); // Set total pages from the response
        } catch (error) {
            console.error('Error fetching documents:', error);
            throw error;
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        getDocs(contractCode, page, pageSize);
    };

    useEffect(() => {
        // Fetch contracts when the component loads
        setDocs([])
        fetchContracts();
        const savedContractCode = localStorage.getItem("selectedContractCode");
        if (savedContractCode) {
            setContractCode(savedContractCode); // Set saved contract code to state
        } else if (cc) {
            setContractCode(null); // If there's a URL param (cc), set it
        }
    }, [cc]);

    useEffect(() => {
        // On contractCode change or initial load, fetch documents
        if (contractCode) {
            setCurrentPage(1);
            getDocs(contractCode, 1, pageSize);
        }
    }, [contractCode, pageSize]);

    // Select contract and store in localStorage
    function selectContract(contractCode) {
        setContractCode(contractCode);
        localStorage.setItem("selectedContractCode", contractCode); // Save contract code to localStorage
    }

    // Load selected contract code from localStorage


    // Handle editing a cell
    const handleCellEdit = (docIndex, field) => {
        setEditing({ docIndex, field });
        setEditedValue(docs[docIndex][field]);
    };

    // Handle the change of value in the input field
    const handleChange = (e) => {
        setEditedValue(e.target.value);
    };

    // Save the edited value by updating the backend and docs
    const handleSave = async (collectionName) => {
        if (!editing) return;

        const updatedDocs = [...docs];
        updatedDocs[editing.docIndex][editing.field] = editedValue;
        if (!editedValue) {
            return;
        }
        try {
            await updateDocument(docs[editing.docIndex].New_SDRL_Code, { fieldName: editing.field, newValue: editedValue }, collectionName);
            setDocs(updatedDocs); // Update local state
            setEditing(null); // Stop editing
        } catch (error) {
            setError("Failed to update the document.");
            console.error(error);
        }
    };

    // Function to update the document in the backend
    const updateDocument = async (sdrlCode, updatedFields, collectionName) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/gl/docs/${collectionName}/${sdrlCode}`, updatedFields);
        } catch (error) {
            console.error("Error updating document:", error);
            throw error;
        }
    };

    return (
        <div className="flex p-2 text-xs">
            <div className="w-2/5 bg-black rounded mr-3">
                {loading ? (
                    <p className="text-white p-5">Loading...</p>
                ) : (
                    <ul>
                        {contracts.map((item) => (
                            <li key={item.contractCode} className="relative">
                                <a
                                    onClick={() => selectContract(item.contractCode)}
                                    href="#"
                                    className={`${contractCode === item.contractCode ? 'bg-gray-200 text-gray-800' : 'text-white'} block hover:bg-gray-200 hover:text-gray-800 cursor-pointer py-2 px-4 transition-colors duration-200`}
                                >
                                    {item.name}
                                </a>
                                <hr className="absolute bottom-0 w-full border-t-2 border-gray-300" />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="w-4/5">
                <div className="overflow-x-auto">
                    {contractCode && (
                        <div>
                            <table className="bg-white border border-gray-300">
                                <thead className="bg-black text-yellow-500">
                                    <tr>
                                        {commonHeadings.map((heading) => (
                                            <th key={heading} className="border px-2 py-1 whitespace-nowrap">{heading}</th>
                                        ))}
                                        {otherHeadings.map((heading) => (
                                            <th key={heading} className="border px-2 py-1 whitespace-nowrap">{contractCode} {heading}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {docs.map((doc, index) => (
                                        <tr key={index}>
                                            {commonHeadings.map((heading, idx) => (
                                                <td
                                                    key={idx}
                                                    className="border px-2 py-1"
                                                    onClick={() => handleCellEdit(index, heading)}
                                                >
                                                    {editing?.docIndex === index && editing.field === heading ? (
                                                        <input
                                                            type="text"
                                                            value={editedValue}
                                                            onChange={handleChange}
                                                            onBlur={() => handleSave('contentData')} // Save on blur
                                                            onKeyDown={(e) => { if (e.key === 'Enter') handleSave('contentData'); }} // Save on Enter
                                                            autoFocus
                                                            className="border p-1"
                                                        />
                                                    ) : (
                                                        doc[heading]
                                                    )}
                                                </td>
                                            ))}
                                            {otherHeadings.map((heading, idx) => (
                                                <td
                                                    key={idx}
                                                    className="border px-2 py-1"
                                                    onClick={() => handleCellEdit(index, heading)}
                                                >
                                                    {editing?.docIndex === index && editing.field === heading ? (
                                                        <input
                                                            type="text"
                                                            value={editedValue}
                                                            onChange={handleChange}
                                                            onBlur={() => handleSave(contractCode)}
                                                            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(contractCode); }}
                                                            autoFocus
                                                            className="border p-1"
                                                        />
                                                    ) : (
                                                        doc[heading]
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {contractCode && <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-indigo-500 text-white py-1 px-4 rounded"
                    >
                        Previous
                    </button>
                    <span className='text-white'>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="bg-indigo-500 text-white py-1 px-4 rounded"
                    >
                        Next
                    </button>
                </div>}
            </div>
        </div>
    );
}

export default GlobalLibrary;
