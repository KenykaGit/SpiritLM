import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";
import { docsCode } from "../src/configs/consts/docs.const";
import { MODEL_GROUPS } from "../src/configs/consts/models.const";

const code = docsCode("https://spiritlm.example/v1/");

function curlArguments(example: string): string[] {
  // Replace curl with an argument recorder; never contact an upstream.
  const output = execFileSync("bash", ["--noprofile", "--norc", "-e", "-c", [
    'curl() { printf "%s\\0" "$@"; }',
    example,
  ].join("\n")], {
    encoding: "utf8",
    env: {
      PATH: process.env.PATH,
      NODE_ENV: "test",
      SPIRITLM_API_KEY: "test-secret",
      SPIRITLM_BASE_URL: "https://spiritlm.example/v1",
    },
  });
  return output.split("\0").filter(Boolean);
}

test("copied curl examples expand credentials and send valid Chat Completions JSON", () => {
  const models = curlArguments(code.models);
  assert.ok(models.includes("https://spiritlm.example/v1/models"));
  assert.ok(models.includes("Authorization: Bearer test-secret"));

  for (const [example, streaming] of [[code.chat, false], [code.stream, true]] as const) {
    const args = curlArguments(example);
    assert.ok(args.includes("https://spiritlm.example/v1/chat/completions"));
    assert.ok(args.includes("Authorization: Bearer test-secret"));
    assert.ok(args.includes("Content-Type: application/json"));
    assert.equal(args.includes("-N"), streaming);
    const body = JSON.parse(args[args.indexOf("-d") + 1]);
    assert.equal(body.stream, streaming);
    assert.ok(MODEL_GROUPS.some((group) =>
      group.models.some((model) => model.id === body.model),
    ));
    assert.deepEqual(body.messages, [{ role: "user", content: "Привет!" }]);
    assert.equal(body.max_tokens, 128);
  }
});

test("OpenCode example uses Chat Completions and keeps all catalog IDs unchanged", () => {
  const config = JSON.parse(code.opencode);
  const provider = config.provider.spiritlm;
  assert.equal(provider.npm, "@ai-sdk/openai-compatible");
  assert.equal(provider.options.baseURL, "https://spiritlm.example/v1");
  assert.equal(provider.options.apiKey, "{env:SPIRITLM_API_KEY}");
  assert.deepEqual(
    Object.keys(provider.models),
    MODEL_GROUPS.flatMap((group) => group.models.map((model) => model.id)),
  );
  const modelId = config.model.slice("spiritlm/".length);
  assert.ok(provider.models[modelId]);
});

test("documented SSE data frames parse as JSON until the terminal DONE marker", () => {
  const frames = code.streamResponse.trim().split("\n\n");
  assert.equal(frames.pop(), "data: [DONE]");
  const chunks = frames.map((frame) => JSON.parse(frame.slice("data: ".length)));
  assert.equal(chunks[0].choices[0].delta.content, "Привет!");
  const usageChunk = chunks.at(-1);
  assert.deepEqual(usageChunk.choices, []);
  assert.equal(
    usageChunk.usage.total_tokens,
    usageChunk.usage.prompt_tokens + usageChunk.usage.completion_tokens,
  );
  assert.equal(
    JSON.parse(code.streamError.slice("data: ".length)).error.code,
    "stream_interrupted",
  );
});
