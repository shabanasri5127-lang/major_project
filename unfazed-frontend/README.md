# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Run the MERN application

Start the backend from `unfazed-backend` with `npm run dev` and the frontend from
`unfazed-frontend` with `npm run dev`. The Vite development server proxies `/api`
requests to `http://localhost:5000`. Set `VITE_API_URL` to a full API base URL
(for example `http://localhost:5000/api`) when the frontend and backend are
hosted separately.

The backend `.env` must define `MONGO_URI` and `JWT_SECRET`. Sign-up lets users
choose a patient or doctor account; doctor registration requires a speciality.
Doctors can update their availability from the dashboard. Signed-in users can
update their profile, patients can book appointments, and doctors can manage
appointment status from their dashboard.
