import { Icon } from "./icon";
import { API_BASE_URL, QUICK_START_MODEL_ID } from "../../../../configs/api";
import { Card } from "@/components/ui/card";

export function QuickStart() {
  return (
    <section className="quick-start section-pad" id="quick-start">
      <div className="quick-start-copy">
        <h2>
          Первый запрос за пару минут.
        </h2>
        <p>Укажите API-ключ в переменной окружения и отправьте первый запрос через OpenAI SDK.</p>
      </div>

      <Card className="quick-code">
        <div className="quick-code-head">
          <span>Node.js</span>
          <span className="code-file">app.ts</span>
          <span className="quick-code-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>

        <pre>
          <code>
            <span className="code-purple">const</span> client ={" "}
            <span className="code-purple">new</span> OpenAI(&#123;{"\n"}
            {"  "}apiKey: process.env.
            <span className="code-yellow">SPIRITLM_API_KEY</span>,{"\n"}
            {"  "}baseURL:{" "}
            <span className="code-green">
              &quot;{API_BASE_URL}&quot;
            </span>
            ,{"\n"}
            &#125;);{"\n\n"}
            <span className="code-purple">const</span> answer ={" "}
            <span className="code-purple">await</span>{" "}
            client.chat.completions.create(&#123;{"\n"}
            {"  "}model:{" "}
            <span className="code-green">
              &quot;{QUICK_START_MODEL_ID}&quot;
            </span>
            ,{"\n"}
            {"  "}messages: [&#123; role:{" "}
            <span className="code-green">&quot;user&quot;</span>, content:{" "}
            <span className="code-green">&quot;Привет!&quot;</span>{" "}
            &#125;],{"\n"}
            &#125;);
          </code>
        </pre>

        <div className="quick-code-foot">
          Совместимо с OpenAI SDK
        </div>
      </Card>
    </section>
  );
}
