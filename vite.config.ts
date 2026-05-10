import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    ignorePatterns: ["doc/rbtv-api/official/**"],
    options: { typeAware: true, typeCheck: true },
  },
});
