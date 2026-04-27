// Wallbit expenses by category for Scriptable.
// Run once inside Scriptable to save your API key, then add it as a widget.

const CONFIG = {
  apiKeychainKey: "wallbit_api_key",
  baseUrl: "https://api.wallbit.io/api/public/v1/transactions",
  currency: "USD",
  refreshMinutes: 30,
  maxPages: 5,
  pageLimit: 50,
  topCategories: 3,
  locale: "en-US",
};

const EXCLUDED_TYPE_KEYWORDS = [
  "DEPOSIT",
  "TRADE",
  "DIVIDEND",
  "INTEREST",
  "INTERNAL",
  "ROBO",
];

const CATEGORY_RULES = [
  {
    category: "Transfers",
    keywords: ["withdrawal_local", "transfer", "wire", "ach", "brubank", "mercadopago", "galicia"],
  },
  {
    category: "Travel",
    keywords: ["airbnb", "hotel", "booking", "hostel", "lodging", "flight", "airline"],
  },
  {
    category: "Developer Tools",
    keywords: [
      "vercel",
      "railway",
      "cursor",
      "openai",
      "screenstudio",
      "lemsqzy",
      "capcut",
      "nokia of america",
      "refero",
    ],
  },
  {
    category: "Transport",
    keywords: ["uber", "cabify", "taxi", "lyft", "sube", "metro", "bus", "ypf"],
  },
  {
    category: "Food & Coffee",
    keywords: [
      "restaurant",
      "restaurante",
      "cafe",
      "coffee",
      "starbucks",
      "burger",
      "pizza",
      "rappi",
      "pedidosya",
      "ifood",
      "mcdonald",
      "havanna",
      "rapanui",
      "rodziny",
      "rufian",
      "barra recreo",
      "up town",
      "las ernestinas",
      "le utthe",
      "inner company",
    ],
  },
  {
    category: "Groceries",
    keywords: [
      "super",
      "market",
      "mercado",
      "mercadito",
      "carrefour",
      "coto",
      "jumbo",
      "walmart",
      "grocery",
      "cencosud",
    ],
  },
  {
    category: "Subscriptions",
    keywords: ["spotify", "netflix", "apple", "google", "youtube", "claude.ai subscription"],
  },
  {
    category: "Shopping",
    keywords: [
      "amazon",
      "mercadolibre",
      "mercado libre",
      "shop",
      "store",
      "tienda",
      "zara",
      "ay not dead",
    ],
  },
  {
    category: "Health",
    keywords: ["farmacia", "farmacity", "pharmacy", "doctor", "hospital", "clinic", "clinica"],
  },
  {
    category: "Utilities",
    keywords: ["electric", "gas", "internet", "phone", "telefono", "utility", "servicio"],
  },
  {
    category: "Rewards",
    keywords: ["cashback", "cashback_accumulated", "reward"],
  },
  {
    category: "Fees",
    keywords: ["fee", "commission", "comision"],
  },
];

const THEME = {
  background: dynamicColor("#FFFFFF", "#1C1C1E"),
  card: dynamicColor("#F2F2F7", "#2C2C2E"),
  separator: dynamicColor("#E5E5EA", "#3A3A3C"),
  title: dynamicColor("#111111", "#F5F5F7"),
  muted: dynamicColor("#6E6E73", "#A1A1A6"),
  text: dynamicColor("#1C1C1E", "#F2F2F7"),
  accent: dynamicColor("#007AFF", "#0A84FF"),
  positive: dynamicColor("#34C759", "#30D158"),
  warning: dynamicColor("#D70015", "#FF453A"),
};

const CHART_COLORS = ["#2E7DD7", "#FF8A2A", "#63BD48", "#FFD03B", "#C7C7CC", "#8E8E93"];

const WALLBIT_LOGO_URL =
  "https://qmuzyruteeekpodralsd.supabase.co/storage/v1/object/public/Images/wallbit.png";

const WALLBIT_LOGO_BASE64 =
  "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";

async function main() {
  const widget = await createWidget();

  if (config.runsInWidget) {
    Script.setWidget(widget);
  } else {
    await widget.presentMedium();
  }

  Script.complete();
}

async function createWidget() {
  const widget = new ListWidget();
  widget.backgroundColor = THEME.background;
  widget.refreshAfterDate = minutesFromNow(CONFIG.refreshMinutes);

  try {
    const transactions = await fetchMonthlyTransactions();
    const expenseTransactions = transactions.filter(isExpenseTransaction);
    const summary = summarizeByCategory(expenseTransactions);
    const dashboard = buildDashboardData(expenseTransactions, summary);

    if (summary.length === 0) {
      await addEmptyState(widget);
    } else {
      await addDashboard(widget, dashboard);
    }
  } catch (error) {
    await addErrorState(widget, error);
  }

  return widget;
}

async function addEmptyState(widget) {
  widget.setPadding(16, 16, 16, 16);
  await addHeader(widget, "This Month", 30);
  widget.addSpacer();

  const empty = widget.addText("No expenses this month");
  empty.textColor = THEME.muted;
  empty.font = Font.systemFont(13);
  empty.centerAlignText();

  widget.addSpacer();
}

async function addErrorState(widget, error) {
  widget.setPadding(16, 16, 16, 16);
  await addHeader(widget, "This Month", 30);
  widget.addSpacer(8);

  const message = widget.addText(getFriendlyError(error));
  message.textColor = THEME.warning;
  message.font = Font.systemFont(12);
  message.lineLimit = 4;

  if (!config.runsInWidget) {
    console.error(error);
  }
}

async function addDashboard(widget, dashboard) {
  const family = config.widgetFamily || "medium";

  if (family === "small") {
    await addSmallWidget(widget, dashboard);
    return;
  }

  if (family === "large") {
    await addLargeWidget(widget, dashboard);
    return;
  }

  await addMediumWidget(widget, dashboard);
}

async function addSmallWidget(widget, dashboard) {
  widget.setPadding(20, 20, 18, 20);
  widget.spacing = 5;

  await addHeader(widget, "This Month", 24);
  addTotal(widget, dashboard.total, 23);

  const body = widget.addStack();
  body.layoutHorizontally();
  body.centerAlignContent();

  const list = body.addStack();
  list.layoutVertically();
  list.size = new Size(76, 58);
  addCompactLegend(list, dashboard.items.slice(0, 4), false);

  body.addSpacer();
  addChartImage(body, dashboard.items, 50, 14);
}

async function addMediumWidget(widget, dashboard) {
  widget.setPadding(14, 12, 14, 12);

  const root = widget.addStack();
  root.layoutHorizontally();
  root.centerAlignContent();
  root.spacing = 8;

  const left = root.addStack();
  left.layoutVertically();
  left.size = new Size(94, 0);
  await addHeader(left, "This Month", 24);
  left.addSpacer(8);
  addTotal(left, dashboard.total, 23);
  left.addSpacer(3);
  addUpdatedText(left, dashboard.count);

  const chart = root.addStack();
  chart.layoutVertically();
  chart.centerAlignContent();
  chart.size = new Size(66, 0);
  addChartImage(chart, dashboard.items, 64, 15);

  const legend = root.addStack();
  legend.layoutVertically();
  legend.size = new Size(116, 0);
  addMediumLegend(legend, dashboard.items.slice(0, 4));
}

async function addLargeWidget(widget, dashboard) {
  widget.setPadding(22, 18, 18, 18);

  await addHeader(widget, "This Month", 30);
  widget.addSpacer(10);

  const hero = widget.addStack();
  hero.layoutHorizontally();
  hero.centerAlignContent();
  hero.spacing = 14;

  const left = hero.addStack();
  left.layoutVertically();
  left.size = new Size(158, 0);
  addTotal(left, dashboard.total, 32);
  left.addSpacer(6);
  addUpdatedText(left, dashboard.count);
  left.addSpacer(18);
  addWeekBars(left, dashboard.weekdays);

  const chart = hero.addStack();
  chart.layoutVertically();
  chart.centerAlignContent();
  chart.size = new Size(118, 0);
  addChartImage(chart, dashboard.items, 112, 24);

  widget.addSpacer(16);

  const divider = widget.addStack();
  divider.backgroundColor = THEME.separator;
  divider.size = new Size(0, 1);

  widget.addSpacer(12);

  const table = widget.addStack();
  table.layoutVertically();
  addTableLegend(table, dashboard.items.slice(0, 5), dashboard.total);
}

async function addHeader(parent, subtitle, iconSize) {
  const row = parent.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();

  const iconBox = row.addStack();
  iconBox.size = new Size(iconSize, iconSize);
  iconBox.cornerRadius = 8;
  iconBox.setPadding(0, 0, 0, 0);

  const icon = iconBox.addImage(await getWallbitLogo());
  icon.imageSize = new Size(iconSize, iconSize);
  icon.cornerRadius = 7;

  row.addSpacer(8);

  const text = row.addStack();
  text.layoutVertically();

  const title = text.addText("Expenses");
  title.textColor = THEME.title;
  title.font = Font.semiboldSystemFont(15);
  title.lineLimit = 1;

  const caption = text.addText(subtitle);
  caption.textColor = THEME.muted;
  caption.font = Font.systemFont(10);
  caption.lineLimit = 1;
}

function addTotal(parent, total, fontSize) {
  const totalText = parent.addText(formatMoney(total));
  totalText.textColor = THEME.title;
  totalText.font = Font.systemFont(fontSize);
  totalText.minimumScaleFactor = 0.78;
  totalText.lineLimit = 1;
}

function addUpdatedText(parent, count) {
  const updated = parent.addText(`Updated ${formatTime(new Date())}`);
  updated.textColor = THEME.muted;
  updated.font = Font.systemFont(9);
  updated.lineLimit = 1;
}

function addCompactLegend(parent, items, showAmounts) {
  for (const item of items) {
    const row = parent.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    addDot(row, item.color, 5);
    row.addSpacer(5);

    const label = row.addText(item.category);
    label.textColor = THEME.text;
    label.font = Font.systemFont(9);
    label.lineLimit = 1;

    if (showAmounts) {
      row.addSpacer();
      const amount = row.addText(formatMoney(item.total));
      amount.textColor = THEME.text;
      amount.font = Font.systemFont(9);
      amount.lineLimit = 1;
    }

    parent.addSpacer(3);
  }
}

function addMediumLegend(parent, items) {
  for (const item of items) {
    const row = parent.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    addDot(row, item.color, 6);
    row.addSpacer(5);

    const label = row.addText(item.category);
    label.textColor = THEME.text;
    label.font = Font.systemFont(10);
    label.minimumScaleFactor = 0.75;
    label.lineLimit = 1;

    row.addSpacer(5);

    const amount = row.addText(formatMoneyWithCents(item.total));
    amount.textColor = THEME.title;
    amount.font = Font.mediumSystemFont(9);
    amount.minimumScaleFactor = 0.75;
    amount.lineLimit = 1;

    parent.addSpacer(7);
  }
}

function addDetailedLegend(parent, items, total) {
  for (const item of items) {
    const row = parent.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    addDot(row, item.color, 7);
    row.addSpacer(7);

    const label = row.addText(item.category);
    label.textColor = THEME.text;
    label.font = Font.systemFont(11);
    label.lineLimit = 1;

    row.addSpacer();

    const amount = row.addText(formatMoneyWithCents(item.total));
    amount.textColor = THEME.title;
    amount.font = Font.mediumSystemFont(11);
    amount.lineLimit = 1;

    row.addSpacer(10);

    const percent = row.addText(formatPercent(item.total, total));
    percent.textColor = THEME.muted;
    percent.font = Font.systemFont(10);
    percent.lineLimit = 1;

    parent.addSpacer(8);
  }
}

function addTableLegend(parent, items, total) {
  const header = parent.addStack();
  header.layoutHorizontally();

  const category = header.addText("CATEGORY");
  category.textColor = THEME.muted;
  category.font = Font.mediumSystemFont(9);
  category.lineLimit = 1;

  header.addSpacer();

  const amount = header.addText("AMOUNT");
  amount.textColor = THEME.muted;
  amount.font = Font.mediumSystemFont(9);
  amount.lineLimit = 1;

  header.addSpacer(18);

  const percent = header.addText("%");
  percent.textColor = THEME.muted;
  percent.font = Font.mediumSystemFont(9);
  percent.lineLimit = 1;

  parent.addSpacer(16);

  for (const item of items) {
    const row = parent.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    addCategoryIcon(row, item);
    row.addSpacer(10);

    const label = row.addText(item.category);
    label.textColor = THEME.text;
    label.font = Font.systemFont(12);
    label.lineLimit = 1;

    row.addSpacer();

    const value = row.addText(formatMoneyWithCents(item.total));
    value.textColor = THEME.title;
    value.font = Font.mediumSystemFont(12);
    value.lineLimit = 1;

    row.addSpacer(18);

    const share = row.addText(formatPercent(item.total, total));
    share.textColor = THEME.muted;
    share.font = Font.systemFont(11);
    share.lineLimit = 1;

    parent.addSpacer(13);
  }
}

function addWeekBars(parent, weekdays) {
  const max = Math.max(...weekdays.map((day) => day.total), 1);
  const chart = parent.addStack();
  chart.layoutHorizontally();
  chart.bottomAlignContent();
  chart.spacing = 9;
  chart.size = new Size(140, 74);

  for (const day of weekdays) {
    const column = chart.addStack();
    column.layoutVertically();
    column.bottomAlignContent();
    column.size = new Size(11, 74);

    const barSpace = column.addStack();
    barSpace.layoutVertically();
    barSpace.bottomAlignContent();
    barSpace.size = new Size(8, 50);

    const height = Math.max(8, Math.round((day.total / max) * 50));
    const spacer = 50 - height;
    if (spacer > 0) {
      barSpace.addSpacer(spacer);
    }

    const bar = barSpace.addStack();
    bar.backgroundColor = day.isToday ? THEME.accent : dynamicColor("#DCEAF8", "#3A4A5F");
    bar.cornerRadius = 4;
    bar.size = new Size(8, height);

    column.addSpacer(6);

    const label = column.addText(day.label);
    label.textColor = THEME.muted;
    label.font = Font.systemFont(10);
    label.centerAlignText();
    label.lineLimit = 1;
  }
}

function addChartImage(parent, items, size, thickness) {
  const image = drawDonutChart(items, size, thickness);
  const chart = parent.addImage(image);
  chart.imageSize = new Size(size, size);
  chart.centerAlignImage();
}

function addDot(parent, hex, size) {
  const dot = parent.addStack();
  dot.backgroundColor = new Color(hex);
  dot.cornerRadius = size / 2;
  dot.size = new Size(size, size);
}

function addCategoryIcon(parent, item) {
  const box = parent.addStack();
  box.backgroundColor = dynamicColor("#F2F2F7", "#3A3A3C");
  box.cornerRadius = 7;
  box.size = new Size(24, 24);
  box.setPadding(5, 5, 5, 5);

  const image = box.addImage(getSymbolImage(getCategorySymbol(item.category)));
  image.tintColor = new Color(item.color);
  image.imageSize = new Size(14, 14);
}

async function fetchMonthlyTransactions() {
  const apiKey = await getApiKey();
  const range = getMonthRange();
  const transactions = [];

  for (let page = 1; page <= CONFIG.maxPages; page++) {
    const json = await fetchTransactionsPage(apiKey, page, range);
    const items = extractTransactions(json);

    transactions.push(...items);

    const totalPages = Number(json?.data?.pages || 1);
    if (page >= totalPages || items.length === 0) {
      break;
    }
  }

  return transactions;
}

async function fetchTransactionsPage(apiKey, page, range) {
  const query = buildQuery({
    page,
    limit: CONFIG.pageLimit,
    status: "COMPLETED",
    currency: CONFIG.currency,
    from_date: range.from,
    to_date: range.to,
  });

  const request = new Request(`${CONFIG.baseUrl}?${query}`);
  request.method = "GET";
  request.headers = { "X-API-Key": apiKey };
  request.timeoutInterval = 20;

  return request.loadJSON();
}

function extractTransactions(json) {
  const items = json?.data?.data;
  return Array.isArray(items) ? items : [];
}

async function getApiKey() {
  if (Keychain.contains(CONFIG.apiKeychainKey)) {
    return Keychain.get(CONFIG.apiKeychainKey);
  }

  if (config.runsInWidget) {
    throw new Error("API_KEY_MISSING");
  }

  const alert = new Alert();
  alert.title = "Wallbit API Key";
  alert.message = "Paste your API key with read permission. It will be saved in the iOS Keychain.";
  alert.addSecureTextField("API key");
  alert.addAction("Save");
  alert.addCancelAction("Cancel");

  const action = await alert.presentAlert();
  if (action === -1) {
    throw new Error("API_KEY_CANCELLED");
  }

  const apiKey = alert.textFieldValue(0).trim();
  if (!apiKey) {
    throw new Error("API_KEY_EMPTY");
  }

  Keychain.set(CONFIG.apiKeychainKey, apiKey);
  return apiKey;
}

function isExpenseTransaction(transaction) {
  const type = String(transaction.type || "").toUpperCase();

  if (EXCLUDED_TYPE_KEYWORDS.some((keyword) => type.includes(keyword))) {
    return false;
  }

  return getAmount(transaction) > 0;
}

function summarizeByCategory(transactions) {
  const totals = {};

  for (const transaction of transactions) {
    const category = categorize(transaction);
    totals[category] = (totals[category] || 0) + getAmount(transaction);
  }

  return Object.entries(totals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

function buildDashboardData(transactions, summary) {
  const total = summary.reduce((sum, item) => sum + item.total, 0);
  const items = summary.map((item, index) => ({
    ...item,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return {
    total,
    items,
    count: transactions.length,
    weekdays: summarizeByWeekday(transactions),
  };
}

function summarizeByWeekday(transactions) {
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  const today = new Date();
  const todayIndex = toMondayFirstIndex(today);
  const days = labels.map((label, index) => ({
    label,
    total: 0,
    isToday: index === todayIndex,
  }));

  for (const transaction of transactions) {
    const date = new Date(transaction.created_at);
    if (Number.isNaN(date.getTime())) {
      continue;
    }

    days[toMondayFirstIndex(date)].total += getAmount(transaction);
  }

  return days;
}

function toMondayFirstIndex(date) {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

function categorize(transaction) {
  const text = getSearchableText(transaction);

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => text.includes(keyword.toLowerCase()))) {
      return rule.category;
    }
  }

  return "Other";
}

function getSearchableText(transaction) {
  return [
    transaction.type,
    transaction.external_address,
    transaction.comment,
    transaction.source_currency?.code,
    transaction.dest_currency?.code,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getAmount(transaction) {
  const sourceAmount = Number(transaction.source_amount);
  const destAmount = Number(transaction.dest_amount);

  if (Number.isFinite(sourceAmount) && sourceAmount > 0) {
    return sourceAmount;
  }

  if (Number.isFinite(destAmount) && destAmount > 0) {
    return destAmount;
  }

  return 0;
}

function getMonthRange() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    from: formatLocalDate(firstDay),
    to: formatLocalDate(now),
  };
}

function buildQuery(params) {
  return Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&");
}

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatMoney(amount) {
  return amount.toLocaleString(CONFIG.locale, {
    style: "currency",
    currency: CONFIG.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatMoneyWithCents(amount) {
  return formatMoney(amount);
}

function formatPercent(amount, total) {
  if (!total) {
    return "0%";
  }

  return `${Math.round((amount / total) * 100)}%`;
}

function formatTime(date) {
  return date.toLocaleTimeString(CONFIG.locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function minutesFromNow(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

function dynamicColor(lightHex, darkHex) {
  return Color.dynamic(new Color(lightHex), new Color(darkHex));
}

function drawDonutChart(items, size, thickness) {
  const context = new DrawContext();
  context.size = new Size(size, size);
  context.opaque = false;
  context.respectScreenScale = true;

  const total = items.reduce((sum, item) => sum + item.total, 0);
  const center = size / 2;
  const radius = (size - thickness) / 2;
  const step = size >= 120 ? 1.3 : 1.8;
  const ringColor = "#E5E5EA";

  drawArcDots(context, center, radius, thickness, -90, 270, ringColor, step);

  if (!total) {
    return context.getImage();
  }

  let cursor = -90;
  for (const item of items) {
    const sweep = (item.total / total) * 360;
    drawArcDots(context, center, radius, thickness, cursor, cursor + sweep - 1, item.color, step);
    cursor += sweep;
  }

  return context.getImage();
}

function drawArcDots(context, center, radius, thickness, startDegrees, endDegrees, colorHex, step) {
  context.setFillColor(new Color(colorHex));

  for (let angle = startDegrees; angle <= endDegrees; angle += step) {
    const radians = (angle * Math.PI) / 180;
    const x = center + Math.cos(radians) * radius;
    const y = center + Math.sin(radians) * radius;
    context.fillEllipse(new Rect(x - thickness / 2, y - thickness / 2, thickness, thickness));
  }
}

function getCategorySymbol(category) {
  const symbols = {
    "Developer Tools": "chevron.left.forwardslash.chevron.right",
    "Food & Coffee": "fork.knife",
    Travel: "airplane",
    Transport: "bus.fill",
    Shopping: "bag.fill",
    Groceries: "cart.fill",
    Subscriptions: "star.fill",
    Health: "cross.case.fill",
    Utilities: "bolt.fill",
    Transfers: "arrow.left.arrow.right",
    Rewards: "gift.fill",
    Fees: "creditcard.fill",
    Other: "ellipsis",
  };

  return symbols[category] || "ellipsis";
}

function getSymbolImage(name) {
  const symbol = SFSymbol.named(name) || SFSymbol.named("circle.fill");
  return symbol.image;
}

async function getWallbitLogo() {
  try {
    const request = new Request(WALLBIT_LOGO_URL);
    request.timeoutInterval = 10;
    return await request.loadImage();
  } catch (error) {
    if (!config.runsInWidget) {
      console.error(error);
    }

    return getSymbolImage("creditcard.fill");
  }
}

function getFriendlyError(error) {
  const message = String(error?.message || error);

  if (message.includes("API_KEY_MISSING")) {
    return "Open this script in Scriptable to save your API key.";
  }

  if (message.includes("API_KEY_CANCELLED") || message.includes("API_KEY_EMPTY")) {
    return "API key is not configured.";
  }

  if (message.includes("401")) {
    return "API key is invalid or expired.";
  }

  if (message.includes("403")) {
    return "API key needs read permission.";
  }

  if (message.includes("429")) {
    return "Wallbit rate limit. Try again later.";
  }

  return "Could not load Wallbit.";
}

await main();
