# Portfólio Emanuel Alves

Este é o projeto oficial do portfólio do atleta **Emanuel Alves**, uma aplicação web moderna e dinâmica projetada para exibir conquistas, trajetória, galeria de fotos e gerenciar parcerias.

A aplicação conta com um sistema de gerenciamento de conteúdo (CMS) integrado por meio de um painel administrativo, permitindo atualizações em tempo real sem a necessidade de alterações no código.

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando as melhores tecnologias do ecossistema JavaScript:

- **Frontend**: [React 19](https://react.dev/) com [Vite](https://vitejs.dev/) para um desenvolvimento rápido e otimizado.
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) para um design moderno, responsivo e de alta performance.
- **Animações**: [Framer Motion](https://www.framer.com/motion/) e [Motion](https://motion.dev/) para transições suaves e interações premium.
- **Backend & Banco de Dados**: [Supabase](https://supabase.com/) (PostgreSQL) para armazenamento de dados, autenticação de usuários e gerenciamento de arquivos (fotos da galeria).
- **Roteamento**: [React Router DOM](https://reactrouter.com/) para navegação entre as páginas do site e o painel administrativo.
- **Ícones**: [Lucide React](https://lucide.dev/) para uma interface intuitiva.

## ✨ Funcionalidades

### 🏠 Landing Page (Página Inicial)
- **Hero Section**: Apresentação principal com imagem de destaque e impacto.
- **Sobre**: Biografia detalhada e informações do atleta.
- **Trajetória**: Timeline interativa mostrando a evolução na carreira.
- **Estatísticas**: Contador de conquistas e números relevantes.
- **Conquistas/Títulos**: Exibição detalhada de medalhas e resultados em competições.
- **Galeria**: Mural de fotos organizado por categorias.
- **Patrocinadores**: Espaço dedicado aos parceiros e apoiadores.
- **Contato**: Informações de contato direto e links para redes sociais.

### 🔐 Painel Administrativo (`/dev`)
O projeto inclui uma área restrita e protegida por autenticação para gerenciamento completo dos dados:
- **Perfil**: Edição de nomes, bios, fotos e redes sociais.
- **Estatísticas**: Gerenciamento de números e labels exibidos.
- **Timeline**: Adição e edição de eventos na trajetória histórica.
- **Conquistas**: Controle total sobre os títulos e medalhas exibidos.
- **Galeria**: Upload e organização de imagens.
- **Patrocinadores**: Gestão de logos e links dos parceiros.

## 🛠️ Configuração e Instalação

### Pré-requisitos
- Node.js instalado.
- Conta no Supabase.

### Passos para instalação

1. **Clonar o repositório**:
   ```bash
   git clone https://github.com/apenask/portifolioemanuelalves.git
   cd portifolioemanuelalves
   ```

2. **Instalar dependências**:
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente**:
   Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:
   ```env
   VITE_SUPABASE_URL=SUA_URL_DO_SUPABASE
   VITE_SUPABASE_ANON_KEY=SUA_KEY_ANON_DO_SUPABASE
   ```

> **Importante (Netlify):** não coloque essas variáveis entre aspas no painel de Environment Variables. Aspas extras podem gerar erro **401 Unauthorized** no Supabase.

4. **Rodar o projeto**:
   ```bash
   npm run dev
   ```

## 🏗️ Estrutura do Projeto

- `src/components`: Componentes reutilizáveis divididos por seções (Home e Admin).
- `src/context`: Gerenciamento de estado global (Dados e Autenticação).
- `src/lib`: Configurações de bibliotecas externas (Supabase, Utils).
- `src/pages`: Páginas principais da aplicação.
- `supabase/`: Scripts SQL para inicialização do banco de dados.

## 🧪 Debug rápido de erro do Supabase (no navegador)

Se quiser ver o erro real no **Console** (DevTools), rode:

```js
await window.debugSupabase()
```


Se aparecer `window.debugSupabase is not a function`:
1. confirme que o deploy mais recente foi publicado,
2. faça um hard refresh (Ctrl+F5),
3. rode `typeof window.debugSupabase` (deve retornar `"function"`).

Esse comando retorna:
- se URL/chave foram carregadas no build (`hasUrl`, `hasKey`),
- prefixo da chave (sem expor a chave completa),
- `statusCode`, `message` e `details` do Supabase.

> Se vier `statusCode: "401"`, normalmente é chave `anon` inválida, errada, ou com aspas extras no ambiente de deploy.

## 📄 Licença

Este projeto é de uso privado para o atleta Emanuel Alves.
