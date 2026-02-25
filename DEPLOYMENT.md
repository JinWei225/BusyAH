# Deployment Guide: Vercel & Turso

This guide walks you through deploying your BusyAH Next.js application to Vercel and setting up a production database on Turso.

## Part 1: Setting up Turso (Production Database)

You'll need a live Turso database to connect to your Vercel app, as the local SQLite file (`local.db`) won't work in a serverless environment like Vercel.

1. **Create a Turso Account & Install CLI:**
   - Sign up at [turso.tech](https://turso.tech).
   - Install the Turso CLI on your Mac (if you haven't already):
     ```bash
     brew install tursodatabase/tap/turso
     ```
   - Authenticate with the CLI:
     ```bash
     turso auth login
     ```

2. **Create the Database:**
   - Create a new database for your app:
     ```bash
     turso db create busyah-db
     ```
   - Get the database URL (you will need this for Vercel):
     ```bash
     turso db show busyah-db --url
     ```
     *(It will look something like: `libsql://busyah-db-yourusername.turso.io`)*

3. **Get the Authentication Token:**
   - Create a token to access your database:
     ```bash
     turso db tokens create busyah-db
     ```

4. **Push Your Schema to Turso:**
   - To create the tables in your new production database, set the environment variables locally temporarily or use the Turso CLI.
   - Run the following in your terminal, replacing the URL and Token with the ones you just got:
     ```bash
     TURSO_DATABASE_URL="your-turso-db-url" TURSO_AUTH_TOKEN="your-turso-token" npm run db:push
     ```

## Part 2: Deploying to Vercel

1. **Push your code to GitHub:**
   - Create a repository on GitHub (e.g., `busyah-app`).
   - Push your local `/Users/jinwei/BusyAH` directory to this GitHub repository.

2. **Import Project to Vercel:**
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **Add New...** -> **Project**.
   - Import the GitHub repository you just created.

3. **Configure Environment Variables in Vercel:**
   - Before clicking "Deploy", open the **Environment Variables** section.
   - Add the following variables:
     - `GOOGLE_API_KEY`: **This is NOT your Client Secret.** Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials), click "Create Credentials" -> "API Key".
     - `GOOGLE_CALENDAR_ID`: **This is NOT your Client ID.** Open Google Calendar (web), go to Settings for your calendar -> "Integrate calendar" -> copy the "Calendar ID" (usually your email).
     - `TURSO_DATABASE_URL`: *(Paste the URL from Turso)*
     - `TURSO_AUTH_TOKEN`: *(Paste the Token from Turso)*

4. **Deploy:**
   - Click the **Deploy** button.
   - Vercel will automatically detect that it's a Next.js app, run `npm run build`, and deploy your app.

## Part 3: Updating Capacitor (Android App)

Once your Vercel app is live, you'll get a production URL (e.g., `https://busyah.vercel.app`).

1. **Update Capacitor Config:**
   - Open `capacitor.config.ts` in your local project.
   - Change the `server.url` to your new Vercel URL:
     ```typescript
     server: {
       url: 'https://busyah.vercel.app', // <-- UPDATE THIS
       cleartext: true
     }
     ```

2. **Sync Settings to Android:**
   - Run the following command to update the Android project with the new configuration:
     ```bash
     npx cap open android
     ```
   - Then, inside Android Studio, you can build your APK or run it on an emulator/device. The app will now communicate with your live Vercel deployment!
