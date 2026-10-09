# PC Builder Guide

## Descrição e objetivo

O PC Builder Guide é um site educativo em português brasileiro sobre componentes de computadores e etapas básicas de montagem. Foi desenvolvido para a Tarefa 07 da disciplina de Web Design, com foco em estrutura semântica, CSS externo, Box Model, Flexbox e responsividade.

O objetivo é ajudar iniciantes a reconhecerem a função das peças, observarem critérios básicos de compatibilidade e seguirem uma sequência inicial de montagem. O conteúdo é informativo e não substitui os manuais dos fabricantes ou assistência técnica especializada.

## Requisitos acadêmicos atendidos

- Página semântica com cabeçalho, navegação, conteúdo principal, seções, artigos, listas, FAQ e rodapé;
- Catálogo com 20 componentes de hardware, descrições, categoria, ficha de verificação, ilustrações e textos alternativos;
- Guia de montagem, FAQ, orientações de segurança e navegação por âncoras;
- HTML com mais de 400 linhas e CSS com mais de 300 linhas;
- Demonstração explícita de Content, Padding, Border e Margin nos 20 cartões do catálogo;
- Mais de 20 declarações de Flexbox distribuídas entre os layouts;
- Media queries para desktop, tablet e celular;
- Comentários explicativos no HTML e nos blocos principais de CSS.

## Tecnologias utilizadas

- HTML5;
- CSS3 externo;
- SVG local para ilustrações esquemáticas dos componentes;
- Git para versionamento local.

Não foram usados frameworks, bibliotecas de componentes, dependências externas de CSS ou JavaScript.

## Estrutura de arquivos

```text
Tarefa - 07/
├── assets/
│   ├── placa-mae.webp
│   ├── processador.webp
│   ├── placa-video.webp
│   ├── ...
│   └── pasta-termica.webp
├── index.html
├── style.css
└── README.md
```

## Box Model

Os 20 elementos `.hardware-card` são a demonstração principal do Box Model. Cada cartão recebe `width`, `min-height`, `margin`, `padding` e `border`, enquanto o conteúdo interno possui altura mínima, margem, preenchimento e borda superior. Assim, as quatro áreas do modelo de caixa ficam verificáveis diretamente no CSS e aplicadas a elementos reais do catálogo.

## Flexbox

O layout usa Flexbox no cabeçalho, menu, hero, catálogo, cartões, fichas técnicas, guia de montagem, FAQ, seção sobre e rodapé. Há uso funcional de `display`, `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `align-content`, `align-self`, `flex-grow`, `flex-shrink`, `flex-basis`, `flex`, `gap`, `row-gap`, `column-gap` e `order`.

No catálogo, os cartões se distribuem conforme o espaço disponível. Em telas menores, eles passam naturalmente para novas linhas e, no celular, ocupam uma coluna.

## Como executar

1. Abra o arquivo `Tarefa - 07/index.html` em um navegador moderno.
2. Use o menu para navegar pelas seções da página.
3. Não há instalação, servidor local ou dependência necessária.

## Responsividade

- Desktop: hero horizontal e múltiplos cartões por linha;
- Tablet: redução de espaçamentos e cartões com base flexível;
- Celular: cabeçalho e hero empilhados, catálogo em uma coluna e fichas técnicas adaptadas;
- Telas muito estreitas: detalhes das fichas técnicas passam para orientação vertical para preservar a legibilidade.

## Histórico resumido

| Versão | Descrição |
| --- | --- |
| 0.1.0 | Estrutura inicial, navegação e hero |
| 0.2.0 | Catálogo de 20 componentes |
| 0.3.0 | Aplicação do Box Model |
| 0.3.1 | Correção das imagens do catálogo |
| 0.4.0 | Organização dos layouts com Flexbox |
| 0.5.0 | Responsividade |
| 0.6.0 | Guia de montagem |
| 0.7.0 | FAQ, conteúdo complementar e rodapé |
| 0.8.0 | Comentários explicativos |
| 1.0.0 | Documentação final |

## Capturas de tela

> Espaço reservado para captura da versão desktop.

> Espaço reservado para captura da versão tablet.

> Espaço reservado para captura da versão celular.

## Repositório

[github.com/s2ddv/web-design](https://github.com/s2ddv/web-design)
