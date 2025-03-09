import Header from "../../../components/Header";
import LoginActivity from "./LoginActivity";
import PageVisit from "./PageVisit";
import EmployeeLeaves from "./EmployeeLeaves";

function BehaviouralAnalytics () {
    return (
        <div>
            <Header title="Behavioural Analytics" />
            <LoginActivity />
            <PageVisit />
            <EmployeeLeaves />
        </div>
    )
}

export default BehaviouralAnalytics