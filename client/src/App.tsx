import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<h1>Hello</h1>} path="/" />
          <Route element={<h1>Login</h1>} path="/login" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
