import { useState } from "react";
import axios from "axios";

const Profile = ({ user }) => {
    const [changeHRNumber, setChangeHRNumber] = useState(user?.Hr || "");

    const hrDomains = {
        "1": "https://hr1.jjm-manufacturing.com",
        "2": "https://hr2.jjm-manufacturing.com",
        "3": "https://hr3.jjm-manufacturing.com",
        "4": "https://hr4.jjm-manufacturing.com",
    };

    const handleChangeHR = async () => {
        try {
            await axios.put("http://localhost:7687/api/auth/change-hr", 
                { changeHRNumber }, 
                { withCredentials: true }
            );
            alert("HR number updated");

            setTimeout(() => {
                window.location.href = hrDomains[changeHRNumber];
            }, 500);
        } catch (error) {
            alert("Failed to update HR number");
        }
    };

    return (
        <div>
            <h2>Profile</h2>
            <img src={user?.profileImage || "/default-profile.png"} alt="Profile" width="100" />
            <p>Name: {user?.firstname} {user?.lastname}</p>
            <p>Email: {user?.email}</p>
            <label>HR Number:</label>
            <select 
                value={changeHRNumber} 
                onChange={(e) => setChangeHRNumber(e.target.value)}
            >
                <option value="1">HR1</option>
                <option value="2">HR2</option>
                <option value="3">HR3</option>
                <option value="4">HR4</option>
            </select>
            <p>Domain: {hrDomains[changeHRNumber] || "Select HR Number"}</p>
            <button onClick={handleChangeHR}>Change HR Number</button>
        </div>
    );
};

export default Profile;
