"use client";
import React from "react";
import { Header } from "../_component/Header";
import { Label } from "./_component/Label";
import { Input } from "./_component/Input";
import { ErrorMessage } from "./_component/ErrorMessage";
import { FormEvent, useState } from "react";
import { API_BASE_URL } from "../posts";
import { ContactsErrorsType } from "@/types/ContactsErrorsType";
import { InquiryType } from "@/types/InquiryType";
import "@/app/globals.css";

const InquiryPage: React.FC = () => {
  const [inquiryData, setInquiryData] = useState<InquiryType>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactsErrorsType>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (id: string, value: string) => {
    setInquiryData((prevData) => ({ ...prevData, [id]: value }));
  };

  const validate = () => {
    const tempErrors: ContactsErrorsType = {};
    if (!inquiryData.name.length || inquiryData.name.length > 30)
      tempErrors.name = "お名前は必須です。";
    if (!inquiryData.email.length)
      tempErrors.email = "メールアドレスは必須です。";
    if (!inquiryData.name.length || inquiryData.message.length > 500)
      tempErrors.message = "本文は必須です。";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData),
      });
      if (!response.ok) throw new Error("Network response was not ok");

      alert("送信しました！");
      setInquiryData({ name: "", email: "", message: "" });
      setErrors({});
    } catch (error) {
      console.log("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setInquiryData({ name: "", email: "", message: "" });
  };

  return (
    <div className="flex flex-col">
      <Header />
      <div className="w-[800px] mx-auto my-5 p-5 sm:w-[428px] md:w-[1024px]">
        <div className="md:m-10">
        <h1 className="text-xl mb-5 font-bold md:text-4xl">問合わせフォーム</h1>
        </div>
        <form id="myForm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="name">
              <div className="flex sm:flex-row sm:items-center">
                <dt className="w-[120px] mt-4 sm:mt-0 sm:mb-2 text-left md:text-xl">
                  お名前
                </dt>
                <div className="sm:flex sm:flex-col mb-5 w-full">
                  <Input
                    type="text"
                    id="name"
                    value={inquiryData.name}
                    onChange={(value) => handleChange("name", value)}
                    disabled={isSubmitting}
                    className="h-15 w-full"
                  />
                  <ErrorMessage message={errors.name} />
                </div>
              </div>
            </Label>
          </div>
  
          <div className="mb-4">
            <Label htmlFor="email">
              <div className="flex sm:flex-row sm:items-center">
                <dt className="w-[120px] mt-4 sm:mt-0 sm:mb-2 text-left md:text-xl">
                  メールアドレス
                </dt>
                <div className="sm:flex sm:flex-col w-full">
                  <Input
                    type="text"
                    id="email"
                    value={inquiryData.email}
                    onChange={(value) => handleChange("email", value)}
                    disabled={isSubmitting}
                    className="h-15 w-full"
                  />
                  <ErrorMessage message={errors.email} />
                </div>
              </div>
            </Label>
          </div>
  
          <div className="mb-4">
            <Label htmlFor="message">
              <div className="flex sm:flex-row sm:items-start">
                <dt className="w-[120px] mt-[120px] sm:mt-0 sm:mb-2 text-left md:text-xl">
                  本文
                </dt>
                <div className="sm:flex sm:flex-col w-full">
                  <textarea
                    id="message"
                    value={inquiryData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    disabled={isSubmitting}
                    rows={10}
                    className="w-full box-border border border-gray-300 rounded-lg mb-2.5 p-5"
                  />
                  <ErrorMessage message={errors.message} />
                </div>
              </div>
            </Label>
          </div>
  
          <div className="text-center mt-10">
            <input
              type="submit"
              value="送信"
              disabled={isSubmitting}
              className="border border-gray-300 rounded p-2 px-4 text-base font-bold bg-blue-800 text-white mx-2"
            />
            <input
              type="reset"
              value="クリア"
              onClick={handleClear}
              disabled={isSubmitting}
              className="border border-gray-300 rounded p-2 px-4 text-base font-bold bg-gray-300 mx-2"
            />
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default InquiryPage;
