# Bingo Virtual Brasileiro 🎯

[![Netlify Status](https://api.netlify.com/api/v1/badges/52d93949-5ae8-455f-91d0-fb5b51aaddb0/deploy-status)](https://app.netlify.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Um bingo virtual brasileiro, moderno, open source e 100% responsivo. Perfeito para jogar com amigos, família ou organizar sorteios comunitários. 

O projeto funciona inteiramente no navegador (Client-Side), sem necessidade de banco de dados ou backend complexo, utilizando o poder do **BroadcastChannel** para sincronização ao vivo das pedras sorteadas entre o painel do organizador e as cartelas dos participantes no mesmo dispositivo/navegador, além de geração automatizada de QR Codes.

---

## ✨ Funcionalidades

- 👑 **Modo Organizador/Painel de Sorteio**:
  - Geração de código de sala exclusivo e código QR para compartilhamento.
  - Globo virtual animado em SVG para simulação física das pedras.
  - Sorteio aleatório de pedras de 1 a 75 com feedback sonoro integrado.
  - Histórico visual de pedras já sorteadas.

- 🎟️ **Modo Participante/Cartela**:
  - Cartelas geradas com números únicos e aleatórios baseados nos padrões de bingo (B-I-N-G-O).
  - Marcador de pedras com validação visual inteligente de pedras válidas.
  - Detecção automática de linhas, colunas e Bingo (cartela cheia).
  - Efeitos visuais premium com confetes coloridos em comemoração a vitórias.

- ⚙️ **Sincronização ao vivo**:
  - Comunicação via `BroadcastChannel` para atualizar cartelas abertas na mesma sessão automaticamente quando uma pedra é sorteada.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3** com variáveis CSS e keyframes personalizados para micro-animações.
- **JavaScript Moderno** utilizando um compilador leve e reativo baseado em React UMD sob o capô (`support.js`).
- **Web Audio API** para síntese direta de efeitos sonoros retro-sintetizados sem necessidade de arquivos `.mp3`/`.wav` pesados.
- **QR Code API** integrada para criação em tempo real dos acessos às cartelas.

---

## 🚀 Como Executar Localmente

Como o projeto é totalmente baseado em arquivos estáticos, você não precisa compilar nada.

1. Clone o repositório ou baixe os arquivos.
2. Abra o terminal na pasta do projeto e inicie um servidor web simples. Exemplos:

   **Usando Python (instalado por padrão na maioria dos sistemas):**
   ```bash
   python3 -m http.server 8000
   ```

   **Usando Node.js (via npx/serve):**
   ```bash
   npx serve .
   ```

3. Acesse `http://localhost:8000` no seu navegador.

---

## ☁️ Como Hospedar no Netlify

Este projeto está pronto para ser hospedado no Netlify em apenas 2 cliques!

### Método 1: Arrastar e Soltar (Drag and Drop)
1. Acesse o painel do [Netlify Drop](https://app.netlify.com/drop).
2. Arraste a pasta deste projeto e solte no local indicado.
3. Seu site estará online em poucos segundos!

### Método 2: Integração com Git/GitHub
1. Crie um repositório no seu GitHub e suba este projeto.
2. Acesse o site do Netlify, clique em **Add new site** -> **Import an existing project**.
3. Selecione o repositório do GitHub.
4. As configurações padrão já estão pré-configuradas no arquivo [netlify.toml](file:///Users/janklever/Documents/Projetos/Bingo/netlify.toml). Clique em **Deploy**.

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](file:///Users/janklever/Documents/Projetos/Bingo/LICENSE) para obter mais informações.
