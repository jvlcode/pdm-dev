import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';

const RFQForm = ({ rfqId, onClose, onSuccess }) => {
  const { control, handleSubmit, register, setValue, formState: { errors } } = useForm({
    defaultValues: {
      category: 'sample1',
      description: 'sampledesc1',
      entity: 'sampleentity',
      ypDocumentNumber: '123456',
      packageManager: 'John Doe',
      packageEngineer: 'Jane Smith',
      packageBuyer: 'Alice Johnson',
      eca: 'ECA-001',
      draft: '2024-01-01',
      issued: '2024-02-01',
      signed: '2024-03-01',
      company: 'Example Corp',
      contact: 'contact@example.com'
    }
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (rfqId) {
      axios.get(`http://localhost:8000/api/v1/rfqs/${rfqId}`)
        .then(response => {
          const data = response.data;
          // Set form values from fetched data
          Object.keys(data).forEach(key => {
            setValue(key, data[key]);
          });
        })
        .catch(error => console.error('Error fetching RFQ:', error));
    }
  }, [rfqId, setValue]);

  const onSubmit = (data) => {
    const request = rfqId 
      ? axios.put(`http://localhost:8000/api/v1/rfqs/${rfqId}`, data)
      : axios.post('http://localhost:8000/api/v1/rfqs', data);

    request
      .then(() => {
        setSuccessMessage(rfqId ? 'RFQ updated successfully!' : 'RFQ created successfully!');
        setServerError(''); // Clear any previous server errors
        onSuccess();
        onClose();
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setSuccessMessage(''); // Clear any previous success messages
          setServerError(error.response.data.error || 'An error occurred.');
        } else {
          setServerError('An unexpected error occurred.');
        }
      });
  };

  const handleDelete = () => {
    if (!rfqId) return;

    axios.delete(`http://localhost:8000/api/v1/rfqs/${rfqId}`)
      .then(() => {
        setSuccessMessage('RFQ deleted successfully!');
        setServerError(''); // Clear any previous server errors
        onSuccess();
        onClose();
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setSuccessMessage(''); // Clear any previous success messages
          setServerError(error.response.data.error || 'An error occurred.');
        } else {
          setServerError('An unexpected error occurred.');
        }
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">{rfqId ? 'Edit RFQ' : 'Create RFQ'}</h2>
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        {serverError && <p className="text-red-500 mb-4">{serverError}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category:</label>
            <input
              type="text"
              {...register('category', { required: 'Category is required' })}
              className={`mt-1 block w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description:</label>
            <input
              type="text"
              {...register('description', { required: 'Description is required' })}
              className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          {/* Entity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Entity:</label>
            <input
              type="text"
              {...register('entity', { required: 'Entity is required' })}
              className={`mt-1 block w-full px-3 py-2 border ${errors.entity ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.entity && <p className="text-red-500 text-xs mt-1">{errors.entity.message}</p>}
          </div>

          {/* YP Document Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">YP Document Number:</label>
            <input
              type="text"
              {...register('ypDocumentNumber', { required: 'YP Document Number is required' })}
              className={`mt-1 block w-full px-3 py-2 border ${errors.ypDocumentNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.ypDocumentNumber && <p className="text-red-500 text-xs mt-1">{errors.ypDocumentNumber.message}</p>}
          </div>

          {/* Package Manager */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Package Manager:</label>
            <input
              type="text"
              {...register('packageManager', { required: 'Package Manager is required' })}
              className={`mt-1 block w-full px-3 py-2 border ${errors.packageManager ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.packageManager && <p className="text-red-500 text-xs mt-1">{errors.packageManager.message}</p>}
          </div>

          {/* Package Engineer */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Package Engineer:</label>
            <input
              type="text"
              {...register('packageEngineer', { required: 'Package Engineer is required' })}
              className={`mt-1 block w-full px-3 py-2 border ${errors.packageEngineer ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.packageEngineer && <p className="text-red-500 text-xs mt-1">{errors.packageEngineer.message}</p>}
          </div>

          {/* Package Buyer */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Package Buyer:</label>
            <input
              type="text"
              {...register('packageBuyer', { required: 'Package Buyer is required' })}
              className={`mt-1 block w-full px-3 py-2 border ${errors.packageBuyer ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.packageBuyer && <p className="text-red-500 text-xs mt-1">{errors.packageBuyer.message}</p>}
          </div>

          {/* ECA */}
          <div>
            <label className="block text-sm font-medium text-gray-700">ECA:</label>
            <input
              type="text"
              {...register('eca', { required: 'ECA is required' })}
              className={`mt-1 block w-full px-3 py-2 border ${errors.eca ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.eca && <p className="text-red-500 text-xs mt-1">{errors.eca.message}</p>}
          </div>

          {/* Draft Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Draft Date:</label>
            <Controller
              control={control}
              name="draft"
              render={({ field }) => (
                <input
                  type="date"
                  {...field}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.draft ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
              )}
            />
            {errors.draft && <p className="text-red-500 text-xs mt-1">{errors.draft.message}</p>}
          </div>

          {/* Issued Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Issued Date:</label>
            <Controller
              control={control}
              name="issued"
              render={({ field }) => (
                <input
                  type="date"
                  {...field}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.issued ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
              )}
            />
            {errors.issued && <p className="text-red-500 text-xs mt-1">{errors.issued.message}</p>}
          </div>

          {/* Signed Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Signed Date:</label>
            <Controller
              control={control}
              name="signed"
              render={({ field }) => (
                <input
                  type="date"
                  {...field}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.signed ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
              )}
            />
            {errors.signed && <p className="text-red-500 text-xs mt-1">{errors.signed.message}</p>}
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Company:</label>
            <input
              type="text"
              {...register('company')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.company ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact:</label>
            <input
              type="text"
              {...register('contact')}
              className={`mt-1 block w-full px-3 py-2 border ${errors.contact ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact.message}</p>}
          </div>

          <div className="col-span-3 flex justify-between mt-6">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Save
            </button>
            {rfqId && (
              <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                Delete
              </button>
            )}
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RFQForm;
