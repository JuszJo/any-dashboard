import { RouterProvider, createBrowserRouter, createRoutesFromChildren, Route, Navigate } from "react-router-dom"

import Dashboard from "./pages/dashboard/Dashboard"
import Login from "./pages/auth/Login"

import './App.css'
import Signup from "./pages/auth/Signup"
import AuthLayout from "./layouts/AuthLayout"

const router = createBrowserRouter(createRoutesFromChildren([
  <Route errorElement={<div>Something Went Wrong</div>}>
    <Route index element={<Navigate to={"login"} replace={true} />} />
    <Route path="login" element={<Login />} />,
    <Route path="signup" element={<Signup />} />,
    <Route path="dashboard" element={<AuthLayout />}>
      <Route index element={<Dashboard />} />,
    </Route>
    <Route path="*" element={<div>Not Found</div>} />
  </Route>
]))

function App() {
  return <RouterProvider router={router} />
}

export default App;
