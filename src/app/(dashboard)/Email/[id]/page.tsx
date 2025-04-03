"use client";
import NewEmail from "@/components/Email/NewEmail";
import { EMAIL_LIST_API } from "@/constants/envConfig";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [email, setEmail] = useState<string[]>([]);

  useEffect(() => {
    const fetchEmail = async () => {
      const response = await axiosInstance.get(
        `${EMAIL_LIST_API}?email_list_id=eq.${id}`
      );
      setEmail(response.data);
    };
    fetchEmail();
  }, [id]);
  return (
    <div className="max-w-[800px] mx-auto p-4 w-full">
      <NewEmail data={email[0]} isEdit={true} />
    </div>
  );
};

export default Page;
