"use strict";

// Configurações, estado e referências do cadastro inicial de lançamentos.
const STORAGE_KEY = "findash-transactions-v1";
const BUDGET_STORAGE_KEY = "findash-budgets-v1";
const THEME_STORAGE_KEY = "findash-theme-v1";
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateView = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
const state = { transactions: [], budgets: [], editingId: null, editingBudgetCategory: null };
const dom = {
  menuButton: document.querySelector(".menu-toggle"), navigation: document.querySelector(".main-nav"),
  form: document.querySelector("#transaction-form"), type: document.querySelector("#transaction-type"),
  description: document.querySelector("#transaction-description"), amount: document.querySelector("#transaction-amount"),
  category: document.querySelector("#transaction-category"), date: document.querySelector("#transaction-date"),
  list: document.querySelector("#transactions-list"), empty: document.querySelector("#empty-transactions"),
  count: document.querySelector("#transactions-count"), feedback: document.querySelector("#feedback"), cancelEdit: document.querySelector("#cancel-edit")
};
Object.assign(dom, { totalIncome: document.querySelector("#total-income"), totalExpenses: document.querySelector("#total-expenses"), totalBalance: document.querySelector("#total-balance"), summaryCount: document.querySelector("#summary-count"), balanceLabel: document.querySelector("#balance-label"), savingsRate: document.querySelector("#savings-rate"), savingsProgress: document.querySelector("#savings-progress"), savingsMessage: document.querySelector("#savings-message") });
Object.assign(dom, { deleteDialog: document.querySelector("#delete-dialog"), deleteMessage: document.querySelector("#delete-dialog-message"), confirmDelete: document.querySelector("#confirm-delete") });
Object.assign(dom, { search: document.querySelector("#search-transactions"), filterType: document.querySelector("#filter-type"), filterCategory: document.querySelector("#filter-category"), sort: document.querySelector("#sort-transactions"), noResults: document.querySelector("#no-results") });
Object.assign(dom, { budgetList: document.querySelector("#budget-list"), emptyBudgets: document.querySelector("#empty-budgets"), budgetReference: document.querySelector("#budget-reference"), openBudget: document.querySelector("#open-budget-modal"), budgetDialog: document.querySelector("#budget-dialog"), budgetForm: document.querySelector("#budget-form"), budgetCategory: document.querySelector("#budget-category"), budgetLimit: document.querySelector("#budget-limit"), budgetFeedback: document.querySelector("#budget-feedback"), cancelBudget: document.querySelector("#cancel-budget") });
Object.assign(dom, { chart: document.querySelector("#expense-chart"), chartEmpty: document.querySelector("#chart-empty"), chartLegend: document.querySelector("#chart-legend") });
Object.assign(dom, { themeToggle: document.querySelector("#theme-toggle") });
Object.assign(dom, { restoreDemo: document.querySelector("#restore-demo"), demoDialog: document.querySelector("#demo-dialog"), confirmDemo: document.querySelector("#confirm-demo") });
Object.assign(dom, { exportData: document.querySelector("#export-data") });
Object.assign(dom, { helpDialog: document.querySelector("#help-dialog"), openHelp: document.querySelector("#open-help"), closeHelp: document.querySelector("#close-help"), helpTop: document.querySelector("#help-top"), helpMain: document.querySelector(".help-main"), helpLinks: [...document.querySelectorAll(".help-nav a")], helpSections: [...document.querySelectorAll(".help-section")], backToTop: document.querySelector("#back-to-top") });

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  initializeTheme();
  initializeNavigation();
  if (!dom.form) return;
  state.transactions = loadTransactions();
  state.budgets = loadBudgets();
  resetTransactionForm();
  renderTransactions();
  updateIndicators();
  renderBudgets();
  drawExpenseChart();
  dom.form.addEventListener("submit", handleTransactionSubmit);
  dom.cancelEdit.addEventListener("click", resetTransactionForm);
  dom.confirmDelete.addEventListener("click", deleteSelectedTransaction);
  [dom.search, dom.filterType, dom.filterCategory, dom.sort].forEach(control => control.addEventListener("input", renderTransactions));
  dom.openBudget.addEventListener("click", openBudgetDialog);
  dom.cancelBudget.addEventListener("click", () => dom.budgetDialog.close());
  dom.budgetForm.addEventListener("submit", saveBudget);
  window.addEventListener("resize", scheduleChartRedraw);
  dom.themeToggle.addEventListener("click", toggleTheme);
  dom.restoreDemo.addEventListener("click", () => dom.demoDialog.showModal());
  dom.confirmDemo.addEventListener("click", restoreDemoData);
  dom.exportData.addEventListener("click", exportData);
  initializeHelpCenter();
}

function initializeTheme() {
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    // A preferência do sistema mantém a interface utilizável sem armazenamento.
  }

  applyTheme(savedTheme || preferred);
}
function toggleTheme() {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
}
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  dom.themeToggle?.setAttribute("aria-pressed", String(theme === "dark"));

  const label = dom.themeToggle?.querySelector(".sr-only");
  if (label) label.textContent = theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro";

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // O tema já foi aplicado à sessão, mesmo quando não pode ser persistido.
  }

  drawExpenseChart();
}
function restoreDemoData() { const month = currentMonthKey(); const stamp = new Date().toISOString(); state.transactions = [{ id: crypto.randomUUID(), type: "income", description: "Salário demonstrativo", amountCents: 480000, category: "Trabalho", date: `${month}-05`, createdAt: stamp }, { id: crypto.randomUUID(), type: "expense", description: "Mercado demonstrativo", amountCents: 6845, category: "Alimentação", date: `${month}-07`, createdAt: stamp }, { id: crypto.randomUUID(), type: "expense", description: "Transporte demonstrativo", amountCents: 3200, category: "Transporte", date: `${month}-09`, createdAt: stamp }, { id: crypto.randomUUID(), type: "expense", description: "Curso demonstrativo", amountCents: 8900, category: "Educação", date: `${month}-11`, createdAt: stamp }]; state.budgets = [{ category: "Alimentação", limitCents: 90000 }, { category: "Transporte", limitCents: 45000 }, { category: "Lazer", limitCents: 35000 }]; saveTransactions(); saveBudgets(); renderTransactions(); updateIndicators(); renderBudgets(); drawExpenseChart(); showFeedback("Exemplos restaurados. Todos os dados são fictícios."); }
function exportData() { const payload = { application: "FinDash", version: "0.10.0", exportedAt: new Date().toISOString(), currency: "BRL", transactions: state.transactions, budgets: state.budgets }; const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `findash-dados-${todayISO()}.json`; document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(url); showFeedback("Arquivo JSON exportado com sucesso."); }

// Central de ajuda: modal, navegação interna, FAQ e retorno ao topo.
function initializeHelpCenter() {
  if (!dom.helpDialog) return;
  dom.openHelp.addEventListener("click", openHelpCenter);
  dom.closeHelp.addEventListener("click", closeHelpCenter);
  dom.helpTop.addEventListener("click", scrollHelpToTop);
  dom.backToTop.addEventListener("click", scrollPageToTop);
  window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
  dom.helpMain.addEventListener("scroll", updateHelpNavigation, { passive: true });
  dom.helpLinks.forEach(link => link.addEventListener("click", handleHelpNavigation));
  document.querySelectorAll(".faq-list details").forEach(item => item.addEventListener("toggle", handleFaqToggle));
  dom.helpDialog.addEventListener("close", restoreOpeningFocus);
  dom.helpDialog.addEventListener("cancel", event => { event.preventDefault(); closeHelpCenter(); });
}

function openHelpCenter(event) {
  state.helpTrigger = event.currentTarget;
  dom.helpDialog.showModal();
  dom.helpMain.scrollTo({ top: 0, behavior: "instant" });
  setActiveHelpLink("#help-start");
  window.setTimeout(() => dom.closeHelp.focus(), 0);
}

function closeHelpCenter() {
  if (dom.helpDialog.open) dom.helpDialog.close();
}

function restoreOpeningFocus() {
  if (state.helpTrigger instanceof HTMLElement) state.helpTrigger.focus();
  state.helpTrigger = null;
}

function handleHelpNavigation(event) {
  event.preventDefault();
  const link = event.currentTarget;
  const target = document.querySelector(link.getAttribute("href"));
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  setActiveHelpLink(link.getAttribute("href"));
}

function setActiveHelpLink(hash) {
  announceHelpSection(hash);
  dom.helpLinks.forEach(link => {
    const current = link.getAttribute("href") === hash;
    link.classList.toggle("is-active", current);
    if (current) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function updateHelpNavigation() {
  const mainTop = dom.helpMain.getBoundingClientRect().top;
  const visible = dom.helpSections.find(section => {
    const rect = section.getBoundingClientRect();
    return rect.top >= mainTop && rect.top < mainTop + 180;
  });
  if (visible) setActiveHelpLink(`#${visible.id}`);
}

function scrollHelpToTop() {
  dom.helpMain.scrollTo({ top: 0, behavior: "smooth" });
  setActiveHelpLink("#help-start");
}

function updateBackToTopVisibility() {
  dom.backToTop.classList.toggle("is-visible", window.scrollY > 500);
}

function scrollPageToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleFaqToggle(event) {
  const openedItem = event.currentTarget;
  if (!openedItem.open) return;
  // Mantém a leitura focada: uma resposta aberta por vez reduz rolagem excessiva no modal.
  document.querySelectorAll(".faq-list details").forEach(item => {
    if (item !== openedItem) item.open = false;
  });
}

function getHelpSectionName(hash) {
  const labels = {
    "#help-start": "Começar",
    "#help-transactions": "Lançamentos",
    "#help-summary": "Indicadores",
    "#help-budgets": "Orçamentos",
    "#help-chart": "Gráfico",
    "#help-data": "Dados e privacidade",
    "#help-faq": "Perguntas frequentes"
  };
  return labels[hash] || "Central de ajuda";
}

function announceHelpSection(hash) {
  const title = getHelpSectionName(hash);
  dom.helpDialog.setAttribute("aria-label", `Central de ajuda: ${title}`);
}

function initializeNavigation() {
  if (!dom.menuButton || !dom.navigation) return;
  dom.menuButton.addEventListener("click", () => {
    const isOpen = dom.navigation.classList.toggle("is-open");
    dom.menuButton.setAttribute("aria-expanded", String(isOpen));
    dom.menuButton.querySelector(".sr-only").textContent = isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação";
  });
  dom.navigation.addEventListener("click", event => {
    if (event.target.matches("a")) { dom.navigation.classList.remove("is-open"); dom.menuButton.setAttribute("aria-expanded", "false"); }
  });
}

// Converte formatos monetários aceitos em centavos para evitar cálculos em ponto flutuante.
function parseAmountToCents(rawValue) {
  const value = rawValue.trim().replace(/\s/g, "");
  if (!value || /[^0-9,.]/.test(value)) return null;
  let normalized = value;
  if (value.includes(",") && value.includes(".")) {
    if (!/^\d{1,3}(\.\d{3})*,\d{2}$/.test(value)) return null;
    normalized = value.replace(/\./g, "").replace(",", ".");
  } else if (value.includes(",")) {
    if (!/^\d+(,\d{1,2})?$/.test(value)) return null;
    normalized = value.replace(",", ".");
  } else if (value.includes(".") && !/^\d+(\.\d{1,2})?$/.test(value)) return null;
  const cents = Math.round(Number(normalized) * 100);
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}

function isValidISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const check = new Date(Date.UTC(year, month - 1, day));
  return check.getUTCFullYear() === year && check.getUTCMonth() === month - 1 && check.getUTCDate() === day;
}
function todayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
function formatMoney(cents) { return money.format(cents / 100); }
function formatDate(value) { return dateView.format(new Date(`${value}T12:00:00`)); }

function validateTransaction(data) {
  if (data.description.length < 2) return "Digite uma descrição com pelo menos 2 caracteres.";
  if (!data.category) return "Escolha uma categoria para o lançamento.";
  if (!isValidISODate(data.date)) return "Informe uma data existente e válida.";
  if (!data.amountCents) return "Informe um valor positivo, como 12,50 ou 1.234,56.";
  return "";
}

function handleTransactionSubmit(event) {
  event.preventDefault();
  const data = { type: dom.type.value, description: dom.description.value.trim(), amountCents: parseAmountToCents(dom.amount.value), category: dom.category.value, date: dom.date.value };
  const error = validateTransaction(data);
  if (error) return showFeedback(error, true);
  if (state.editingId) {
    const current = state.transactions.find(item => item.id === state.editingId);
    Object.assign(current, data);
    showFeedback("Lançamento atualizado com sucesso.");
  } else {
    state.transactions.push({ id: crypto.randomUUID(), ...data, createdAt: new Date().toISOString() });
    showFeedback("Lançamento adicionado com sucesso.");
  }
  saveTransactions(); resetTransactionForm(); renderTransactions();
  updateIndicators();
  renderBudgets();
  drawExpenseChart();
}

// O resumo usa somente centavos inteiros, evitando imprecisão financeira.
function updateIndicators() {
  if (!dom.totalIncome) return;
  const totals = state.transactions.reduce((accumulator, transaction) => {
    accumulator[transaction.type] += transaction.amountCents;
    return accumulator;
  }, { income: 0, expense: 0 });
  const balance = totals.income - totals.expense;
  const rate = totals.income ? (balance / totals.income) * 100 : null;
  dom.totalIncome.textContent = formatMoney(totals.income);
  dom.totalExpenses.textContent = formatMoney(totals.expense);
  dom.totalBalance.textContent = formatMoney(balance);
  dom.summaryCount.textContent = String(state.transactions.length);
  dom.balanceLabel.textContent = !state.transactions.length ? "Aguardando lançamentos" : balance >= 0 ? "Resultado positivo" : "Atenção ao saldo negativo";
  dom.savingsRate.textContent = rate === null ? "—" : `${rate.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
  const progress = rate === null ? 0 : Math.max(0, Math.min(100, rate));
  dom.savingsProgress.style.width = `${progress}%`;
  dom.savingsProgress.parentElement.setAttribute("aria-valuenow", String(Math.round(progress)));
  dom.savingsMessage.textContent = rate === null ? "Adicione receitas para acompanhar este indicador." : rate < 0 ? "As despesas ultrapassaram suas receitas." : rate < 20 ? "Há espaço para fortalecer sua reserva." : "Ótimo ritmo: você está preservando parte da receita.";
}

function renderTransactions() {
  dom.list.replaceChildren();
  const ordered = getFilteredTransactions();
  ordered.forEach(transaction => dom.list.append(createTransactionItem(transaction)));
  dom.empty.hidden = state.transactions.length > 0;
  dom.noResults.hidden = !(state.transactions.length > 0 && ordered.length === 0);
  dom.count.textContent = `${ordered.length} ${ordered.length === 1 ? "registro" : "registros"} exibidos`;
}

function normalizeText(value) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR"); }
function getFilteredTransactions() {
  const query = normalizeText(dom.search.value.trim());
  const result = state.transactions.filter(item => {
    const matchesQuery = !query || normalizeText(item.description).includes(query) || normalizeText(item.category).includes(query);
    return matchesQuery && (dom.filterType.value === "all" || item.type === dom.filterType.value) && (dom.filterCategory.value === "all" || item.category === dom.filterCategory.value);
  });
  return result.sort((first, second) => { const comparison = first.date.localeCompare(second.date) || first.createdAt.localeCompare(second.createdAt); return dom.sort.value === "newest" ? -comparison : comparison; });
}

// A criação por nós do DOM evita a interpretação de conteúdo fornecido pelo usuário.
function createTransactionItem(transaction) {
  const item = document.createElement("li"); item.className = "transaction-item";
  const icon = document.createElement("span"); icon.className = `transaction-icon ${transaction.type}`; icon.textContent = transaction.type === "income" ? "+" : "−";
  const details = document.createElement("div"); details.className = "transaction-details";
  const description = document.createElement("p"); description.className = "transaction-description"; description.textContent = transaction.description;
  const meta = document.createElement("p"); meta.className = "transaction-meta"; meta.textContent = `${transaction.category} · ${formatDate(transaction.date)}`;
  const amount = document.createElement("p"); amount.className = `transaction-amount ${transaction.type}`; amount.textContent = `${transaction.type === "income" ? "+" : "−"} ${formatMoney(transaction.amountCents)}`;
  const actions = document.createElement("div"); actions.className = "transaction-actions";
  actions.append(createActionButton("Editar", "✎", () => startEditing(transaction.id)), createActionButton("Excluir", "×", () => requestDeletion(transaction.id), "delete"));
  details.append(description, meta); item.append(icon, details, amount, actions); return item;
}

function createActionButton(label, icon, action, extraClass = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `icon-button ${extraClass}`;
  button.setAttribute("aria-label", label);
  button.textContent = icon;
  button.addEventListener("click", action);
  return button;
}

function startEditing(id) {
  const item = state.transactions.find(transaction => transaction.id === id);
  if (!item) return;

  state.editingId = id;
  dom.type.value = item.type;
  dom.description.value = item.description;
  dom.amount.value = (item.amountCents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  dom.category.value = item.category;
  dom.date.value = item.date;
  dom.form.querySelector("button[type='submit']").textContent = "Salvar alterações";
  dom.cancelEdit.hidden = false;
  dom.description.focus();
}

function requestDeletion(id) {
  const item = state.transactions.find(transaction => transaction.id === id);
  if (!item) return;

  state.deletingId = id;
  dom.deleteMessage.textContent = `“${item.description}” será removido permanentemente.`;
  dom.deleteDialog.showModal();
}

function deleteSelectedTransaction() {
  if (!state.deletingId) return;

  state.transactions = state.transactions.filter(item => item.id !== state.deletingId);
  state.deletingId = null;
  saveTransactions();
  renderTransactions();
  updateIndicators();
  renderBudgets();
  drawExpenseChart();
  showFeedback("Lançamento excluído com sucesso.");
}

function resetTransactionForm() {
  state.editingId = null;
  dom.form.reset();
  dom.type.value = "expense";
  dom.date.value = todayISO();
  dom.form.querySelector("button[type='submit']").textContent = "Adicionar lançamento";
  dom.cancelEdit.hidden = true;
}

function isTransactionShape(item) { return item && typeof item.id === "string" && ["income", "expense"].includes(item.type) && typeof item.description === "string" && Number.isSafeInteger(item.amountCents) && item.amountCents > 0 && typeof item.category === "string" && isValidISODate(item.date); }
function loadTransactions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter(isTransactionShape) : [];
  } catch {
    showFeedback("Não foi possível recuperar os lançamentos locais. A sessão continuará em memória.", true);
    return [];
  }
}

function saveTransactions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
    return true;
  } catch {
    showFeedback("Não foi possível salvar os lançamentos localmente. A sessão continuará em memória.", true);
    return false;
  }
}

function isBudgetShape(item) {
  return item
    && typeof item.category === "string"
    && Number.isSafeInteger(item.limitCents)
    && item.limitCents > 0;
}

function loadBudgets() {
  try {
    const saved = JSON.parse(localStorage.getItem(BUDGET_STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter(isBudgetShape) : [];
  } catch {
    showFeedback("Não foi possível recuperar os orçamentos locais. A sessão continuará em memória.", true);
    return [];
  }
}

function saveBudgets() {
  try {
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(state.budgets));
    return true;
  } catch {
    showFeedback("Não foi possível salvar os orçamentos localmente. A sessão continuará em memória.", true);
    return false;
  }
}

function currentMonthKey() {
  return todayISO().slice(0, 7);
}

function openBudgetDialog() {
  state.editingBudgetCategory = null;
  dom.budgetForm.reset();
  dom.budgetFeedback.textContent = "";
  dom.budgetDialog.showModal();
  dom.budgetCategory.focus();
}

function saveBudget(event) {
  event.preventDefault();
  const category = dom.budgetCategory.value;
  const limitCents = parseAmountToCents(dom.budgetLimit.value);

  if (!category || !limitCents) {
    dom.budgetFeedback.textContent = "Escolha uma categoria e informe um limite válido.";
    return;
  }

  const index = state.budgets.findIndex(item => item.category === category);
  if (index >= 0) state.budgets[index].limitCents = limitCents;
  else state.budgets.push({ category, limitCents });

  saveBudgets();
  dom.budgetDialog.close();
  renderBudgets();
  showFeedback("Orçamento salvo com sucesso.");
}

function getCurrentMonthSpending(category) {
  return state.transactions
    .filter(item => item.type === "expense" && item.category === category && item.date.startsWith(currentMonthKey()))
    .reduce((total, item) => total + item.amountCents, 0);
}

function renderBudgets() {
  if (!dom.budgetList) return;

  const month = new Date(`${currentMonthKey()}-01T12:00:00`);
  const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(month);

  dom.budgetList.replaceChildren();
  dom.budgetReference.textContent = `Referência: ${monthLabel}`;
  state.budgets.forEach(budget => dom.budgetList.append(createBudgetCard(budget)));
  dom.emptyBudgets.hidden = state.budgets.length > 0;
}

function createBudgetCard(budget) {
  const spent = getCurrentMonthSpending(budget.category);
  const percent = (spent / budget.limitCents) * 100;
  const card = document.createElement("article");
  const level = percent >= 100 ? "exceeded" : percent >= 80 ? "warning" : "";
  card.className = `budget-card ${level}`;

  const heading = document.createElement("h3");
  heading.textContent = budget.category;

  const value = document.createElement("strong");
  value.textContent = `${formatMoney(spent)} de ${formatMoney(budget.limitCents)}`;

  const bar = document.createElement("div");
  bar.className = "budget-bar";
  const fill = document.createElement("span");
  fill.style.width = `${Math.min(100, percent)}%`;
  bar.append(fill);

  const status = document.createElement("p");
  status.textContent = percent >= 100 ? "Limite ultrapassado" : percent >= 80 ? "Próximo do limite" : `${Math.round(percent)}% utilizado`;

  const actions = document.createElement("div");
  actions.className = "budget-actions";
  actions.append(createActionButton("Editar orçamento", "✎", () => editBudget(budget)));
  actions.append(createActionButton("Excluir orçamento", "×", () => deleteBudget(budget.category), "delete"));

  card.append(heading, value, bar, status, actions);
  return card;
}

function editBudget(budget) {
  dom.budgetCategory.value = budget.category;
  dom.budgetLimit.value = (budget.limitCents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  dom.budgetDialog.showModal();
}

function deleteBudget(category) {
  state.budgets = state.budgets.filter(item => item.category !== category);
  saveBudgets();
  renderBudgets();
}

function expenseByCategory() {
  return state.transactions
    .filter(item => item.type === "expense" && item.date.startsWith(currentMonthKey()))
    .reduce((categories, item) => {
      categories[item.category] = (categories[item.category] || 0) + item.amountCents;
      return categories;
    }, {});
}

function scheduleChartRedraw() {
  clearTimeout(state.chartTimer);
  state.chartTimer = setTimeout(drawExpenseChart, 100);
}

// O gráfico e os cartões de orçamento compartilham a mesma referência mensal.
function drawExpenseChart() {
  if (!dom.chart) return;

  const entries = Object.entries(expenseByCategory());
  dom.chartEmpty.hidden = entries.length > 0;
  dom.chart.hidden = !entries.length;
  dom.chartLegend.replaceChildren();
  if (!entries.length) return;

  const colors = ["#156a50", "#bb7615", "#b23e38", "#426cac", "#7256a7", "#158a92", "#a64f72", "#576b5d"];
  const width = dom.chart.clientWidth;
  const height = 280;
  const scale = window.devicePixelRatio || 1;

  dom.chart.width = width * scale;
  dom.chart.height = height * scale;

  const context = dom.chart.getContext("2d");
  context.scale(scale, scale);
  context.clearRect(0, 0, width, height);

  const max = Math.max(...entries.map(([, value]) => value));
  const spacing = (width - 60) / entries.length;
  const barWidth = Math.min(80, spacing - 15);

  entries.forEach(([category, value], index) => {
    const color = colors[index % colors.length];
    const x = 42 + index * spacing + 5;
    const chartHeight = (value / max) * 190;
    const y = 225 - chartHeight;

    context.fillStyle = color;
    context.fillRect(x, y, barWidth, chartHeight);
    context.fillStyle = "#607067";
    context.font = "12px system-ui";
    context.fillText(formatMoney(value), x, y - 8);

    context.save();
    context.translate(x + barWidth / 2, 247);
    context.rotate(-0.35);
    context.fillText(category.slice(0, 12), 0, 0);
    context.restore();

    appendChartLegend(category, color);
  });
}

function appendChartLegend(category, color) {
  const legend = document.createElement("li");
  const dot = document.createElement("span");
  dot.className = "legend-dot";
  dot.style.background = color;
  legend.append(dot, document.createTextNode(category));
  dom.chartLegend.append(legend);
}
function showFeedback(message, isError = false) { dom.feedback.textContent = message; dom.feedback.classList.toggle("is-error", isError); dom.feedback.hidden = false; clearTimeout(showFeedback.timer); showFeedback.timer = setTimeout(() => { dom.feedback.hidden = true; }, 4500); }
