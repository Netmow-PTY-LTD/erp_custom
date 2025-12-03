import { LoginForm } from "@/components/auth/LoginForm";
import { Link } from "react-router";

export default function Login() {
 return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 self-center font-medium text-xl">
          <div className="flex size-6 items-center justify-center rounded-md">
            <img src="https://inleadsit.com.my/wp-content/uploads/2023/07/favicon-2.png" alt="Logo" className="w-6 h-6 object-contain" />
          </div>
          Inleads IT
        </Link>
        <LoginForm />
      </div>
    </div>
  )

}
