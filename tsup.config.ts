import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    schema: "src/schema/index.ts",
    components: "src/components/index.ts",
    sitemap: "src/sitemap/index.ts",
    validation: "src/validation/index.ts",
    og: "src/og/index.ts",
    "adapters/nextjs": "src/adapters/nextjs/index.ts",
    "adapters/react-router": "src/adapters/react-router/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  minify: true,
  clean: true,
  splitting: true,
  treeshake: true,
  external: ["react"],
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".cjs" : ".js",
    };
  },
});
