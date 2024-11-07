import React from 'react';
import Template from '../components/Template';


  
// Generate formFields JSON manually
const formFields = [
  {
    type: 'number',
    label: 'Sort',
    name: 'sort',
    placeholder: 'Enter Sort',
    validation: { required: 'Sort is required' }
  },
  {
    type: 'text',
    label: 'Discipline Name',
    name: 'disciplineName',
    placeholder: 'Enter Discipline Name',
    validation: { required: 'Discipline Name is required' }
  },
  {
    type: 'textarea',
    label: 'Scope Includes',
    name: 'scopeIncludes',
    placeholder: 'Enter Scope Includes',
    validation: {}
  }
];


  
    
const dataTableColumns = [
  {
    name: 'Sort',
    selector: row => row.sort,
    width: '100px'
  },
  {
    name: 'Discipline Name',
    selector: row => row.disciplineName,
    width: '200px'
  },
  {
    name: 'Scope Includes',
    selector: row => row.scopeIncludes,
    width: '300px'
  }
];



function TradeDisipline({collection}) {
    return (
            <Template
                formFields={formFields}
                dataTableColumns={dataTableColumns}
                collection={collection}
                name="System Trade"
            />
    );
}

export default TradeDisipline;
