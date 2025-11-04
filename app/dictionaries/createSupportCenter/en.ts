import type { SupportCenterLocale } from './createSupportCenter.d.ts';

const en: SupportCenterLocale = {
  label: {
    pageTitle: "Support Center",
    supportRequestList: "Support Requests",
    newRequest: "New Request",
    noRequests: "No support requests found",
    issueType: "Issue Type",
    issueTypePlaceholder: "Please select an issue type",
    technical: "Technical Issue",
    account: "Account Issue",
    billing: "Billing Issue",
    other: "Other",
    subject: "Subject",
    subjectPlaceholder: "Please enter a subject",
    description: "Issue Details",
    descriptionPlaceholder: "Please describe the issue in detail",
    cancel: "Cancel",
    submit: "Submit",
    submitting: "Submitting...",
    status: "Status",
    creator: "Creator",
    createdAt: "Created At",
    updatedAt: "Updated At",
    statusOpen: "Open",
    statusInProgress: "In Progress",
    statusClosed: "Resolved",
    back: "← Back",
    reply: "Reply",
    replyContent: "Reply Content",
    inquiryContent: "Inquiry Content",
    attachedFiles: "Attached Files",
    messagePlaceholder: "Please enter a message",
    markResolved: "Mark as Resolved",
    markUnresolved: "Mark as Unresolved",
    staff: "Staff",
    problemType: "Problem Type",
    technicalIssue: "Technical Issue",
    accountRelated: "Account Related",
    billingRelated: "Billing Related",
    deleteFile: "Delete File",
    fileRemoved: "File has been deleted"
  },
  alert: {
    requestReceived: "Your inquiry has been received. Please wait for contact from our staff.",
    submitFailed: "Failed to submit support request",
    subjectRequired: "Please enter a subject",
    descriptionRequired: "Please enter a description",
    messageRequired: "Please enter a message",
    supportRequestError: "Support request fetch error:"
  }
};

export default en;