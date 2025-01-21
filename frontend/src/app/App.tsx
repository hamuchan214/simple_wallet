import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import LoginForm from "../pages/LoginForm";
import Register from "../pages/register";
import Dashboard from "../pages/Dashboard";
import History from "../pages/History";
import TagSetting from "../pages/TagSetting";
import { navigationHelper } from "../utils/navigationHelper";

const App = () => {
  const navigate = useNavigate();
  navigationHelper.navigate = navigate;
  return (
    <Routes>
      {/* ログインページ */}
      <Route path="/" element={<LoginForm />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/history" element={<History />} />
      <Route path="/tag-setting" element={<TagSetting />} />

      {/* その他の未定義ルートは "/" にリダイレクト */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
