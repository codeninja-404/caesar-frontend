// src/components/InboxList.jsx
import React from "react";
import InboxItem from "./InboxItem";

const InboxList = ({
  inboxes,
  emails,
  status,
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
  deleteEmail, // Add prop
}) => (
  <div className="w-full max-w-3xl">
    <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200">
      Inboxes
    </h2>
    {status === "loading" ? (
      <div className="space-y-3 sm:space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 animate-pulse"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 sm:h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 sm:h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="h-8 sm:h-9 w-14 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 sm:h-9 w-14 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 sm:h-9 w-20 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 sm:h-9 w-20 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 space-y-2">
              <div className="h-3 sm:h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 sm:h-16 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    ) : inboxes.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400 text-center text-sm sm:text-base">
        No inboxes yet. Create one to get started!
      </p>
    ) : (
      <ul className="space-y-3 sm:space-y-4">
        {inboxes.map((inbox) => (
          <InboxItem
            key={inbox.id}
            inbox={inbox}
            emails={emails[inbox.id] || []}
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
            status={status}
            deleteEmail={deleteEmail} // Pass to InboxItem
          />
        ))}
      </ul>
    )}
  </div>
);

export default InboxList;
