import {Routes,Route} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import Login from './public/Login';

import AdminDashboard from './private/AdminDashboard';

function App (){
  return(
    <div>
      <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Route>
      </Routes>
    </div>
  )
}

export default App;