# ChatBlue

ChatBlue é um aplicativo de chat em tempo real que suporta mensagens de texto. Ele utiliza o Socket.IO para comunicação em tempo real.

## Funcionalidades

- **Mensagens de Texto:** Envie e receba mensagens de texto em tempo real.
- **Lista de Contatos:** Veja uma lista de usuários conectados.
- **Notificações de Status:** Receba notificações quando usuários entrarem ou saírem do chat.

## Tecnologias Usadas

- **Node.js:** Ambiente de execução para JavaScript no servidor.
- **Express:** Framework para construção de aplicativos web em Node.js.
- **Socket.IO:** Biblioteca para comunicação em tempo real entre o servidor e os clientes.
- **HTML5:** Linguagem de marcação para estruturação da página web.
- **CSS3:** Linguagem de estilo para apresentação da página web.
- **JavaScript:** Linguagem de programação para lógica do lado do cliente e servidor.

## Requisitos

- Node.js (versão 14 ou superior)
- Navegador moderno

## Instalação

1. **Clone o Repositório**

    ```bash
    git clone https://github.com/seu-usuario/chatblue.git
    cd chatblue
    ```

2. **Instale as Dependências**

    ```bash
    npm install
    ```

3. **Inicie o Servidor**

    ```bash
    npm start
    ```

    O servidor será iniciado na porta `3000`.

4. **Abra o Aplicativo**

    Abra seu navegador e vá para [http://localhost:3000](http://localhost:3000).

## Estrutura do Projeto

- **`public/`**: Contém os arquivos estáticos (HTML, CSS, JS).
  - **`index.html`**: Página principal do chat.
  - **`style.css`**: Estilos para a interface do usuário.
  - **`script.js`**: Código JavaScript para a funcionalidade do chat.

- **`server.js`**: Configuração do servidor Node.js com Express e Socket.IO.

## Vídeo Demonstrativo

Veja o vídeo abaixo para uma demonstração do ChatBlue:

[![Vídeo Demonstrativo](https://img.youtube.com/vi/SEU_CODIGO_DE_VÍDEO/maxresdefault.jpg)](https://cdn.discordapp.com/attachments/1244796885512880299/1281392166865997916/demo.mp4?ex=66db8cf3&is=66da3b73&hm=3e95a8cb9aff45578ee1d30d36e9a999bd9497406a01f87d38ee42491495bf0b)

Clique na imagem para assistir ao vídeo.

## Funcionalidade do Servidor

O servidor é responsável por:

- Gerenciar conexões e desconexões de usuários.
- Manter uma lista de usuários online.
- Emitir atualizações de mensagens e usuários para todos os clientes.

## Como Usar

1. **Entrar no Chat:**
   - Insira um nome de usuário na tela de login e clique em "Iniciar Chat".

2. **Enviar Mensagens:**
   - Digite uma mensagem no campo de texto e clique em "Enviar".

## Contribuição

Este código está sendo disponibilizado para fins de estudo e aprendizado. Se você gostaria de contribuir para o ChatBlue, sinta-se à vontade para fazer um fork do repositório e enviar um pull request.

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).
## Contato

Para mais informações ou dúvidas, entre em contato comigo no discord: indiozeraa7

