import React, { useEffect, useState } from 'react';
import SidebarMenu from './SideBarMenu';
import { faAddressBook,  faBox, faFolder, faBriefcase, faBuilding, faCoins, faFile, faFolderOpen, faHouse, faPeopleGroup, faPrint} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
// Menu data example





const Sidebar = () => {
	
    const [error, setError] = useState(null); // State for error handling
    const [loading, setLoading] = useState(true); // Initially set to true
    const [menu, setMenu] =  useState([
        {
            label: 'Global Library',
            icon: faHouse,
            url: '/',
        },
        // Add more menu items as needed
    ]);

	useEffect(() => {
		fetchMenus();
	}, []);

	const fetchMenus = async () => {
        setLoading(true); // Set loading to true when fetching starts
        setError(null); // Reset error state before fetching
        try {
            const data = await getMenus(); // Fetch data
            setMenu(data); // Update categories state
        } catch (err) {
            setError(err.message); // Update error state if there's an error
        } finally {
            setLoading(false); // Set loading to false when done
        }

    }

    const getMenus = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/gl/menus`);
            return response.data; // Return the fetched data
        } catch (error) {
            console.error('Error fetching contract categories:', error);
            throw error; // Rethrow the error to handle it in the component
        }
    };
  
  return (
      <div className="w-1/5	 bg-black text-white p-4">
        <SidebarMenu data={menu} />
      </div>
  );
};

export default Sidebar;
