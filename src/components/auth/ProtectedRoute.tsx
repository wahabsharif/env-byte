"use client";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const checkUser = () => {
      if (user) {
        setLoading(false);
      } else {
        router.push("/login");
      }
    };

    checkUser();
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={100} color="#14b8a6" loading={loading} />
      </div>
    );
  }

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
