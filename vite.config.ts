import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": ["./bin/ensure-version-consistency", "vp check --fix"],
  },
  fmt: {
    ignorePatterns: ["doc/rbtv-api/official/**"],
  },
  lint: {
    ignorePatterns: ["doc/rbtv-api/official/**"],
    options: { typeAware: true, typeCheck: true },
  },
});
