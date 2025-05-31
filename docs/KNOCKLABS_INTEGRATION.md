# Knocklabs Integration for Invoice Notifications

This document explains how to set up and use Knocklabs for sending invoice notifications in the MLS application.

## What is Knocklabs?

[Knocklabs](https://knock.app/) is a notification infrastructure service that helps you send notifications across various channels (email, SMS, push, in-app, etc.) with a unified API.

## Setup Instructions

### 1. Install Dependencies

The required dependencies have been added to the project:

```json
"@knocklabs/client": "^0.9.0",
"@knocklabs/node": "^0.4.11",
```

Run `npm install` to install these dependencies.

### 2. Environment Configuration

Create a `.env.local` file in the root of your project with the following variables:

```
KNOCK_API_KEY=your_knock_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Replace `your_knock_api_key_here` with your actual Knock API key.

### 3. Knock Dashboard Setup

1. Sign up for a Knock account at [https://knock.app/](https://knock.app/)
2. Create a new workflow named "invoice-notification"
3. Configure the channels you want to use (email, SMS, etc.)
4. Design your notification templates for each channel
5. Get your API key from the Knock dashboard

## How It Works

### Sending Invoices

The application uses Knocklabs to send invoice notifications to clients. When an agent clicks "Send Invoice" in the payments dashboard, the following happens:

1. The client is identified in Knock's system (if not already)
2. An invoice notification is sent through the configured channels
3. The activity is logged in the database

### Implementation Details

The integration consists of:

1. **Knock Utility** (`lib/knock.ts`): Contains functions for interacting with the Knock API
2. **API Endpoint** (`app/api/invoices/send/route.ts`): Handles invoice sending requests

## Testing

To test the invoice notification:

1. Set up your Knock account and configure the workflow
2. Add your API key to the `.env.local` file
3. Go to the Payments dashboard
4. Select a client with a pending payment
5. Click "Send Invoice"
6. Check the Knock dashboard to verify the notification was sent

## Troubleshooting

If notifications are not being sent:

1. Check that your Knock API key is correct
2. Verify that the workflow slug in `lib/knock.ts` matches your Knock workflow
3. Check the browser console and server logs for errors
4. Ensure the client has a valid email address

## Additional Resources

- [Knock Documentation](https://docs.knock.app/)
- [Knock Node.js SDK](https://github.com/knocklabs/knock-node)
- [Knock React SDK](https://github.com/knocklabs/knock-react)