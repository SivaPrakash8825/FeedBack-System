import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
function App() {
  return (
    <>
      <BrowserRouter>
        <h1>Hello</h1>
        <Routes>
          {/* Login Page */}
          <Route element={<LoginPage />} path="/" />
          {/* Feedback Page */}
          <Route element={<h1>Login</h1>} path="/feedback" />
          {/* Admin Page */}
          <Route element={<h1>Login</h1>} path="/admin" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
