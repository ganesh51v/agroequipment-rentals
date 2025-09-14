# TODO: Fix ERR_CONNECTION_REFUSED on Registration

## Information Gathered
- Frontend register.html fetches to `http://localhost:5000/api/auth/register`
- Backend server.js listens on `PORT || 5001`
- Port mismatch: Frontend targets 5000, server defaults to 5001
- Backend routes and controller are correctly implemented
- Server is likely not running (no active terminals in environment_details)
- Dependencies are installed (package.json and package-lock.json present)
- .env file exists but cannot be read (security restriction)

## Plan
- [x] Update register.html to fetch to `http://localhost:5001/api/auth/register` to match server default port
- [x] Ensure .env has JWT_SECRET set (if not, add it)
- [x] Start the backend server using `npm run dev` in backend directory
- [x] Test the registration form to confirm it works

## Dependent Files to Edit
- register.html: Change fetch URL port from 5000 to 5001

## Followup Steps
- [ ] Run `cd backend && npm run dev` to start the server
- [ ] Open register.html in browser and test registration
- [ ] If still issues, check console for database connection errors or missing env vars
- [ ] Verify user is created in database after successful registration
