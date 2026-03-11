import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
export default defineConfig(({ mode }) => {
    const rootDir = fileURLToPath(new URL(".", import.meta.url));
    const env = loadEnv(mode, rootDir, "");
    const proxyTarget = env.VITE_PROXY_TARGET;

    return {
        plugins: [react(), tailwindcss()],
        server: proxyTarget
            ? {
                  proxy: {
                      "/auth": {
                          target: proxyTarget,
                          changeOrigin: true,
                          secure: false,
                      },
                      "/attendance": {
                          target: proxyTarget,
                          changeOrigin: true,
                          secure: false,
                      },
                      "/employees": {
                          target: proxyTarget,
                          changeOrigin: true,
                          secure: false,
                      },
                      "/departments": {
                          target: proxyTarget,
                          changeOrigin: true,
                          secure: false,
                      },
                      "/roles": {
                          target: proxyTarget,
                          changeOrigin: true,
                          secure: false,
                      },
                      "/reports": {
                          target: proxyTarget,
                          changeOrigin: true,
                          secure: false,
                      },
                  },
              }
            : undefined,
    };
});
