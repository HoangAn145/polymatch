import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  readdir,
  readFile,
  writeFile,
  rm,
} from "node:fs/promises";
import { join, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { transform } from "esbuild";
import { readApiResponse } from "../src/lib/apiResponse";

test("chat function loads as native Node ESM without a TS loader or bundler", async () => {
  const root = process.cwd();
  const output = await mkdtemp(join(root, ".runtime-check-"));
  try {
    await writeFile(join(output, "package.json"), '{"type":"module"}');
    for (const dir of ["api", "server", "src/lib"]) {
      for (const file of await readdir(join(root, dir), { recursive: true })) {
        if (!file.endsWith(".ts")) continue;
        const dest = join(output, dir, file.replace(/\.ts$/, ".js"));
        await mkdir(dirname(dest), { recursive: true });
        const result = await transform(
          await readFile(join(root, dir, file), "utf8"),
          {
            loader: "ts",
            format: "esm",
            target: "node22",
          },
        );
        await writeFile(dest, result.code);
      }
    }
    const code = `import handler from './api/chat.js';
      delete process.env.SUPABASE_URL; delete process.env.SUPABASE_ANON_KEY;
      let status, payload;
      await handler({method:'POST',headers:{},body:{}}, {
        setHeader(){}, status(s){status=s;return this}, json(p){payload=p;return this}
      });
      if(status!==503 || typeof payload.error!=='string') process.exit(1);`;
    execFileSync(process.execPath, ["--input-type=module", "-e", code], {
      cwd: output,
      env: { ...process.env, NODE_OPTIONS: "" },
      stdio: "pipe",
    });
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});

test("API client handles platform text errors without exposing raw server output", async () => {
  await assert.rejects(
    readApiResponse(
      new Response("A server error has occurred", { status: 500 }),
    ),
    /HTTP 500/,
  );
  await assert.rejects(
    readApiResponse(new Response("<html>timeout</html>", { status: 504 })),
    /phản hồi quá lâu/,
  );
  await assert.rejects(
    readApiResponse(
      new Response('{"error":"Vui lòng đăng nhập."}', { status: 401 }),
    ),
    /Vui lòng đăng nhập/,
  );
  assert.deepEqual(await readApiResponse(new Response('{"answer":"OK"}')), {
    answer: "OK",
  });
});
