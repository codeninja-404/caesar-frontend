import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link } from "react-router-dom";
import {
  createInbox,
  fetchInboxes,
  deleteInbox,
  fetchInboxEmails,
  sendEmail,
} from "./store/inboxSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import About from "./About";

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
  const [isSendOpen, setIsSendOpen] = useState(false); // Control Send modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // Control Delete modal

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
      setIsDeleteOpen(false); // Close modal after delete
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
    dispatch(
      sendEmail({
        from: sendFrom,
        to: sendTo,
        subject: sendSubject,
        body: sendBody,
      })
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Email sent", { description: `To: ${sendTo}` });
        setSendFrom("");
        setSendTo("");
        setSendSubject("");
        setSendBody("");
        setIsSendOpen(false); // Close modal after send
      } else {
        toast.error("Failed to send email", {
          description: result.error?.message,
        });
      }
    });
  };

  const Home = () => (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4">
      <div className="flex justify-between w-full max-w-md mb-6">
        <h1 className="text-3xl font-bold">CaesarMail</h1>
        <div className="flex items-center space-x-4">
          <Link
            to="/about"
            className="text-primary underline dark:text-primary-foreground"
          >
            About
          </Link>
          <Switch
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
            aria-label="Toggle dark mode"
          />
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <Button onClick={handleCreateInbox} disabled={status === "loading"}>
          {status === "loading" ? "Creating..." : "Create Inbox (Ctrl+N)"}
        </Button>
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={status === "loading"}
        >
          Refresh
        </Button>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
          Error: {error}
        </div>
      )}
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Inboxes</h2>
        {status === "loading" ? (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-4 border-t-4 border-muted border-t-primary dark:border-t-primary-foreground rounded-full animate-spin"></div>
          </div>
        ) : inboxes.length === 0 ? (
          <p className="text-muted-foreground dark:text-muted">
            No inboxes yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {inboxes.map((inbox) => (
              <li
                key={inbox.id}
                className={`${
                  deletingId === inbox.id
                    ? "animate-out fade-out duration-300"
                    : "animate-in fade-in slide-in-from-bottom-2 duration-300"
                }`}
              >
                <Card className="bg-card text-card-foreground dark:bg-card-dark dark:text-card-foreground-dark">
                  <CardContent className="p-4 flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span>{inbox.id}</span>
                        <span className="text-muted-foreground dark:text-muted text-sm ml-2">
                          (Created:{" "}
                          {new Date(inbox.created_at).toLocaleString()})
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyInbox(inbox.id)}
                          disabled={status === "loading"}
                        >
                          {copiedId === inbox.id ? "Copied!" : "Copy"}
                        </Button>
                        <AlertDialog
                          open={isDeleteOpen && deleteId === inbox.id}
                          onOpenChange={setIsDeleteOpen}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={
                                status === "loading" || deletingId === inbox.id
                              }
                              onClick={() => setDeleteId(inbox.id)}
                            >
                              {deletingId === inbox.id
                                ? "Deleting..."
                                : "Delete"}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="dark:bg-gray-800 dark:text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription className="dark:text-gray-300">
                                This will permanently delete {inbox.id}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setDeleteId(null)}
                                className="dark:bg-gray-700 dark:text-white"
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteInbox(inbox.id)}
                                className="dark:bg-red-600 dark:text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleViewEmails(inbox.id)}
                          disabled={status === "loading"}
                        >
                          View Emails
                        </Button>
                        <AlertDialog
                          open={isSendOpen && sendFrom === inbox.id}
                          onOpenChange={setIsSendOpen}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={status === "loading"}
                              onClick={() => setSendFrom(inbox.id)}
                            >
                              Send Email
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="dark:bg-gray-800 dark:text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Send Email from {inbox.id}
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <div className="space-y-4">
                              <Input
                                placeholder="To"
                                value={sendTo}
                                onChange={(e) => setSendTo(e.target.value)}
                                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                              />
                              <Input
                                placeholder="Subject"
                                value={sendSubject}
                                onChange={(e) => setSendSubject(e.target.value)}
                                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                              />
                              <Textarea
                                placeholder="Body"
                                value={sendBody}
                                onChange={(e) => setSendBody(e.target.value)}
                                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                              />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="dark:bg-gray-700 dark:text-white">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleSendEmail}
                                className="dark:bg-blue-600 dark:text-white"
                              >
                                Send
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    {emails[inbox.id] && (
                      <div className="mt-2">
                        <h3 className="text-sm font-semibold">Emails:</h3>
                        {emails[inbox.id].length === 0 ? (
                          <p className="text-muted-foreground dark:text-muted text-sm">
                            No emails yet.
                          </p>
                        ) : (
                          <ul className="space-y-1">
                            {emails[inbox.id].map((email) => (
                              <li key={email.id} className="text-sm">
                                <strong>From:</strong> {email.from_email} |{" "}
                                <strong>Subject:</strong> {email.subject} |{" "}
                                <span>{email.body}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
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
