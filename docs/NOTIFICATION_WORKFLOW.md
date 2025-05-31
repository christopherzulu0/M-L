# Notification Workflow Documentation

This document explains the complete workflow for notifications in the MLS application, focusing on invoice notifications.

## Overview

The notification system in the MLS application uses Knocklabs to send notifications to users. The workflow involves several components:

1. **UI Trigger**: Agent initiates sending an invoice from the Payments dashboard
2. **API Endpoint**: Processes the request and prepares notification data
3. **Knock Integration**: Sends the notification through configured channels
4. **Notification Display**: Shows notification counts and details to users

## Detailed Workflow

### 1. UI Trigger Points

There are two main ways to trigger an invoice notification:

#### From "All Payments" Tab:
1. Agent navigates to the Payments dashboard
2. In the "All Payments" tab, agent clicks the "View" button (eye icon) for a payment
3. From the dropdown menu, agent selects "Send Invoice"
4. The system checks if there's an associated pending purchase
5. If found, it opens the invoice dialog with purchase details
6. Agent can add an optional note
7. Agent clicks "Send Invoice" to trigger the notification

#### From "Pending Invoices" Tab:
1. Agent navigates to the Payments dashboard
2. Switches to the "Pending Invoices" tab
3. Clicks the "View" button for a purchase with remaining payment
4. Selects "Send Invoice" from the dropdown menu
5. The invoice dialog opens with purchase details
6. Agent can add an optional note
7. Agent clicks "Send Invoice" to trigger the notification

### 2. Frontend to Backend Flow

When the agent clicks "Send Invoice" in the dialog:

1. The `handleSendInvoice` function in `app/dashboard/payments/page.tsx` is called
2. It prepares the invoice data with purchase ID and optional notes
3. It makes a POST request to `/api/invoices/send` with this data
4. It shows a loading state while the request is processing
5. On success, it displays a success toast message and closes the dialog
6. On failure, it displays an error toast message

### 3. API Endpoint Processing

The API endpoint in `app/api/invoices/send/route.ts` handles the request:

1. It receives the POST request with purchase ID and optional notes
2. It validates that the purchase ID is provided
3. It fetches the purchase details from the database, including property and buyer information
4. It validates that the buyer has an email address
5. It identifies the user in Knock's system using the `identifyUser` function
6. It sends the invoice notification using the `sendInvoiceNotification` function
7. It logs the activity in the database
8. It returns a success or error response

### 4. Knock Integration

The Knock integration in `lib/knock.ts` handles sending the notification:

1. The `identifyUser` function registers or updates the user in Knock's system with their email and name
2. The `sendInvoiceNotification` function triggers the 'invoice-notification' workflow in Knock
3. It provides recipient information (buyer ID)
4. It provides data for the notification templates:
   - Purchase ID
   - Buyer name
   - Property title
   - Total amount
   - Remaining amount
   - Optional notes
   - Invoice URL for the client to access

### 5. Notification Delivery

Knock delivers the notification through configured channels:
1. Email notifications
2. In-app notifications
3. Other channels as configured in the Knock dashboard

### 6. Notification Display

Notifications are displayed to users in the dashboard:

1. The dashboard layout (`app/dashboard/layout.tsx`) fetches the unread notification count
2. It displays a badge with the count on the bell icon in the top navigation
3. It also displays the badge on the "Notifications" link in the sidebar
4. The count refreshes every 5 minutes
5. Users can click on the bell icon or "Notifications" link to view their notifications

## Data Flow Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  UI Component   │────▶│   API Endpoint  │────▶│  Knock Library  │────▶│  Knock Service  │
│                 │     │                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                                               │
        │                       │                                               │
        ▼                       ▼                                               ▼
┌─────────────────┐     ┌─────────────────┐                           ┌─────────────────┐
│                 │     │                 │                           │                 │
│  Toast Message  │     │  Activity Log   │                           │  Notification   │
│                 │     │                 │                           │   Channels      │
└─────────────────┘     └─────────────────┘                           └─────────────────┘
                                                                              │
                                                                              │
                                                                              ▼
                                                                     ┌─────────────────┐
                                                                     │                 │
                                                                     │   User Device   │
                                                                     │                 │
                                                                     └─────────────────┘
```

## Configuration

To configure the notification system:

1. Set up a Knock account and create an 'invoice-notification' workflow
2. Configure the channels you want to use (email, SMS, etc.)
3. Design your notification templates for each channel
4. Add your Knock API key to the `.env.local` file
5. Set the `NEXT_PUBLIC_APP_URL` environment variable for correct invoice URLs

## Troubleshooting

If notifications are not being sent or displayed:

1. Check that your Knock API key is correct in the environment variables
2. Verify that the workflow slug in `lib/knock.ts` matches your Knock workflow
3. Check the browser console and server logs for errors
4. Ensure the client has a valid email address
5. Check that the `/api/notifications` endpoint is working correctly