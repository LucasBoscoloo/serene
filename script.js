const $ = (id) => document.getElementById(id),
  times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
const today = new Date();
today.setHours(0, 0, 0, 0);
const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fromIso = (s) => new Date(s + "T12:00:00");
let selectedDate = iso(today),
  selectedTime = "",
  month = new Date(today.getFullYear(), today.getMonth(), 1),
  step = 1,
  customerName = "",
  customerPhone = "",
  lastBooking = null;
const STORAGE_KEY = "serene-agendamentos-v1";
const saved = (() => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); }
  catch { return null; }
})();
let records = saved?.records || [
  {
    id: 1,
    date: iso(today),
    time: "10:00",
    name: "Cliente de exemplo",
    phone: "(00) 00000-0000",
    status: "Confirmado",
  },
];
const blocks = new Set(saved?.blocks || []);
let adminLoggedIn = sessionStorage.getItem("serene-admin-auth") === "true";
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ records, blocks: [...blocks] })); }
  catch { /* O protótipo continua funcionando enquanto a página estiver aberta. */ }
}
$("adminDate").value = selectedDate;
$("adminDate").min = iso(today);
if (adminLoggedIn) {
  $("accountButton").classList.add("account-authenticated");
  $("accountButton").setAttribute("aria-label", "Conta profissional conectada");
  $("accountButton").querySelector(".account-label").textContent = "Conta";
}
const escapeHtml = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const pretty = (s) =>
  fromIso(s).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
function occupied(d, t) {
  return records.some((r) => r.date === d && r.time === t && r.status !== "Cancelado");
}
function free(d, t) {
  const slot = new Date(d + "T" + t + ":00");
  return !occupied(d, t) && !blocks.has(d + " " + t) && slot > new Date();
}
function switchView(view) {
  $("client").classList.toggle("hidden", view !== "client");
  $("admin").classList.toggle("hidden", view !== "admin");
  $("clientTab").classList.toggle("active", view === "client");
  if (view === "admin") {
    $("accountButton").classList.add("account-active");
    $("adminDate").value = selectedDate;
    $("adminLogin").classList.toggle("hidden", adminLoggedIn);
    $("adminDashboard").classList.toggle("hidden", !adminLoggedIn);
    if (adminLoggedIn) renderAdmin();
  } else {
    $("accountButton").classList.remove("account-active");
    renderClient();
  }
}
$("loginForm").onsubmit = (e) => {
  e.preventDefault();
  const username = $("loginUser").value.trim();
  const password = $("loginPassword").value;
  if (username === "admin" && password === "1234") {
    adminLoggedIn = true;
    sessionStorage.setItem("serene-admin-auth", "true");
    $("loginError").textContent = "";
    $("loginPassword").value = "";
    $("adminLogin").classList.add("hidden");
    $("adminDashboard").classList.remove("hidden");
    $("accountButton").classList.add("account-authenticated");
    $("accountButton").setAttribute("aria-label", "Conta profissional conectada");
    $("accountButton").querySelector(".account-label").textContent = "Conta";
    $("adminDate").value = selectedDate;
    renderAdmin();
  } else {
    $("loginError").textContent = "Usuário ou senha incorretos. Confira os dados e tente novamente.";
    $("loginPassword").value = "";
    $("loginPassword").focus();
  }
};
function logoutAdmin() {
  adminLoggedIn = false;
  sessionStorage.removeItem("serene-admin-auth");
  $("adminDashboard").classList.add("hidden");
  $("adminLogin").classList.remove("hidden");
  $("accountButton").classList.remove("account-authenticated");
  $("accountButton").setAttribute("aria-label", "Entrar na conta");
  $("accountButton").querySelector(".account-label").textContent = "Entrar";
  $("loginForm").reset();
}
function syncSummary() {
  [1, 2, 3].forEach((n) => $("s" + n).classList.toggle("on", n <= step));
}
function calendar() {
  const y = month.getFullYear(),
    m = month.getMonth(),
    first = new Date(y, m, 1).getDay(),
    count = new Date(y, m + 1, 0).getDate();
  let out = "";
  for (let i = 0; i < first; i++) out += "<span></span>";
  for (let n = 1; n <= count; n++) {
    const d = new Date(y, m, n),
      s = iso(d);
    out += `<button class="day ${s === selectedDate ? "selected" : ""}" ${d < today ? "disabled" : ""} aria-label="${d.toLocaleDateString("pt-BR")}" aria-pressed="${s === selectedDate}" onclick="pickDate('${s}')">${n}</button>`;
  }
  return out;
}
function renderClient() {
  syncSummary();
  if (step === 1) {
    $("bookingBody").innerHTML =
      `<div class="service"><div><h3>Massagem</h3><small>Atendimento individual em local fixo</small></div><span class="check">✓</span></div><div class="date-layout"><div><div class="calendar-head"><button class="iconbtn" aria-label="Mês anterior" onclick="moveMonth(-1)" ${month <= new Date(today.getFullYear(), today.getMonth(), 1) ? "disabled" : ""}>‹</button><strong>${month.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</strong><button class="iconbtn" aria-label="Próximo mês" onclick="moveMonth(1)">›</button></div><div class="week"><span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span></div><div class="days">${calendar()}</div></div><div><h3>Horários disponíveis</h3><p class="caption">${pretty(selectedDate)} · horário local</p><div class="slots">${times.map((t) => `<button class="slot ${t === selectedTime ? "selected" : ""}" ${free(selectedDate, t) ? "" : "disabled"} aria-pressed="${t === selectedTime}" onclick="pickTime('${t}')">${t}</button>`).join("")}</div><p class="caption">Horários apagados estão indisponíveis.</p></div></div><div class="actions"><span class="caption">1 de 3 · Escolha seu horário</span><button class="primary" ${selectedTime && free(selectedDate, selectedTime) ? "" : "disabled"} onclick="nextStep()">Continuar</button></div>`;
  } else if (step === 2) {
    $("bookingBody").innerHTML =
      `<h2>Dados de contato</h2><p>Informe um nome e telefone para a solicitação.</p><form id="contactForm"><label for="customerName">Nome</label><input id="customerName" autocomplete="name" placeholder="Seu nome" required minlength="2" maxlength="80" value="${escapeHtml(customerName)}"><label for="customerPhone">Telefone com DDD</label><input id="customerPhone" type="tel" autocomplete="tel" inputmode="tel" placeholder="(00) 00000-0000" required maxlength="20" value="${escapeHtml(customerPhone)}"><div class="notice">Use dados fictícios para testar este protótipo.</div><div id="formError" role="alert"></div><div class="actions"><button type="button" class="secondary" onclick="backStep()">Voltar</button><button class="primary" type="submit">Solicitar agendamento</button></div></form>`;
    $("contactForm").onsubmit = (e) => {
      e.preventDefault();
      customerName = $("customerName").value.trim();
      customerPhone = $("customerPhone").value.trim();
      if (
        customerName.length < 2 ||
        !/^\d{10,11}$/.test(customerPhone.replace(/\D/g, ""))
      ) {
        $("formError").textContent =
          "Informe seu nome e um telefone com DDD (10 ou 11 dígitos).";
        return;
      }
      if (!free(selectedDate, selectedTime)) {
        step = 1;
        selectedTime = "";
        renderClient();
        return;
      }
      lastBooking = {
        id: Date.now(),
        date: selectedDate,
        time: selectedTime,
        name: customerName,
        phone: customerPhone,
        status: "Pendente",
      };
      records.push(lastBooking);
      persist();
      step = 3;
      renderClient();
    };
  } else {
    $("bookingBody").innerHTML =
      `<div class="success"><div class="success-icon">✓</div><div class="eyebrow">Pedido registrado</div><h2>Solicitação enviada!</h2><div class="final-details"><div class="detail"><span>Nome</span><strong>${escapeHtml(lastBooking.name)}</strong></div><div class="detail"><span>Telefone</span><strong>${escapeHtml(lastBooking.phone)}</strong></div><div class="detail"><span>Serviço</span><strong>Massagem</strong></div><div class="detail"><span>Profissional</span><strong>Serene</strong></div><div class="detail"><span>Data</span><strong>${fromIso(lastBooking.date).toLocaleDateString("pt-BR")}</strong></div><div class="detail"><span>Horário</span><strong>${lastBooking.time}</strong></div><div class="detail"><span>Local</span><strong>Atendimento fixo</strong></div></div><p class="caption">Endereço, duração e valor a combinar com a profissional. O atendimento depende da confirmação de Serene.</p><span class="badge">${lastBooking.status === "Pendente" ? "Aguardando confirmação" : lastBooking.status}</span><p class="caption">Acompanhe e confirme o pedido na Área da profissional.</p><button class="primary" onclick="switchView('admin')">Ver na agenda</button><div style="margin-top:16px"><button class="secondary" onclick="restart()">Novo agendamento</button></div></div>`;
  }
}
function pickDate(s) {
  selectedDate = s;
  selectedTime = "";
  renderClient();
}
function pickTime(t) {
  if (free(selectedDate, t)) {
    selectedTime = t;
    renderClient();
  }
}
function moveMonth(n) {
  month.setMonth(month.getMonth() + n);
  renderClient();
}
function nextStep() {
  if (selectedTime && free(selectedDate, selectedTime)) {
    step = 2;
    renderClient();
  }
}
function backStep() {
  customerName = $("customerName").value;
  customerPhone = $("customerPhone").value;
  step = 1;
  renderClient();
}
function restart() {
  step = 1;
  selectedTime = "";
  customerName = "";
  customerPhone = "";
  renderClient();
}
function renderAdmin() {
  const date = $("adminDate").value,
    items = records
      .filter((r) => r.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  $("stats").innerHTML = [
    ["Solicitações pendentes", items.filter((r) => r.status === "Pendente").length],
    ["Atendimentos confirmados", items.filter((r) => r.status === "Confirmado").length],
    ["Horários livres", times.filter((t) => free(date, t)).length],
  ]
    .map(([label, n]) => `<div class="stat">${label}<strong>${n}</strong></div>`)
    .join("");
  $("appointments").innerHTML = items.length
    ? items
        .map(
          (r) =>
            `<div class="row"><div><strong>${r.time} · ${escapeHtml(r.name)}</strong><br><small>Massagem · ${escapeHtml(r.phone)}</small><br><span class="badge ${r.status.toLowerCase()}">${r.status}</span></div><div class="row-actions">${r.status === "Pendente" ? `<button class="primary" onclick="updateStatus(${r.id},'Confirmado')">Confirmar</button>` : ""}${r.status !== "Cancelado" ? `<button class="secondary" onclick="updateStatus(${r.id},'Cancelado')">Cancelar</button>` : `<button class="secondary" onclick="updateStatus(${r.id},'Pendente')">Reabrir solicitação</button>`}</div></div>`,
        )
        .join("")
    : '<div class="empty">Nenhum atendimento nesta data.</div>';
  $("availability").innerHTML = times
    .map((t) => {
      const b = blocks.has(date + " " + t),
        o = occupied(date, t),
        past = new Date(date + "T" + t + ":00") <= new Date();
      return `<button class="slot ${b ? "blocked" : ""}" ${o || past ? "disabled" : ""} aria-pressed="${b}" onclick="toggleBlock('${t}')">${t}<br><small>${o ? "Ocupado" : past ? "Encerrado" : b ? "Bloqueado" : "Livre"}</small></button>`;
    })
    .join("");
}
function updateStatus(id, status) {
  const r = records.find((r) => r.id === id);
  if (r) {
    r.status = status;
    persist();
    renderAdmin();
  }
}
function toggleBlock(t) {
  const d = $("adminDate").value,
    k = d + " " + t;
  if (occupied(d, t)) return;
  blocks.has(k) ? blocks.delete(k) : blocks.add(k);
  persist();
  renderAdmin();
}
$("adminDate").onchange = () => {
  if ($("adminDate").value) renderAdmin();
};
renderClient();
if (document.modelContext?.registerTool) {
  try {
    Promise.resolve(
      document.modelContext.registerTool({
        name: "consultar_horarios_disponiveis",
        description:
          "Consultar horários disponíveis na demonstração para uma data, sem criar agendamento.",
        inputSchema: {
          type: "object",
          properties: { data: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" } },
          required: ["data"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true },
        execute: ({ data }) => {
          if (
            !/^\d{4}-\d{2}-\d{2}$/.test(data) ||
            isNaN(fromIso(data)) ||
            iso(fromIso(data)) !== data
          )
            throw Error("Data inválida");
          return { data, horarios: times.filter((t) => free(data, t)) };
        },
      }),
    ).catch(() => {});
  } catch (e) {}
}


