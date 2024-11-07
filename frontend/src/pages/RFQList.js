import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import RFQForm from './RFQForm'; // Adjust the path as needed
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { enGB } from 'date-fns/locale'; // Import the locale if needed


const RFQList = () => {
  const [rfqs, setRfqs] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [newValue, setNewValue] = useState('');
  const [originalValue, setOriginalValue] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showVendors, setShowVendors] = useState(false);
  const [currentRFQ, setCurrentRFQ] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [messageTimeout, setMessageTimeout] = useState(null);
  const [columns, setColumns] = useState({
    drfqNo: false,
    category: true,
    description: true,
    entity: true,
    ypDocumentNumber: true,
    packageManager: true,
    packageEngineer: true,
    packageBuyer: true,
    eca: true,
    draft: true,
    issued: true,
    signed: true,
    company: true,
    contact: true,
    selectedVendor: true,
    level: true,
    rfqPlanned: true,
    rfqForecast: true,
    rfqActual: true,
    bidDays: true,
    bidPlanned: true,
    bidForecast: true,
    bidReceivedActual: true,
    tbeDays: true,
    tbePlanned: true,
    tbeForecast: true,
    tbeActual: true,
    cbeDays: true,
    cbePlanned: true,
    cbeForecast: true,
    cbeActual: true,
    poDays: true,
    poPlanned: true,
    poForecast: true,
    poActual: true,
    poType: true,
    poNo: true,
    estLeadTimeMonths: true,
    estLeadTimeDays: true,
    deliveryTerms: true,
    exwDate: true,
    readyToShipLeadDays: true,
    estReadyToShip: true,
    estTransitTimeDays: true,
    phase: true,
    customsClearance: true,
    etaPlanned: true,
    etaForecast: true,
    etaActual: true,
    siteLocation: true,
    ros: true,
    variance: true,
    location: true,
    cutOff: true,
    remarks: true,
    vendors: true // Assuming you also want to toggle visibility for vendors field
  });
  
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedRFQs, setSelectedRFQs] = useState(new Set());
  const [expandedRFQs, setExpandedRFQs] = useState(new Set()); // Added state for expanded RFQs

  const isDateColumn = (field) => {
    const dateColumns = [
      'draft', 'issued',
      'rfqPlanned', 'rfqForecast', 'rfqActual', 'bidPlanned', 'bidForecast', 'bidReceivedActual',
      'tbePlanned', 'tbeForecast', 'tbeActual', 'cbePlanned', 'cbeForecast', 'cbeActual', 'poPlanned',
      'poForecast', 'poActual', 'exwDate', 'estReadyToShip', 'etaPlanned', 'etaForecast', 'etaActual'
    ];
    return dateColumns.includes(field);
  };

  const filterPanelRef = useRef(null);

  useEffect(() => {
    const savedColumns = JSON.parse(localStorage.getItem('rfqColumns'));
    if (savedColumns) {
      setColumns(savedColumns);
    }
    fetchRFQs(currentPage);

    const handleClickOutside = (event) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target)) {
        setFilterPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (messageTimeout) {
        clearTimeout(messageTimeout);
      }
    };
  }, [currentPage, messageTimeout]);

  useEffect(() => {
    localStorage.setItem('rfqColumns', JSON.stringify(columns));
  }, [columns]);

  const fetchRFQs = (page) => {
    axios.get(`http://localhost:8000/api/v1/rfqs?page=${page}&limit=10`)
      .then(response => {
        setRfqs(response.data.rfqs);
        setTotalPages(response.data.pages);
      })
      .catch(error => console.error('Error fetching RFQs:', error));
  };

  const handleEditClick = (field, rfqId, currentValue) => {
    setEditingCell({ field, rfqId });
    setNewValue(currentValue);
    setOriginalValue(currentValue);
  };

  const handleChange = (value, type) => {
    if (type === 'date') {
      // Convert the Date object to a string in ISO format
      setNewValue(value ? value.toISOString().split('T')[0] : ''); // Format as YYYY-MM-DD
    } else {
      // For text input, just set the string value
      setNewValue(value);
    }
  };

  const handleSave = (rfqId) => {
    if (newValue !== originalValue) {
      const updatedData = { [editingCell.field]: newValue };

      axios.put(`http://localhost:8000/api/v1/rfqs/${rfqId}`, updatedData)
        .then(() => {
          fetchRFQs(currentPage);
          setEditingCell(null);
          setNewValue('');
          setOriginalValue('');
          setSuccess('RFQ updated successfully!');
          if (messageTimeout) clearTimeout(messageTimeout);
          setMessageTimeout(setTimeout(() => setSuccess(''), 5000));
        })
        .catch(error => {
          setError('Error saving RFQ');
          if (messageTimeout) clearTimeout(messageTimeout);
          setMessageTimeout(setTimeout(() => setError(''), 5000));
          console.error('Error saving RFQ:', error);
        });
    } else {
      setEditingCell(null);
      setNewValue('');
      setOriginalValue('');
    }
  };

  const handleBlur = () => {
    if (editingCell) {
      handleSave(editingCell.rfqId);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave(editingCell.rfqId);
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/v1/rfqs/${id}`)
      .then(() => {
        fetchRFQs(currentPage);
        setSuccess('RFQ deleted successfully!');
        if (messageTimeout) clearTimeout(messageTimeout);
        setMessageTimeout(setTimeout(() => setSuccess(''), 5000));
      })
      .catch(error => {
        setError('Error deleting RFQ');
        if (messageTimeout) clearTimeout(messageTimeout);
        setMessageTimeout(setTimeout(() => setError(''), 5000));
        console.error('Error deleting RFQ:', error);
      });
  };

  const handleShowForm = () => {
    setCurrentRFQ(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setCurrentRFQ(null);
    setShowForm(false);
  };

  const handleShowVendorForm = () => {
    if (selectedRFQs.size === 1) {
      setShowVendorForm(true);
    }
  };

  const handleVendorFormClose = () => {
    setShowVendorForm(false);
  };

  const handleSuccess = () => {
    fetchRFQs(currentPage);
  };

  const toggleColumn = (column) => {
    setColumns(prevState => ({
      ...prevState,
      [column]: !prevState[column]
    }));
  };

  const handleFilterToggle = () => {
    setFilterPanelOpen(prevState => !prevState);
  };

  const handleCheckboxChange = (column) => {
    setColumns(prevState => ({
      ...prevState,
      [column]: !prevState[column]
    }));
  };

  const handleSelectRFQ = (rfqId) => {
    setSelectedRFQs(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(rfqId)) {
        newSelection.delete(rfqId);
      } else {
        newSelection.add(rfqId);
      }
      console.log("Updated selection:", Array.from(newSelection)); // Debugging statement
      return newSelection;
    });
  };
  
  const handleSelectAll = () => {
    if (selectedRFQs.size === rfqs.length) {
      setSelectedRFQs(new Set());
    } else {
      setSelectedRFQs(new Set(rfqs.map(rfq => rfq._id)));
    }
  };

  const handleBulkDelete = () => {
    const deletePromises = Array.from(selectedRFQs).map(id => axios.delete(`http://localhost:8000/api/v1/rfqs/${id}`));
    Promise.all(deletePromises)
      .then(() => {
        fetchRFQs(currentPage);
        setSuccess('Selected RFQs deleted successfully!');
        if (messageTimeout) clearTimeout(messageTimeout);
        setMessageTimeout(setTimeout(() => setSuccess(''), 5000));
        setSelectedRFQs(new Set());
      })
      .catch(error => {
        setError('Error deleting selected RFQs');
        if (messageTimeout) clearTimeout(messageTimeout);
        setMessageTimeout(setTimeout(() => setError(''), 5000));
        console.error('Error deleting selected RFQs:', error);
      });
  };

  const VendorForm = () => {
    const [vendorData, setVendorData] = useState({
      company: '',
      contact: ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setVendorData(prevData => ({
        ...prevData,
        [name]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      // Only send the payload if there's exactly one RFQ selected
      if (selectedRFQs.size === 1) {
        const [rfqId] = selectedRFQs;

        axios.post('http://localhost:8000/api/v1/rfqs/addVendor', {
          rfqId,
          ...vendorData
        })
          .then(() => {
            handleVendorFormClose();
            setVendorData({
              company: '',
              contact: ''
            });
            fetchRFQs(currentPage);
            setSuccess('Vendor added successfully!');
            if (messageTimeout) clearTimeout(messageTimeout);
            setMessageTimeout(setTimeout(() => setSuccess(''), 5000));
          })
          .catch(error => {
            setError('Error adding vendor');
            if (messageTimeout) clearTimeout(messageTimeout);
            setMessageTimeout(setTimeout(() => setError(''), 5000));
            console.error('Error adding vendor:', error);
          });
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center text-black">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-semibold mb-4">Add Vendor</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={vendorData.company}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={vendorData.contact}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={selectedRFQs.size !== 1} // Disable if not exactly one RFQ is selected
                className={`bg-blue-500 text-white p-2 rounded ${selectedRFQs.size !== 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Add
              </button>
              <button
                type="button"
                onClick={handleVendorFormClose}
                className="bg-gray-500 text-white p-2 rounded ml-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const FilterPanel = () => {
    return (
      <div
        ref={filterPanelRef}
        className={`absolute top-16 left-0 bg-white border border-gray-200 shadow-lg p-4 z-10 max-w-screen-sm ${filterPanelOpen ? 'block' : 'hidden'}`}
      >
        <h3 className="text-lg font-semibold mb-2 text-black">Filter Columns</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Object.keys(columns).map(column => (
            <div key={column} className="flex items-center">
              <input
                type="checkbox"
                checked={columns[column]}
                onChange={() => handleCheckboxChange(column)}
                id={column}
                className="mr-2"
              />
              <label htmlFor={column} className="text-sm text-black">{column}</label>
            </div>
          ))}
        </div>
        <button
          onClick={() => setFilterPanelOpen(false)}
          className="mt-4 bg-red-500 text-white p-2 rounded"
        >
          Close
        </button>
      </div>
    );
  };

  const DataTable = () => {
    const handleExpandToggle = (rfqId) => {
      setExpandedRFQs(prev => {
        const newSet = new Set(prev);
        if (newSet.has(rfqId)) {
          newSet.delete(rfqId);
        } else {
          newSet.add(rfqId);
        }
        return newSet;
      });
    };


    const formatDate = (dateString) => {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return the original string if not a valid date
      }
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    
    const TableData = ({rfq, vendor }) => {
      const handleTextChange = (e) => {
        handleChange(e.target.value, 'text');
      };
    
      const handleDateChange = (date) => {
        handleChange(date, 'date');
      };
      return   <tr className={`${vendor ? 'bg-gray-300':''} border-b border-gray-500`}>
      <td className={`p-2  text-center w-full`}>
        <input
          type="checkbox"
          checked={selectedRFQs.has(rfq._id)}
          onChange={() => handleSelectRFQ(rfq._id)}
        />
      </td>
      {Object.keys(columns).map(column => (
        columns[column] && (
          <td key={column} className="p-2 text-black text-center whitespace-nowrap">
            {editingCell && editingCell.rfqId === rfq._id && editingCell.field === column ? (
            isDateColumn(column) ? (
              <DatePicker
                selected={newValue ? new Date(newValue) : null}
                onChange={handleDateChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="border p-1 rounded"
                autoFocus
                dateFormat="dd/MM/yyyy" // Customize date format as needed
                locale={enGB} // Optional: Set locale if needed
              />
            ) : (
              <input
                key={column}
                type="text"
                value={rfq[column]}
                onChange={handleTextChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="border bg-gray-200 p-1 rounded"
                autoFocus
              />
            )
            ) : (
              <span className='Text' onDoubleClick={() => handleEditClick(column, rfq._id, rfq[column])}>
                {isDateColumn(column) ? formatDate(rfq[column]): (rfq[column] || "EMPTY")}
              </span>
            )}
          </td>
        )
      ))}
      <td className="p-2">
        <button onClick={() => handleDelete(rfq._id)} className="text-red-500">Delete</button>
      </td>
     
    </tr>
    }

    return (
      <div className="overflow-x-auto scrollbar">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className=' bg-indigo-900 text-white'>
          <tr>
            <th className="p-2 border-b uppercase text-sm whitespace-nowrap">
              <input
                type="checkbox"
                checked={selectedRFQs.size === rfqs.length}
                onChange={handleSelectAll}
              />
            </th>
            {Object.keys(columns).map(column => (
              columns[column] && (
                <th key={column} className="p-2 border-b  uppercase text-sm">{column}</th>
              )
            ))}
            <th className="p-2 border-b uppercase text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rfqs.length > 0 ? (
            rfqs.map(rfq => (
              <React.Fragment key={rfq._id}>
                <TableData rfq={rfq} />
                {(
                  showVendors && rfq.vendors.map(vendor => (
                    <TableData rfq={vendor} vendor={true} />
                  ))
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={Object.keys(columns).length + 3} className="p-2 text-center text-black">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    );
  };

  const handleShowVendors =() => {
     setShowVendors(state => !state)
  } 

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <button onClick={handleShowForm} className="bg-indigo-900 text-white p-2 rounded">
          Add New RFQ
        </button>
        <button
          onClick={handleShowVendorForm}
          className={`ml-4 bg-indigo-900 text-white p-2 rounded ${selectedRFQs.size !== 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={selectedRFQs.size !== 1} // Disable button if not exactly one RFQ is selected
        >
          Add Vendor
        </button>
        <button onClick={handleFilterToggle} className="ml-4 bg-white text-black p-2 rounded">
          <FontAwesomeIcon icon={faFilter} /> Filters
        </button>
        <label><input type='checkbox' className='ml-4 p-2'  value={showVendors} onChange={handleShowVendors} />Show Vendors</label>         
      </div>
      {FilterPanel()}
      {showForm && <RFQForm onClose={handleCloseForm} onSuccess={handleSuccess} />}
      {showVendorForm && <VendorForm />}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      {selectedRFQs.size > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 text-white p-2 rounded"
          >
            Delete Selected
          </button>
        </div>
      )}
      <DataTable />
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-indigo-900 text-white p-2 rounded"
        >
          Previous
        </button>
        <span className="self-center text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-indigo-900 text-white p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RFQList;
