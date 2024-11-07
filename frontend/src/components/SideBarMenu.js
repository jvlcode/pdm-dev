import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

// MenuItem Component
const MenuItem = ({ item, isActive, isParent }) => (
    <Link
        to={item.url}
        className={`flex gap-1 items-center py-2 px-4 ${
            isActive ? 'bg-white text-black' : 'text-white'
        } hover:bg-gray-200 hover:text-black`}
    >
        <FontAwesomeIcon icon={item.icon || faBars} />
        <span className={isParent ? 'font-medium' : 'text-sm'}>{item.label}</span>
    </Link>
);

// Recursive SubMenu Component (supports multi-level menus)
const SubMenu = ({ items, activeUrl }) => {
    // Local state for the submenu to track open/close state
    const [subMenuItems, setSubMenuItems] = useState(
        items.map(item => ({
            ...item,
            isOpen: item.children ? false : null // Track open/close state only for items with children
        }))
    );

    // Function to toggle submenus independently
    const toggleSubMenu = (index) => {
        const updatedItems = [...subMenuItems];
        updatedItems[index].isOpen = !updatedItems[index].isOpen;
        setSubMenuItems(updatedItems);
    };

    return (
        <ul className="pl-4">
            {subMenuItems.map((item, index) => (
                <li key={index}>
                    {item.children ? (
                        <>
                            <a
                                href="#"
                                className="flex gap-1 items-center text-white py-2 px-4 hover:bg-gray-200 hover:text-black"
                                onClick={() => toggleSubMenu(index)}
                            >
                                <FontAwesomeIcon icon={item.icon || faBars} />
                                <span>{item.label}</span>
                                <FontAwesomeIcon
                                    icon={item.isOpen ? faCaretUp : faCaretDown}
                                    className="ml-auto"
                                />
                            </a>
                            {/* Recursively render submenus */}
                            {item.isOpen && (
                                <div className="transition-all duration-300 ease-in-out">
                                    <SubMenu items={item.children} activeUrl={activeUrl} />
                                </div>
                            )}
                        </>
                    ) : (
                        <MenuItem
                            isParent={false}
                            item={item}
                            isActive={activeUrl.startsWith(item.url)}
                        />
                    )}
                </li>
            ))}
        </ul>
    );
};

// SidebarMenu Component
const SidebarMenu = ({ data }) => {
    const [menuItems, setMenuItems] = useState([]);
    const location = useLocation();

    useEffect(() => {
        // Initialize menuItems with isOpen set to false for items with children
        const initializedMenuItems = data.map(item => ({
            ...item,
            isOpen: item.children ? false : null // Track open/close state only for items with children
        }));
        setMenuItems(initializedMenuItems);
    }, [data]);

    const toggleSubMenu = (index) => {
        const updatedMenuItems = [...menuItems];
        updatedMenuItems[index].isOpen = !updatedMenuItems[index].isOpen;
        setMenuItems(updatedMenuItems);
    };

    return (
        <div className="w-full">
            <ul className="space-y-1">
                {menuItems.map((item, index) => (
                    <li key={index} className="relative">
                        {item.children ? (
                            <>
                                <a
                                    href="#"
                                    className="flex gap-1 items-center text-white py-2 px-4 hover:bg-gray-200 hover:text-black"
                                    onClick={() => toggleSubMenu(index)}
                                >
                                    <FontAwesomeIcon icon={item.icon || faBars} />
                                    <span className="font-medium">{item.label}</span>
                                    <FontAwesomeIcon
                                        icon={item.isOpen ? faCaretUp : faCaretDown}
                                        className="ml-auto"
                                    />
                                </a>
                                {/* Render submenu if isOpen is true */}
                                {item.isOpen && (
                                    <div className="transition-all duration-300 ease-in-out">
                                        <SubMenu items={item.children} activeUrl={location.pathname} />
                                    </div>
                                )}
                            </>
                        ) : (
                            <MenuItem
                                isParent={true}
                                item={item}
                                isActive={location.pathname === item.url}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SidebarMenu;
