import Header from "../../components/Header"
import usePageTracking from "../../hooks/usePageTracking";

function EmployeeDashboard () {
    usePageTracking("Dashboard");
    
    return (
        <div>
            <Header title="Dashboard"/>
            Employee Dashboard
        </div>
    )
}

export default EmployeeDashboard