import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

// https://vite.dev/config/
export default defineConfig(props => {
  const env = loadEnv(props.mode, process.cwd(), "VITE_APP");

  const envWithProcessPrefix = {
    "process.env": `${JSON.stringify(env)}`,
  };

  return {
    plugins: [react()],
    define: envWithProcessPrefix,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})


// export default defineConfig({
//   plugins: [react()],
//   define: 
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })
