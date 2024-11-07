import React from 'react';
import Template from '../components/Template';


  
// Generate formFields JSON manually
const formFields = [
  {
    type: 'number',
    label: 'System Number',
    name: 'systemNumber',
    placeholder: 'Enter System Number',
    validation: { required: 'System Number is required' }
  },
  {
    type: 'text',
    label: 'System Name',
    name: 'systemName',
    placeholder: 'Enter System Name',
    validation: { required: 'System Name is required' }
  },
  {
    type: 'textarea',
    label: 'Purpose',
    name: 'purpose',
    placeholder: 'Enter Purpose',
    validation: { required: 'Purpose is required' }
  }
];

  
    
const dataTableColumns = [
  {
    name: 'System Number',
    selector: row => row.systemNumber,
    width: '150px'
  },
  {
    name: 'System Name',
    selector: row => row.systemName,
    width: '200px'
  },
  {
    name: 'Purpose',
    selector: row => row.purpose,
    width: '300px'
  }
];



function System({collection}) {
    return (
            <Template
                formFields={formFields}
                dataTableColumns={dataTableColumns}
                collection={collection}
                name="Systems"
            />
    );
}

export default System;
