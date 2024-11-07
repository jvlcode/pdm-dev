export async function updateDataTable(row,data,setData)  {
	const exists = data.some((el) => el._id == row._id)
	if(exists) {
		const elements = data.map((el) => {
			if(el._id == row._id) {
				el = row;
			}
			return el;
		});
		setData(elements);
	}else {
		setData((state) => [...state, row])
	}
}

// utils/datatable.js
export async function fetchTemplates(collection) {
    const queryParams = {
        collection
    };
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${process.env.REACT_APP_API_URL}/templates?${queryString}`;
    const response = await fetch(url);
    return response.json();
}


export async function addTemplate(body) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return response.json();
}

export async function updateTemplate(id, body) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/templates?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return response.json();
}

export async function deleteTemplate(id, collection) {
    await fetch(`${process.env.REACT_APP_API_URL}/templates?id=${id}&collection=${collection}`, {
        method: 'DELETE'
    });
}

export async function fetchOptions(collection, namePath, val) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/templates?collection=${collection}`);
    const data = await response.json();
    
    const result = data.map(el => {
        const name = getValueByPath(el, namePath);
        return { id: el[val], name };
    });

    return result;

    function getValueByPath(obj, path) {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    }
}


