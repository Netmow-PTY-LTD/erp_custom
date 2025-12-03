import { useAppSelector } from "@/store/store";
import { Navigate, Outlet } from "react-router";


// const dummyUser = {
//   id: "123",
//   name: "Rabby Hasan",
//   role: "hr", // ⬅ change role: "super-admin" | "tenant-admin" | "hr" | "sales" | etc
// };


export default function ProtectedRoute() {
//   const user = useSelector((s) => s.auth.user);
const user=useAppSelector((state) => state.auth.user);
const token =useAppSelector((state) => state.auth.token);

console.log("ProtectedRoute User: ", user);

  if (!user || !token) return <Navigate to="/login" replace />;

  // if (!allowed.includes(user.role)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <Outlet />;
}
