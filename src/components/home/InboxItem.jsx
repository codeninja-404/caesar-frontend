// src/components/InboxItem.jsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const InboxItem = ({
  inbox,
  emails,
  deletingId,
  copiedId,
  isDeleteOpen,
  deleteId,
  setDeleteId,
  setIsDeleteOpen,
  handleCopyInbox,
  handleDeleteInbox,
  handleViewEmails,
  setSendFrom,
  setIsSendOpen,
  setSendTo,
  setSendSubject,
  setSendBody,
  status,
  deleteEmail,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [readStatus, setReadStatus] = useState({});
  const [deletingEmailId, setDeletingEmailId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const initialStatus = emails.reduce((acc, email) => {
      acc[email.id] = email.isRead || false;
      return acc;
    }, {});
    setReadStatus(initialStatus);
  }, [emails]);

  useEffect(() => {
    if (deletingId === inbox.id) {
      setIsVisible(false);
    }
  }, [deletingId, inbox.id]);

  const handleReply = (email) => {
    setSendFrom(inbox.id);
    setSendTo(email.from_email);
    setSendSubject(`Re: ${email.subject}`);
    setSendBody(
      `\n\n--- Original Message ---\nFrom: ${email.from_email}\nSubject: ${email.subject}\n\n${email.body}`
    );
    setIsSendOpen(true);
  };

  const toggleReadStatus = (emailId) => {
    setReadStatus((prev) => ({
      ...prev,
      [emailId]: !prev[emailId],
    }));
  };

  const handleDeleteEmail = (emailId) => {
    setDeletingEmailId(emailId);
    setTimeout(() => {
      deleteEmail({ inboxId: inbox.id, emailId });
      setDeletingEmailId(null);
    }, 300);
  };

  const handleMarkAllRead = () => {
    setReadStatus((prev) => {
      const updatedStatus = { ...prev };
      emails.forEach((email) => {
        updatedStatus[email.id] = true;
      });
      return updatedStatus;
    });
  };

  const handleRefreshInbox = () => {
    setIsRefreshing(true);
    handleViewEmails(inbox.id); // Re-use existing fetch logic
    setTimeout(() => setIsRefreshing(false), 500); // Simulate refresh duration
  };

  const sortedEmails = [...emails].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  const hasUnread = sortedEmails.some((email) => !readStatus[email.id]);

  return (
    <li
      className={`transition-all duration-500 ease-in-out transform ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 scale-95"
      } ${deletingId === inbox.id ? "pointer-events-none" : ""}`}
    >
      <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex-1">
              <span className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">
                {inbox.id}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1 sm:ml-2">
                (Created: {new Date(inbox.created_at).toLocaleString()})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyInbox(inbox.id)}
                disabled={status === "loading"}
                className="text-xs sm:text-sm border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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
                    disabled={status === "loading" || deletingId === inbox.id}
                    onClick={() => setDeleteId(inbox.id)}
                    className="text-xs sm:text-sm bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                  >
                    {deletingId === inbox.id ? "Deleting..." : "Delete"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white dark:bg-gray-800 rounded-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-800 dark:text-white">
                      Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
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
                      className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
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
                className="text-xs sm:text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                View Emails
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={status === "loading"}
                onClick={() => {
                  setSendFrom(inbox.id);
                  setSendTo("");
                  setSendSubject("");
                  setSendBody("");
                  setIsSendOpen(true);
                }}
                className="text-xs sm:text-sm border-blue-600 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900"
              >
                Send Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshInbox}
                disabled={status === "loading" || isRefreshing}
                className="text-xs sm:text-sm border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
          {sortedEmails.length > 0 && (
            <div className="mt-3 sm:mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Emails:
                </h3>
                {hasUnread && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleMarkAllRead}
                    className="p-0 h-auto text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Mark All as Read
                  </Button>
                )}
              </div>
              <ul className="space-y-3 mt-2">
                {sortedEmails.map((email) => (
                  <li
                    key={email.id}
                    className={`text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-md transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md cursor-pointer ${
                      !readStatus[email.id] ? "font-bold" : ""
                    } ${
                      deletingEmailId === email.id
                        ? "opacity-0 scale-95"
                        : "opacity-100 scale-100"
                    }`}
                  >
                    <div className="flex flex-col gap-2">
                      <div>
                        <strong>From:</strong>{" "}
                        <span className="font-medium">{email.from_email}</span>
                      </div>
                      <div>
                        <strong>Subject:</strong>{" "}
                        <span className="font-medium">{email.subject}</span>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 line-clamp-2">
                        {email.body}
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(email.created_at).toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => toggleReadStatus(email.id)}
                            className="p-0 h-auto text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {readStatus[email.id] ? "Mark Unread" : "Mark Read"}
                          </Button>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => handleReply(email)}
                            className="p-0 h-auto text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Reply
                          </Button>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => handleDeleteEmail(email.id)}
                            disabled={
                              deletingEmailId === email.id ||
                              status === "loading"
                            }
                            className="p-0 h-auto text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            {deletingEmailId === email.id
                              ? "Deleting..."
                              : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </li>
  );
};

export default InboxItem;
