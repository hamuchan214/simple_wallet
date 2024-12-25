import { Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import { Dashboard } from "@mui/icons-material";
import Register from "./components/register";

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