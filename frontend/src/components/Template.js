import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useForm } from 'react-hook-form';
import FormElement from './FormElement';
import { fetchTemplates, addTemplate, updateTemplate, deleteTemplate, updateDataTable} from '../utils/template';
import SuccessMessage from './SuccessMessage';


const Template = ({ formFields, dataTableColumns, collection, name }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [success, setSuccess] = useState('');
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [edit, setEdit] = useState(null);


    const customStyles = {
        rows: {
            style: {
                backgroundColor: '#131023', // override the row height
                color: "white",
                borderTop: "1px solid white"
            }
        },
        headCells: {
            style: {
                backgroundColor: "#0d0b18",
                color: "white"
            }
        },
        pagination: {
            style: {
                backgroundColor: "#0d0b18",
                color: "white"
            },
            pageButtonsStyle: {
                backgroundColor: "white"
            
            }
        }
    };

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchData();
      }, [collection]);

    useEffect(() => {
        
    },[edit])

    const fetchData = async () => {
        try {
          const data = await fetchTemplates(collection);
          setData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };

    const showMessage = (text) => {
        setSuccess(text);
        setTimeout(() => setSuccess(""), 5000);
    };

    const toggleForm = () => {
        setShowForm((state) => !state);
    };

    const onSubmit = async (formData) => {
        const body = {
            collection,
            data: { ...formData }
        };

        try {
            let result;
            if (!edit) {
                result = await addTemplate(body);
            } else {
                result = await updateTemplate(edit._id, body);
                if(result.error) {
                    showMessage(result.error);
                    return
                }
            }
            const doc = result;
            updateDataTable(doc, data, setData);
            reset();
            closeForm();
            showMessage("Data Updated!");
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteRow = (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            deleteTemplate(id, collection).then(() => {
                setData(data.filter((el) => el._id !== id));
                showMessage("Data Deleted!");
            }).catch(error => {
                console.error('Error deleting data:', error);
            });
        }
    };

    const editRow = (row) => {
        setEdit(row);
        setShowForm(true)
    };

    const closeForm = () => {
        reset();
        setEdit(null)
        setShowForm(false)
    }

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    function dataField(obj, field) {
        // if( path.includes('.') ) {
        //     function getPropertyByPath(obj, path) {
        //         return path.split('.').reduce((acc, key) => acc[key], obj);
        //     }
        //     return getPropertyByPath(obj,path)
        // }

        if(field.ref) {
            const { ref} = field;
             // if( path.includes('.') ) {
            function getPropertyByPath(obj, ref) {
                return ref.split('.').reduce((acc, key) => acc[key], obj);
            }
            return getPropertyByPath(obj,ref)
            // return obj[field.ref];
        }
        return obj[field['name']];
    }
    const getErrorMessage = (fieldPath) => {
        const pathArray = fieldPath.split('.'); // Split the path into an array
        let error = errors;
        for (let path of pathArray) {
            error = error[path]; // Traverse nested errors object
            if (!error) return ''; // Return empty string if error not found
        }
        return error.message ? error : ''; // Return error message if present
    };
    return (
        <>
            <div className='flex justify-between mt-5 mx-5'>
                <div>
                    <span className='main-heading'>{name}</span>
                </div>
                {!showForm ?
                    <button onClick={toggleForm} className='form-button'>Add {name}</button> :
                    <button onClick={closeForm} className='form-button bg-yellow-500 hover:bg-red-800'>Close</button>
                }
            </div>
            {success &&  <SuccessMessage message={success}/>}
            {/* <SuccessMessage message={"TEST"}/> */}
            {showForm ? (
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className="m-2 bg-[#0d0b18] shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className={formFields.length > 5 ? 'grid grid-cols-3 gap-4':''}>

                            {formFields.map((field, index) => (
                                <div key={index} className="mb-4">
                                    <FormElement
                                        field={field}
                                        label={field.label}
                                        placeholder={field.placeholder}
                                        defaultValue={edit && dataField(edit, field)}
                                        register={register(field.name, { required: field.validation?.required })}
                                        error={getErrorMessage(field.name)}
                                        options={field.options}
                                        type={field.type}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="form-button" type="submit">{edit ? `Save` : `Submit`}</button>
                        </div>
                    </form>
                </div>
            ) : 
            <DataTable
                columns={[
                    {
                        name: 'S.no',
                        selector: (row, index) => (currentPage - 1) * 5 + index + 1,
                        width: '70px'
                    },
                    ...dataTableColumns,
                    {
                        name: "Action",
                        cell: (row) => (
                            <div className='flex gap-1'>
                                <button onClick={() =>editRow(row) } className='table-button'>Edit</button>
                                <button onClick={() =>deleteRow(row._id)} className='table-button'>Delete</button>
                            </div>
                        )
                    }
                ]}
                data={data}
                pagination
                paginationPerPage={10}
                onChangePage={handlePageChange}
                customStyles={customStyles}
            />}
        </>
    );
};

export default Template;
