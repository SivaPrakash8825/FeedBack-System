import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import FeedbackPage from "./pages/FeedbackPage";
import AdminPage from "./pages/AdminPage";
// import useRole from "./store/useRole";
import { JsonToExcel } from "./components/JsonToExcel";
// import ExcelToJsonConverter from "./components/ExcelToJson";

function App() {
  // const role = useRole((state) => state.role);

  return (
    <>
      <BrowserRouter>
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

          {/* Dummy */}
          <Route
            element={
              <>
                <JsonToExcel />
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
