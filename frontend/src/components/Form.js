import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FormElement from '../components/FormElement';

const Form = ({ collectionName, formFields, onSubmitted, showMessage, edit }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const body = {
            collectionName,
            data
        };

        try {
            let response;
            if (!edit) {
                response = await fetch(`${process.env.REACT_APP_API_URL}/templates`, {
                    headers: { 'Content-Type': 'application/json' },
                    method: "POST",
                    body: JSON.stringify(body)
                });
            } else {
                response = await fetch(`${process.env.REACT_APP_API_URL}/templates?id=${edit._id}`, {
                    headers: { 'Content-Type': 'application/json' },
                    method: "PUT",
                    body: JSON.stringify(body)
                });
            }
            const doc = await response.json();
            onSubmitted(doc);
            reset();
            showMessage("Data Updated!");
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {formFields.map((field, index) => (
                    <div key={index} className="mb-4">
                        <FormElement
                            label={field.label}
                            placeholder={field.placeholder}
                            defaultValue={edit && edit[field.name]}
                            register={register(field.name, { required: field.validation.required })}
                            error={errors[field.name]}
                            type={field.type}
                        />
                    </div>
                ))}
                <div className="flex items-center justify-between">
                    <button className="form-button" type="submit">{edit ? `Save` : `Submit`}</button>
                </div>
            </form>
        </div>
    );
};

export default Form;
