# FinDash — Dashboard Financeiro Pessoal

## Contexto acadêmico

Projeto desenvolvido para a Tarefa 08 da disciplina de Web Design da Facens.

O objetivo é demonstrar uma aplicação front-end completa com HTML5, CSS3 e JavaScript puro.

O FinDash organiza receitas, despesas, orçamentos e indicadores em uma única interface local.

## Objetivos do projeto

- Registrar receitas e despesas pessoais.
- Mostrar indicadores financeiros atualizados.
- Apoiar o planejamento por categorias.
- Aplicar conceitos fundamentais de JavaScript vistos em aula.
- Manter os dados no navegador, sem serviço remoto.
- Oferecer interface responsiva, acessível e em português brasileiro.

## Tecnologias

- HTML5 semântico.
- CSS3 com Grid, Flexbox, variáveis e media queries.
- JavaScript Vanilla.
- Canvas nativo para o gráfico de barras.
- localStorage para persistência.
- Blob e URL.createObjectURL para exportação JSON.
- Git para versionamento incremental.

## Como executar

1. Clone ou baixe o repositório.
2. Acesse a pasta `Tarefa - 08`.
3. Abra `index.html` em um navegador moderno.
4. Não há dependências, instalação ou servidor necessários.

## Estrutura de arquivos

```text
Tarefa - 08/
├── index.html
├── style.css
├── script.js
├── README.md
└── DOCUMENTACAO-ACADEMICA.md
```

## Funcionalidades

### Navegação e apresentação

- Cabeçalho com identidade visual FinDash.
- Menu responsivo para telas menores.
- Link de salto para o conteúdo principal.
- Aviso de privacidade local.

### Lançamentos

- Cadastro de receitas e despesas.
- Descrição, valor, categoria, tipo e data.
- Aceita os formatos `12,50`, `12.50` e `1.234,56`.
- Valida valores positivos e datas reais.
- Armazena montantes em centavos inteiros.
- Renderiza itens pelo DOM sem interpretar texto do usuário como HTML.
- Persiste lançamentos com localStorage.
- Recupera registros ao recarregar a página.

### Resumo financeiro

- Total acumulado de receitas.
- Total acumulado de despesas.
- Saldo geral.
- Contagem de lançamentos.
- Taxa de economia.
- Barra de progresso da taxa de economia.
- Mensagens condicionais para saldo e economia.

### Manutenção e filtros

- Edição de lançamentos no formulário.
- Cancelamento de edição.
- Confirmação antes de exclusão.
- Pesquisa por descrição e categoria.
- Busca independente de acentos e letras maiúsculas.
- Filtro por tipo.
- Filtro por categoria.
- Ordenação por data.
- Mensagem quando não há resultados.

### Orçamentos e gráfico

- Limites mensais recorrentes por categoria.
- Cálculo de gastos limitado ao mês atual.
- Barras de uso e alertas visualmente distintos.
- Edição e exclusão de orçamentos.
- Gráfico Canvas de despesas mensais por categoria.
- Legenda e estado vazio para o gráfico.
- Redesenho após mudanças e redimensionamento.

### Recursos complementares

- Tema claro e escuro persistente.
- Respeito à preferência inicial do sistema.
- Dados demonstrativos opcionais e confirmados.
- Exportação local de dados em JSON.
- Central de ajuda com FAQ expansível.
- Guia financeiro e orientações de privacidade.
- Botão de retorno ao topo.

## Persistência e privacidade

Os dados são guardados no `localStorage` do navegador atual.

Não há login, integração bancária, servidor, banco remoto ou envio automático de informações.

Limpar dados de navegação pode apagar os registros locais.

Use a exportação JSON para criar uma cópia dos lançamentos e orçamentos.

## Acessibilidade e responsividade

O projeto usa rótulos em formulários, foco visível, mensagens com `aria-live`, botões com nomes acessíveis e diálogos nativos.

O layout se adapta para tablet e celular com CSS Grid, Flexbox e media queries.

O tema respeita redução de movimento no sistema.

## Conceitos JavaScript aplicados

- Variáveis, constantes e tipos de dados.
- Operadores aritméticos e condicionais.
- Funções e callbacks.
- Arrays, objetos, `reduce`, `filter`, `find` e `sort`.
- Estruturas de repetição com `forEach`.
- Manipulação segura do DOM.
- `textContent`, `value`, `classList` e `dataset`.
- Eventos com `addEventListener`.
- Elementos criados dinamicamente.
- Datas, formatação internacional e validação.
- APIs de armazenamento, Canvas e download.

## Limitações conhecidas

- Não há importação de JSON nesta versão.
- Não há sincronização entre navegadores ou dispositivos.
- Não há autenticação ou múltiplos perfis.
- O mês de referência de orçamento é o mês atual do dispositivo.
- O FinDash é educativo e não substitui orientação financeira profissional.

## Histórico de versões

- `0.1.0` estrutura inicial e navegação.
- `0.2.0` cadastro e listagem de transações.
- `0.3.0` indicadores financeiros dinâmicos.
- `0.4.0` edição e exclusão de transações.
- `0.5.0` pesquisa e filtros.
- `0.6.0` gerenciamento de orçamentos.
- `0.7.0` gráfico Canvas de despesas.
- `0.8.0` alternância de tema persistente.
- `0.9.0` restauração de dados demonstrativos.
- `0.10.0` exportação de dados em JSON.
- `0.11.0` central de ajuda e guia financeiro.
- `1.0.0` documentação e entrega final.

## Repositório

https://github.com/s2ddv/web-design

## Autor e entrega

Projeto acadêmico desenvolvido no diretório exclusivo da Tarefa 08.

O envio ao Canvas é responsabilidade posterior do aluno.
