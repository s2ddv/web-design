"use strict";

// Configurações, estado e referências do cadastro inicial de lançamentos.
const STORAGE_KEY = "findash-transactions-v1";
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateView = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
const state = { transactions: [], editingId: null };
const dom = {
  menuButton: document.querySelector(".menu-toggle"), navigation: document.querySelector(".main-nav"),
  form: document.querySelector("#transaction-form"), type: document.querySelector("#transaction-type"),
  description: document.querySelector("#transaction-description"), amount: document.querySelector("#transaction-amount"),
  category: document.querySelector("#transaction-category"), date: document.querySelector("#transaction-date"),
  list: document.querySelector("#transactions-list"), empty: document.querySelector("#empty-transactions"),
  count: document.querySelector("#transactions-count"), feedback: document.querySelector("#feedback"), cancelEdit: document.querySelector("#cancel-edit")
};
Object.assign(dom, { totalIncome: document.querySelector("#total-income"), totalExpenses: document.querySelector("#total-expenses"), totalBalance: document.querySelector("#total-balance"), summaryCount: document.querySelector("#summary-count"), balanceLabel: document.querySelector("#balance-label"), savingsRate: document.querySelector("#savings-rate"), savingsProgress: document.querySelector("#savings-progress"), savingsMessage: document.querySelector("#savings-message") });

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  initializeNavigation();
  if (!dom.form) return;
  state.transactions = loadTransactions();
  resetTransactionForm();
  renderTransactions();
  updateIndicators();
  dom.form.addEventListener("submit", handleTransactionSubmit);
  dom.cancelEdit.addEventListener("click", resetTransactionForm);
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
function todayISO() { return new Date().toISOString().slice(0, 10); }
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
  state.transactions.push({ id: crypto.randomUUID(), ...data, createdAt: new Date().toISOString() });
  saveTransactions(); resetTransactionForm(); renderTransactions(); showFeedback("Lançamento adicionado com sucesso.");
  updateIndicators();
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
  const ordered = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  ordered.forEach(transaction => dom.list.append(createTransactionItem(transaction)));
  dom.empty.hidden = ordered.length > 0;
  dom.count.textContent = `${ordered.length} ${ordered.length === 1 ? "registro" : "registros"}`;
}

// A criação por nós do DOM evita a interpretação de conteúdo fornecido pelo usuário.
function createTransactionItem(transaction) {
  const item = document.createElement("li"); item.className = "transaction-item";
  const icon = document.createElement("span"); icon.className = `transaction-icon ${transaction.type}`; icon.textContent = transaction.type === "income" ? "+" : "−";
  const details = document.createElement("div"); details.className = "transaction-details";
  const description = document.createElement("p"); description.className = "transaction-description"; description.textContent = transaction.description;
  const meta = document.createElement("p"); meta.className = "transaction-meta"; meta.textContent = `${transaction.category} · ${formatDate(transaction.date)}`;
  const amount = document.createElement("p"); amount.className = `transaction-amount ${transaction.type}`; amount.textContent = `${transaction.type === "income" ? "+" : "−"} ${formatMoney(transaction.amountCents)}`;
  details.append(description, meta); item.append(icon, details, amount); return item;
}

function resetTransactionForm() { dom.form.reset(); dom.type.value = "expense"; dom.date.value = todayISO(); }

function isTransactionShape(item) { return item && typeof item.id === "string" && ["income", "expense"].includes(item.type) && typeof item.description === "string" && Number.isSafeInteger(item.amountCents) && item.amountCents > 0 && typeof item.category === "string" && isValidISODate(item.date); }
function loadTransactions() { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); return Array.isArray(saved) ? saved.filter(isTransactionShape) : []; } catch { showFeedback("Não foi possível recuperar os lançamentos locais.", true); return []; } }
function saveTransactions() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions)); } catch { showFeedback("Seu navegador não conseguiu salvar os dados locais.", true); } }
function showFeedback(message, isError = false) { dom.feedback.textContent = message; dom.feedback.classList.toggle("is-error", isError); dom.feedback.hidden = false; clearTimeout(showFeedback.timer); showFeedback.timer = setTimeout(() => { dom.feedback.hidden = true; }, 4500); }
