import { userAuth } from "@/api/api"
import { useLayoutEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"

export default function AuthLayout() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    setLoading(true);
    
    userAuth()
    .then(() => {
      setAuth(true);
    })
    .catch(error => {
      console.log("Error in auth layout, ", error);
    })
    .finally(() => {
      setLoading(false);
    })

  }, [])

  if(loading && !auth) return null;

  return (
    !loading && !auth ? <Navigate to={"/login"} /> : <Outlet />
  )
}