import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    headers: {
      "Content-Security-Policy": `
        script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:;
      style-src 'self' 'unsafe-inline';
      font-src 'self' data:;
        img-src * data: blob:;
        connect-src *;
      object-src 'none';
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
      `.replace(/\n/g, ""),
    },
  },
});
