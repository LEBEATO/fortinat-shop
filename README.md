🛒 Fortinat Shop

Um projeto moderno inspirado na loja do Fortnite, desenvolvido em Next.js, integrado com Prisma, Neon Database e a Fortnite API.

Este repositório contém uma aplicação completa para listar cosméticos, exibir detalhes, permitir compra, devolver itens e muito mais.


---

🚀 Tecnologias Utilizadas

Next.js 14 (App Router)

TypeScript

Prisma ORM

Neon (PostgreSQL Serverless)

Fortnite API

TailwindCSS

Lucide Icons

React Hooks



---

📦 Funcionalidades

✔️ Listagem completa de cosméticos da API Fortnite<br> ✔️ Sistema de compra de itens<br> ✔️ Sistema de devolução<br> ✔️ Página de itens adquiridos<br> ✔️ Interface moderna e responsiva<br> ✔️ Integração com banco de dados Neon<br> ✔️ Transformação de dados personalizados da API<br>


---

⚙️ Como instalar e rodar o projeto

🔧 1. Clonar o repositório

git clone https://github.com/SEU-USUARIO/fortinat-shop.git
cd fortinat-shop

📥 2. Instalar dependências

npm install

🗄️ 3. Configurar o Prisma

Crie o arquivo .env:

DATABASE_URL="sua_url_do_neon"

Depois execute:

npx prisma generate
npx prisma db push

▶️ 4. Rodar o projeto

npm run dev

A aplicação ficará disponível em:
http://localhost:3000


---

📁 Estrutura do Projeto

fortinat-shop/
 ├─ app/                # Páginas e rotas do Next.js
 ├─ components/         # Componentes reutilizáveis (Cards, Navbar etc)
 ├─ lib/                # Funções auxiliares e integração com API
 ├─ prisma/             # Schema do Prisma
 ├─ public/             # Imagens e arquivos estáticos
 └─ types/              # Tipagens TypeScript


---

🔗 Fortnite API

A aplicação consome dados diretamente da Fortnite API v2:

/shop – Itens da loja

/cosmetics – Lista de cosméticos


Mais detalhes estão disponíveis na documentação oficial.


---

📸 Prévia (opcional)

Adicione prints aqui depois, se quiser.


---

📝 Licença

Este projeto está sob a licença MIT. Sinta‑se livre para usar, alterar e contribuir.


---

💬 Contato

Se quiser ajuda ou melhorias, estou por aqui! ✨
