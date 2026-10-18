import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useUser } from "./hooks/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Dashboard() {
  return (
    <div className="p-8 text-white bg-slate-900 h-screen">Dashboard Page</div>
  );
}

function ProtectedRoute() {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
