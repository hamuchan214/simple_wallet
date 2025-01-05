import { Route, Routes } from "react-router-dom";
import LoginForm from "../pages/LoginForm";
import Register from "../pages/register";
import Dashboard from "../pages/Dashboard";

const App = () => {
  return(
    <Routes>
      <Route path="/" element = {<LoginForm/>}/>
      <Route path="/dashboard" element = {<Dashboard/>}/>
      <Route path="/register" element = {<Register/>}/>
      <Route path="/dashboard" element = {<Dashboard/>}/>
    </Routes>
  )
}

export default App;