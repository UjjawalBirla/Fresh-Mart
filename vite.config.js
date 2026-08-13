import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/firebase")) {
            if (id.includes("/firebase/auth")) return "firebase-auth";
            if (id.includes("/firebase/firestore")) return "firebase-firestore";
            if (id.includes("/firebase/app")) return "firebase-app";
            return "firebase-core";
          }

          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router")
          ) {
            return "react-vendor";
          }

          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
