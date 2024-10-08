import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import FeedbackPage from "./pages/FeedbackPage";
import AdminPage from "./pages/AdminPage";
import useRole from "./store/useRole";
import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import PasswordGenPage from "./pages/PasswordGenPage";
import ReportGenPage from "./pages/ReportGenPage";
import FeedbackHomePage from "./pages/FeedbackHomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ForAuth from "./components/ForAuth";
import Toast from "./components/Toast";
import DeletionPage from "./pages/DeletionPage";
import UpdatePage from "./pages/UpdatePage";

function App() {
  const role = useRole((state) => state.role);
  const divRef=useRef<HTMLDivElement | null>(null)
  const [username, setUsername] = useState<string>("");
  const [academicyearlist, setAcademicyearlist] = useState<string[]>([]);
  useEffect(() => {
    const curYear = new Date().getFullYear();
    const years = [];
  
    
    for (let i = curYear - 5; i < curYear + 2; i++) {
      years.push(`${i}-${(i + 1) % 100}`);
    }
    setAcademicyearlist(years);
  }, []);
  const goTopView = () => {
    if (divRef.current) {
      divRef.current.scrollIntoView({behavior:"smooth"})
    }
  }


  return (
    <div ref={divRef}>
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
                <FeedbackHomePage goTopView={goTopView}/>
              </ProtectedRoute>
            }
            path="/feedback/:username"
          />
          {/* Feedback MCQ Page */}
          <Route
            element={
              <ProtectedRoute>
                <FeedbackPage goTopView={goTopView}/>
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
                <PasswordGenPage academicyearlist={academicyearlist} />
              </ProtectedRoute>
            }
            path="/admin/generate"
          />
          {/* Table data deletion page */}
          <Route
            element={
              <ProtectedRoute shouldBeAdmin>
                <DeletionPage academicyearlist={academicyearlist}/>
              </ProtectedRoute>
            }
            path="/admin/delete"
          />
          {/* Report generate page */}
          <Route
            path="/admin/reportgenerate"
            element={
              <ProtectedRoute shouldBeAdmin>
                <ReportGenPage academicyearlist={academicyearlist} />
              </ProtectedRoute>
            }
          />

          {/* Update DB Data page */}
          <Route
            path="/admin/update"
            element={
              <ProtectedRoute shouldBeAdmin>
                <UpdatePage  academicyearlist={academicyearlist}/>
              </ProtectedRoute>
            }
          />

          {/* Dummy */}
          {/* <Route
            element={
              <>
                <DeleteEmptyCells />
              </>
            }
            path="/admin/dummy"
          /> */}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toast />
      </BrowserRouter>
    </div>
  );
}

export default App;
