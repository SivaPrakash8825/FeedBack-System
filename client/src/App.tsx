import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import FeedbackPage from "./pages/FeedbackPage";
import AdminPage from "./pages/AdminPage";
import useRole from "./store/useRole";
import Header from "./components/Header";
import GeneratePage from "./pages/GeneratePage";
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
          <Route
            element={
              <ProtectedRoute shouldBeAdmin>
                <GeneratePage />
              </ProtectedRoute>
            }
            path="/admin/generate"
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
