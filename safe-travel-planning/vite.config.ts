// https://vitejs.dev/config/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => {
  // const env = loadEnv(mode, process.cwd(), "");
  // console.log("Environment Variables:", env); // 환경 변수 로그 추가

  const base = {
    plugins: [react()],
  };

  if ("build" === command) {
    return base;
  }

  // console.log("Proxy target URL:", env.VITE_G_MAP_API_KEY); // 프록시 타겟 URL 로그 추가

  return {
    ...base,
    server: {
      proxy: {
        "/proxy": {
          target: "https://maps.googleapis.com", // 수정된 타겟 URL
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy/, ""),
          secure: false,
          ws: true,
        },
      },
    },
  };
});