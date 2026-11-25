/**
 * Google Apps Script — Ponte oficial Mentoria Regisdência
 * (Google Forms + Google Sheets + Notificações Telegram)
 *
 * Recursos armazenados em ScriptProperties (nunca expostos no código ou Git):
 * - FORM_ID
 * - SPREADSHEET_ID
 * - WEB_APP_SECRET
 * - ITEM_IDS
 * - TELEGRAM_BOT_TOKEN   (token gerado pelo @BotFather)
 * - TELEGRAM_CHAT_ID     (ID do grupo privado autorizado, ex.: -100...)
 * - TELEGRAM_SENT_IDS    (controle interno anti-duplicidade)
 * - TELEGRAM_RETRY_QUEUE (fila automática de reenvio em caso de falha)
 */

const FORM_TITLE = "Mentoria Regisdência — Candidaturas 2027";
const SHEET_TITLE = "Mentoria Regisdência — Respostas de Candidaturas";
const LGPD_CHOICE = "Sim, autorizo o tratamento dos dados (LGPD)";
const MAX_TELEGRAM_RETRIES = 5;
const MAX_SENT_IDS_STORED = 200;
const MAX_RETRY_QUEUE_SIZE = 50;

const SITUACAO_CHOICES = [
  "Recém-formado",
  "Estagiário em internato",
  "Médico que trabalha",
  "Outra",
];

const PROVA_CHOICES = [
  "ENARE",
  "SESP-PE",
  "USP-SP",
  "FESP-PE",
  "UNICAMP",
  "Outra",
];

/**
 * Executa a criação única e idempotente do Google Forms + Google Sheets vinculado
 * e grava os identificadores e o segredo em ScriptProperties.
 */
function setupMentoriaRegisdencia() {
  const props = PropertiesService.getScriptProperties();

  let secret = props.getProperty("WEB_APP_SECRET");
  if (!secret) {
    secret = generateSecret_();
    props.setProperty("WEB_APP_SECRET", secret);
  }

  let formId = props.getProperty("FORM_ID");
  let form = null;
  if (formId) {
    try {
      form = FormApp.openById(formId);
    } catch (err) {
      form = null;
    }
  }

  let sheetId = props.getProperty("SPREADSHEET_ID");
  let ss = null;
  if (sheetId) {
    try {
      ss = SpreadsheetApp.openById(sheetId);
    } catch (err) {
      ss = null;
    }
  }

  if (!ss) {
    ss = SpreadsheetApp.create(SHEET_TITLE);
    sheetId = ss.getId();
    props.setProperty("SPREADSHEET_ID", sheetId);
  }

  if (!form) {
    form = FormApp.create(FORM_TITLE);
    form.setDescription(
      "Respostas recebidas pelo formulário oficial da landing page da Mentoria Regisdência.",
    );
    form.setCollectEmail(false);
    form.setAcceptingResponses(true);

    const nomeItem = form
      .addTextItem()
      .setTitle("Nome completo")
      .setRequired(true);

    const whatsappItem = form
      .addTextItem()
      .setTitle("WhatsApp")
      .setRequired(true);

    const emailItem = form
      .addTextItem()
      .setTitle("E-mail")
      .setRequired(false);

    const situacaoItem = form
      .addMultipleChoiceItem()
      .setTitle("Sua situação")
      .setChoiceValues(SITUACAO_CHOICES)
      .setRequired(true);

    const situacaoOutraItem = form
      .addTextItem()
      .setTitle("Detalhe da situação (se Outra)")
      .setRequired(false);

    const provasItem = form
      .addCheckboxItem()
      .setTitle("Provas pretendidas")
      .setChoiceValues(PROVA_CHOICES)
      .setRequired(true);

    const dificuldadeItem = form
      .addParagraphTextItem()
      .setTitle("Sua principal dificuldade")
      .setRequired(true);

    const indicacaoItem = form
      .addTextItem()
      .setTitle("Código de indicação ou cupom")
      .setRequired(false);

    const lgpdItem = form
      .addMultipleChoiceItem()
      .setTitle("Autorização LGPD")
      .setChoiceValues([LGPD_CHOICE])
      .setRequired(true);

    const origemItem = form
      .addTextItem()
      .setTitle("Origem / UTM / Referrer")
      .setRequired(false);

    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

    formId = form.getId();
    props.setProperty("FORM_ID", formId);
    props.setProperty(
      "ITEM_IDS",
      JSON.stringify({
        nome: nomeItem.getId(),
        whatsapp: whatsappItem.getId(),
        email: emailItem.getId(),
        situacao: situacaoItem.getId(),
        situacaoOutra: situacaoOutraItem.getId(),
        provas: provasItem.getId(),
        dificuldade: dificuldadeItem.getId(),
        indicacao: indicacaoItem.getId(),
        lgpd: lgpdItem.getId(),
        origem: origemItem.getId(),
      }),
    );
  }

  Logger.log("=== CONFIGURAÇÃO CONCLUÍDA ===");
  Logger.log("FORM_ID: " + formId);
  Logger.log("FORM_EDIT_URL: " + form.getEditUrl());
  Logger.log("SPREADSHEET_ID: " + sheetId);
  Logger.log("SPREADSHEET_URL: " + ss.getUrl());
  Logger.log("WEB_APP_SECRET: " + secret);
}

/**
 * Health-check simples (sem expor segredos ou respostas).
 */
function doGet() {
  return jsonOutput_({
    ok: true,
    service: "mentoria-regisdencia-candidatura-bridge",
  });
}

/**
 * Recebe a candidatura validada pelo servidor Next.js, verifica o segredo,
 * evita duplicidade concorrente ou repetida no mesmo dia e grava uma resposta
 * oficial no Google Forms (que sincroniza automaticamente com o Google Sheets).
 * Somente após a confirmação do registro no Forms, dispara a notificação Telegram.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return jsonOutput_({
      ok: false,
      error: "Servidor ocupado. Tente novamente em instantes.",
    });
  }

  try {
    const props = PropertiesService.getScriptProperties();
    const expectedSecret = props.getProperty("WEB_APP_SECRET");
    const formId = props.getProperty("FORM_ID");
    const sheetId = props.getProperty("SPREADSHEET_ID");
    const rawItemIds = props.getProperty("ITEM_IDS");

    if (!expectedSecret || !formId || !rawItemIds) {
      return jsonOutput_({
        ok: false,
        error: "Integração não inicializada. Execute setupMentoriaRegisdencia().",
      });
    }

    let payload;
    try {
      payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    } catch (err) {
      return jsonOutput_({ ok: false, error: "JSON inválido." });
    }

    if (!payload || payload.secret !== expectedSecret) {
      return jsonOutput_({ ok: false, error: "Não autorizado." });
    }

    const nome = String(payload.nome || "").trim();
    const whatsapp = String(payload.whatsapp || "").trim();
    const email = String(payload.email || "").trim();
    const situacaoLabel = String(payload.situacaoLabel || "").trim();
    const situacaoOutra = String(payload.situacaoOutra || "").trim();
    const provas = Array.isArray(payload.provas)
      ? payload.provas.map((p) => String(p).trim()).filter(Boolean)
      : [];
    const dificuldade = String(payload.dificuldade || "").trim();
    const indicacao = String(payload.indicacao || "").trim();
    const origemResumo = String(payload.origemResumo || "").trim();
    const lgpd = Boolean(payload.lgpd);
    const dedupKey = String(payload.dedupKey || "").trim();

    if (
      nome.length < 3 ||
      whatsapp.replace(/\D/g, "").length < 8 ||
      SITUACAO_CHOICES.indexOf(situacaoLabel) === -1 ||
      provas.length === 0 ||
      dificuldade.length < 3 ||
      !lgpd
    ) {
      return jsonOutput_({
        ok: false,
        error: "Dados obrigatórios ausentes ou inválidos.",
      });
    }

    const validProvas = provas.filter((p) => PROVA_CHOICES.indexOf(p) !== -1);
    if (validProvas.length === 0) {
      return jsonOutput_({
        ok: false,
        error: "Nenhuma prova válida informada.",
      });
    }

    // Deduplicação em cache (até 6h) + conferência nas respostas recentes do dia
    const cache = CacheService.getScriptCache();
    if (dedupKey) {
      if (cache.get(dedupKey)) {
        return jsonOutput_({
          ok: true,
          duplicate: true,
          message: "Candidatura já registrada anteriormente hoje.",
        });
      }
      if (sheetId && isDuplicateInSheetToday_(sheetId, whatsapp)) {
        cache.put(dedupKey, "1", 21600);
        return jsonOutput_({
          ok: true,
          duplicate: true,
          message: "Candidatura já registrada anteriormente hoje.",
        });
      }
    }

    const itemIds = JSON.parse(rawItemIds);
    const form = FormApp.openById(formId);
    const formResponse = form.createResponse();

    formResponse.withItemResponse(
      form.getItemById(itemIds.nome).asTextItem().createResponse(nome),
    );
    formResponse.withItemResponse(
      form.getItemById(itemIds.whatsapp).asTextItem().createResponse(whatsapp),
    );
    if (email) {
      formResponse.withItemResponse(
        form.getItemById(itemIds.email).asTextItem().createResponse(email),
      );
    }
    formResponse.withItemResponse(
      form
        .getItemById(itemIds.situacao)
        .asMultipleChoiceItem()
        .createResponse(situacaoLabel),
    );
    if (situacaoOutra) {
      formResponse.withItemResponse(
        form
          .getItemById(itemIds.situacaoOutra)
          .asTextItem()
          .createResponse(situacaoOutra),
      );
    }
    formResponse.withItemResponse(
      form
        .getItemById(itemIds.provas)
        .asCheckboxItem()
        .createResponse(validProvas),
    );
    formResponse.withItemResponse(
      form
        .getItemById(itemIds.dificuldade)
        .asParagraphTextItem()
        .createResponse(dificuldade),
    );
    if (indicacao) {
      formResponse.withItemResponse(
        form
          .getItemById(itemIds.indicacao)
          .asTextItem()
          .createResponse(indicacao),
      );
    }
    formResponse.withItemResponse(
      form
        .getItemById(itemIds.lgpd)
        .asMultipleChoiceItem()
        .createResponse(LGPD_CHOICE),
    );
    if (origemResumo) {
      formResponse.withItemResponse(
        form
          .getItemById(itemIds.origem)
          .asTextItem()
          .createResponse(origemResumo),
      );
    }

    // Operação principal: gravação oficial no Google Forms + Google Sheets
    const submitted = formResponse.submit();
    const responseId = submitted.getId();
    const submittedAt = submitted.getTimestamp();

    if (dedupKey) {
      cache.put(dedupKey, responseId, 21600);
    }

    // Operação complementar: notificação Telegram (falha nunca perde a candidatura)
    notifyTelegramSafely_(
      {
        responseId: responseId,
        submittedAtIso: submittedAt.toISOString(),
        nome: nome,
        whatsapp: whatsapp,
        situacaoLabel: situacaoLabel,
        situacaoOutra: situacaoOutra,
        provas: validProvas,
        dificuldade: dificuldade,
        indicacao: indicacao,
        origemResumo: origemResumo,
      },
      sheetId,
    );

    return jsonOutput_({
      ok: true,
      responseId: responseId,
      submittedAt: submittedAt.toISOString(),
    });
  } catch (err) {
    return jsonOutput_({
      ok: false,
      error: "Erro interno ao registrar no Google Forms.",
    });
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// NOTIFICAÇÕES TELEGRAM (APÓS CONFIRMAÇÃO NO GOOGLE FORMS)
// ============================================================================

/**
 * Executa o envio ao Telegram sem lançar exceções para o fluxo principal.
 * Em caso de falha, registra na fila TELEGRAM_RETRY_QUEUE para reenvio automático.
 */
function notifyTelegramSafely_(notification, sheetId) {
  try {
    const props = PropertiesService.getScriptProperties();
    const token = props.getProperty("TELEGRAM_BOT_TOKEN");
    const chatId = props.getProperty("TELEGRAM_CHAT_ID");

    if (!token || !chatId) {
      enqueueTelegramRetry_(
        notification,
        sheetId,
        "TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não configurado.",
      );
      return;
    }

    if (wasTelegramSent_(notification.responseId)) {
      return;
    }

    const result = sendTelegramNotification_(token, chatId, sheetId, notification);
    if (result.ok) {
      markTelegramSent_(notification.responseId);
    } else {
      enqueueTelegramRetry_(notification, sheetId, result.error);
    }
  } catch (err) {
    try {
      enqueueTelegramRetry_(
        notification,
        sheetId,
        String((err && err.message) || err),
      );
    } catch (innerErr) {
      Logger.log("Falha ao enfileirar retry do Telegram.");
    }
  }
}

/**
 * Envia a mensagem formatada e os dois botões interativos via API oficial do Telegram.
 */
function sendTelegramNotification_(token, chatId, sheetId, data) {
  const tz = Session.getScriptTimeZone() || "America/Sao_Paulo";
  const dt = data.submittedAtIso ? new Date(data.submittedAtIso) : new Date();
  const formattedDate = Utilities.formatDate(dt, tz, "dd/MM/yyyy 'às' HH:mm");

  const situacaoTexto =
    data.situacaoLabel === "Outra" && data.situacaoOutra
      ? data.situacaoLabel + " (" + data.situacaoOutra + ")"
      : data.situacaoLabel;

  const dificuldadeCurta = truncateText_(data.dificuldade, 200);

  const lines = [
    data.isTest
      ? "<b>[TESTE] NOVA APLICAÇÃO | REGIS-DÊNCIA 2027</b>"
      : "<b>NOVA APLICAÇÃO | REGIS-DÊNCIA 2027</b>",
    "",
    "<b>Candidato:</b> " + escapeHtml_(data.nome),
    "<b>Data e horário:</b> " + escapeHtml_(formattedDate),
    "<b>WhatsApp:</b> " + escapeHtml_(formatPhoneDisplay_(data.whatsapp)),
    "<b>Situação:</b> " + escapeHtml_(situacaoTexto),
    "<b>Provas:</b> " + escapeHtml_((data.provas || []).join(", ")),
    "<b>Dificuldade:</b> " + escapeHtml_(dificuldadeCurta),
  ];

  if (data.indicacao) {
    lines.push("<b>Indicação / Cupom:</b> " + escapeHtml_(data.indicacao));
  }

  if (data.origemResumo) {
    lines.push(
      "<b>Origem:</b> " + escapeHtml_(truncateText_(data.origemResumo, 140)),
    );
  }

  const inlineKeyboard = buildTelegramButtons_(data, sheetId);

  const body = {
    chat_id: chatId,
    text: lines.join("\n"),
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  };

  const response = UrlFetchApp.fetch(
    "https://api.telegram.org/bot" + token + "/sendMessage",
    {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(body),
      muteHttpExceptions: true,
    },
  );

  const code = response.getResponseCode();
  let parsed = null;
  try {
    parsed = JSON.parse(response.getContentText() || "{}");
  } catch (err) {
    parsed = null;
  }

  if (code >= 200 && code < 300 && parsed && parsed.ok === true) {
    return { ok: true };
  }

  return {
    ok: false,
    error:
      "HTTP " +
      code +
      (parsed && parsed.description ? ": " + parsed.description : ""),
  };
}

function buildTelegramButtons_(data, sheetId) {
  const rows = [];
  const waDigits = normalizeBrazilPhoneForWa_(data.whatsapp);
  if (waDigits) {
    const firstName = String(data.nome || "").trim().split(/\s+/)[0] || "olá";
    const greeting =
      "Olá, " +
      firstName +
      "! Recebemos sua aplicação para a Mentoria Regis-dência 2027 e gostaríamos de conversar sobre a sua preparação.";
    rows.push([
      {
        text: "Entrar em contato pelo WhatsApp",
        url: "https://wa.me/" + waDigits + "?text=" + encodeURIComponent(greeting),
      },
    ]);
  }

  if (sheetId) {
    rows.push([
      {
        text: "Visualizar aplicações",
        url: "https://docs.google.com/spreadsheets/d/" + sheetId + "/edit",
      },
    ]);
  }

  return rows;
}

// ============================================================================
// CONTROLE ANTI-DUPLICIDADE E FILA AUTÔNOMA DE REENVIO (RETRY)
// ============================================================================

function wasTelegramSent_(responseId) {
  if (!responseId) return false;
  const cache = CacheService.getScriptCache();
  if (cache.get("tg_sent_" + responseId)) return true;

  const props = PropertiesService.getScriptProperties();
  const sentIds = parseJsonArray_(props.getProperty("TELEGRAM_SENT_IDS"));
  return sentIds.indexOf(responseId) !== -1;
}

function markTelegramSent_(responseId) {
  if (!responseId) return;
  const cache = CacheService.getScriptCache();
  cache.put("tg_sent_" + responseId, "1", 21600);

  const props = PropertiesService.getScriptProperties();
  const sentIds = parseJsonArray_(props.getProperty("TELEGRAM_SENT_IDS"));
  if (sentIds.indexOf(responseId) === -1) {
    sentIds.push(responseId);
    if (sentIds.length > MAX_SENT_IDS_STORED) {
      sentIds.splice(0, sentIds.length - MAX_SENT_IDS_STORED);
    }
    props.setProperty("TELEGRAM_SENT_IDS", JSON.stringify(sentIds));
  }
}

function enqueueTelegramRetry_(notification, sheetId, errorMsg) {
  if (!notification || !notification.responseId) return;
  if (wasTelegramSent_(notification.responseId)) return;

  const props = PropertiesService.getScriptProperties();
  const queue = parseJsonArray_(props.getProperty("TELEGRAM_RETRY_QUEUE"));
  const alreadyQueued = queue.some(
    (item) =>
      item &&
      item.notification &&
      item.notification.responseId === notification.responseId,
  );
  if (alreadyQueued) return;

  queue.push({
    notification: notification,
    sheetId: sheetId || props.getProperty("SPREADSHEET_ID") || "",
    attempts: 1,
    nextRetryAt: Date.now() + 5 * 60 * 1000,
    lastError: truncateText_(String(errorMsg || "Erro desconhecido"), 160),
  });

  if (queue.length > MAX_RETRY_QUEUE_SIZE) {
    queue.splice(0, queue.length - MAX_RETRY_QUEUE_SIZE);
  }
  props.setProperty("TELEGRAM_RETRY_QUEUE", JSON.stringify(queue));
}

/**
 * Executada automaticamente a cada 10 minutos por gatilho temporal do Apps Script
 * para reenviar notificações pendentes em caso de indisponibilidade do Telegram.
 */
function processTelegramRetryQueue() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;

  try {
    const props = PropertiesService.getScriptProperties();
    const token = props.getProperty("TELEGRAM_BOT_TOKEN");
    const chatId = props.getProperty("TELEGRAM_CHAT_ID");
    const queue = parseJsonArray_(props.getProperty("TELEGRAM_RETRY_QUEUE"));

    if (queue.length === 0 || !token || !chatId) return;

    const now = Date.now();
    const remaining = [];

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (!item || !item.notification) continue;

      const rid = item.notification.responseId;
      if (wasTelegramSent_(rid)) continue;

      if (item.nextRetryAt && now < item.nextRetryAt) {
        remaining.push(item);
        continue;
      }

      const res = sendTelegramNotification_(
        token,
        chatId,
        item.sheetId || props.getProperty("SPREADSHEET_ID") || "",
        item.notification,
      );

      if (res.ok) {
        markTelegramSent_(rid);
      } else {
        const nextAttempt = (item.attempts || 1) + 1;
        if (nextAttempt <= MAX_TELEGRAM_RETRIES) {
          const backoffMinutes = Math.min(120, Math.pow(3, nextAttempt - 1) * 5);
          remaining.push({
            notification: item.notification,
            sheetId: item.sheetId,
            attempts: nextAttempt,
            nextRetryAt: now + backoffMinutes * 60 * 1000,
            lastError: truncateText_(String(res.error || ""), 160),
          });
        } else {
          Logger.log(
            "Notificação descartada após " +
              MAX_TELEGRAM_RETRIES +
              " tentativas: responseId=" +
              rid,
          );
        }
      }
    }

    props.setProperty("TELEGRAM_RETRY_QUEUE", JSON.stringify(remaining));
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// FUNÇÕES DE CONFIGURAÇÃO E TESTE NO EDITOR DO APPS SCRIPT
// ============================================================================

/**
 * Descobre automaticamente o TELEGRAM_CHAT_ID do grupo privado a partir das
 * mensagens recentes recebidas pelo bot (sem exibir o token nos logs).
 */
function detectTelegramChatId() {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty("TELEGRAM_BOT_TOKEN");
  if (!token) {
    Logger.log(
      "Adicione primeiro TELEGRAM_BOT_TOKEN em Configurações do projeto -> Propriedades do script.",
    );
    return;
  }

  const res = UrlFetchApp.fetch(
    "https://api.telegram.org/bot" + token + "/getUpdates",
    { muteHttpExceptions: true },
  );
  const data = JSON.parse(res.getContentText() || "{}");
  if (!data.ok || !Array.isArray(data.result)) {
    Logger.log("Não foi possível consultar getUpdates do Telegram.");
    return;
  }

  const seen = {};
  for (let i = 0; i < data.result.length; i++) {
    const upd = data.result[i];
    const msg =
      upd.message ||
      upd.channel_post ||
      (upd.my_chat_member && upd.my_chat_member);
    const chat = msg && msg.chat;
    if (chat && !seen[chat.id]) {
      seen[chat.id] = true;
      Logger.log(
        "CHAT ENCONTRADO -> ID: " +
          chat.id +
          " | Tipo: " +
          chat.type +
          " | Título: " +
          (chat.title || chat.username || "Privado"),
      );
    }
  }

  if (Object.keys(seen).length === 0) {
    Logger.log(
      "Nenhum chat encontrado ainda. Envie uma mensagem no grupo privado onde o bot foi adicionado e execute novamente.",
    );
  }
}

/**
 * Instala (de forma idempotente) o gatilho automático a cada 10 minutos
 * para processar reenvios pendentes do Telegram.
 */
function installTelegramRetryTrigger() {
  const existing = ScriptApp.getProjectTriggers();
  for (let i = 0; i < existing.length; i++) {
    if (existing[i].getHandlerFunction() === "processTelegramRetryQueue") {
      Logger.log("Gatilho processTelegramRetryQueue já está instalado.");
      return;
    }
  }

  ScriptApp.newTrigger("processTelegramRetryQueue")
    .timeBased()
    .everyMinutes(10)
    .create();
  Logger.log("Gatilho processTelegramRetryQueue (10 min) instalado com sucesso.");
}

/**
 * Envia uma mensagem de teste claramente identificada para o grupo configurado,
 * validando token, chat ID e os dois botões interativos sem alterar a planilha.
 */
function sendTelegramTestMessage() {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty("TELEGRAM_BOT_TOKEN");
  const chatId = props.getProperty("TELEGRAM_CHAT_ID");
  const sheetId = props.getProperty("SPREADSHEET_ID");

  if (!token || !chatId) {
    Logger.log(
      "Configure TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID nas Propriedades do script antes de testar.",
    );
    return;
  }

  const res = sendTelegramNotification_(token, chatId, sheetId, {
    responseId: "TEST_" + Date.now(),
    submittedAtIso: new Date().toISOString(),
    nome: "Candidato Teste (Validação Telegram)",
    whatsapp: "(11) 99999-0001",
    situacaoLabel: "Estagiário em internato",
    situacaoOutra: "",
    provas: ["ENARE", "USP-SP"],
    dificuldade:
      "Conciliar rodízios do internato com revisões semanais e simulados.",
    indicacao: "TESTE2027",
    origemResumo: "utm_source=teste | utm_medium=telegram_setup",
    isTest: true,
  });

  Logger.log(
    res.ok
      ? "Mensagem de teste enviada com sucesso ao grupo do Telegram!"
      : "Falha no envio de teste: " + res.error,
  );
}

// ============================================================================
// UTILITÁRIOS INTERNOS
// ============================================================================

function isDuplicateInSheetToday_(sheetId, whatsapp) {
  try {
    const ss = SpreadsheetApp.openById(sheetId);
    const sheets = ss.getSheets();
    if (!sheets || sheets.length === 0) return false;
    const sheet = sheets[0];
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return false;

    const startRow = Math.max(2, lastRow - 150);
    const numRows = lastRow - startRow + 1;
    const values = sheet.getRange(startRow, 1, numRows, 3).getValues();
    const targetDigits = String(whatsapp).replace(/\D/g, "");
    const todayStr = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd",
    );

    for (let i = values.length - 1; i >= 0; i--) {
      const ts = values[i][0];
      const rowPhone = String(values[i][2] || "").replace(/\D/g, "");
      if (ts instanceof Date && rowPhone === targetDigits) {
        const rowDate = Utilities.formatDate(
          ts,
          Session.getScriptTimeZone(),
          "yyyy-MM-dd",
        );
        if (rowDate === todayStr) return true;
      }
    }
    return false;
  } catch (err) {
    return false;
  }
}

function normalizeBrazilPhoneForWa_(rawPhone) {
  let digits = String(rawPhone || "").replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length < 8 || digits.length > 15) return "";
  if (digits.length === 10 || digits.length === 11) {
    digits = "55" + digits;
  }
  return digits;
}

function formatPhoneDisplay_(rawPhone) {
  const digits = String(rawPhone || "").replace(/\D/g, "");
  if (digits.length === 11) {
    return (
      "(" +
      digits.slice(0, 2) +
      ") " +
      digits.slice(2, 7) +
      "-" +
      digits.slice(7)
    );
  }
  if (digits.length === 10) {
    return (
      "(" +
      digits.slice(0, 2) +
      ") " +
      digits.slice(2, 6) +
      "-" +
      digits.slice(6)
    );
  }
  return String(rawPhone || "").trim();
}

function escapeHtml_(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function truncateText_(str, maxLen) {
  const clean = String(str || "").trim().replace(/\s+/g, " ");
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen - 1).trim() + "…";
}

function parseJsonArray_(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function generateSecret_() {
  return (
    Utilities.getUuid().replace(/-/g, "") +
    Utilities.getUuid().replace(/-/g, "")
  );
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
