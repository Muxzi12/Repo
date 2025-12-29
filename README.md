# Gitly

Gitly is a web application that allows users to connect their GitHub account, browse their repositories, and upload selected repository metadata into a database for further use across creator, developer, and launch-based workflows.

The project is designed to be a lightweight foundation for building developer-focused platforms that rely on GitHub identity, repository ownership, and authenticated access.

---

## Overview

Gitly provides a simple and secure way to:

- Authenticate users via GitHub OAuth
- Access a user’s GitHub repositories with permission
- Allow users to select repositories they own or contribute to
- Store repository metadata in a database
- Build additional features on top of verified GitHub ownership

Authentication and session management are handled entirely by Supabase, ensuring a reliable and production-ready OAuth flow without custom callback handling.

---

## Core Features

- GitHub authentication using Supabase Auth
- Secure OAuth flow with hosted callback
- Access to public and private repositories based on granted scopes
- Repository selection and metadata ingestion
- Database-backed storage with row-level security
- Clean separation between authentication, data, and UI layers

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Supabase (Auth and Database)
- GitHub OAuth
- GitHub REST API

---

## Authentication Flow

Gitly uses Supabase Auth with the GitHub provider.

The OAuth process works as follows:

1. User clicks "Connect GitHub"
2. User is redirected to GitHub for authorization
3. GitHub redirects to Supabase’s hosted callback
4. Supabase exchanges the authorization code for a session
5. User is redirected back to the application with an active session

No custom OAuth callback routes are implemented in the application.

---

## Repository Access

Once authenticated, Gitly retrieves the GitHub access token from the Supabase session and uses it to query the GitHub API.

Repository data that may be stored includes:

- Repository ID
- Name and full name
- URL
- Visibility (public or private)
- Default branch
- Metadata such as stars and forks

Only metadata is stored by default. Repository source code is not copied unless explicitly implemented.

---

## Environment Variables

The following environment variables are required:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

These values can be found in the Supabase project dashboard.

---

## Security

- OAuth tokens are managed by Supabase and not stored manually
- Row-level security ensures users can only access their own data
- No private keys or secrets are exposed to the client
- Authentication state is derived directly from Supabase sessions

---

## Development

To run the project locally:

1. Install dependencies
2. Configure environment variables
3. Start the development server
4. Connect a GitHub account through the UI

GitHub OAuth must be configured in both GitHub Developer Settings and the Supabase dashboard for authentication to function correctly.

---

## Future Extensions

Gitly is designed to be extended with additional features such as:

- Repository-based deployments
- Token launches tied to GitHub ownership
- On-chain actions linked to verified repositories
- Monetization and access control
- Webhooks for repository updates

---

## License

This project is provided as-is. Licensing can be added based on project requirements.
