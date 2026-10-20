import { API_BASE_URL, QUICK_START_MODEL_ID } from "../../../configs/consts/api.const";
import { Card } from "@/components/ui/card";

export function QuickStart() {
  return (
    <section className="bg-spirit-section" id="quick-start">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-14 sm:px-7 lg:grid-cols-5 lg:items-center lg:gap-16 lg:px-10 lg:py-20">
        <div className="max-w-sm lg:col-span-2">
          <h2 className="font-heading text-4xl font-bold leading-tight tracking-tighter text-balance sm:text-5xl">
            Первый запрос за пару минут.
          </h2>
          <p className="mt-3 text-sm text-spirit-muted">
            Укажите API-ключ в переменной окружения и отправьте первый запрос через OpenAI SDK.
          </p>
        </div>

        <Card className="overflow-hidden rounded-xl border-spirit-code-border bg-spirit-code-bg shadow-2xl lg:col-span-3">
          <div className="flex h-11 items-center gap-3 border-b border-spirit-code-border px-4 text-xs text-spirit-code-label">
            <span>Node.js</span>
            <span className="text-spirit-code-file">app.ts</span>
            <span className="ml-auto flex gap-1" aria-hidden="true">
              <i className="size-2 rounded-full bg-spirit-red" />
              <i className="size-2 rounded-full bg-spirit-amber" />
              <i className="size-2 rounded-full bg-spirit-emerald" />
            </span>
          </div>

          <pre className="overflow-x-auto p-4 font-mono text-xs leading-7 text-spirit-code-text">
            <code>
              <span className="text-spirit-purple">const</span> client ={" "}
              <span className="text-spirit-purple">new</span> OpenAI(&#123;{"\n"}
              {"  "}apiKey: process.env.<span className="text-spirit-yellow">SPIRITLM_API_KEY</span>,{"\n"}
              {"  "}baseURL: <span className="text-spirit-green">&quot;{API_BASE_URL}&quot;</span>,{"\n"}
              &#125;);{"\n\n"}
              <span className="text-spirit-purple">const</span> answer = <span className="text-spirit-purple">await</span>{" "}
              client.chat.completions.create(&#123;{"\n"}
              {"  "}model: <span className="text-spirit-green">&quot;{QUICK_START_MODEL_ID}&quot;</span>,{"\n"}
              {"  "}messages: [&#123; role: <span className="text-spirit-green">&quot;user&quot;</span>, content:{" "}
              <span className="text-spirit-green">&quot;Привет!&quot;</span> &#125;],{"\n"}
              &#125;);
            </code>
          </pre>

          <div className="flex min-h-10 items-center border-t border-spirit-code-border px-4 text-xs text-spirit-code-label">
            Совместимо с OpenAI SDK
          </div>
        </Card>
      </div>
    </section>
  );
}
