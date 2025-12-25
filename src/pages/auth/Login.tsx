import { LoginForm } from "@/components/auth/LoginForm";
import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useGetSettingsInfoQuery } from "@/store/features/admin/settingsApiService";

export default function Login() {
  const navigate = useNavigate();
   const { data: companyProfileSettings } = useGetSettingsInfoQuery();
  console.log("companyProfileSettings", companyProfileSettings);
  const logo = companyProfileSettings?.data?.logo_url;
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 self-center font-medium text-xl">
          <div className="flex size-6 items-center justify-center rounded-md">
            <img src={logo || "https://inleadsit.com.my/wp-content/uploads/2023/07/favicon-2.png"} alt="Logo" className="w-6 h-6 object-contain" />
          </div>
          Inleads IT
        </Link>
        <LoginForm />
      </div>
    </div>
  )

}
