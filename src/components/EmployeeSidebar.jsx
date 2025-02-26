import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Briefcase, Eye, GiftIcon, LayoutDashboard, PlusIcon, TrendingUp, ChevronDown, ChevronRight, DollarSign, Menu, X } from "lucide-react";

const EmployeeSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activePage = location.pathname;
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleDropdown = (index, href) => {
    if (href) {
      handleNavigation(href);
    }
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
      name: "Benefits Overview",
      href: "/benefits-overview",
      icon: PlusIcon,
      subItems: [
        { name: "Apply benefit", href: "/apply-benefit" },
        { name: "My Deductions", href: "/my-deductions" },
      ],
    },
    {
      name: "Incentives Overview",
      href: "/incentives-overview",
      icon: GiftIcon,
      subItems: [
        { name: "My sales", href: "/my-sales-commission" },
        { name: "My tracking", href: "/my-incentives-tracking" },
        { name: "Recognition", href: "/my-recognition-programs" },
      ],
    },
    {
      name: "Compensation Overview",
      href: "/compensation-overview",
      icon: DollarSign,
      subItems: [
        { name: "Salary Structure", href: "/my-salary-structure" },
      ],
    },
    {
      name: "Payroll Overview",
      href: "/payroll-overview",
      icon: DollarSign,
      subItems: [
        { name: "Salary Structure", href: "/my-salary-structure" },
        { name: "Payroll Distribution", href: "/payroll-distribution-request" },
        { name: "My payslip", href: "/my-payslip" },
      ],
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isSidebarOpen ? "w-72" : "w-0 overflow-hidden"}`}>
        <div className={`p-6 h-full overflow-y-auto custom-scrollbar ${isSidebarOpen ? "block" : "hidden"}`}>
          <div className="flex items-center space-x-3 mb-8">
            <div className="flex-1">
              <h1 className="font-bold text-gray-800 dark:text-white text-lg">Employee</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="mt-8 space-y-6">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.subItems ? (
                  <div>
                    <div
                      className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => toggleDropdown(index, item.href)}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="font-medium text-sm ml-3 text-gray-700 dark:text-gray-300">{item.name}</span>
                      </div>
                      {openDropdown === index ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                    </div>
                    {openDropdown === index && (
                      <div className="ml-6 space-y-2">
                        {item.subItems.map((subItem, subIndex) => (
                          <div
                            key={subIndex}
                            className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                              activePage === subItem.href
                                ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                            }`}
                            onClick={() => handleNavigation(subItem.href)}
                          >
                            <span className="font-medium text-sm ml-3">{subItem.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                      activePage === item.href
                        ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-sm ml-3">{item.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-72" : "ml-0"}`}>
        <button 
          className="fixed top-10 left-24 z-50 p-2 bg-gray-200 dark:bg-gray-800 rounded-full"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X className="w-6 h-6 text-gray-700 dark:text-gray-300" /> : <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
        </button>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
