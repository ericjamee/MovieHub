import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Ensure this matches the output directory in Azure
  },
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
