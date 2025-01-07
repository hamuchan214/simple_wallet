import { Route, Routes, Navigate } from "react-router-dom";
import LoginForm from "../pages/LoginForm";
import Register from "../pages/register";
import Dashboard from "../pages/Dashboard";

const App = () => {
  return (
    <Routes>
      {/* ログインページ */}
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* その他の未定義ルートは "/" にリダイレクト */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
