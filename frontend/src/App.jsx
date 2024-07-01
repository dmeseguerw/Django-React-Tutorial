// This is the root of our App to navigate
import react from "react"
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"

function Logout() {
  localStorage.clear() // Clear refresh and access tokens
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  // Dont submit old tokens when registering
  return <Register />
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path ="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path = "/login" element = {<Login />}/>
        <Route path = "/logout" element = {<Logout />}/>
        <Route path = "/register" element = {<RegisterAndLogout />}/>
        <Route path = "*" element = {<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
