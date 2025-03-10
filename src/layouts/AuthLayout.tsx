import { userAuth } from "@/api/api"
import { Toaster } from "@/components/ui/sonner";
import { AxiosError } from "axios";
import { useEffect, useLayoutEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"

import { toast } from "sonner";

export default function AuthLayout() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  useLayoutEffect(() => {
    setLoading(true);
    
    userAuth()
    .then(() => {
      setAuth(true);
    })
    .catch(error => {
      if(error instanceof AxiosError) {
        const errorCause = error.message;

        if(errorCause == "Network Error") {
          console.error("Network error in auth layout")
          setNetworkError(true);
        }
        else {
          console.log("Error in auth layout, ", error);
        }
      }
      else {
        console.log("Error in auth layout, ", error);
      }
    })
    .finally(() => {
      setLoading(false);
    })

  }, [])

  useEffect(() => {
    function handleOffline() {
      console.log("offline");
      
      toast("Offline", {
        description: "Looks like you're offline, check your internet connection.",
        duration: 1000 * 5
      })
    }

    function handleOnline() {
      console.log("online");
      
      toast("Online", {
        description: "You're back online.",
        duration: 1000 * 5
      })
    }

    addEventListener("offline", handleOffline);
    addEventListener("online", handleOnline);

    return () => {
      removeEventListener("offline", handleOffline);
      removeEventListener("online", handleOnline);
    }
  }, [])

  if(loading && !auth) return null;

  if(!loading && networkError) return (
    <>
      <Outlet />
      <Toaster className="bg-black text-white" />
    </>
  )

  return (
    !loading && !auth ? <Navigate to={"/login"} /> : (
      <>
        <Outlet />
        <Toaster className="bg-black text-white" />
      </>
    )
  )
}