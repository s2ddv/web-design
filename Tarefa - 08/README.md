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
└── evidencias/
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
- `1.0.1` tratamento de falhas de armazenamento local e continuidade em memória.
- `1.0.2` geração de datas e períodos financeiros no fuso local.
- `1.0.3` revisão de legibilidade, comentários e organização dos arquivos principais.
- `1.0.4` revisão da documentação acadêmica e registro das evidências.

## Manutenção pós-1.0.0

### Correções aplicadas

- A leitura da preferência de tema agora é protegida contra indisponibilidade do `localStorage`; nesse caso, o tema preferido pelo sistema é aplicado sem interromper a inicialização.
- A escrita do tema, dos lançamentos e dos orçamentos é tratada com recuperação. Quando a persistência falha, os dados continuam disponíveis durante a sessão e a interface informa a limitação.
- A data usada nos campos e na referência mensal passou a ser montada com `getFullYear()`, `getMonth()` e `getDate()`. Assim, o resultado não é deslocado pelo horário UTC.
- Orçamentos e gráfico usam a mesma chave mensal local, sem alterar o significado de registros já existentes.

### Verificações executadas

- `node --check script.js`: concluído sem erros de sintaxe.
- `git diff --check`: concluído sem erros de espaços em branco.
- Datas controladas: validação do formato local para fevereiro bissexto e não bissexto, viradas de mês e de ano.
- Inspeção da prévia local: formulário, filtros, resumo, orçamentos, gráfico, exportação, ajuda e controles de tema foram encontrados na árvore de acessibilidade.
- A referência exibida na prévia foi `outubro de 2026`, coerente com a data local observada de `2026-10-16`.

O clique automatizado para alternar o tema excedeu o tempo de resposta do navegador. Portanto, a alternância visual e as capturas abaixo permanecem como verificação manual pendente; elas não são declaradas como concluídas.

## Evidências para o Canvas

O diretório [`evidencias/`](evidencias/) contém a relação de capturas a inserir. As imagens devem ser feitas na versão local desta entrega, usando somente os dados demonstrativos e sem expor dados financeiros pessoais.

Capturas previstas:

1. Tela inicial em desktop.
2. Cadastro e listagem de transações demonstrativas.
3. Indicadores financeiros.
4. Orçamentos mensais.
5. Gráfico financeiro.
6. Tema escuro.
7. Central de ajuda.
8. Layout em celular.

## Documentação acadêmica para entrega

Este README consolida a documentação final da atividade: identificação, objetivos, tecnologias, estrutura, funcionalidades, conceitos de JavaScript, histórico Git, repositório, testes e evidências. Os códigos completos estão em `index.html`, `style.css` e `script.js`, todos na pasta desta tarefa.

Para a submissão no Canvas, inclua as imagens pendentes indicadas em `evidencias/` e cite este repositório como fonte do código. O arquivo acadêmico separado foi removido intencionalmente do versionamento, conforme orientação do autor.

## Repositório

https://github.com/s2ddv/web-design

## Autor e entrega

Projeto acadêmico desenvolvido no diretório exclusivo da Tarefa 08.

O envio ao Canvas é responsabilidade posterior do aluno.
