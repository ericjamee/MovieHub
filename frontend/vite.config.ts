import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    headers: {
      "Content-Security-Policy": `
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  font-src 'self' data:;
  img-src 'self' data:;
  connect-src 'self' https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net;
  object-src 'none';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\n/g, ""),
    },
  },
});
