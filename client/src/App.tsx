import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import FeedbackPage from "./pages/FeedbackPage";
import AdminPage from "./pages/AdminPage";
import useRole from "./store/useRole";
// import { JsonToExcel } from "./components/JsonToExcel";
import { ExcelToJson } from "./components/ExcelToJson";
import { useState } from "react";
import Header from "./components/Header";
import PasswordGenPage from "./pages/PasswordGenPage";
import FeedbackHomePage from "./pages/FeedbackHomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ForAuth from "./components/ForAuth";

import PdfGenerator from "./components/GeneratePdf";
function App() {
  // const role = useRole((state) => state.role);
  const [username, setUsername] = useState<string>("");
  const { role } = useRole();

  return (
    <>
      <BrowserRouter>
        <ForAuth />
        {role && <Header />}
        <Routes>
          {/* Login Page */}
          <Route
            element={
              <LoginPage username={username} setUsername={setUsername} />
            }
            path="/"
          />
          {/* Feedback Page */}
          <Route
            element={
              <ProtectedRoute>
                <FeedbackPage />
              </ProtectedRoute>
            }
            path="/feedback/:username/:type"
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

          {/* Feedback Homepage */}
          <Route
            element={
              <ProtectedRoute>
                <FeedbackHomePage
                  username={username}
                  setUsername={setUsername}
                />
              </ProtectedRoute>
            }
            path="/feedback/:username"
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

          <Route path="*" element={<NotFoundPage />} />
          {/* PdfGenerator Page */}
          <Route element={<PdfGenerator />} path="/generate-pdf" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
