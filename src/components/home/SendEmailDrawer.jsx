// src/components/SendEmailDrawer.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SendEmailDrawer = ({
  isOpen,
  setIsOpen,
  sendFrom,
  sendTo: initialSendTo,
  setSendTo: setParentSendTo,
  sendSubject: initialSendSubject,
  setSendSubject: setParentSendSubject,
  sendBody: initialSendBody,
  setSendBody: setParentSendBody,
  sendError: initialSendError,
  setSendError: setParentSendError,
  inboxes,
  handleSendEmail,
}) => {
  const [sendTo, setSendTo] = useState(initialSendTo || "");
  const [sendSubject, setSendSubject] = useState(initialSendSubject || "");
  const [sendBody, setSendBody] = useState(initialSendBody || "");
  const [sendError, setSendError] = useState(initialSendError || "");

  const onSend = () => {
    setParentSendTo(sendTo);
    setParentSendSubject(sendSubject);
    setParentSendBody(sendBody);
    setParentSendError(sendError);
    handleSendEmail();
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black/50 bg-opacity-30 transition-opacity duration-500 ease-in-out ${
            isOpen ? "opacity-100" : "opacity-0"
          } z-40`}
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[70%] bg-white dark:bg-gray-800 shadow-2xl transform transition-all duration-500 ease-in-out ${
          isOpen ? "translate-x-0 scale-100" : "translate-x-full scale-95"
        } z-50`}
      >
        <div className="p-4 sm:p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              Send Email from {sendFrom}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              <svg
                className="w-5 sm:w-6 h-5 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
          <div className="space-y-4 sm:space-y-6 flex-grow">
            <Select
              value={sendTo}
              onValueChange={(value) => {
                setSendTo(value);
                setSendError("");
              }}
            >
              <SelectTrigger className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                {inboxes.map((inbox) => (
                  <SelectItem
                    key={inbox.id}
                    value={inbox.id}
                    className="text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {inbox.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {sendError && (
              <p className="text-red-500 dark:text-red-300 text-sm font-medium">
                {sendError}
              </p>
            )}
            <Input
              placeholder="Subject"
              value={sendSubject}
              onChange={(e) => setSendSubject(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <Textarea
              placeholder="Type your message here..."
              value={sendBody}
              onChange={(e) => setSendBody(e.target.value)}
              className="w-full flex-grow bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            />
          </div>
          <div className="mt-4 sm:mt-6">
            <Button
              onClick={onSend}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md transition-colors"
            >
              Send Email
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendEmailDrawer;
