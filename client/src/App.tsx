import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import FeedbackPage from "./pages/FeedbackPage";
import AdminPage from "./pages/AdminPage";
import useRole from "./store/useRole";
import { JsonToExcel } from "./components/JsonToExcel";
import { ExcelToJson } from "./components/ExcelToJson";
import Header from "./components/Header";
import PasswordGenPage from "./pages/PasswordGenPage";

function App() {
  const role = useRole((state) => state.role);

  return (
    <>
      <BrowserRouter>
        {role && <Header />}
        <Routes>
          {/* Login Page */}
          <Route element={<LoginPage />} path="/" />
          {/* Feedback Page */}
          <Route
            element={
              <ProtectedRoute>
                <FeedbackPage />
              </ProtectedRoute>
            }
            path="/feedback"
          />
          {/* Admin Page */}
          <Route
            element={
              <ProtectedRoute shouldBeAdmin>
                <AdminPage />
              </ProtectedRoute>
            }
            path="/admin"
          />
          {/* login id generator */}
          <Route
            element={
              <ProtectedRoute shouldBeAdmin>
                <PasswordGenPage />
              </ProtectedRoute>
            }
            path="/admin/generate"
          />

          {/* Dummy */}
          <Route
            element={
              <>
                <ExcelToJson />
              </>
            }
            path="/dummy"
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
