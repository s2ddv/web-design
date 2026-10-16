# Documentação Acadêmica — Tarefa 08

## Identificação

Disciplina: Web Design.

Instituição: Facens.

Atividade: Tarefa 08.

Projeto: FinDash — Dashboard Financeiro Pessoal.

## Objetivo

Construir uma aplicação front-end para acompanhamento financeiro pessoal.

O sistema registra receitas, despesas, orçamentos e indicadores sem depender de servidor.

## Metodologia de desenvolvimento

O projeto foi desenvolvido em incrementos funcionais.

Cada incremento foi implementado, verificado com análise de sintaxe e `git diff --check`, adicionado ao stage e registrado em um commit próprio.

Essa estratégia preservou um histórico em que cada versão representa um estado navegável do produto.

## Tecnologias utilizadas

- HTML5 para estrutura semântica.
- CSS3 para identidade visual, temas e responsividade.
- JavaScript puro para comportamento e dados.
- localStorage para persistência.
- Canvas para gráfico de barras.
- APIs Blob e URL para exportação.
- Git para versionamento.

## Estrutura do código

O arquivo `index.html` contém as seções de apresentação, resumo, lançamentos, planejamento, gráfico e diálogos.

O arquivo `style.css` contém variáveis de tema, layout, componentes, media queries e estilos de acessibilidade.

O arquivo `script.js` organiza configurações, estado, referências DOM, persistência, transações, indicadores, filtros, orçamentos, gráfico, tema, exportação e ajuda.

Os códigos-fonte completos estão disponíveis no mesmo diretório desta documentação.

## Modelo de dados

Uma transação possui os campos `id`, `type`, `description`, `amountCents`, `category`, `date` e `createdAt`.

Um orçamento possui `category` e `limitCents`.

Valores são guardados como inteiros em centavos para evitar problemas de ponto flutuante.

Datas são validadas no formato ISO `YYYY-MM-DD`.

## Funcionalidades implementadas

### Cadastro de transações

O formulário permite criar receitas ou despesas e valida descrição, categoria, data e valor.

As entradas `12,50`, `12.50` e `1.234,56` são convertidas em centavos.

Texto do usuário é colocado com `textContent`, evitando injeção de HTML.

### Persistência

Os lançamentos e orçamentos usam chaves independentes de localStorage.

Ao abrir novamente a página, dados estruturados são recuperados e validados antes da renderização.

### Indicadores

Receitas, despesas e saldo são acumulados sobre todo o histórico.

A taxa de economia usa a fórmula `(receitas - despesas) / receitas × 100` quando há receitas.

### Edição e exclusão

Editar leva os dados do item selecionado ao formulário.

Excluir abre um diálogo nativo com explicação e opção de cancelamento.

### Pesquisa e filtros

A normalização de texto remove diacríticos e diferenciação de maiúsculas.

Tipo, categoria, termo e ordenação podem ser combinados.

### Orçamentos

Cada orçamento é um limite recorrente por categoria.

O cálculo de uso filtra apenas despesas cujo mês seja igual ao mês atual.

Alertas aparecem quando o uso é alto ou ultrapassa o limite.

### Gráfico

O Canvas agrupa despesas mensais por categoria e desenha barras proporcionais.

Ele apresenta mensagem de estado vazio e acompanha mudanças de tamanho da janela.

### Tema, exemplos e exportação

O tema segue a preferência do sistema quando ainda não há escolha salva.

Dados demonstrativos somente são restaurados após confirmação explícita.

O arquivo JSON exportado contém versão, data, moeda, transações e orçamentos.

### Ajuda

A central de ajuda explica a utilização real da interface, privacidade, acessibilidade, limitações e FAQ.

Ela também possui navegação interna e retorno ao topo.

## Trechos relevantes

```js
const balance = totals.income - totals.expense;
const rate = totals.income ? (balance / totals.income) * 100 : null;
```

O trecho acima evita divisão sem receita e mantém o cálculo da taxa explícito.

```js
const cents = Math.round(Number(normalized) * 100);
return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
```

O valor monetário é convertido para centavos antes de ser salvo.

```js
const blob = new Blob([JSON.stringify(payload, null, 2)], {
  type: "application/json"
});
```

O Blob permite baixar uma cópia de dados sem serviço externo.

## Testes realizados

- Verificação de sintaxe do JavaScript com `node --check`.
- Verificação de espaços e conflitos de diff com `git diff --check`.
- Verificação dos commits após cada etapa.
- Auditoria das contagens finais de linhas.

Não foram capturas de tela automatizadas nesta execução.

Por isso, não há imagens fictícias de evidência no repositório.

Capturas reais podem ser produzidas posteriormente ao abrir `index.html` em navegador.

## Evidências pendentes

- Captura da tela inicial em desktop.
- Captura do formulário com lançamentos.
- Captura do resumo e gráfico.
- Captura dos orçamentos.
- Captura do tema escuro.
- Captura da central de ajuda.

## Histórico de commits

| Versão | Mensagem |
| --- | --- |
| 0.1.0 | estrutura inicial e navegação |
| 0.2.0 | cadastro e listagem de transações |
| 0.3.0 | indicadores financeiros dinâmicos |
| 0.4.0 | edição e exclusão de transações |
| 0.5.0 | pesquisa e filtros de transações |
| 0.6.0 | gerenciamento de orçamentos |
| 0.7.0 | gráfico de despesas por categoria |
| 0.8.0 | alternância de tema persistente |
| 0.9.0 | restauração de dados demonstrativos |
| 0.10.0 | exportação de dados em JSON |
| 0.11.0 | central de ajuda e guia financeiro |
| 1.0.0 | documentação e entrega final |

## Repositório

https://github.com/s2ddv/web-design

## Conclusão

O FinDash reúne conceitos de JavaScript ensinados na atividade em uma interface única, responsiva e local.

O projeto entrega mais de cinco funcionalidades interativas, persistência, validação, planejamento, gráfico e documentação de uso.

O código completo pode ser consultado diretamente nos arquivos `index.html`, `style.css` e `script.js`.
