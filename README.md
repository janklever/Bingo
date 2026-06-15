# Bingo Brasileiro 🎯

[![Netlify Status](https://api.netlify.com/api/v1/badges/52d93949-5ae8-455f-91d0-fb5b51aaddb0/deploy-status)](https://app.netlify.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Um bingo virtual brasileiro, moderno, open source, estruturado em **React + Vite + SCSS** e 100% responsivo. Perfeito para jogar com amigos, família ou organizar sorteios comunitários.

Este projeto foi reestruturado de forma modular para seguir os padrões modernos de engenharia de software: separação completa de estilos SCSS e componentização de páginas. Sincronização em tempo real via **BroadcastChannel** e geração de QR Codes inclusa.

---

## 🏗️ Estrutura de Pastas

```
Bingo/
├── src/
│   ├── components/         # Componentes compartilhados (Globo, Celebração)
│   ├── pages/              # Páginas da aplicação (Home, Setup, Caller, Card)
│   ├── styles/             # Estilos modulares em Sass (SCSS)
│   ├── App.jsx             # Estado global, áudios e lógica de roteamento
│   └── main.jsx            # Ponto de entrada do React
├── index.html              # Template principal carregado pelo Vite
├── netlify.toml            # Regras de build e cabeçalhos de segurança do Netlify
└── package.json            # Scripts de build e dependências npm
```

---

## ✨ Funcionalidades

- 👑 **Modo Organizador/Sorteador (`Caller.jsx`, `Setup.jsx`)**:
  - Geração de código de sala exclusivo e código QR para compartilhamento.
  - Globo virtual animado em SVG para simulação física das pedras.
  - Sorteio aleatório de pedras de 1 a 75 com feedback sonoro integrado.
  - Histórico visual de pedras já sorteadas.

- 🎟️ **Modo Participante/Cartela (`Card.jsx`)**:
  - Cartelas geradas com números únicos e aleatórios baseados nos padrões de bingo (B-I-N-G-O).
  - Marcador de pedras com validação visual inteligente de pedras válidas.
  - Detecção automática de linhas, colunas e Bingo (cartela cheia).
  - Efeitos visuais premium com confetes coloridos em comemoração a vitórias (`Celebration.jsx`).

- ⚙️ **Sincronização ao vivo**:
  - Comunicação via `BroadcastChannel` para atualizar cartelas abertas na mesma sessão automaticamente quando uma pedra é sorteada.

---

## 🛠️ Tecnologias Utilizadas

- **Vite** como ferramenta de empacotamento rápido (Bundler).
- **React (v18)** com componentes funcionais e hooks.
- **Sass (SCSS)** com variáveis, modulação e keyframes de animação.
- **Web Audio API** para efeitos sonoros retro-sintetizados.
- **QR Code API** integrada para criação de links dinâmicos para os participantes.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js instalado (versão 18 ou superior).

### Instalação
1. Clone este repositório:
   ```bash
   git clone <url-do-seu-repositorio>
   ```
2. Instale as dependências npm:
   ```bash
   npm install
   ```

### Executar servidor de desenvolvimento
```bash
npm run dev
```
O projeto estará disponível por padrão em `http://localhost:5173`.

### Compilar para produção
```bash
npm run build
```

---

## ☁️ Como Hospedar no Netlify

Este projeto está pronto para ser hospedado no Netlify através de integração contínua (CI):

1. Hospede o projeto no seu GitHub.
2. Acesse o site do Netlify, clique em **Add new site** -> **Import an existing project**.
3. Selecione o repositório do GitHub.
4. O Netlify lerá automaticamente o arquivo [netlify.toml](file:///Users/janklever/Documents/Projetos/Bingo/netlify.toml), preenchendo as seguintes configurações:
   - **Build Command**: `npm run build`
   - **Publish directory**: `dist`
5. Clique em **Deploy** e seu site estará online em instantes.

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](file:///Users/janklever/Documents/Projetos/Bingo/LICENSE) para obter mais informações.
