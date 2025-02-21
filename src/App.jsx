import {Routes,Route} from 'react-router-dom'
import Login from './public/Login';
import AdminDashboard from './private/AdminDashboard';

function App (){
  return(
    <div>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/dashboard' element={<AdminDashboard/>}/>
      </Routes>
    </div>
  )
}

export default App;