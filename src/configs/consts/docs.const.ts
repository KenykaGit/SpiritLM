export function docsCode(baseUrl: string) {
  return {
    models: [
      `curl "${baseUrl}/models" \\`,
      '  -H "Authorization: Bearer $SPIRITLM_API_KEY"',
    ].join("\n"),
    chat: [
      `curl "${baseUrl}/chat/completions" \\`,
      '  -H "Authorization: Bearer $SPIRITLM_API_KEY" \\',
      '  -H "Content-Type: application/json" \\',
      "  -d '{",
      '    "model": "deepseek/deepseek-v4-flash",',
      '    "messages": [{"role": "user", "content": "Привет!"}],',
      '    "max_tokens": 128,',
      '    "stream": false',
      "  }'",
    ].join("\n"),
    stream: JSON.stringify({
      model: "deepseek/deepseek-v4-flash",
      messages: [{ role: "user", content: "Привет!" }],
      max_tokens: 128,
      stream: true,
      stream_options: { include_usage: true },
    }, null, 2),
  };
}
