import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import FeedbackPage from "./pages/FeedbackPage";
import AdminPage from "./pages/AdminPage";
import useRole from "./store/useRole";
import { ExcelToJson } from "./components/ExcelToJson";
import { useState } from "react";
import Header from "./components/Header";
import PasswordGenPage from "./pages/PasswordGenPage";
import ReportGenPage from "./pages/ReportGenPage";
import FeedbackHomePage from "./pages/FeedbackHomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ForAuth from "./components/ForAuth";
import Toast from "./components/Toast";
import UpdatePage from "./pages/UpdatePage";

function App() {
  const role = useRole((state) => state.role);
  const [username, setUsername] = useState<string>("");

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
          {/* List Of Staffs / Labs*/}
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
          {/* Feedback MCQ Page */}
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

          {/* Report generate page */}
          <Route
            path="/admin/reportgenerate"
            element={
              <ProtectedRoute shouldBeAdmin>
                <ReportGenPage />
              </ProtectedRoute>
            }
          />

          {/* Update DB Data page */}
          <Route
            path="/admin/update"
            element={
              <ProtectedRoute shouldBeAdmin>
                <UpdatePage />
              </ProtectedRoute>
            }
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

          {/* Report generate page */}
          <Route
            path="/admin/reportgenerate"
            element={
              <ProtectedRoute shouldBeAdmin>
                <ReportGenPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toast />
      </BrowserRouter>
    </>
  );
}

export default App;
