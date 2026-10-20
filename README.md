# SpiritLM

Стартовый проект на Next.js 15 с App Router и TypeScript. Tailwind CSS 4 и shadcn/ui подготовлены; папка `src/components/ui` предназначена для компонентов shadcn.

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

Добавить компонент shadcn/ui:

```bash
npx shadcn@latest add button
```

`react-hot-toast` уже подключён в корневом layout. Уведомления можно показывать через `import toast from "react-hot-toast"`. Пакет `@taiga-ui/icons` добавлен в зависимости; shadcn/ui не требует установленного `lucide-react` или `sonner`.
