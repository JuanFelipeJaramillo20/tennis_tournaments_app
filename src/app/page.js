"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserList() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, []);

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center flex-column mt-5"></div>
  );
}
