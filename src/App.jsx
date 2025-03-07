// src/App.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import {
  createInbox,
  fetchInboxes,
  deleteInbox,
  fetchInboxEmails,
  sendEmail,
  deleteEmail,
} from "./store/inboxSlice";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

import InboxList from "./components/home/InboxList";
import SendEmailDrawer from "./components/home/SendEmailDrawer";
import About from "./About";
import Header from "./components/home/Header";
import { Button } from "./components/ui/button";

function App() {
  const dispatch = useDispatch();
  const { inboxes, emails, status, error } = useSelector(
    (state) => state.inbox
  );
  const [deleteId, setDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [sendFrom, setSendFrom] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [sendSubject, setSendSubject] = useState("");
  const [sendBody, setSendBody] = useState("");
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    dispatch(fetchInboxes());
  }, [dispatch]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "n") {
        event.preventDefault();
        if (status !== "loading") {
          handleCreateInbox();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status]);

  const handleCreateInbox = () => {
    dispatch(createInbox()).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        toast.success(`Created ${result.payload.inbox_id}`, {
          description: "Inbox created successfully",
        });
      }
    });
  };

  const handleRefresh = () => {
    dispatch(fetchInboxes());
  };

  const handleDeleteInbox = (inboxId) => {
    setDeletingId(inboxId);
    setTimeout(() => {
      dispatch(deleteInbox(inboxId)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          toast.error(`Deleted ${inboxId}`, {
            description: "Inbox deleted permanently",
          });
        }
      });
      setDeletingId(null);
      setDeleteId(null);
      setIsDeleteOpen(false);
    }, 300);
  };

  const handleCopyInbox = (inboxId) => {
    navigator.clipboard.writeText(inboxId);
    setCopiedId(inboxId);
    toast.success(`${inboxId} copied`, {
      description: "Copied to clipboard",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleViewEmails = (inboxId) => {
    dispatch(fetchInboxEmails(inboxId));
  };

  const handleSendEmail = () => {
    console.log("Sending:", {
      from: sendFrom,
      to: sendTo,
      subject: sendSubject,
      body: sendBody,
    });
    if (!sendTo.includes("@caesarmail.com")) {
      setSendError("Recipient must be a @caesarmail.com inbox");
      toast.error("Invalid recipient", {
        description: "Use a @caesarmail.com address",
      });
      return;
    }
    dispatch(
      sendEmail({
        from: sendFrom,
        to: sendTo,
        subject: sendSubject,
        body: sendBody,
      })
    )
      .then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          toast.success("Email sent", { description: `To: ${sendTo}` });
          setSendFrom("");
          setSendTo("");
          setSendSubject("");
          setSendBody("");
          setIsSendOpen(false);
          setSendError("");
        } else {
          console.error("Send failed:", result);
          setSendError(result.error?.message || "Unknown error");
          toast.error("Failed to send email", {
            description: result.error?.message || "Unknown error",
          });
        }
      })
      .catch((err) => console.error("Unexpected error:", err));
  };

  const Home = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-foreground flex flex-col items-center p-3 sm:p-6 lg:p-8 relative">
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6 w-full max-w-md">
        <Button
          onClick={handleCreateInbox}
          disabled={status === "loading"}
          className="text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
        >
          {status === "loading" ? "Creating..." : "Create Inbox (Ctrl+N)"}
        </Button>
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={status === "loading"}
          className="text-xs sm:text-sm border-blue-600 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900"
        >
          Refresh
        </Button>
      </div>
      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg shadow-md w-full max-w-md text-sm sm:text-base">
          Error: {error}
        </div>
      )}
      <InboxList
        inboxes={inboxes}
        emails={emails}
        status={status}
        deletingId={deletingId}
        copiedId={copiedId}
        isDeleteOpen={isDeleteOpen}
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        setIsDeleteOpen={setIsDeleteOpen}
        handleCopyInbox={handleCopyInbox}
        handleDeleteInbox={handleDeleteInbox}
        handleViewEmails={handleViewEmails}
        setSendFrom={setSendFrom}
        setIsSendOpen={setIsSendOpen}
        setSendTo={setSendTo}
        setSendSubject={setSendSubject}
        setSendBody={setSendBody}
        deleteEmail={deleteEmail} // Pass to InboxList
      />
      <SendEmailDrawer
        isOpen={isSendOpen}
        setIsOpen={setIsSendOpen}
        sendFrom={sendFrom}
        sendTo={sendTo}
        setSendTo={setSendTo}
        sendSubject={sendSubject}
        setSendSubject={setSendSubject}
        sendBody={sendBody}
        setSendBody={setSendBody}
        sendError={sendError}
        setSendError={setSendError}
        inboxes={inboxes}
        handleSendEmail={handleSendEmail}
      />
    </div>
  );

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Toaster theme={isDarkMode ? "dark" : "light"} />
    </>
  );
}

export default App;
