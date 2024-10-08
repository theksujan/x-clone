import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { BsFileX } from "react-icons/bs";
import LoadingSpinner from "./components/common/LoadingSpinner";
function App() {
  const {
    data: authUser,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["authUser"], 
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = res.json();
        if (!res.ok || data.error){
          return null;
        } 
        console.log("authUser is here: ", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }


  return (
    <div className="flex max-w-6xl mx-auto">
       {authUser && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        ></Route>
      </Routes>
      { authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
