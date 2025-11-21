import { Navigate, Outlet } from "react-router";


const dummyUser = {
  id: "123",
  name: "Rabby Hasan",
  role: "hr", // ⬅ change role: "super-admin" | "tenant-admin" | "hr" | "sales" | etc
};


export default function ProtectedRoute({ allowed }: { allowed: string[] }) {
//   const user = useSelector((s) => s.auth.user);
const user=dummyUser;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowed.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
