import React from 'react';
import Template from '../components/Template';

const formFields = [
  {
    type: 'text',
    label: 'Discipline',
    name: 'discipline',
    placeholder: 'Enter Discipline',
    validation: { required: 'Discipline is required' }
  },
  {
    type: 'textarea',
    label: 'Description',
    name: 'description',
    placeholder: 'Enter Description',
    validation: {}
  }
];

const dataTableColumns = [
  {
    name: 'Discipline',
    selector: row => row.discipline,
    width: '200px'
  },
  {
    name: 'Description',
    selector: row => row.description || '-',
    width: '300px'
  }
];





function UpliftDiscipline({collection}) {
    return (
            <Template
                formFields={formFields}
                dataTableColumns={dataTableColumns}
                collection={collection}
                name="Uplift Discipline"
            />
    );
}

export default UpliftDiscipline;
