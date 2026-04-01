const CARD_FILTERS = [
  { id: "all", label: "全部" },
  { id: "blessing", label: "祝福" },
  { id: "hybrid", label: "诡契" },
  { id: "curse", label: "诅咒" },
  { id: "relic", label: "奇物" },
];

const RARITY_LABEL = {
  common: "普通",
  rare: "稀有",
  epic: "史诗",
  legendary: "传说",
};

const KIND_LABEL = {
  blessing: "祝福",
  hybrid: "诡契",
  curse: "诅咒",
  relic: "奇物",
};

const STAT_META = [
  { key: "craft", label: "古法编程", tone: "稳定但不花哨" },
  { key: "vibe", label: "Vibe 共鸣", tone: "灵感与模型默契" },
  { key: "stability", label: "稳定性", tone: "面对事故的硬度" },
  { key: "tokens", label: "Token 储备", tone: "还能再喂几轮上下文" },
  { key: "hype", label: "热度", tone: "观众和老板愿不愿意鼓掌" },
  { key: "integrity", label: "项目完整度", tone: "代码和精神是否还完整" },
];

let CARDS = [];

const OPENING_DRAFT_SIZE = 8;
const OPENING_PICK_TARGET = 3;

const STAGES = [
  {
    id: "idea",
    label: "Sprint 01",
    title: "点子着陆",
    intro: "你决定不再只是聊概念，这次真的要做一个能跑的东西。",
    cost: 2,
    threshold: 16,
    eventCount: 1,
    weights: { craft: 0.35, vibe: 1.05, stability: 0.25, hype: 0.18 },
    reward: { tokens: 2, hype: 1 },
    penalty: { integrity: 1, stability: 1 },
  },
  {
    id: "scaffold",
    label: "Sprint 02",
    title: "脚手架周",
    intro: "目录结构刚长出骨架，你已经开始和未来的自己对线。",
    cost: 3,
    threshold: 18,
    eventCount: 1,
    weights: { craft: 0.7, vibe: 0.65, stability: 0.45, hype: 0.05 },
    reward: { craft: 1, tokens: 2 },
    penalty: { integrity: 1, tokens: 1 },
  },
  {
    id: "tech-choice",
    label: "Sprint 03",
    title: "技术选型",
    intro: "每一个今天看上去优雅的决定，都可能在三周后回来追杀你。",
    cost: 3,
    threshold: 19,
    eventCount: 1,
    weights: { craft: 0.85, vibe: 0.55, stability: 0.4, hype: 0.08 },
    reward: { stability: 1, tokens: 2 },
    penalty: { stability: 1, hype: 1 },
  },
  {
    id: "prototype",
    label: "Sprint 04",
    title: "原型冲刺",
    intro: "功能刚能跑，审美还在路上，但你已经忍不住想把它发到群里。",
    cost: 4,
    threshold: 21,
    eventCount: 2,
    weights: { craft: 0.4, vibe: 1.05, stability: 0.4, hype: 0.22 },
    reward: { hype: 3, tokens: 1 },
    penalty: { integrity: 1, tokens: 2 },
  },
  {
    id: "pivot",
    label: "Sprint 05",
    title: "需求变形",
    intro: "项目开始长出第二人格，昨天的功能今天已经被定义为历史包袱。",
    cost: 4,
    threshold: 22,
    eventCount: 2,
    weights: { craft: 0.65, vibe: 0.8, stability: 0.55, hype: 0.12 },
    reward: { craft: 1, hype: 2 },
    penalty: { integrity: 1, stability: 1, vibe: 1 },
  },
  {
    id: "integration",
    label: "Sprint 06",
    title: "接口联调",
    intro: "前后端、文档和现实世界终于要正面相撞了。",
    cost: 4,
    threshold: 24,
    eventCount: 2,
    weights: { craft: 0.75, vibe: 0.42, stability: 1.05, hype: 0.05 },
    reward: { stability: 1, tokens: 2 },
    penalty: { integrity: 1, tokens: 1, vibe: 1 },
  },
  {
    id: "ux-polish",
    label: "Sprint 07",
    title: "体验打磨",
    intro: "现在它不仅要能用，还得让人觉得你不是在仓库里连夜拼出来的。",
    cost: 5,
    threshold: 25,
    eventCount: 2,
    weights: { craft: 0.35, vibe: 1.08, stability: 0.45, hype: 0.25 },
    reward: { hype: 3, integrity: 1 },
    penalty: { tokens: 2, stability: 1 },
  },
  {
    id: "hackathon",
    label: "Sprint 08",
    title: "黑客松周",
    intro: "所有人都在炫技，你必须决定是稳扎稳打还是现场起飞。",
    cost: 5,
    threshold: 27,
    eventCount: 2,
    weights: { craft: 0.55, vibe: 0.92, stability: 0.45, hype: 0.32 },
    reward: { hype: 4, tokens: 2 },
    penalty: { integrity: 1, hype: 2 },
  },
  {
    id: "beta",
    label: "Sprint 09",
    title: "灰度试运行",
    intro: "真实用户第一次碰到你的产品，世界终于开始给出不客气的反馈。",
    cost: 5,
    threshold: 28,
    eventCount: 2,
    weights: { craft: 0.62, vibe: 0.58, stability: 1.02, hype: 0.12 },
    reward: { integrity: 1, tokens: 2, hype: 1 },
    penalty: { integrity: 1, stability: 2 },
  },
  {
    id: "traffic",
    label: "Sprint 10",
    title: "流量刺穿",
    intro: "一条转发把你从冷启动直接推到聚光灯里，系统和心态同时接受压测。",
    cost: 6,
    threshold: 30,
    eventCount: 2,
    weights: { craft: 0.45, vibe: 0.85, stability: 0.72, hype: 0.36 },
    reward: { hype: 5, tokens: 1 },
    penalty: { integrity: 1, stability: 2, tokens: 2 },
  },
  {
    id: "refactor",
    label: "Sprint 11",
    title: "重构季",
    intro: "你终于有机会停下来整理战场，只是没人保证整理过程中不会再炸一次。",
    cost: 6,
    threshold: 31,
    eventCount: 2,
    weights: { craft: 1.05, vibe: 0.3, stability: 0.92, hype: 0.05 },
    reward: { craft: 2, integrity: 1 },
    penalty: { tokens: 2, stability: 2 },
  },
  {
    id: "board-demo",
    label: "Sprint 12",
    title: "融资展示",
    intro: "你要同时说服投资人、同事和你自己，这个东西不只是碰巧能跑。",
    cost: 6,
    threshold: 33,
    eventCount: 3,
    weights: { craft: 0.42, vibe: 0.78, stability: 0.55, hype: 0.45 },
    reward: { hype: 6, tokens: 2 },
    penalty: { hype: 2, integrity: 1 },
  },
  {
    id: "launch",
    label: "Sprint 13",
    title: "上线周",
    intro: "所有临时方案都会在这一周索要利息，所有侥幸都会在这一周露头。",
    cost: 7,
    threshold: 35,
    eventCount: 3,
    weights: { craft: 0.7, vibe: 0.42, stability: 1.12, hype: 0.18 },
    reward: { integrity: 1, tokens: 3, hype: 2 },
    penalty: { integrity: 2, stability: 2, tokens: 2 },
  },
  {
    id: "aftercare",
    label: "Sprint 14",
    title: "长尾维护",
    intro: "真正的产品不是发布那一刻诞生的，而是你愿不愿意继续照顾它。",
    cost: 7,
    threshold: 36,
    eventCount: 3,
    weights: { craft: 0.8, vibe: 0.52, stability: 0.95, hype: 0.22 },
    reward: { integrity: 1, hype: 3, tokens: 2 },
    penalty: { integrity: 2, stability: 2 },
  },
];

const RANDOM_EVENTS = [
  {
    id: "cold_brew",
    title: "冷萃超量",
    weight: 9,
    apply(state) {
      applyDelta(state, { tokens: 2, vibe: 1, stability: -1 });
      return "咖啡把你的脑回路直接推到了 1.25 倍速。";
    },
  },
  {
    id: "opensource_loot",
    title: "开源掉宝",
    weight: 7,
    condition: (state) => state.craft >= 8,
    apply(state) {
      applyDelta(state, { craft: 1, tokens: 2, hype: 1 });
      return "你在一条 issue 里顺手捡到能直接救命的实现。";
    },
  },
  {
    id: "boss_voice",
    title: "深夜语音",
    weight: 7,
    maxStage: 9,
    apply(state) {
      applyDelta(state, { hype: 1, stability: -2 });
      return "需求被重新命名为“再顺一下感觉”，你却没能得到任何额外定义。";
    },
  },
  {
    id: "community_push",
    title: "社区自来水",
    weight: 5,
    minStage: 3,
    condition: (state) => state.hype >= 4,
    apply(state) {
      applyDelta(state, { hype: 3, tokens: 2 });
      return "有人把你的 Demo 转到了更大的圈子里，热度忽然自己开始生长。";
    },
  },
  {
    id: "context_loss",
    title: "上下文蒸发",
    weight: 7,
    apply(state) {
      applyDelta(state, { tokens: -3, vibe: -1 });
      return "你关掉了一个窗口，也顺便把最关键的一段上下文忘在了昨天。";
    },
  },
  {
    id: "mentor_review",
    title: "前辈路过",
    weight: 6,
    apply(state) {
      applyDelta(state, { craft: 2, stability: 1 });
      return "一句“你要不要先看一下这里的边界”省掉了你半夜两小时。";
    },
  },
  {
    id: "ghost_bug",
    title: "幽灵 Bug",
    weight: 5,
    minStage: 2,
    apply(state) {
      applyDelta(state, { stability: -2 });
      if (state.modifiers.failureRefund) {
        applyDelta(state, { tokens: 1 });
        return "它只在演示前五分钟出现，但肩上的恶魔居然替你补回了 1 Token。";
      }
      return "它只在你看着屏幕的时候消失，在别人围观时准时出现。";
    },
  },
  {
    id: "user_praise",
    title: "首批好评",
    weight: 6,
    minStage: 2,
    apply(state) {
      applyDelta(state, { hype: 2, integrity: 1 });
      return "第一批用户夸你“居然真的有用”，这句评价比任何 KPI 都更提神。";
    },
  },
  {
    id: "cache_miracle",
    title: "缓存奇迹",
    weight: 5,
    condition: (state) => state.tokens <= 16,
    apply(state) {
      applyDelta(state, { tokens: 4, vibe: 1 });
      return "缓存终于第一次站在你这边，像宇宙迟到的道歉。";
    },
  },
  {
    id: "weekend_silence",
    title: "周末安静",
    weight: 5,
    apply(state) {
      applyDelta(state, { stability: 2, tokens: 1 });
      return "没有新消息轰炸的一天，让你重新听见自己的思路。";
    },
  },
  {
    id: "design_overdrive",
    title: "设计飞升",
    weight: 5,
    minStage: 2,
    apply(state) {
      applyDelta(state, { hype: 2, vibe: 2, tokens: -1 });
      return "视觉突然升级了一个档次，你的改动范围也同步升级了一个档次。";
    },
  },
  {
    id: "dependency_roulette",
    title: "依赖轮盘",
    weight: 6,
    minStage: 4,
    apply(state) {
      applyDelta(state, { stability: -2, tokens: -1 });
      return "你更新了一个依赖，它也顺手更新了你的人生难度。";
    },
  },
  {
    id: "sponsor_ping",
    title: "赞助邀约",
    weight: 4,
    minStage: 7,
    unique: true,
    condition: (state) => state.hype >= 8,
    apply(state) {
      applyDelta(state, { tokens: 5, hype: 2 });
      return "路过的赞助商突然问你有没有兴趣把这个项目讲成一个更大的故事。";
    },
  },
  {
    id: "intern_surprise",
    title: "实习生波函数",
    weight: 6,
    minStage: 1,
    apply(state) {
      if (Math.random() < 0.5) {
        applyDelta(state, { tokens: 3, stability: 1 });
        return "实习生交来一份神之一 PR，像是来自另一个更稳定的宇宙。";
      }
      applyDelta(state, { stability: -2, integrity: -1 });
      return "实习生把测试环境和生产环境之间最后一点羞耻心一起删掉了。";
    },
  },
  {
    id: "meme_viral",
    title: "梗图出圈",
    weight: 4,
    minStage: 5,
    condition: (state) => state.vibe >= 10,
    apply(state) {
      applyDelta(state, { hype: 4, tokens: 2, stability: -1 });
      return "你做的某个离谱效果被疯传，热度比文档先一步抵达世界。";
    },
  },
  {
    id: "manual_trace",
    title: "徒手顺栈",
    weight: 5,
    condition: (state) => state.modifiers.noVibe,
    apply(state) {
      applyDelta(state, { craft: 2, stability: 1, tokens: 1 });
      return "你顺着调用栈一路摸到真正的病灶，像回到石器时代但更可靠。";
    },
  },
  {
    id: "multi_model_resonance",
    title: "多模型共振",
    weight: 4,
    condition: (state) => state.modifiers.dualModel,
    apply(state) {
      applyDelta(state, { vibe: 2, craft: 1, hype: 1 });
      return "这一次两个模型没有互相扯后腿，反而真的拼出了正确答案。";
    },
  },
  {
    id: "funding_winter",
    title: "资金寒潮",
    weight: 5,
    minStage: 8,
    apply(state) {
      applyDelta(state, { tokens: -2, hype: -1, stability: 1 });
      return "预算缩了一圈，但你也被迫学会了什么叫真正的取舍。";
    },
  },
  {
    id: "lucky_refactor",
    title: "幸运重构",
    weight: 4,
    minStage: 6,
    condition: (state) => state.craft >= 10,
    apply(state) {
      applyDelta(state, { craft: 1, integrity: 1, tokens: 2 });
      return "你本来只是想整理一下，结果顺手把几片雷区一起拆干净了。";
    },
  },
  {
    id: "night_eureka",
    title: "午夜灵光",
    weight: 5,
    minStage: 3,
    apply(state) {
      applyDelta(state, { vibe: 2, craft: 1, stability: -1 });
      return "洗澡的时候，方案自己从天花板上掉了下来。";
    },
  },
  {
    id: "meeting_cancelled",
    title: "会议蒸发",
    weight: 4,
    apply(state) {
      applyDelta(state, { tokens: 2, stability: 1 });
      return "会突然取消了，你第一次感觉人生还有继续推进的可能。";
    },
  },
];

const nodes = {
  startRunBtn: document.querySelector("#startRunBtn"),
  randomCardBtn: document.querySelector("#randomCardBtn"),
  viewCodexBtn: document.querySelector("#viewCodexBtn"),
  restartRunBtn: document.querySelector("#restartRunBtn"),
  runStatusBadge: document.querySelector("#runStatusBadge"),
  statsGrid: document.querySelector("#statsGrid"),
  chapterText: document.querySelector("#chapterText"),
  progressFill: document.querySelector("#progressFill"),
  modifierList: document.querySelector("#modifierList"),
  encounterSummary: document.querySelector("#encounterSummary"),
  runHint: document.querySelector("#runHint"),
  draftChoices: document.querySelector("#draftChoices"),
  quickDrawCard: document.querySelector("#quickDrawCard"),
  pickedCards: document.querySelector("#pickedCards"),
  pickedCount: document.querySelector("#pickedCount"),
  logList: document.querySelector("#logList"),
  filterBar: document.querySelector("#filterBar"),
  codexGrid: document.querySelector("#codexGrid"),
  codexSection: document.querySelector("#codexSection"),
};

const RUN_LENGTH = STAGES.length;

const createInitialState = () => ({
  chapter: 0,
  craft: 8,
  vibe: 8,
  stability: 8,
  tokens: 24,
  hype: 0,
  integrity: 3,
  status: "idle",
  phase: "idle",
  openingPicked: 0,
  currentChoices: [],
  picked: [],
  lastEncounter: null,
  pendingStageEvents: [],
  ending: null,
  log: ["项目立项：有人说“先随便做个 Demo 看看”，你决定把它认真做成一整段人生。"],
  seenEvents: new Set(),
  modifiers: {
    noVibe: false,
    tokenMultiplier: 1,
    failureRefund: false,
    extraDraft: 0,
    dualModel: false,
    shield: 0,
    successTokenBonus: 0,
    encounterBonus: 0,
    costReduction: 0,
    demonBug: false,
  },
});

let state = createInitialState();
let quickDrawCardId = null;
let activeFilter = "all";
let cardsLoaded = false;
let cardLoadError = "";
const CARD_BY_ID = new Map();
const CARD_TEMPLATE_CACHE = new Map();
const CODEX_MARKUP_CACHE = new Map();
const LOG_RENDER_LIMIT = 18;
let lastQuickDrawCardId = null;
let lastCodexFilter = null;
const CARD_DATA_PATH = "./cards.json";

function clampNumber(value, min = 0, max = 999) {
  return Math.max(min, Math.min(max, value));
}

function applyDelta(currentState, delta) {
  Object.entries(delta).forEach(([key, value]) => {
    currentState[key] += value;
  });
}

function normalizeState(nextState) {
  nextState.craft = clampNumber(nextState.craft, 0);
  nextState.vibe = clampNumber(nextState.vibe, 0);
  nextState.stability = clampNumber(nextState.stability, 0);
  nextState.tokens = clampNumber(Math.round(nextState.tokens), 0);
  nextState.hype = clampNumber(nextState.hype, 0);
  nextState.integrity = clampNumber(nextState.integrity, 0, 6);
  nextState.modifiers.shield = clampNumber(nextState.modifiers.shield, 0, 9);
  nextState.modifiers.extraDraft = clampNumber(nextState.modifiers.extraDraft, 0, 2);
  nextState.modifiers.costReduction = clampNumber(nextState.modifiers.costReduction, 0, 4);
  nextState.modifiers.successTokenBonus = clampNumber(nextState.modifiers.successTokenBonus, 0, 9);
  nextState.modifiers.encounterBonus = clampNumber(nextState.modifiers.encounterBonus, 0, 9);
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getCard(cardId) {
  return CARD_BY_ID.get(cardId);
}

function setControlsDisabled(disabled) {
  nodes.startRunBtn.disabled = disabled;
  nodes.randomCardBtn.disabled = disabled;
  nodes.restartRunBtn.disabled = disabled;
}

function syncCardIndexes() {
  CARD_BY_ID.clear();
  CARDS.forEach((card) => {
    CARD_BY_ID.set(card.id, card);
  });

  CARD_TEMPLATE_CACHE.clear();
  CODEX_MARKUP_CACHE.clear();
  lastQuickDrawCardId = null;
  lastCodexFilter = null;
}

function getRandomCardId() {
  if (!CARDS.length) {
    return null;
  }
  return CARDS[Math.floor(Math.random() * CARDS.length)].id;
}

function runCardEffects(effects, currentState) {
  effects.forEach((effect) => {
    switch (effect.type) {
      case "stat":
        currentState[effect.key] += effect.value;
        break;
      case "modifierSet":
        currentState.modifiers[effect.key] = effect.value;
        break;
      case "modifierAdd":
        currentState.modifiers[effect.key] += effect.value;
        break;
      case "modifierMultiply":
        currentState.modifiers[effect.key] *= effect.value;
        break;
      case "log":
        currentState.log.push(effect.text);
        break;
      case "chance": {
        const branch = Math.random() < effect.chance ? effect.success || [] : effect.failure || [];
        runCardEffects(branch, currentState);
        break;
      }
      default:
        console.warn("Unknown card effect type:", effect.type, effect);
    }
  });
}

function applyCard(card, currentState) {
  runCardEffects(card.effects || [], currentState);
}

function setCardLoadError(message) {
  cardLoadError = message;
  cardsLoaded = false;
  setControlsDisabled(true);
  nodes.runHint.textContent = message;
  nodes.draftChoices.innerHTML = `<div class="empty-state">${message}</div>`;
  nodes.quickDrawCard.innerHTML = `<div class="quickdraw-empty">${message}</div>`;
  nodes.codexGrid.innerHTML = `<div class="empty-state">${message}</div>`;
}

async function loadCardsData() {
  const response = await fetch(CARD_DATA_PATH, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`卡牌数据加载失败：${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  const cards = Array.isArray(payload) ? payload : payload.cards;
  if (!Array.isArray(cards) || cards.length === 0) {
    throw new Error("卡牌数据为空，请检查 cards.json。");
  }

  CARDS = cards;
  syncCardIndexes();
  quickDrawCardId = getRandomCardId();
  cardsLoaded = true;
  cardLoadError = "";
}

function getCurrentStage(currentState) {
  return STAGES[currentState.chapter] || null;
}

function getModifierLabels(currentState) {
  const labels = [];
  const mods = currentState.modifiers;

  if (mods.noVibe) labels.push("禁止 Vibe coding");
  if (mods.tokenMultiplier > 1) labels.push(`Token 消耗 x${mods.tokenMultiplier}`);
  if (mods.failureRefund) labels.push("失败返还 Token");
  if (mods.dualModel) labels.push("双模型协同");
  if (mods.demonBug) labels.push("肩上恶魔潜伏");
  if (mods.extraDraft > 0) labels.push(`每轮额外选项 +${mods.extraDraft}`);
  if (mods.shield > 0) labels.push(`护盾 ${mods.shield}`);
  if (mods.successTokenBonus > 0) labels.push(`成功赏金 +${mods.successTokenBonus} Token`);
  if (mods.costReduction > 0) labels.push(`遭遇消耗减免 ${mods.costReduction}`);
  if (mods.encounterBonus > 0) labels.push(`遭遇实力 +${mods.encounterBonus}`);

  if (currentState.phase === "opening") {
    labels.push(`开局构筑 ${currentState.openingPicked}/${OPENING_PICK_TARGET}`);
  }

  return labels.length > 0 ? labels : ["当前还没有形成流派，先从开局构筑挑一张卡开始。"];
}

function drawCardChoices(currentState, amount, keepExisting = []) {
  const blocked = new Set([...currentState.picked, ...keepExisting]);
  let pool = CARDS.filter((card) => !blocked.has(card.id));
  if (pool.length < amount) {
    pool = CARDS.filter((card) => !keepExisting.includes(card.id));
  }
  return shuffle(pool).slice(0, amount).map((card) => card.id);
}

function sampleOpeningChoices(currentState) {
  return drawCardChoices(currentState, OPENING_DRAFT_SIZE);
}

function sampleStageChoices(currentState) {
  const choiceCount = Math.min(5, 3 + currentState.modifiers.extraDraft);
  return drawCardChoices(currentState, choiceCount);
}

function getEligibleEvents(currentState, stage, usedIds) {
  return RANDOM_EVENTS.filter((event) => {
    if (usedIds.has(event.id)) return false;
    if (event.unique && currentState.seenEvents.has(event.id)) return false;
    if (event.minStage != null && currentState.chapter < event.minStage) return false;
    if (event.maxStage != null && currentState.chapter > event.maxStage) return false;
    if (event.condition && !event.condition(currentState, stage)) return false;
    return true;
  });
}

function pickWeightedEvent(events) {
  let totalWeight = 0;
  events.forEach((event) => {
    totalWeight += event.weight;
  });

  let cursor = Math.random() * totalWeight;
  for (const event of events) {
    cursor -= event.weight;
    if (cursor <= 0) {
      return event;
    }
  }

  return events[events.length - 1] || null;
}

function resolveRandomEvents(stage) {
  const usedIds = new Set();
  const entries = [];
  const totalEvents = stage.eventCount + (Math.random() < 0.35 ? 1 : 0);

  for (let index = 0; index < totalEvents; index += 1) {
    const candidates = getEligibleEvents(state, stage, usedIds);
    if (!candidates.length) {
      break;
    }

    const event = pickWeightedEvent(candidates);
    usedIds.add(event.id);
    if (event.unique) {
      state.seenEvents.add(event.id);
    }

    const detail = event.apply(state, stage) || event.title;
    normalizeState(state);
    state.log.push(`[事件] ${event.title}：${detail}`);
    entries.push(`${event.title}：${detail}`);
  }

  return entries;
}

function startRun() {
  if (!cardsLoaded) {
    return;
  }

  state = createInitialState();
  state.status = "running";
  state.phase = "opening";
  state.currentChoices = sampleOpeningChoices(state);
  state.log.push("新的《Vibecoding模拟器》开始。先定开局，再看这辈子会被什么奇怪构筑带走。");
  state.ending = null;
  render();
}

function restartRun() {
  startRun();
}

function drawQuickCard() {
  if (!cardsLoaded) {
    return;
  }

  quickDrawCardId = getRandomCardId();
  renderQuickDraw();
}

function prepareNextStage() {
  if (state.chapter >= RUN_LENGTH) {
    finishRun();
    return;
  }

  const stage = getCurrentStage(state);
  state.log.push(`阶段 ${state.chapter + 1}/${RUN_LENGTH}【${stage.title}】开始。${stage.intro}`);
  state.pendingStageEvents = resolveRandomEvents(stage);

  if (state.tokens <= 0 || state.integrity <= 0) {
    finishRun();
    return;
  }

  state.phase = "stage";
  state.currentChoices = sampleStageChoices(state);
}

function buildStagePower(currentState, stage) {
  const vibeValue = currentState.modifiers.noVibe ? 0 : currentState.vibe;
  let power =
    currentState.craft * stage.weights.craft +
    vibeValue * stage.weights.vibe +
    currentState.stability * stage.weights.stability +
    currentState.hype * stage.weights.hype +
    currentState.modifiers.encounterBonus;

  const notes = [...currentState.pendingStageEvents];

  if (currentState.modifiers.dualModel) {
    power += 2;
    notes.push("双刀流在关键节点里稳定提供额外火力");
  }

  if (currentState.modifiers.noVibe && stage.weights.vibe > 0) {
    notes.push("这一阶段的 Vibe 加成被回归基本功完全封印");
  }

  if (currentState.tokens <= 8) {
    power -= 1.5;
    notes.push("Token 余量已经见底，很多本可大胆尝试的操作都变成了保守求生");
  }

  if (currentState.stability >= 12) {
    power += 1.5;
    notes.push("系统韧性足够高，你能扛住更多临场波动");
  }

  if (!currentState.modifiers.noVibe && currentState.vibe >= 12) {
    power += 1.2;
    notes.push("灵感过载状态让你在模糊地带比平时更敢下判断");
  }

  if (currentState.hype >= 10 && stage.weights.hype >= 0.25) {
    power += 1.2;
    notes.push("项目热度开始反哺推进速度，世界愿意给你更多容错");
  }

  if (currentState.modifiers.demonBug && Math.random() < 0.35) {
    power -= 2;
    currentState.stability -= 1;
    notes.push("肩上的恶魔在最关键的时候又放出了一只新 bug");
  }

  power += Math.floor(Math.random() * 7) - 3;
  return { power, notes };
}

function resolveStage() {
  const stage = getCurrentStage(state);
  if (!stage) {
    finishRun();
    return;
  }

  const rawCost = Math.ceil(stage.cost * state.modifiers.tokenMultiplier);
  const cost = Math.max(1, rawCost - state.modifiers.costReduction);
  state.tokens -= cost;

  const { power, notes } = buildStagePower(state, stage);
  const success = power >= stage.threshold;

  if (success) {
    applyDelta(state, stage.reward);
    if (state.modifiers.successTokenBonus > 0) {
      state.tokens += state.modifiers.successTokenBonus;
    }
    state.log.push(
      `阶段 ${state.chapter + 1}/${RUN_LENGTH}【${stage.title}】成功。你以 ${power.toFixed(1)} 点实力压过阈值 ${stage.threshold}。`
    );
  } else {
    let absorbed = false;
    if (state.modifiers.shield > 0) {
      state.modifiers.shield -= 1;
      absorbed = true;
      state.log.push(`阶段 ${state.chapter + 1}/${RUN_LENGTH}【${stage.title}】差点失控，但护盾替你挡下了最致命的一次崩坏。`);
    } else {
      applyDelta(state, {
        integrity: -(stage.penalty.integrity || 0),
        stability: -(stage.penalty.stability || 0),
        tokens: -(stage.penalty.tokens || 0),
        vibe: -(stage.penalty.vibe || 0),
        hype: -(stage.penalty.hype || 0),
      });
      state.log.push(
        `阶段 ${state.chapter + 1}/${RUN_LENGTH}【${stage.title}】失败。你的 ${power.toFixed(1)} 点实力没能跨过阈值 ${stage.threshold}。`
      );
    }

    if (state.modifiers.failureRefund) {
      state.tokens += cost;
      state.log.push("肩上的恶魔坏笑着把这次消耗过的 Token 退了回来，像在诱导你继续赌。");
    }

    if (absorbed) {
      state.tokens -= stage.penalty.tokens || 0;
      state.vibe -= stage.penalty.vibe || 0;
      state.hype -= stage.penalty.hype || 0;
      state.stability -= stage.penalty.stability || 0;
    }
  }

  normalizeState(state);

  state.lastEncounter = {
    title: stage.title,
    intro: stage.intro,
    label: stage.label,
    power: power.toFixed(1),
    threshold: stage.threshold,
    cost,
    success,
    notes,
  };

  state.pendingStageEvents = [];
  state.chapter += 1;

  if (state.tokens <= 0 || state.integrity <= 0 || state.chapter >= RUN_LENGTH) {
    finishRun();
    return;
  }

  prepareNextStage();
}

function getEnding(currentState) {
  const score =
    currentState.craft * 2.4 +
    currentState.vibe * 1.9 +
    currentState.stability * 2.2 +
    currentState.tokens * 1.15 +
    currentState.hype * 1.8 +
    currentState.integrity * 10 +
    currentState.picked.length * 2.4 +
    currentState.chapter * 3.2;

  if (currentState.tokens <= 0) {
    return {
      pill: "预算烧穿",
      title: "你不是不会做，只是上下文和耐心一起先耗尽了",
      text: "你一路冲得太猛，最后死在 Token 断粮和缓存冷酷无情的现实里。这不是平庸局，只是没能撑到故事最后一页。",
      score,
    };
  }

  if (currentState.integrity <= 0) {
    return {
      pill: "全线崩盘",
      title: "项目完整度归零，事故复盘写成了一部中篇小说",
      text: "你确实做成了很多东西，只是它们集中在错误的时间、错误的环境和错误的按钮之后一起发生了。",
      score,
    };
  }

  if (currentState.chapter >= RUN_LENGTH && currentState.modifiers.noVibe && currentState.craft >= 18) {
    return {
      pill: "古法飞升",
      title: "你用一把老键盘穿过了 AI 时代",
      text: "别人以为你有秘密武器，其实你只是把每一个边界、每一次调用和每一段报错都看得足够认真。",
      score,
    };
  }

  if (currentState.chapter >= RUN_LENGTH && currentState.modifiers.dualModel && currentState.vibe >= 18) {
    return {
      pill: "协奏结局",
      title: "你把多模型合作调成了一支真正能演奏的乐队",
      text: "没有谁单独拯救这局，是你把它们放进了正确的节拍里。整个项目像一段被编排过的 improvisation。",
      score,
    };
  }

  if (currentState.chapter >= RUN_LENGTH && currentState.hype >= 24) {
    return {
      pill: "现象级出圈",
      title: "项目上线后自己长出了传播能力",
      text: "你原本只是想做一个能跑的东西，最后却做成了大家都想转发、模仿和讨论的现象级样本。",
      score,
    };
  }

  if (score >= 185) {
    return {
      pill: "神话结局",
      title: "你把这段开发人生打成了传说级构筑",
      text: "旁人只看见结果很漂亮，只有你知道中间到底经历了多少波动、多少临场判断和多少险之又险的翻盘。",
      score,
    };
  }

  if (score >= 155) {
    return {
      pill: "黄金结局",
      title: "项目漂亮上线，连复盘都显得从容",
      text: "它不只是能跑，还拥有一种让人愿意继续留下来的完整度。你成功把构筑、执行和运气压进了同一条轨道。",
      score,
    };
  }

  if (score >= 125) {
    return {
      pill: "合格通关",
      title: "你把项目平稳送到了终点，而且看起来不像是侥幸",
      text: "这不是碾压局，但你在每一个本来会分崩离析的节点都勉强站稳了脚跟，这本身就很硬。",
      score,
    };
  }

  return {
    pill: "狼狈上岸",
    title: "项目终于活着上线，你也终于能把椅背往后一躺",
    text: "结局算不上辉煌，但它真实、艰难，而且足够完整。很多构筑根本活不到这里，而你已经把它带过来了。",
    score,
  };
}

function finishRun() {
  state.status = "finished";
  state.phase = "finished";
  state.currentChoices = [];
  state.ending = getEnding(state);
  state.log.push(`本局结束，结算分数 ${state.ending.score.toFixed(1)}。`);
}

function pickCard(cardId) {
  if (state.status !== "running") {
    return;
  }

  const card = getCard(cardId);
  if (!card) {
    return;
  }

  state.picked.push(card.id);
  state.log.push(`你拿到了【${card.name}】：${card.flavor}`);
  applyCard(card, state);
  normalizeState(state);

  if (state.phase === "opening") {
    state.openingPicked += 1;
    state.currentChoices = state.currentChoices.filter((id) => id !== card.id);

    if (state.openingPicked >= OPENING_PICK_TARGET) {
      state.currentChoices = [];
      state.log.push("开局构筑完成。真正漫长的开发人生，现在才算开始。");
      prepareNextStage();
    }

    render();
    return;
  }

  state.currentChoices = [];
  resolveStage();
  render();
}

function cardTemplate(card, showButton = false) {
  const cacheKey = `${card.id}:${showButton ? "draft" : "static"}`;
  const cachedMarkup = CARD_TEMPLATE_CACHE.get(cacheKey);
  if (cachedMarkup) {
    return cachedMarkup;
  }

  const buttonHtml = showButton
    ? `<button class="pick-btn" data-card-id="${card.id}">选择这张</button>`
    : "";

  const markup = `
    <article class="vibe-card ${card.rarity}">
      <div class="card-top">
        <span class="card-kind">${KIND_LABEL[card.kind]}</span>
        <span class="card-rarity">${RARITY_LABEL[card.rarity]}</span>
      </div>
      <div>
        <h3 class="card-title">${card.name}</h3>
        <p class="card-flavor">${card.flavor}</p>
      </div>
      <p class="card-effect">${card.effectText}</p>
      ${buttonHtml}
    </article>
  `;

  CARD_TEMPLATE_CACHE.set(cacheKey, markup);
  return markup;
}

function renderStats() {
  nodes.statsGrid.innerHTML = STAT_META.map(
    (stat) => `
      <div class="stat-card">
        <p class="stat-label">${stat.label}</p>
        <p class="stat-value">${state[stat.key]}</p>
        <p class="meta-line">${stat.tone}</p>
      </div>
    `
  ).join("");
}

function renderModifiers() {
  nodes.modifierList.innerHTML = getModifierLabels(state)
    .map((label) => `<span class="modifier-pill">${label}</span>`)
    .join("");
}

function renderEncounterSummary() {
  if (!state.lastEncounter && state.phase === "opening") {
    nodes.encounterSummary.innerHTML = "你正在从 8 张随机起手卡中挑 3 张作为开局天赋。真正的阶段结算会在开局构筑结束后出现。";
    return;
  }

  if (!state.lastEncounter) {
    nodes.encounterSummary.innerHTML = "阶段还没正式开始。先把起手构筑拼出来，命运才会往前滚动。";
    return;
  }

  const notes = state.lastEncounter.notes.length
    ? `<p class="meta-line">本阶段事件：${state.lastEncounter.notes.join("；")}。</p>`
    : "";

  nodes.encounterSummary.innerHTML = `
    <p class="meta-line">${state.lastEncounter.label}</p>
    <strong>${state.lastEncounter.title}</strong>
    <p class="meta-line">${state.lastEncounter.intro}</p>
    <p class="meta-line">本次消耗 ${state.lastEncounter.cost} Token，实力 ${state.lastEncounter.power} / 阈值 ${state.lastEncounter.threshold}。</p>
    <p class="meta-line">${state.lastEncounter.success ? "结果：这一阶段顺利推进。" : "结果：这一阶段现场冒烟。"} </p>
    ${notes}
  `;
}

function renderDraftChoices() {
  if (!cardsLoaded) {
    nodes.draftChoices.innerHTML = `<div class="empty-state">${cardLoadError || "卡牌数据加载中..."}</div>`;
    return;
  }

  if (state.status === "idle") {
    nodes.draftChoices.innerHTML = `<div class="empty-state">点击“开始一局”，先从 8 张随机卡中挑 3 张开局，再把这次 Vibecoding 人生一路打到结局。</div>`;
    return;
  }

  if (state.status === "finished") {
    nodes.draftChoices.innerHTML = `
      <div class="result-box">
        <span class="result-pill">${state.ending.pill}</span>
        <h3 class="result-title">${state.ending.title}</h3>
        <p class="result-text">${state.ending.text}</p>
        <p class="meta-line">最终分数：${state.ending.score.toFixed(1)}</p>
      </div>
    `;
    return;
  }

  if (state.phase === "opening") {
    nodes.draftChoices.innerHTML = state.currentChoices
      .map((cardId) => cardTemplate(getCard(cardId), true))
      .join("");
    return;
  }

  nodes.draftChoices.innerHTML = state.currentChoices
    .map((cardId) => cardTemplate(getCard(cardId), true))
    .join("");
}

function renderQuickDraw() {
  if (!cardsLoaded) {
    nodes.quickDrawCard.innerHTML = `<div class="quickdraw-empty">${cardLoadError || "卡牌数据加载中..."}</div>`;
    lastQuickDrawCardId = null;
    return;
  }

  if (quickDrawCardId === lastQuickDrawCardId) {
    return;
  }

  const card = getCard(quickDrawCardId);
  if (!card) {
    nodes.quickDrawCard.innerHTML = `<div class="quickdraw-empty">点击“今日运势”获得今天的 Vibe 预兆。</div>`;
    lastQuickDrawCardId = null;
    return;
  }
  nodes.quickDrawCard.innerHTML = cardTemplate(card, false);
  lastQuickDrawCardId = quickDrawCardId;
}

function renderPickedCards() {
  nodes.pickedCount.textContent = `${state.picked.length} 张`;

  if (state.picked.length === 0) {
    nodes.pickedCards.innerHTML = `<div class="empty-state">你的构筑还空着。离谱的人生，一般都从第一张起手卡开始歪。</div>`;
    return;
  }

  nodes.pickedCards.innerHTML = state.picked
    .map((cardId, index) => {
      const card = getCard(cardId);
      const stageIndex = index + 1 - OPENING_PICK_TARGET;
      const badgeLabel =
        index < OPENING_PICK_TARGET
          ? `开局 ${index + 1}`
          : `阶段 ${stageIndex}`;

      return `
        <div class="picked-item">
          <div class="picked-header">
            <p class="picked-title">${card.name}</p>
            <span class="chapter-badge">${badgeLabel}</span>
          </div>
          <p class="picked-text">${card.effectText}</p>
        </div>
      `;
    })
    .join("");
}

function renderLogs() {
  nodes.logList.innerHTML = state.log
    .slice(-LOG_RENDER_LIMIT)
    .reverse()
    .map(
      (line, index) => `
        <div class="log-item">
          <span class="chapter-badge">LOG ${String(index + 1).padStart(2, "0")}</span>
          <p class="log-line">${line}</p>
        </div>
      `
    )
    .join("");
}

function renderCodexFilters() {
  if (!nodes.filterBar.childElementCount) {
    nodes.filterBar.innerHTML = CARD_FILTERS.map(
      (filter) => `
        <button class="filter-btn ${activeFilter === filter.id ? "active" : ""}" data-filter-id="${filter.id}">
          ${filter.label}
        </button>
      `
    ).join("");
    return;
  }

  nodes.filterBar.querySelectorAll("[data-filter-id]").forEach((button) => {
    button.classList.toggle("active", button.getAttribute("data-filter-id") === activeFilter);
  });
}

function renderCodex() {
  if (!cardsLoaded) {
    nodes.codexGrid.innerHTML = `<div class="empty-state">${cardLoadError || "卡牌图鉴加载中..."}</div>`;
    lastCodexFilter = null;
    return;
  }

  if (activeFilter === lastCodexFilter) {
    return;
  }

  if (!CODEX_MARKUP_CACHE.has(activeFilter)) {
    const cards =
      activeFilter === "all"
        ? CARDS
        : CARDS.filter((card) => card.kind === activeFilter);

    CODEX_MARKUP_CACHE.set(activeFilter, cards.map((card) => cardTemplate(card, false)).join(""));
  }

  nodes.codexGrid.innerHTML = CODEX_MARKUP_CACHE.get(activeFilter);
  lastCodexFilter = activeFilter;
}

function renderStatus() {
  const finished = state.status === "finished";
  const progressTotal = RUN_LENGTH + 1;
  const progressValue = finished
    ? progressTotal
    : state.status === "idle"
      ? 0
      : state.chapter + state.openingPicked / OPENING_PICK_TARGET;

  nodes.runStatusBadge.textContent =
    state.status === "idle" ? "待机中" : finished ? "本局结束" : state.phase === "opening" ? "开局构筑中" : "开发人生进行中";
  nodes.runStatusBadge.className = `status-badge ${state.status === "idle" ? "idle" : finished ? "finished" : "running"}`;
  nodes.chapterText.textContent =
    state.phase === "opening" && !finished
      ? `开局 ${state.openingPicked} / ${OPENING_PICK_TARGET}`
      : `${Math.min(state.chapter, RUN_LENGTH)} / ${RUN_LENGTH}`;
  nodes.progressFill.style.width = `${(progressValue / progressTotal) * 100}%`;

  if (state.status === "idle") {
    nodes.runHint.textContent = cardsLoaded
      ? "点击“开始一局”后，你会先挑 3 张开局卡，再一路经历多个阶段、随机事件和结局判定。"
      : cardLoadError || "正在加载 cards.json...";
    return;
  }

  if (finished) {
    nodes.runHint.textContent = "本局已经结算。你可以重开一局，或者去图鉴里研究下一套更离谱的长线构筑。";
    return;
  }

  if (state.phase === "opening") {
    nodes.runHint.textContent = `从 8 张随机起手里挑出 3 张作为这次人生的开局天赋。已选择 ${state.openingPicked}/${OPENING_PICK_TARGET}。`;
    return;
  }

  const nextStage = getCurrentStage(state);
  const eventHint = state.pendingStageEvents.length
    ? `当前已触发 ${state.pendingStageEvents.length} 条随机事件。`
    : "这一阶段暂时风平浪静。";
  nodes.runHint.textContent = `阶段 ${state.chapter + 1}/${RUN_LENGTH}【${nextStage.title}】。${nextStage.intro} ${eventHint}`;
}

function render() {
  renderStatus();
  renderStats();
  renderModifiers();
  renderEncounterSummary();
  renderDraftChoices();
  renderPickedCards();
  renderLogs();
}

nodes.startRunBtn.addEventListener("click", startRun);
nodes.randomCardBtn.addEventListener("click", drawQuickCard);
nodes.restartRunBtn.addEventListener("click", restartRun);
nodes.viewCodexBtn.addEventListener("click", () => {
  nodes.codexSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.addEventListener("click", (event) => {
  const pickButton = event.target.closest("[data-card-id]");
  if (pickButton) {
    pickCard(pickButton.getAttribute("data-card-id"));
    return;
  }

  const filterButton = event.target.closest("[data-filter-id]");
  if (filterButton) {
    activeFilter = filterButton.getAttribute("data-filter-id");
    renderCodexFilters();
    renderCodex();
  }
});

async function bootstrap() {
  setControlsDisabled(true);
  renderCodexFilters();
  render();
  renderCodex();
  renderQuickDraw();

  try {
    await loadCardsData();
    setControlsDisabled(false);
    renderCodexFilters();
    renderCodex();
    renderQuickDraw();
    render();
  } catch (error) {
    console.error(error);
    setCardLoadError(
      "加载 cards.json 失败。若你是直接双击打开 index.html，请改用本地静态服务器访问这个目录。"
    );
    render();
  }
}

bootstrap();
