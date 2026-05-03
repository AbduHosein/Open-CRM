# Open-CRM

By: Abdu Hosein, Phillip Lane

A basic v1 CRM made with Django + SQLite + Typescript React for solopreneurs or small agencies.

<img width="1266" height="423" alt="image" src="https://github.com/user-attachments/assets/293d46a8-f26f-423e-932e-7a98f80a99d8" />

### Quick Start Guide ###

#### Backend - Quick Start ####

[Backend README](src/crm_api)

#### Frontend - Quick Start ####

[Frontend README](src/frontend)


#### First Time Signing In ####
1. Follow this article [Build Secure Google Sign-In with React, TypeScript + Node.js](https://medium.com/@anjanaindumini128/build-secure-google-sign-in-with-react-typescript-node-js-677394b8543a)
2. Once you have your gooogle client id add it your your frontend .env file at /src/frontend/.env:
```
VITE_GOOGLE_CLIENT_ID=<client id generated for your google cloud client>
```
3. Launch the app and press Sign in with Google.
4. Upon success the first user is automatically approved and made an admin.

#### Features List ####
- Google SSO Login with basic pending -> approved user flow for admins.
- Home page with basic analytics, Current & Overdue Follow-ups, Quick Actions, and Clients/Projects/Leads splash cards.
- Leads Page with 4 swim lanes and draggable Lead cards for lead capture + monitoring.
- Client and Project pages with Mantine tables to display ongoing relationships/contracts.
- Basic User Management page for admins to approve/manage users

<img width="1274" height="945" alt="image" src="https://github.com/user-attachments/assets/33f4952c-8b97-4ac8-8fc8-288c66234a16" />
