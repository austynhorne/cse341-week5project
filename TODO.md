# TODO List for Fixing Render GET Error

- [x] Add `app.set('trust proxy', 1);` to server.js for Render proxy compatibility
- [ ] Advise user to set required environment variables on Render: MONGO_URI, DB_NAME, SESSION_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- [ ] Redeploy the app on Render
- [ ] Check Render logs to ensure the app starts successfully
- [ ] Test a GET request to the API (e.g., root or /api/fish) to verify it works
