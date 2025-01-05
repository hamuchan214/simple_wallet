import { Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Register from "./components/register";
import Dashboard from "./components/Dashboard";

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