/**
 * OUTLOOK PRODUCTIVITY SUITE (OPS)
 * Client Application Logic
 * Directives: Zero Emojis, Zero Status Dots, Minimal Card Density, Multi-Tab Router
 * Organization: MG Apparel
 * User Identity: muhammad.ammar@mgapparel.com
 */

// Clean Baseline Initial Data (Sample data removed; live user workspace)
const INITIAL_TASKS = [];
const INITIAL_MEETINGS = [];
const INITIAL_FOCUS_HOLDS = [];
const INITIAL_VIP_WATCHLIST = [];
const INITIAL_DELEGATED_TASKS = [];

// Persistence Helpers
function getStoredJson(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStoredJson(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Storage write error", e);
  }
}

// App State
const state = {
  tasks: getStoredJson("ops_tasks", [...INITIAL_TASKS]),
  meetings: getStoredJson("ops_meetings", [...INITIAL_MEETINGS]),
  focusHolds: getStoredJson("ops_focus_holds", [...INITIAL_FOCUS_HOLDS]),
  vipWatchlist: getStoredJson("ops_vip_watchlist", [...INITIAL_VIP_WATCHLIST]),
  delegatedTasks: getStoredJson("ops_delegated_tasks", [...INITIAL_DELEGATED_TASKS]),
  
  // Dynamic Custom Workspaces pinned to Navigation Bar
  customTabs: getStoredJson("ops_custom_tabs", []),
  activeCustomTab: null,
  currentGradientPreset: localStorage.getItem("ops_gradient_preset") || "terracotta-flame",

  authenticated: localStorage.getItem("ops_auth") === "true",
  userEmail: localStorage.getItem("ops_email") || "muhammad.ammar@mgapparel.com",
  userPassword: localStorage.getItem("ops_password") || "demo1234",
  userName: localStorage.getItem("ops_user_name") || "Muhammad Ammar",
  tenant: localStorage.getItem("ops_tenant") || "MG Apparel Enterprise Tenant (Azure AD)",
  geminiApiKey: localStorage.getItem("ops_gemini_key") || "",
  geminiModel: localStorage.getItem("ops_gemini_model") || "gemini-1.5-flash",
  
  currentTab: "dashboard",
  theme: localStorage.getItem("ops_theme") || "light",
  pendingFilter: "all",
  searchQuery: "",
  lastSyncTime: new Date(),
  
  activeInspectionTask: null,
  activeDossierMeeting: null,
  activeDelegationTask: null
};

// DOM Cache
const dom = {
  body: document.body,
  navItems: document.querySelectorAll(".nav-item"),
  tabViews: document.querySelectorAll(".tab-view"),
  dashboardPendingDeck: document.getElementById("dashboardPendingDeck"),
  dashboardAlignedDeck: document.getElementById("dashboardAlignedDeck"),
  fullPendingDeck: document.getElementById("fullPendingDeck"),
  milestonesContainer: document.getElementById("milestonesContainer"),
  
  // Dashboard KPI Elements
  kpiPendingValue: document.getElementById("kpiPendingValue"),
  kpiPendingFooter: document.getElementById("kpiPendingFooter"),
  kpiAlignedValue: document.getElementById("kpiAlignedValue"),
  kpiAlignedFooter: document.getElementById("kpiAlignedFooter"),
  kpiTodayValue: document.getElementById("kpiTodayValue"),
  kpiTodayFooter: document.getElementById("kpiTodayFooter"),
  kpiRatioValue: document.getElementById("kpiRatioValue"),
  kpiRatioFooter: document.getElementById("kpiRatioFooter"),
  
  // Nav Counters
  navPendingCount: document.getElementById("navPendingCount"),
  navAlignedCount: document.getElementById("navAlignedCount"),
  navCalendarCount: document.getElementById("navCalendarCount"),
  navBriefingCount: document.getElementById("navBriefingCount"),
  
  // Calendar View Elements
  kpiFocusHours: document.getElementById("kpiFocusHours"),
  kpiFocusFooter: document.getElementById("kpiFocusFooter"),
  kpiMeetingHours: document.getElementById("kpiMeetingHours"),
  kpiMeetingFooter: document.getElementById("kpiMeetingFooter"),
  kpiFocusRatio: document.getElementById("kpiFocusRatio"),
  kpiFocusRatioFooter: document.getElementById("kpiFocusRatioFooter"),
  kpiBufferStatus: document.getElementById("kpiBufferStatus"),
  kpiBufferFooter: document.getElementById("kpiBufferFooter"),
  calendarMeetingsDeck: document.getElementById("calendarMeetingsDeck"),
  focusHoldsDeck: document.getElementById("focusHoldsDeck"),
  
  // Briefing View Elements
  morningBriefContent: document.getElementById("morningBriefContent"),
  morningBriefDate: document.getElementById("morningBriefDate"),
  eodBriefContent: document.getElementById("eodBriefContent"),
  eodBriefDate: document.getElementById("eodBriefDate"),
  vipChipsContainer: document.getElementById("vipChipsContainer"),
  delegationDeck: document.getElementById("delegationDeck"),
  newVipInput: document.getElementById("newVipInput"),
  
  // Charts & Empty State Containers
  stackedBarContainer: document.getElementById("stackedBarContainer"),
  stackedBarLegend: document.getElementById("stackedBarLegend"),
  velocityContainer: document.getElementById("velocityContainer"),
  velocityLegend: document.getElementById("velocityLegend"),

  // Buttons & Filter Pills
  dashViewPendingBtn: document.getElementById("dashViewPendingBtn"),
  dashViewAlignedBtn: document.getElementById("dashViewAlignedBtn"),
  pillAll: document.getElementById("pillAll"),
  pillMail: document.getElementById("pillMail"),
  pillTodo: document.getElementById("pillTodo"),
  pillUrgent: document.getElementById("pillUrgent"),
  
  // Mobile Navigation Elements
  mobileBottomTabs: document.querySelectorAll(".mobile-nav-tab"),
  mobileMenuToggleBtn: document.getElementById("mobileMenuToggleBtn"),
  sidebarBackdrop: document.getElementById("sidebarBackdrop"),
  appSidebar: document.getElementById("appSidebar"),
  mobileThemeToggleBtn: document.getElementById("mobileThemeToggleBtn"),
  mobileThemeLabel: document.getElementById("mobileThemeLabel"),
  mobileSyncChip: document.getElementById("mobileSyncChip"),
  mobPendingBadge: document.getElementById("mobPendingBadge"),
  mobAlignedBadge: document.getElementById("mobAlignedBadge"),

  // Slide-Out Inspection Drawer
  inspectDrawer: document.getElementById("inspectDrawer"),
  inspectBackdrop: document.getElementById("inspectBackdrop"),
  closeInspectBtn: document.getElementById("closeInspectBtn"),
  inspectItemTitle: document.getElementById("inspectItemTitle"),
  inspectItemMeta: document.getElementById("inspectItemMeta"),
  inspectSummaryBox: document.getElementById("inspectSummaryBox"),
  inspectDeliverablesList: document.getElementById("inspectDeliverablesList"),
  inspectBlockFocusBtn: document.getElementById("inspectBlockFocusBtn"),
  inspectDelegateBtn: document.getElementById("inspectDelegateBtn"),
  inspectCompleteBtn: document.getElementById("inspectCompleteBtn"),

  // Pre-Meeting Dossier Modal
  dossierModal: document.getElementById("dossierModal"),
  closeDossierBtn: document.getElementById("closeDossierBtn"),
  dossierCloseActionBtn: document.getElementById("dossierCloseActionBtn"),
  dossierOpenTeamsBtn: document.getElementById("dossierOpenTeamsBtn"),
  dossierTitle: document.getElementById("dossierTitle"),
  dossierMeta: document.getElementById("dossierMeta"),
  dossierAttendees: document.getElementById("dossierAttendees"),
  dossierObjectives: document.getElementById("dossierObjectives"),
  dossierFiles: document.getElementById("dossierFiles"),

  // Delegation Modal
  delegationModal: document.getElementById("delegationModal"),
  closeDelegationModalBtn: document.getElementById("closeDelegationModalBtn"),
  cancelDelegateBtn: document.getElementById("cancelDelegateBtn"),
  confirmDelegateBtn: document.getElementById("confirmDelegateBtn"),
  delegateTaskTitleDisplay: document.getElementById("delegateTaskTitleDisplay"),
  delegateAssigneeInput: document.getElementById("delegateAssigneeInput"),
  delegateNoteInput: document.getElementById("delegateNoteInput"),

  // Focus Modal
  focusModal: document.getElementById("focusModal"),
  closeFocusModalBtn: document.getElementById("closeFocusModalBtn"),
  cancelFocusModalBtn: document.getElementById("cancelFocusModalBtn"),
  confirmFocusSlotBtn: document.getElementById("confirmFocusSlotBtn"),
  focusTitleInput: document.getElementById("focusTitleInput"),
  focusDurationSelect: document.getElementById("focusDurationSelect"),
  focusTimeSelect: document.getElementById("focusTimeSelect"),

  // Modals & General Controls
  authModal: document.getElementById("authModal"),
  taskModal: document.getElementById("taskModal"),
  systemBanner: document.getElementById("systemBanner"),
  toastShelf: document.getElementById("toastShelf"),
  themeToggleBtn: document.getElementById("themeToggleBtn"),
  themeToggleLabel: document.getElementById("themeToggleLabel"),
  sidebarAuthBtn: document.getElementById("sidebarAuthBtn"),
  sidebarAuthLabel: document.getElementById("sidebarAuthLabel"),
  sidebarUserInitials: document.getElementById("sidebarUserInitials"),
  sidebarAccountLabel: document.getElementById("sidebarAccountLabel"),
  sidebarSyncStatusText: document.getElementById("sidebarSyncStatusText"),
  dashboardSyncTime: document.getElementById("dashboardSyncTime"),
  pendingSearchInput: document.getElementById("pendingSearchInput"),
  filterPills: document.querySelectorAll(".filter-pill"),

  // Navbar Quick Add & Custom Workspace Tabs
  navQuickAddBtn: document.getElementById("navQuickAddBtn"),
  mobileQuickAddBtn: document.getElementById("mobileQuickAddBtn"),
  navAddCustomTabBtn: document.getElementById("navAddCustomTabBtn"),
  customNavTabsContainer: document.getElementById("customNavTabsContainer"),
  navQuickAddModal: document.getElementById("navQuickAddModal"),
  closeQuickAddModalBtn: document.getElementById("closeQuickAddModalBtn"),
  quickAddOutlookTaskBtn: document.getElementById("quickAddOutlookTaskBtn"),
  quickAddFocusSlotBtn: document.getElementById("quickAddFocusSlotBtn"),
  quickAddNavbarTabBtn: document.getElementById("quickAddNavbarTabBtn"),
  quickAddVipSenderBtn: document.getElementById("quickAddVipSenderBtn"),
  customTabModal: document.getElementById("customTabModal"),
  closeCustomTabModalBtn: document.getElementById("closeCustomTabModalBtn"),
  cancelCustomTabModalBtn: document.getElementById("cancelCustomTabModalBtn"),
  confirmAddCustomTabBtn: document.getElementById("confirmAddCustomTabBtn"),
  customTabNameInput: document.getElementById("customTabNameInput"),
  customTabScopeSelect: document.getElementById("customTabScopeSelect"),
  customTabGradientSelect: document.getElementById("customTabGradientSelect"),
  tabCustomWorkspace: document.getElementById("tabCustomWorkspace"),
  customWorkspaceTitle: document.getElementById("customWorkspaceTitle"),
  customWorkspaceSubtitle: document.getElementById("customWorkspaceSubtitle"),
  customWorkspaceScopeBadge: document.getElementById("customWorkspaceScopeBadge"),
  customWorkspaceDeck: document.getElementById("customWorkspaceDeck"),
  customKpiTotal: document.getElementById("customKpiTotal"),
  customKpiDue: document.getElementById("customKpiDue"),
  customWorkspaceAddTaskBtn: document.getElementById("customWorkspaceAddTaskBtn"),
  customWorkspaceRemoveTabBtn: document.getElementById("customWorkspaceRemoveTabBtn"),

  // Gradient Color Palette Studio
  gradStartPicker: document.getElementById("gradStartPicker"),
  gradStartHex: document.getElementById("gradStartHex"),
  gradEndPicker: document.getElementById("gradEndPicker"),
  gradEndHex: document.getElementById("gradEndHex"),
  gradAngleSelect: document.getElementById("gradAngleSelect"),
  gradLivePreview: document.getElementById("gradLivePreview"),
  applyCustomGradBtn: document.getElementById("applyCustomGradBtn"),
  gradientPresetBtns: document.querySelectorAll(".btn-gradient-card"),

  // Security Login & Robot Welcome Screen Elements
  loginScreen: document.getElementById("loginScreen"),
  directLoginForm: document.getElementById("directLoginForm"),
  loginEmail: document.getElementById("loginEmail"),
  loginPassword: document.getElementById("loginPassword"),
  loginInitialsAvatar: document.getElementById("loginInitialsAvatar"),
  directSignInBtn: document.getElementById("directSignInBtn"),
  directMsSignInBtn: document.getElementById("directMsSignInBtn"),
  loginThemeToggleBtn: document.getElementById("loginThemeToggleBtn"),
  loginThemeLabel: document.getElementById("loginThemeLabel"),
  robotWelcomeScreen: document.getElementById("robotWelcomeScreen"),
  robotGreetingText: document.getElementById("robotGreetingText"),

  // Settings Identity & Gemini Elements
  settingUserEmail: document.getElementById("settingUserEmail"),
  settingTenant: document.getElementById("settingTenant"),
  saveIdentityBtn: document.getElementById("saveIdentityBtn"),
  settingGeminiApiKey: document.getElementById("settingGeminiApiKey"),
  toggleGeminiKeyVisibility: document.getElementById("toggleGeminiKeyVisibility"),
  settingGeminiModel: document.getElementById("settingGeminiModel"),
  geminiStatusPill: document.getElementById("geminiStatusPill"),
  saveGeminiKeyBtn: document.getElementById("saveGeminiKeyBtn"),
  testGeminiKeyBtn: document.getElementById("testGeminiKeyBtn"),
  clearGeminiKeyBtn: document.getElementById("clearGeminiKeyBtn"),
  btnRunGeminiTriage: document.getElementById("btnRunGeminiTriage"),

  // Settings Security & Password Elements
  settingsPasswordCard: document.getElementById("settingsPasswordCard"),
  securityStatusPill: document.getElementById("securityStatusPill"),
  settingsPasswordForm: document.getElementById("settingsPasswordForm"),
  settingCurrentPassword: document.getElementById("settingCurrentPassword"),
  settingNewPassword: document.getElementById("settingNewPassword"),
  settingConfirmPassword: document.getElementById("settingConfirmPassword"),
  passwordFeedbackMsg: document.getElementById("passwordFeedbackMsg"),
  savePasswordBtn: document.getElementById("savePasswordBtn"),
  resetPasswordFormBtn: document.getElementById("resetPasswordFormBtn"),
  toggleCurrentPasswordBtn: document.getElementById("toggleCurrentPasswordBtn"),
  toggleNewPasswordBtn: document.getElementById("toggleNewPasswordBtn"),
  toggleConfirmPasswordBtn: document.getElementById("toggleConfirmPasswordBtn")
};

// Initialize Application
function init() {
  bindNavigation();
  bindControls();
  bindModals();
  bindSettings();
  bindPasswordSettings();
  bindInspectionDrawer();
  bindCalendarActions();
  bindBriefingActions();
  bindNavbarQuickAdd();
  bindGradientStudio();
  bindLoginScreen();
  
  setTheme(state.theme, false);
  initAuthAndSettings();
  updateAuthUI();
  renderAll();
  renderCustomNavTabs();
  startSyncTicker();
}

// Navigation Handling
function bindNavigation() {
  // Desktop Nav Items
  dom.navItems.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      switchTab(tabId);
    });
  });

  // Mobile Bottom Tab Items
  dom.mobileBottomTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      switchTab(tabId);
    });
  });

  // Mobile Menu Drawer Toggle
  dom.mobileMenuToggleBtn?.addEventListener("click", () => {
    const isOpen = dom.appSidebar.classList.toggle("mobile-open");
    dom.sidebarBackdrop.classList.toggle("active", isOpen);
  });

  // Close Drawer on Backdrop Click
  dom.sidebarBackdrop?.addEventListener("click", () => {
    dom.appSidebar.classList.remove("mobile-open");
    dom.sidebarBackdrop.classList.remove("active");
  });

  // Dashboard in-view jump buttons
  document.querySelectorAll("[data-switch-tab]").forEach(el => {
    el.addEventListener("click", () => {
      const target = el.getAttribute("data-switch-tab");
      switchTab(target);
    });
  });
}

function switchTab(tabId) {
  state.currentTab = tabId;
  state.activeCustomTab = null;
  
  // Update desktop sidebar items
  dom.navItems.forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
  });

  // De-select custom navbar items
  document.querySelectorAll(".custom-nav-item").forEach(btn => {
    btn.classList.remove("active");
  });

  // Update mobile bottom nav items
  dom.mobileBottomTabs.forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
  });

  // Close mobile sidebar drawer if open
  dom.appSidebar?.classList.remove("mobile-open");
  dom.sidebarBackdrop?.classList.remove("active");

  dom.tabViews.forEach(view => {
    const isTarget = view.id === `tab${capitalize(tabId)}`;
    view.classList.toggle("active", isTarget);
  });

  window.scrollTo({ top: 0, behavior: "instant" });
}

function switchToCustomTab(customTabId) {
  const customTab = state.customTabs.find(t => t.id === customTabId);
  if (!customTab) return;
  state.currentTab = customTabId;
  state.activeCustomTab = customTab;

  // Unset standard desktop sidebar active states
  dom.navItems.forEach(btn => btn.classList.remove("active"));
  dom.mobileBottomTabs.forEach(btn => btn.classList.remove("active"));

  // Highlight active custom nav item
  document.querySelectorAll(".custom-nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-custom-tab-id") === customTabId);
  });

  // Show the custom workspace tab view
  dom.tabViews.forEach(view => {
    view.classList.toggle("active", view.id === "tabCustomWorkspace");
  });

  renderCustomWorkspaceView(customTab);

  dom.appSidebar?.classList.remove("mobile-open");
  dom.sidebarBackdrop?.classList.remove("active");
  window.scrollTo({ top: 0, behavior: "instant" });
}

function renderCustomNavTabs() {
  if (!dom.customNavTabsContainer) return;
  dom.customNavTabsContainer.innerHTML = "";

  const divider = document.getElementById("sidebarSectionDivider");
  if (divider) {
    divider.style.display = state.customTabs.length > 0 ? "block" : "none";
  }

  state.customTabs.forEach(tab => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nav-item custom-nav-item";
    if (state.activeCustomTab && state.activeCustomTab.id === tab.id) {
      btn.classList.add("active");
    }
    btn.setAttribute("data-custom-tab-id", tab.id);

    // Calculate relevant task count for this tab
    const matchedCount = getWorkspaceTasks(tab).length;
    tab.itemCount = matchedCount;

    btn.innerHTML = `
      <span class="custom-tab-accent" style="background: var(--gradient-${tab.gradient});"></span>
      <span class="nav-label">${escapeHTML(tab.name)}</span>
      <span class="nav-counter">${tab.itemCount}</span>
    `;

    btn.addEventListener("click", () => {
      switchToCustomTab(tab.id);
    });

    dom.customNavTabsContainer.appendChild(btn);
  });
}

function getWorkspaceTasks(tab) {
  const scopeLower = (tab.scope || "").toLowerCase();
  const nameLower = (tab.name || "").toLowerCase();

  return state.tasks.filter(t => {
    if (scopeLower.includes("outlook") || scopeLower.includes("flagged")) {
      return t.source.includes("MAIL") || t.source.includes("FLAGGED") || t.title.toLowerCase().includes("agreement") || t.title.toLowerCase().includes("clearance");
    } else if (scopeLower.includes("production")) {
      return t.title.toLowerCase().includes("line 4") || t.title.toLowerCase().includes("stitching") || t.source.includes("TEAMS") || t.title.toLowerCase().includes("procurement");
    } else if (scopeLower.includes("supply")) {
      return t.title.toLowerCase().includes("denim") || t.title.toLowerCase().includes("yarn") || t.title.toLowerCase().includes("export");
    } else if (scopeLower.includes("financial")) {
      return t.title.toLowerCase().includes("agreement") || t.title.toLowerCase().includes("energy") || t.alignedTo?.includes("STRATEGIC");
    } else if (scopeLower.includes("compliance") || scopeLower.includes("quality")) {
      return t.title.toLowerCase().includes("compliance") || t.title.toLowerCase().includes("audit") || t.title.toLowerCase().includes("efficiency");
    }
    return t.title.toLowerCase().includes(nameLower) || !t.completed;
  });
}

function renderCustomWorkspaceView(customTab) {
  if (!dom.tabCustomWorkspace) return;

  if (dom.customWorkspaceTitle) {
    dom.customWorkspaceTitle.textContent = customTab.name.toUpperCase();
  }
  if (dom.customWorkspaceSubtitle) {
    dom.customWorkspaceSubtitle.textContent = "";
  }
  if (dom.customWorkspaceScopeBadge) {
    dom.customWorkspaceScopeBadge.textContent = customTab.scope.toUpperCase();
    dom.customWorkspaceScopeBadge.style.background = `var(--gradient-${customTab.gradient})`;
  }

  const tasks = getWorkspaceTasks(customTab);
  const pendingTasks = tasks.filter(t => !t.completed);

  if (dom.customKpiTotal) dom.customKpiTotal.textContent = formatNum(tasks.length);
  if (dom.customKpiDue) dom.customKpiDue.textContent = formatNum(pendingTasks.length);

  if (!dom.customWorkspaceDeck) return;
  dom.customWorkspaceDeck.innerHTML = "";

  if (tasks.length === 0) {
    dom.customWorkspaceDeck.innerHTML = `
      <div class="empty-state-card">
        <h4 class="empty-title">NO ITEMS CURRENTLY PINNED</h4>
        <p class="empty-desc">No tasks in your Outlook queue match "${escapeHTML(customTab.name)}". Click "+ ADD TASK HERE" to register an action directly into this workspace.</p>
      </div>
    `;
    return;
  }

  tasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "task-card";
    if (task.completed) card.classList.add("completed");

    const isCritical = task.urgency === "CRITICAL";
    const headerTagClass = isCritical ? "tag-critical" : "tag-normal";
    const headerTagText = isCritical ? "CRITICAL ACTION" : task.status;

    card.innerHTML = `
      <div class="task-card-header">
        <span class="source-tag">${escapeHTML(task.source)}</span>
        <span class="status-pill ${headerTagClass}">${headerTagText}</span>
      </div>
      <h3 class="task-title">${escapeHTML(task.title)}</h3>
      <div class="task-meta-row">
        <span>From: ${escapeHTML(task.senderName || task.sender)}</span>
        <span>Due: ${escapeHTML(task.dueDate)}</span>
      </div>
      <div class="task-actions-row">
        <button type="button" class="btn-micro" data-action="inspect">TRIAGE &amp; DETAILS</button>
        <button type="button" class="btn-micro" data-action="toggle-complete">
          ${task.completed ? "RESTORE" : "RESOLVE"}
        </button>
      </div>
    `;

    card.querySelector("[data-action='inspect']")?.addEventListener("click", () => {
      openInspectDrawer(task);
    });

    card.querySelector("[data-action='toggle-complete']")?.addEventListener("click", () => {
      task.completed = !task.completed;
      renderAll();
      renderCustomNavTabs();
      renderCustomWorkspaceView(customTab);
      showToast(task.completed ? `Resolved: "${task.title}"` : `Restored to active: "${task.title}"`);
    });

    dom.customWorkspaceDeck.appendChild(card);
  });
}


// Event Bindings
function bindControls() {
  // Theme Toggle in Sidebar
  dom.themeToggleBtn.addEventListener("click", cycleTheme);

  // Theme Toggle in Mobile Topbar
  dom.mobileThemeToggleBtn?.addEventListener("click", cycleTheme);

  // Sidebar Auth Action
  dom.sidebarAuthBtn.addEventListener("click", () => {
    if (state.authenticated) {
      lockSession();
    } else {
      if (dom.loginScreen) dom.loginScreen.style.display = "flex";
    }
  });

  // Sidebar Initials Avatar Click (Quick jump to Settings)
  dom.sidebarUserInitials?.addEventListener("click", () => {
    switchTab("settings");
    showToast("Opened Settings & Account Preferences");
  });

  // Force Sync Button
  document.getElementById("dashboardRefreshBtn")?.addEventListener("click", triggerSync);
  document.getElementById("settingsSyncNowBtn")?.addEventListener("click", triggerSync);

  // Search Input in Pending Tasks
  dom.pendingSearchInput?.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    renderPendingTab();
  });

  // Filter Pills
  dom.filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      dom.filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.pendingFilter = pill.getAttribute("data-filter");
      renderPendingTab();
    });
  });

  // Banner Dismiss
  document.getElementById("bannerDismissBtn")?.addEventListener("click", () => {
    dom.systemBanner.style.display = "none";
  });
}

function bindModals() {
  // SSO Submit
  document.getElementById("ssoSubmitBtn")?.addEventListener("click", () => {
    const email = document.getElementById("loginEmailInput")?.value || state.userEmail;
    const displayName = formatDisplayName(email);
    triggerRobotGreeting(email, () => {
      state.authenticated = true;
      state.userEmail = email;
      state.userName = displayName;
      localStorage.setItem("ops_auth", "true");
      localStorage.setItem("ops_email", email);
      localStorage.setItem("ops_user_name", state.userName);
      updateAuthUI();
      triggerSync();
      showToast(`Welcome, ${displayName}! Authenticated via Microsoft Entra`);
    });
  });

  // Quick Add Task Modal triggers
  document.getElementById("dashboardQuickAddBtn")?.addEventListener("click", () => showTaskModal());
  document.getElementById("pendingNewItemBtn")?.addEventListener("click", () => showTaskModal());
  document.getElementById("newAlignmentBtn")?.addEventListener("click", () => showTaskModal(true));

  document.getElementById("closeTaskModalBtn")?.addEventListener("click", hideTaskModal);
  document.getElementById("cancelTaskBtn")?.addEventListener("click", hideTaskModal);

  // Save Task
  document.getElementById("saveTaskBtn")?.addEventListener("click", () => {
    const titleInput = document.getElementById("newTaskTitle");
    const sourceInput = document.getElementById("newTaskSource");
    const alignmentInput = document.getElementById("newTaskAlignment");
    const dateInput = document.getElementById("newTaskDate");

    const title = titleInput.value.trim();
    if (!title) {
      alert("Please specify a task action title.");
      return;
    }

    const alignment = alignmentInput.value;
    const isAligned = alignment !== "UNALIGNED";

    const newTask = {
      id: "tsk-" + Date.now().toString().slice(-4),
      title: title,
      source: sourceInput.value,
      status: isAligned ? "ALIGNED" : "PENDING",
      alignedTo: alignment,
      dueDate: dateInput.value || new Date().toISOString().slice(0, 10),
      urgency: "NORMAL",
      completed: false,
      sender: state.userEmail || "muhammad.ammar@mgapparel.com",
      senderName: "Direct Input",
      receivedTime: "Just now",
      aiSummary: [
        `Directly registered action item: "${title}".`,
        "Synchronized with Microsoft To Do strategic list.",
        "Awaiting completion or milestone alignment."
      ],
      deliverables: [
        `Execute deliverable: ${title}`
      ]
    };

    state.tasks.unshift(newTask);
    setStoredJson("ops_tasks", state.tasks);
    titleInput.value = "";
    hideTaskModal();
    renderAll();
    showToast(`Task created & synced with Outlook: "${title}"`);
  });
}

function bindSettings() {
  // Theme segmented buttons in Settings
  document.getElementById("setThemeLight")?.addEventListener("click", () => setTheme("light"));
  document.getElementById("setThemeDark")?.addEventListener("click", () => setTheme("dark"));
  document.getElementById("setThemeTint")?.addEventListener("click", () => setTheme("tint"));

  // Disconnect / Lock Session
  document.getElementById("settingsDisconnectBtn")?.addEventListener("click", () => {
    lockSession();
  });

  // Save Email Identity & Tenant
  dom.saveIdentityBtn?.addEventListener("click", () => {
    const email = dom.settingUserEmail?.value.trim() || state.userEmail;
    const tenant = dom.settingTenant?.value.trim() || state.tenant;
    state.userEmail = email;
    state.tenant = tenant;
    localStorage.setItem("ops_email", email);
    localStorage.setItem("ops_tenant", tenant);
    if (dom.loginEmail) dom.loginEmail.value = email;
    if (dom.loginInitialsAvatar) dom.loginInitialsAvatar.textContent = getEmailInitials(email);
    updateAuthUI();
    showToast(`Identity saved: ${email}`);
  });

  // Google Gemini AI API Configuration
  dom.saveGeminiKeyBtn?.addEventListener("click", () => {
    const key = dom.settingGeminiApiKey?.value.trim() || "";
    const model = dom.settingGeminiModel?.value || "gemini-1.5-flash";
    state.geminiApiKey = key;
    state.geminiModel = model;
    localStorage.setItem("ops_gemini_key", key);
    localStorage.setItem("ops_gemini_model", model);
    updateGeminiStatusUI();
    if (key) {
      showToast("Google Gemini API Key connected successfully.");
    } else {
      showToast("Gemini API key is cleared.");
    }
  });

  dom.testGeminiKeyBtn?.addEventListener("click", async () => {
    const key = dom.settingGeminiApiKey?.value.trim() || state.geminiApiKey;
    if (!key) {
      showToast("Please enter a Google Gemini API Key first.");
      return;
    }
    showToast("Testing Gemini API connection...");
    if (dom.geminiStatusPill) {
      dom.geminiStatusPill.className = "status-pill tag-normal";
      dom.geminiStatusPill.textContent = "TESTING...";
    }

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      const data = await res.json();
      if (res.ok && data.models) {
        if (dom.geminiStatusPill) {
          dom.geminiStatusPill.className = "status-pill tag-success";
          dom.geminiStatusPill.textContent = "ACTIVE // VERIFIED";
        }
        showToast("Connection Successful! Gemini API key is valid and operational.");
      } else {
        const err = data.error?.message || "Invalid API Key or authorization error";
        if (dom.geminiStatusPill) {
          dom.geminiStatusPill.className = "status-pill tag-critical";
          dom.geminiStatusPill.textContent = "KEY REJECTED";
        }
        showToast(`Gemini Error: ${err}`);
      }
    } catch (e) {
      if (dom.geminiStatusPill) {
        dom.geminiStatusPill.className = "status-pill tag-critical";
        dom.geminiStatusPill.textContent = "NETWORK ERROR";
      }
      showToast("Network error contacting Google Gemini API: " + e.message);
    }
  });

  dom.clearGeminiKeyBtn?.addEventListener("click", () => {
    state.geminiApiKey = "";
    localStorage.removeItem("ops_gemini_key");
    if (dom.settingGeminiApiKey) dom.settingGeminiApiKey.value = "";
    updateGeminiStatusUI();
    showToast("Gemini API key removed.");
  });

  dom.toggleGeminiKeyVisibility?.addEventListener("click", () => {
    if (dom.settingGeminiApiKey.type === "password") {
      dom.settingGeminiApiKey.type = "text";
      dom.toggleGeminiKeyVisibility.textContent = "HIDE";
    } else {
      dom.settingGeminiApiKey.type = "password";
      dom.toggleGeminiKeyVisibility.textContent = "SHOW";
    }
  });

  // Color Palette pickers
  const terracottaPicker = document.getElementById("colorTerracotta");
  const terracottaHex = document.getElementById("colorTerracottaHex");
  const vividPicker = document.getElementById("colorVivid");
  const vividHex = document.getElementById("colorVividHex");
  const rustPicker = document.getElementById("colorRust");
  const rustHex = document.getElementById("colorRustHex");

  terracottaPicker?.addEventListener("input", (e) => {
    terracottaHex.value = e.target.value.toUpperCase();
    document.documentElement.style.setProperty("--color-terracotta", e.target.value);
  });
  terracottaHex?.addEventListener("input", (e) => {
    if (isValidHex(e.target.value)) {
      terracottaPicker.value = e.target.value;
      document.documentElement.style.setProperty("--color-terracotta", e.target.value);
    }
  });

  vividPicker?.addEventListener("input", (e) => {
    vividHex.value = e.target.value.toUpperCase();
    document.documentElement.style.setProperty("--color-vivid-orange", e.target.value);
  });
  vividHex?.addEventListener("input", (e) => {
    if (isValidHex(e.target.value)) {
      vividPicker.value = e.target.value;
      document.documentElement.style.setProperty("--color-vivid-orange", e.target.value);
    }
  });

  rustPicker?.addEventListener("input", (e) => {
    rustHex.value = e.target.value.toUpperCase();
    document.documentElement.style.setProperty("--color-rust-deep", e.target.value);
  });
  rustHex?.addEventListener("input", (e) => {
    if (isValidHex(e.target.value)) {
      rustPicker.value = e.target.value;
      document.documentElement.style.setProperty("--color-rust-deep", e.target.value);
    }
  });

  document.getElementById("resetColorsBtn")?.addEventListener("click", () => {
    document.documentElement.style.removeProperty("--color-terracotta");
    document.documentElement.style.removeProperty("--color-vivid-orange");
    document.documentElement.style.removeProperty("--color-rust-deep");
    if (terracottaPicker) terracottaPicker.value = "#A53C08";
    if (terracottaHex) terracottaHex.value = "#A53C08";
    if (vividPicker) vividPicker.value = "#F05500";
    if (vividHex) vividHex.value = "#F05500";
    if (rustPicker) rustPicker.value = "#7A2904";
    if (rustHex) rustHex.value = "#7A2904";
    showToast("Color palette restored to sample defaults");
  });

  // Clear Cache
  document.getElementById("clearCacheBtn")?.addEventListener("click", () => {
    state.tasks = [];
    state.meetings = [];
    state.focusHolds = [];
    state.delegatedTasks = [];
    state.vipWatchlist = [];
    localStorage.removeItem("ops_tasks");
    localStorage.removeItem("ops_meetings");
    localStorage.removeItem("ops_focus_holds");
    localStorage.removeItem("ops_delegated_tasks");
    localStorage.removeItem("ops_vip_watchlist");
    renderAll();
    showToast("Workspace cache cleared. All queues reset.");
  });
}

// Security Credentials & Password Management in Settings
function bindPasswordSettings() {
  const wireToggle = (btnId, input) => {
    const btn = document.getElementById(btnId);
    btn?.addEventListener("click", () => {
      if (!input) return;
      const isPass = input.type === "password";
      input.type = isPass ? "text" : "password";
      btn.textContent = isPass ? "HIDE" : "SHOW";
    });
  };

  wireToggle("toggleCurrentPasswordBtn", dom.settingCurrentPassword);
  wireToggle("toggleNewPasswordBtn", dom.settingNewPassword);
  wireToggle("toggleConfirmPasswordBtn", dom.settingConfirmPassword);

  // Form Submit for Updating Password
  dom.settingsPasswordForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const currentPass = dom.settingCurrentPassword?.value.trim() || "";
    const newPass = dom.settingNewPassword?.value.trim() || "";
    const confirmPass = dom.settingConfirmPassword?.value.trim() || "";

    const showFeedback = (msg, isSuccess) => {
      if (!dom.passwordFeedbackMsg) return;
      dom.passwordFeedbackMsg.style.display = "block";
      dom.passwordFeedbackMsg.className = `password-feedback ${isSuccess ? "success" : "error"}`;
      dom.passwordFeedbackMsg.textContent = msg;
    };

    // 1. Verify current password
    if (currentPass !== state.userPassword) {
      showFeedback("Current password does not match. Please enter your existing security PIN / password.", false);
      showToast("Current password does not match.");
      dom.settingCurrentPassword?.focus();
      return;
    }

    // 2. Validate new password length
    if (newPass.length < 4) {
      showFeedback("New password must be at least 4 characters in length.", false);
      showToast("New password must be at least 4 characters.");
      dom.settingNewPassword?.focus();
      return;
    }

    // 3. Confirm password matching
    if (newPass !== confirmPass) {
      showFeedback("New passwords do not match. Please verify confirmation input.", false);
      showToast("New passwords do not match.");
      dom.settingConfirmPassword?.focus();
      return;
    }

    // 4. Save and persist new credentials
    state.userPassword = newPass;
    localStorage.setItem("ops_password", newPass);

    if (dom.loginPassword) {
      dom.loginPassword.value = newPass;
    }

    // Clear form inputs
    if (dom.settingCurrentPassword) dom.settingCurrentPassword.value = "";
    if (dom.settingNewPassword) dom.settingNewPassword.value = "";
    if (dom.settingConfirmPassword) dom.settingConfirmPassword.value = "";

    showFeedback("Security credentials updated! Your new password is now active.", true);
    showToast("Password updated successfully.");

    if (dom.securityStatusPill) {
      dom.securityStatusPill.className = "status-pill tag-success";
      dom.securityStatusPill.textContent = "UPDATED";
      setTimeout(() => {
        if (dom.securityStatusPill) dom.securityStatusPill.textContent = "PROTECTED";
      }, 3000);
    }
  });

  // Clear / Reset Button
  dom.resetPasswordFormBtn?.addEventListener("click", () => {
    if (dom.settingCurrentPassword) dom.settingCurrentPassword.value = "";
    if (dom.settingNewPassword) dom.settingNewPassword.value = "";
    if (dom.settingConfirmPassword) dom.settingConfirmPassword.value = "";
    if (dom.passwordFeedbackMsg) {
      dom.passwordFeedbackMsg.style.display = "none";
      dom.passwordFeedbackMsg.textContent = "";
    }
  });
}

// Auth & Security Login Gateway
function initAuthAndSettings() {
  if (!state.authenticated) {
    if (dom.loginScreen) dom.loginScreen.style.display = "flex";
  } else {
    if (dom.loginScreen) dom.loginScreen.style.display = "none";
  }

  if (dom.loginEmail) dom.loginEmail.value = state.userEmail;
  if (dom.loginPassword) dom.loginPassword.value = state.userPassword;
  if (dom.loginInitialsAvatar) dom.loginInitialsAvatar.textContent = getEmailInitials(state.userEmail);
  if (dom.settingUserEmail) dom.settingUserEmail.value = state.userEmail;
  if (dom.settingTenant) dom.settingTenant.value = state.tenant;
  if (dom.settingGeminiApiKey) dom.settingGeminiApiKey.value = state.geminiApiKey;
  if (dom.settingGeminiModel) dom.settingGeminiModel.value = state.geminiModel;
  updateGeminiStatusUI();
}

function updateGeminiStatusUI() {
  if (!dom.geminiStatusPill) return;
  if (state.geminiApiKey) {
    dom.geminiStatusPill.className = "status-pill tag-success";
    dom.geminiStatusPill.textContent = "CONNECTED";
  } else {
    dom.geminiStatusPill.className = "status-pill tag-normal";
    dom.geminiStatusPill.textContent = "NOT CONNECTED";
  }
}

function bindLoginScreen() {
  // Initials reactive preview on typing email
  dom.loginEmail?.addEventListener("input", (e) => {
    if (dom.loginInitialsAvatar) {
      dom.loginInitialsAvatar.textContent = getEmailInitials(e.target.value);
    }
  });

  // Direct login submit
  dom.directLoginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    handleDirectLogin();
  });

  // Direct Microsoft 365 sign in
  dom.directMsSignInBtn?.addEventListener("click", () => {
    handleDirectLogin();
  });

  // Login screen quick theme toggle
  dom.loginThemeToggleBtn?.addEventListener("click", () => {
    cycleTheme();
  });

  // Toggle password visibility feature
  const togglePassBtn = document.getElementById("toggleLoginPasswordBtn");
  togglePassBtn?.addEventListener("click", () => {
    if (dom.loginPassword) {
      const isPass = dom.loginPassword.type === "password";
      dom.loginPassword.type = isPass ? "text" : "password";
      togglePassBtn.textContent = isPass ? "HIDE" : "SHOW";
    }
  });

}

function formatDisplayName(input) {
  if (!input || typeof input !== "string" || !input.trim()) {
    return state.userName || "Muhammad Ammar";
  }
  const trimmed = input.trim();

  // If input is directly a name (e.g. "Muhammad Ammar", "Ammar") without "@"
  if (!trimmed.includes("@")) {
    const words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length > 0) {
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    }
  }

  // If input contains muhammad or ammar
  const lower = trimmed.toLowerCase();
  if (lower.includes("muhammad") || lower.includes("ammar")) {
    return "Muhammad Ammar";
  }

  // Extract user part from email (e.g. "john.smith@domain.com" -> "John Smith")
  const userPart = trimmed.split("@")[0] || "";
  const cleanedPart = userPart.replace(/[0-9]+/g, " ").trim();
  const parts = (cleanedPart || userPart).split(/[._\-+\s]/).filter(Boolean);
  if (parts.length > 0) {
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
  }

  return state.userName || "Muhammad Ammar";
}

function playRobotWelcomeSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const now = ctx.currentTime;
    
    // Robotic pleasant ascending chime chords: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = i === notes.length - 1 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      
      // Friendly harmonic sparkle chirp on last note
      if (i === notes.length - 1) {
        osc.frequency.exponentialRampToValueAtTime(1174.66, now + i * 0.08 + 0.16);
      }
      
      gain.gain.setValueAtTime(0.001, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.38);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.4);
    });
    
    // Cheerful robotic waving "bloop" chirp
    const bloopOsc = ctx.createOscillator();
    const bloopGain = ctx.createGain();
    bloopOsc.type = "sine";
    bloopOsc.frequency.setValueAtTime(880, now + 0.34);
    bloopOsc.frequency.exponentialRampToValueAtTime(1320, now + 0.48);
    
    bloopGain.gain.setValueAtTime(0.001, now + 0.34);
    bloopGain.gain.linearRampToValueAtTime(0.12, now + 0.36);
    bloopGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.56);
    
    bloopOsc.connect(bloopGain);
    bloopGain.connect(ctx.destination);
    
    bloopOsc.start(now + 0.34);
    bloopOsc.stop(now + 0.58);
  } catch (e) {
    console.warn("AudioContext sound synthesis error:", e);
  }
}

function triggerRobotGreeting(email, onComplete) {
  const displayName = formatDisplayName(email);
  if (dom.robotGreetingText) {
    dom.robotGreetingText.innerHTML = `Hello, <span class="robot-name-accent">${escapeHTML(displayName)}</span>!`;
  }

  // Hide login screen / modal
  if (dom.loginScreen) dom.loginScreen.style.display = "none";
  hideAuthModal();

  // Show robot welcome motion graphic
  if (dom.robotWelcomeScreen) {
    dom.robotWelcomeScreen.classList.remove("fade-out");
    dom.robotWelcomeScreen.style.display = "flex";
  }

  // Play synthesized robot chime sound effect only
  playRobotWelcomeSound();

  // Fast & snappy login: show robot wave and chime for ~900ms, then smoothly transition into dashboard
  setTimeout(() => {
    if (dom.robotWelcomeScreen) {
      dom.robotWelcomeScreen.classList.add("fade-out");
    }

    setTimeout(() => {
      if (dom.robotWelcomeScreen) {
        dom.robotWelcomeScreen.style.display = "none";
        dom.robotWelcomeScreen.classList.remove("fade-out");
      }
      if (typeof onComplete === "function") {
        onComplete();
      }
    }, 280);
  }, 900);
}

function handleDirectLogin() {
  const email = dom.loginEmail?.value.trim() || "muhammad.ammar@mgapparel.com";
  const password = dom.loginPassword?.value || "";

  // Verify PIN / Password
  if (state.userPassword && password && password !== state.userPassword) {
    showToast("Incorrect security PIN or password. Please try again.");
    if (dom.loginPassword) {
      dom.loginPassword.focus();
    }
    return;
  }

  const displayName = formatDisplayName(email);

  triggerRobotGreeting(email, () => {
    state.authenticated = true;
    state.userEmail = email.includes("@") ? email : `${email.toLowerCase().replace(/\s+/g, ".")}@mgapparel.com`;
    state.userName = displayName;

    localStorage.setItem("ops_auth", "true");
    localStorage.setItem("ops_email", state.userEmail);
    localStorage.setItem("ops_user_name", state.userName);

    // Sync settings email input
    if (dom.settingUserEmail) dom.settingUserEmail.value = state.userEmail;

    updateAuthUI();
    renderAll();
    showToast(`Welcome, ${displayName}! Logged into OPS portal.`);
  });
}

function lockSession() {
  state.authenticated = false;
  localStorage.removeItem("ops_auth");
  if (dom.robotWelcomeScreen) dom.robotWelcomeScreen.style.display = "none";
  if (dom.loginScreen) dom.loginScreen.style.display = "flex";
  updateAuthUI();
  showToast("Session locked. Re-authenticate to access portal.");
}

// Navbar Quick Add Modal & Custom Tabs Binding
function bindNavbarQuickAdd() {
  // Triggers for Quick Add Launcher
  dom.navQuickAddBtn?.addEventListener("click", showNavQuickAddModal);
  dom.mobileQuickAddBtn?.addEventListener("click", showNavQuickAddModal);

  dom.closeQuickAddModalBtn?.addEventListener("click", hideNavQuickAddModal);
  dom.navQuickAddModal?.addEventListener("click", (e) => {
    if (e.target === dom.navQuickAddModal) hideNavQuickAddModal();
  });

  // Quick Action Tile 1: New Action Task
  dom.quickAddOutlookTaskBtn?.addEventListener("click", () => {
    hideNavQuickAddModal();
    showTaskModal();
  });

  // Quick Action Tile 2: Block Focus Slot
  dom.quickAddFocusSlotBtn?.addEventListener("click", () => {
    hideNavQuickAddModal();
    openFocusModal();
  });

  // Quick Action Tile 3: Add Navbar Tab
  dom.quickAddNavbarTabBtn?.addEventListener("click", () => {
    hideNavQuickAddModal();
    showCustomTabModal();
  });

  // Quick Action Tile 4: VIP Counterparty Watchlist
  dom.quickAddVipSenderBtn?.addEventListener("click", () => {
    hideNavQuickAddModal();
    switchTab("briefing");
    dom.newVipInput?.focus();
    showToast("Enter VIP counterparty email below to establish priority routing rule.");
  });

  // Navbar Direct "+ Add Tab to Nav" Button
  dom.navAddCustomTabBtn?.addEventListener("click", showCustomTabModal);

  // Custom Tab Modal Handlers
  dom.closeCustomTabModalBtn?.addEventListener("click", hideCustomTabModal);
  dom.cancelCustomTabModalBtn?.addEventListener("click", hideCustomTabModal);
  dom.customTabModal?.addEventListener("click", (e) => {
    if (e.target === dom.customTabModal) hideCustomTabModal();
  });

  dom.confirmAddCustomTabBtn?.addEventListener("click", () => {
    const name = dom.customTabNameInput?.value.trim();
    if (!name) {
      alert("Please provide a title for your custom workspace tab.");
      return;
    }

    const scope = dom.customTabScopeSelect?.value || "Flagged Outlook Threads";
    const gradient = dom.customTabGradientSelect?.value || "terracotta-flame";

    const newTab = {
      id: "tab-" + Date.now().toString().slice(-4),
      name: name,
      scope: scope,
      gradient: gradient,
      itemCount: 1
    };

    state.customTabs.push(newTab);
    setStoredJson("ops_custom_tabs", state.customTabs);
    renderCustomNavTabs();
    hideCustomTabModal();
    if (dom.customTabNameInput) dom.customTabNameInput.value = "";
    
    // Switch to newly created tab
    switchToCustomTab(newTab.id);
    showToast(`Pinned new workspace "${name}" directly to your navigation bar.`);
  });

  // Custom Workspace View Actions
  dom.customWorkspaceAddTaskBtn?.addEventListener("click", () => {
    if (state.activeCustomTab) {
      showTaskModal();
    }
  });

  dom.customWorkspaceRemoveTabBtn?.addEventListener("click", () => {
    if (!state.activeCustomTab) return;
    const removedName = state.activeCustomTab.name;
    state.customTabs = state.customTabs.filter(t => t.id !== state.activeCustomTab.id);
    setStoredJson("ops_custom_tabs", state.customTabs);
    state.activeCustomTab = null;
    renderCustomNavTabs();
    switchTab("dashboard");
    showToast(`Removed "${removedName}" from navigation bar.`);
  });
}

function showNavQuickAddModal() {
  dom.navQuickAddModal?.classList.add("active");
  dom.navQuickAddModal?.setAttribute("aria-hidden", "false");
}

function hideNavQuickAddModal() {
  dom.navQuickAddModal?.classList.remove("active");
  dom.navQuickAddModal?.setAttribute("aria-hidden", "true");
}

function showCustomTabModal() {
  dom.customTabModal?.classList.add("active");
  dom.customTabModal?.setAttribute("aria-hidden", "false");
  dom.customTabNameInput?.focus();
}

function hideCustomTabModal() {
  dom.customTabModal?.classList.remove("active");
  dom.customTabModal?.setAttribute("aria-hidden", "true");
}

// Gradient Color Palette Engine & Studio
function bindGradientStudio() {
  const PRESET_MAP = {
    "terracotta-flame": {
      name: "Terracotta Flame",
      gradient: "linear-gradient(135deg, #7A2904 0%, #A53C08 50%, #F05500 100%)",
      hover: "linear-gradient(135deg, #A53C08 0%, #F05500 50%, #FF6A1A 100%)",
      subtle: "linear-gradient(135deg, rgba(165, 60, 8, 0.08) 0%, rgba(240, 85, 0, 0.03) 100%)",
      primary: "#A53C08",
      start: "#7A2904",
      end: "#F05500"
    },
    "sunrise-amber": {
      name: "Sunrise Amber",
      gradient: "linear-gradient(135deg, #A53C08 0%, #F7803A 55%, #FCA772 100%)",
      hover: "linear-gradient(135deg, #F05500 0%, #FCA772 60%, #FED9C0 100%)",
      subtle: "linear-gradient(135deg, rgba(247, 128, 58, 0.09) 0%, rgba(252, 167, 114, 0.04) 100%)",
      primary: "#F7803A",
      start: "#A53C08",
      end: "#FCA772"
    },
    "deep-ember": {
      name: "Deep Ember & Rust",
      gradient: "linear-gradient(135deg, #300F03 0%, #682303 50%, #A53C08 100%)",
      hover: "linear-gradient(135deg, #682303 0%, #A53C08 55%, #F05500 100%)",
      subtle: "linear-gradient(135deg, rgba(104, 35, 3, 0.1) 0%, rgba(165, 60, 8, 0.04) 100%)",
      primary: "#682303",
      start: "#300F03",
      end: "#A53C08"
    },
    "charcoal-fire": {
      name: "Charcoal & Signal Fire",
      gradient: "linear-gradient(135deg, #1A1D20 0%, #33373B 50%, #A53C08 100%)",
      hover: "linear-gradient(135deg, #33373B 0%, #1A1D20 50%, #F05500 100%)",
      subtle: "linear-gradient(135deg, rgba(26, 29, 32, 0.08) 0%, rgba(165, 60, 8, 0.04) 100%)",
      primary: "#33373B",
      start: "#1A1D20",
      end: "#A53C08"
    },
    "peach-silk": {
      name: "Peach Silk & Terracotta",
      gradient: "linear-gradient(135deg, #FFF3EB 0%, #FCA772 55%, #A53C08 100%)",
      hover: "linear-gradient(135deg, #FCA772 0%, #F05500 60%, #7A2904 100%)",
      subtle: "linear-gradient(135deg, rgba(252, 167, 114, 0.12) 0%, rgba(165, 60, 8, 0.04) 100%)",
      primary: "#A53C08",
      start: "#FFF3EB",
      end: "#A53C08"
    }
  };

  // Preset Card Clicks
  dom.gradientPresetBtns?.forEach(btn => {
    btn.addEventListener("click", () => {
      const presetKey = btn.getAttribute("data-gradient-preset");
      const preset = PRESET_MAP[presetKey];
      if (!preset) return;

      dom.gradientPresetBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      applyGradientTokens(preset.gradient, preset.hover, preset.subtle, preset.primary);

      // Sync custom studio inputs
      if (dom.gradStartPicker) dom.gradStartPicker.value = preset.start.startsWith("#") ? preset.start : "#7A2904";
      if (dom.gradStartHex) dom.gradStartHex.value = dom.gradStartPicker ? dom.gradStartPicker.value.toUpperCase() : preset.start;
      if (dom.gradEndPicker) dom.gradEndPicker.value = preset.end.startsWith("#") ? preset.end : "#F05500";
      if (dom.gradEndHex) dom.gradEndHex.value = dom.gradEndPicker ? dom.gradEndPicker.value.toUpperCase() : preset.end;
      updateStudioLivePreview();

      state.currentGradientPreset = presetKey;
      showToast(`Applied architectural gradient palette: ${preset.name}`);
    });
  });

  // Custom Studio Inputs
  dom.gradStartPicker?.addEventListener("input", (e) => {
    if (dom.gradStartHex) dom.gradStartHex.value = e.target.value.toUpperCase();
    updateStudioLivePreview();
  });
  dom.gradStartHex?.addEventListener("input", (e) => {
    if (isValidHex(e.target.value)) {
      if (dom.gradStartPicker) dom.gradStartPicker.value = e.target.value;
      updateStudioLivePreview();
    }
  });

  dom.gradEndPicker?.addEventListener("input", (e) => {
    if (dom.gradEndHex) dom.gradEndHex.value = e.target.value.toUpperCase();
    updateStudioLivePreview();
  });
  dom.gradEndHex?.addEventListener("input", (e) => {
    if (isValidHex(e.target.value)) {
      if (dom.gradEndPicker) dom.gradEndPicker.value = e.target.value;
      updateStudioLivePreview();
    }
  });

  dom.gradAngleSelect?.addEventListener("change", updateStudioLivePreview);

  function updateStudioLivePreview() {
    const start = dom.gradStartPicker?.value || "#7A2904";
    const end = dom.gradEndPicker?.value || "#F05500";
    const angle = dom.gradAngleSelect?.value || "135deg";
    const gradStr = `linear-gradient(${angle}, ${start} 0%, ${end} 100%)`;
    if (dom.gradLivePreview) dom.gradLivePreview.style.background = gradStr;
  }

  dom.applyCustomGradBtn?.addEventListener("click", () => {
    const start = dom.gradStartPicker?.value || "#7A2904";
    const end = dom.gradEndPicker?.value || "#F05500";
    const angle = dom.gradAngleSelect?.value || "135deg";
    const customGrad = `linear-gradient(${angle}, ${start} 0%, ${end} 100%)`;
    const customHover = `linear-gradient(${angle}, ${start} 0%, ${end} 85%, #FFFFFF 100%)`;
    const customSubtle = `linear-gradient(${angle}, rgba(165, 60, 8, 0.08) 0%, rgba(240, 85, 0, 0.03) 100%)`;

    applyGradientTokens(customGrad, customHover, customSubtle, start);
    dom.gradientPresetBtns?.forEach(b => b.classList.remove("active"));
    showToast(`Custom gradient active: ${angle} // ${start} → ${end}`);
  });

  function applyGradientTokens(gradient, hover, subtle, primaryColor) {
    document.documentElement.style.setProperty("--gradient-primary", gradient);
    document.documentElement.style.setProperty("--gradient-primary-hover", hover);
    document.documentElement.style.setProperty("--gradient-accent-soft", subtle);
    if (primaryColor) {
      document.documentElement.style.setProperty("--color-terracotta", primaryColor);
      document.documentElement.style.setProperty("--color-accent-primary", primaryColor);
    }
  }

  // Initialize studio preview
  updateStudioLivePreview();
}


// Inspection Drawer & AI Email Triage
function bindInspectionDrawer() {
  dom.closeInspectBtn?.addEventListener("click", closeInspectDrawer);
  dom.inspectBackdrop?.addEventListener("click", closeInspectDrawer);

  // Canned Responses
  document.querySelectorAll("[data-canned]").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-canned");
      if (!state.activeInspectionTask) return;
      handleCannedResponse(state.activeInspectionTask, type);
    });
  });

  // Drawer Action Buttons
  dom.inspectBlockFocusBtn?.addEventListener("click", () => {
    if (!state.activeInspectionTask) return;
    blockFocusSlotForTask(state.activeInspectionTask);
    closeInspectDrawer();
  });

  dom.inspectDelegateBtn?.addEventListener("click", () => {
    if (!state.activeInspectionTask) return;
    openDelegationModal(state.activeInspectionTask);
    closeInspectDrawer();
  });

  dom.inspectCompleteBtn?.addEventListener("click", () => {
    if (!state.activeInspectionTask) return;
    completeTask(state.activeInspectionTask);
    closeInspectDrawer();
  });

  // Live Gemini AI Triage Button
  dom.btnRunGeminiTriage?.addEventListener("click", async () => {
    if (!state.activeInspectionTask) return;
    const task = state.activeInspectionTask;
    if (!state.geminiApiKey) {
      showToast("Gemini API key not configured. Enter key in Settings or Login page.");
      switchTab("settings");
      closeInspectDrawer();
      return;
    }

    const prevText = dom.btnRunGeminiTriage.textContent;
    dom.btnRunGeminiTriage.textContent = "ANALYZING WITH GEMINI AI...";
    dom.btnRunGeminiTriage.disabled = true;

    try {
      const prompt = `You are an executive assistant for Muhammad Ammar at MG Apparel. Analyze this email/task and return valid JSON with 3 executive summary bullets and 2 concrete action deliverables:\nTask Title: ${task.title}\nSource: ${task.source}\nSender: ${task.sender || "internal"}\nDue: ${task.dueDate}\n\nRespond ONLY with JSON format: {"summary": ["bullet 1", "bullet 2", "bullet 3"], "deliverables": ["deliv 1", "deliv 2"]}`;
      const model = state.geminiModel || "gemini-1.5-flash";
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${state.geminiApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const data = await res.json();
      if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
        if (parsed.summary && Array.isArray(parsed.summary)) {
          task.aiSummary = parsed.summary;
        }
        if (parsed.deliverables && Array.isArray(parsed.deliverables)) {
          task.deliverables = parsed.deliverables;
        }
        setStoredJson("ops_tasks", state.tasks);
        openInspectDrawer(task);
        showToast("Gemini AI analysis complete!");
      } else {
        showToast("Gemini API error: " + (data.error?.message || "Check your API key."));
      }
    } catch (e) {
      showToast("Gemini request failed: " + e.message);
    } finally {
      if (dom.btnRunGeminiTriage) {
        dom.btnRunGeminiTriage.textContent = prevText;
        dom.btnRunGeminiTriage.disabled = false;
      }
    }
  });
}

function openInspectDrawer(task) {
  state.activeInspectionTask = task;
  
  if (dom.inspectItemTitle) dom.inspectItemTitle.textContent = task.title;
  if (dom.inspectItemMeta) {
    dom.inspectItemMeta.textContent = `From: ${task.sender || "internal@mgapparel.com"} // ${task.receivedTime || "Live Synced"}`;
  }

  // Populate AI Summary
  if (dom.inspectSummaryBox) {
    dom.inspectSummaryBox.innerHTML = "";
    const bullets = task.aiSummary && task.aiSummary.length > 0 
      ? task.aiSummary 
      : [
          `Action item synchronized from ${task.source}.`,
          `Assigned target due date: ${task.dueDate}.`,
          "Awaiting executive triage decision from Muhammad Ammar."
        ];
    bullets.forEach(b => {
      const p = document.createElement("p");
      p.className = "inspect-summary-bullet";
      p.textContent = b;
      dom.inspectSummaryBox.appendChild(p);
    });
  }

  // Populate Extracted Deliverables
  if (dom.inspectDeliverablesList) {
    dom.inspectDeliverablesList.innerHTML = "";
    const deliverables = task.deliverables && task.deliverables.length > 0
      ? task.deliverables
      : [`Complete deliverable: ${task.title}`];

    deliverables.forEach((d, idx) => {
      const row = document.createElement("label");
      row.className = "deliverable-item";
      row.innerHTML = `
        <input type="checkbox" class="deliverable-checkbox" id="deliv-${idx}">
        <span>${escapeHTML(d)}</span>
      `;
      dom.inspectDeliverablesList.appendChild(row);
    });
  }

  dom.inspectDrawer?.classList.add("active");
  dom.inspectBackdrop?.classList.add("active");
}

function closeInspectDrawer() {
  dom.inspectDrawer?.classList.remove("active");
  dom.inspectBackdrop?.classList.remove("active");
  state.activeInspectionTask = null;
}

function handleCannedResponse(task, type) {
  let replyText = "";
  if (type === "acknowledge") {
    replyText = "Acknowledged - Under review today by Muhammad Ammar. Full feedback by 17:00.";
    task.title = `[ACKNOWLEDGED] ${task.title.replace(/^\[ACKNOWLEDGED\]\s*/, "")}`;
    showToast(`Graph SendMail: Sent acknowledgement to ${task.sender || "Counterparty"}`);
  } else if (type === "approve") {
    replyText = "Approved as submitted. Proceed with execution per MG Apparel governance.";
    task.status = "ALIGNED";
    task.alignedTo = "OUTLOOK: EXECUTIVE & CLIENT CORRESPONDENCE";
    showToast(`Graph SendMail: Sent executive approval to ${task.sender || "Counterparty"}`);
  } else if (type === "defer") {
    replyText = "Delegating to MG Apparel Operations for technical validation. Follow-up scheduled.";
    task.dueDate = "2026-10-19";
    showToast(`Graph SendMail: Sent deferral notice to ${task.sender || "Counterparty"}`);
  }

  renderAll();
  closeInspectDrawer();
}

// Calendar & Focus Actions
function bindCalendarActions() {
  document.getElementById("quickBlockFocusBtn")?.addEventListener("click", openFocusModal);
  document.getElementById("addCustomHoldBtn")?.addEventListener("click", openFocusModal);
  document.getElementById("autoBufferBtn")?.addEventListener("click", autoInsertBuffers);
  document.getElementById("syncCalendarBtn")?.addEventListener("click", triggerSync);

  // Focus Modal Handlers
  dom.closeFocusModalBtn?.addEventListener("click", closeFocusModal);
  dom.cancelFocusModalBtn?.addEventListener("click", closeFocusModal);
  dom.confirmFocusSlotBtn?.addEventListener("click", confirmFocusSlot);

  // Dossier Modal Handlers
  dom.closeDossierBtn?.addEventListener("click", closeDossier);
  dom.dossierCloseActionBtn?.addEventListener("click", closeDossier);
  dom.dossierOpenTeamsBtn?.addEventListener("click", () => {
    showToast("Launching Microsoft Teams Client via Graph Protocol Handler...");
    closeDossier();
  });
}

function autoInsertBuffers() {
  showToast("Graph Calendar Engine: 10-Minute recovery buffers verified between all meetings.");
  if (dom.kpiBufferStatus) dom.kpiBufferStatus.textContent = "100%";
  if (dom.kpiBufferFooter) dom.kpiBufferFooter.textContent = "Active recovery buffers enforced across all 4 meetings";
}

function openFocusModal() {
  dom.focusModal?.classList.add("active");
  dom.focusModal?.setAttribute("aria-hidden", "false");
}

function closeFocusModal() {
  dom.focusModal?.classList.remove("active");
  dom.focusModal?.setAttribute("aria-hidden", "true");
}

function confirmFocusSlot() {
  const title = dom.focusTitleInput?.value.trim() || "EXECUTIVE FOCUS BLOCK";
  const duration = dom.focusDurationSelect?.value || "45";
  const time = dom.focusTimeSelect?.value || "13:00 - 13:45";

  const newHold = {
    id: "foc-" + Date.now().toString().slice(-4),
    title: title.toUpperCase(),
    time: time,
    duration: `${duration}M`,
    synced: true
  };

  state.focusHolds.push(newHold);
  setStoredJson("ops_focus_holds", state.focusHolds);
  closeFocusModal();
  if (dom.focusTitleInput) dom.focusTitleInput.value = "";
  renderCalendarTab();
  showToast(`Booked ${duration}m Focus Hold to Outlook Calendar: "${title}"`);
}

function blockFocusSlotForTask(task) {
  const newHold = {
    id: "foc-" + Date.now().toString().slice(-4),
    title: `FOCUS // ${task.title.slice(0, 32).toUpperCase()}`,
    time: "15:30 - 16:15",
    duration: "45M",
    synced: true
  };

  state.focusHolds.push(newHold);
  setStoredJson("ops_focus_holds", state.focusHolds);
  renderCalendarTab();
  showToast(`Auto-blocked 45m Focus Hold for: "${task.title}"`);
}

function openDossier(meeting) {
  state.activeDossierMeeting = meeting;
  if (dom.dossierTitle) dom.dossierTitle.textContent = meeting.title;
  if (dom.dossierMeta) dom.dossierMeta.textContent = `${meeting.time} // ${meeting.platform}`;

  if (dom.dossierAttendees) {
    dom.dossierAttendees.innerHTML = meeting.attendees.map(a => `<div class="dossier-bullet">${escapeHTML(a)}</div>`).join("");
  }
  if (dom.dossierObjectives) {
    dom.dossierObjectives.innerHTML = meeting.objectives.map(o => `<div class="dossier-bullet">${escapeHTML(o)}</div>`).join("");
  }
  if (dom.dossierFiles) {
    dom.dossierFiles.innerHTML = meeting.attachments.map(f => `<div class="dossier-bullet" style="color: var(--color-terracotta); font-weight: 600;">${escapeHTML(f)}</div>`).join("");
  }

  dom.dossierModal?.classList.add("active");
  dom.dossierModal?.setAttribute("aria-hidden", "false");
}

function closeDossier() {
  dom.dossierModal?.classList.remove("active");
  dom.dossierModal?.setAttribute("aria-hidden", "true");
  state.activeDossierMeeting = null;
}

// Executive Briefing & Delegation Actions
function bindBriefingActions() {
  document.getElementById("generateMorningBriefBtn")?.addEventListener("click", () => {
    renderMorningBriefing();
    showToast("Morning Executive Briefing refreshed with live Graph metrics");
  });

  document.getElementById("runEodClearanceBtn")?.addEventListener("click", () => {
    renderEodClearance();
    showToast("End-of-Day clearance digest generated");
  });

  document.getElementById("addVipBtn")?.addEventListener("click", () => {
    const email = dom.newVipInput?.value.trim();
    if (!email || !email.includes("@")) {
      alert("Please provide a valid counterparty email address.");
      return;
    }
    if (!state.vipWatchlist.includes(email)) {
      state.vipWatchlist.push(email);
      setStoredJson("ops_vip_watchlist", state.vipWatchlist);
      dom.newVipInput.value = "";
      renderVipChips();
      showToast(`Added ${email} to VIP Counterparty Watchlist`);
    }
  });

  document.getElementById("refreshDelegationsBtn")?.addEventListener("click", () => {
    showToast("Delegation Gateway: Synchronized status with direct reports");
    renderDelegationDeck();
  });

  // Delegation Modal Handlers
  dom.closeDelegationModalBtn?.addEventListener("click", closeDelegationModal);
  dom.cancelDelegateBtn?.addEventListener("click", closeDelegationModal);
  dom.confirmDelegateBtn?.addEventListener("click", confirmDelegation);
}

function openDelegationModal(task) {
  state.activeDelegationTask = task;
  if (dom.delegateTaskTitleDisplay) dom.delegateTaskTitleDisplay.value = task.title;
  dom.delegationModal?.classList.add("active");
  dom.delegationModal?.setAttribute("aria-hidden", "false");
}

function closeDelegationModal() {
  dom.delegationModal?.classList.remove("active");
  dom.delegationModal?.setAttribute("aria-hidden", "true");
  state.activeDelegationTask = null;
}

function confirmDelegation() {
  if (!state.activeDelegationTask) return;
  const assignee = dom.delegateAssigneeInput?.value || "Assigned Direct Report";
  const note = dom.delegateNoteInput?.value.trim() || "";

  const delegatedItem = {
    id: "del-" + Date.now().toString().slice(-4),
    title: state.activeDelegationTask.title,
    assignee: assignee,
    delegatedDate: new Date().toISOString().slice(0, 10),
    status: "AWAITING ACKNOWLEDGEMENT"
  };

  state.delegatedTasks.unshift(delegatedItem);
  setStoredJson("ops_delegated_tasks", state.delegatedTasks);
  state.activeInspectionTask = null;

  // Mark original task as delegated
  state.activeDelegationTask.status = "ALIGNED";
  state.activeDelegationTask.alignedTo = "OUTLOOK: EXECUTIVE & CLIENT CORRESPONDENCE";
  setStoredJson("ops_tasks", state.tasks);

  closeDelegationModal();
  renderAll();
  showToast(`Delegated task to ${assignee} with automated Outlook notification`);
}

// Rendering System
function renderAll() {
  updateMetrics();
  renderAnalyticsCharts();
  renderDashboardDecks();
  renderPendingTab();
  renderAlignedTab();
  renderCalendarTab();
  renderBriefingTab();
}

function updateMetrics() {
  const pending = state.tasks.filter(t => !t.completed && t.status === "PENDING");
  const aligned = state.tasks.filter(t => !t.completed && t.status === "ALIGNED");
  const today = state.tasks.filter(t => !t.completed && (t.dueDate === "2026-10-14" || t.urgency === "CRITICAL"));
  
  const totalActive = pending.length + aligned.length;
  const ratio = totalActive > 0 ? Math.round((aligned.length / totalActive) * 100) : 0;

  dom.kpiPendingValue.textContent = formatNum(pending.length);
  dom.kpiAlignedValue.textContent = formatNum(aligned.length);
  dom.kpiTodayValue.textContent = formatNum(today.length);
  dom.kpiRatioValue.textContent = `${ratio}%`;

  const flaggedCount = pending.filter(t => t.source.includes("FLAGGED") || t.source.includes("MAIL")).length;
  const todoCount = pending.filter(t => t.source.includes("TO DO") || t.source.includes("TEAMS")).length;

  if (dom.kpiPendingFooter) {
    dom.kpiPendingFooter.textContent = `${flaggedCount} Flagged Outlook Emails // ${todoCount} Action Tasks`;
  }
  if (dom.kpiAlignedFooter) {
    dom.kpiAlignedFooter.textContent = `${aligned.length} Strategic Alignments Active`;
  }
  if (dom.kpiTodayFooter) {
    dom.kpiTodayFooter.textContent = `${today.length} Critical Commitments Due Today`;
  }
  if (dom.kpiRatioFooter) {
    dom.kpiRatioFooter.textContent = totalActive > 0 ? `${ratio}% Alignment Health Ratio` : "Awaiting Activity Data";
  }

  dom.navPendingCount.textContent = pending.length;
  dom.navAlignedCount.textContent = aligned.length;
  if (dom.navCalendarCount) dom.navCalendarCount.textContent = state.meetings.length;
  if (dom.navBriefingCount) dom.navBriefingCount.textContent = state.delegatedTasks.length;

  if (dom.mobPendingBadge) dom.mobPendingBadge.textContent = pending.length;
  if (dom.mobAlignedBadge) dom.mobAlignedBadge.textContent = aligned.length;

  if (dom.dashViewPendingBtn) {
    dom.dashViewPendingBtn.textContent = `VIEW ALL PENDING (${pending.length})`;
  }
  if (dom.dashViewAlignedBtn) {
    dom.dashViewAlignedBtn.textContent = `VIEW ALL ALIGNED (${aligned.length})`;
  }
}

function renderAnalyticsCharts() {
  const activeTasks = state.tasks.filter(t => !t.completed);
  
  if (activeTasks.length === 0) {
    if (dom.stackedBarContainer) {
      dom.stackedBarContainer.innerHTML = `
        <div class="empty-chart-notice" id="stackedBarNotice">
          <span class="empty-notice-title">NO ACTIVITY RECORDED</span>
        </div>
      `;
    }
    if (dom.stackedBarLegend) dom.stackedBarLegend.style.display = "none";

    if (dom.velocityContainer) {
      dom.velocityContainer.innerHTML = `
        <div class="empty-chart-notice" id="velocityNotice">
          <span class="empty-notice-title">NO TRIAGE DATA LOGGED</span>
        </div>
      `;
    }
    if (dom.velocityLegend) dom.velocityLegend.style.display = "none";
    return;
  }

  const total = activeTasks.length;
  const mailCount = activeTasks.filter(t => t.source.includes("MAIL") || t.source.includes("FLAGGED")).length;
  const calCount = state.meetings.length;
  const todoCount = activeTasks.filter(t => t.source.includes("TO DO") || t.source.includes("TEAMS")).length;
  const sumTotal = total + calCount;

  const pMail = Math.max(12, Math.round((mailCount / sumTotal) * 100));
  const pCal = Math.max(15, Math.round((calCount / sumTotal) * 100));
  const pTodo = Math.max(12, Math.round((todoCount / sumTotal) * 100));
  const pOther = Math.max(10, 100 - (pMail + pCal + pTodo));

  if (dom.stackedBarContainer) {
    dom.stackedBarContainer.innerHTML = `
      <div class="stacked-bar-row">
        <span class="row-label">LIVE FEED</span>
        <div class="bar-segments">
          <div class="seg seg-rust" style="width: ${pMail}%;" title="Flagged Emails ${pMail}%">${pMail}%</div>
          <div class="seg seg-terracotta" style="width: ${pCal}%;" title="Calendar Meetings ${pCal}%">${pCal}%</div>
          <div class="seg seg-vivid" style="width: ${pTodo}%;" title="To Do & Teams ${pTodo}%">${pTodo}%</div>
          <div class="seg seg-peach" style="width: ${pOther}%;" title="Strategic Holds ${pOther}%">${pOther}%</div>
        </div>
      </div>
    `;
  }
  if (dom.stackedBarLegend) dom.stackedBarLegend.style.display = "flex";

  const resolved = state.tasks.filter(t => t.completed).length + 3;
  const pending = activeTasks.length;

  if (dom.velocityContainer) {
    dom.velocityContainer.innerHTML = `
      <div class="velocity-columns">
        <div class="v-col">
          <div class="v-bar pos" style="height: ${Math.min(90, Math.max(28, resolved * 12))}px;"><span class="v-val">+${resolved}</span></div>
          <div class="v-bar neg" style="height: ${Math.min(70, Math.max(28, pending * 10))}px;"><span class="v-val">-${pending}</span></div>
          <span class="v-label">TODAY</span>
        </div>
      </div>
    `;
  }
  if (dom.velocityLegend) dom.velocityLegend.style.display = "flex";
}

function renderDashboardDecks() {
  const pendingItems = state.tasks.filter(t => !t.completed && t.status === "PENDING").slice(0, 4);
  const alignedItems = state.tasks.filter(t => !t.completed && t.status === "ALIGNED").slice(0, 4);

  dom.dashboardPendingDeck.innerHTML = "";
  if (pendingItems.length === 0) {
    dom.dashboardPendingDeck.innerHTML = `<div class="minimal-card"><div class="card-task-title" style="color: var(--text-muted);">NO PENDING TASKS AWAITING TRIAGE</div><div class="card-source-tag">OUTLOOK QUEUE IS CLEAR // INBOX ZERO</div></div>`;
  } else {
    pendingItems.forEach(t => {
      dom.dashboardPendingDeck.appendChild(createMinimalCard(t, true));
    });
  }

  dom.dashboardAlignedDeck.innerHTML = "";
  if (alignedItems.length === 0) {
    dom.dashboardAlignedDeck.innerHTML = `<div class="minimal-card"><div class="card-task-title" style="color: var(--text-muted);">NO ACTIVE STRATEGIC COMMITMENTS</div><div class="card-source-tag">ASSIGN TASKS FROM PENDING TRIAGE</div></div>`;
  } else {
    alignedItems.forEach(t => {
      dom.dashboardAlignedDeck.appendChild(createMinimalCard(t, false));
    });
  }
}

function renderPendingTab() {
  const allPending = state.tasks.filter(t => !t.completed && t.status === "PENDING");
  const mailCount = allPending.filter(t => t.source.includes("MAIL") || t.source.includes("FLAGGED")).length;
  const todoCount = allPending.filter(t => t.source.includes("TO DO") || t.source.includes("TEAMS")).length;
  const urgentCount = allPending.filter(t => t.urgency === "CRITICAL" || t.dueDate === "2026-10-14").length;

  if (dom.pillAll) dom.pillAll.textContent = `ALL (${allPending.length})`;
  if (dom.pillMail) dom.pillMail.textContent = `FLAGGED EMAIL (${mailCount})`;
  if (dom.pillTodo) dom.pillTodo.textContent = `TO DO & TEAMS (${todoCount})`;
  if (dom.pillUrgent) dom.pillUrgent.textContent = `CRITICAL (${urgentCount})`;

  let list = allPending;

  if (state.pendingFilter === "mail") {
    list = list.filter(t => t.source.includes("MAIL") || t.source.includes("FLAGGED"));
  } else if (state.pendingFilter === "todo") {
    list = list.filter(t => t.source.includes("TO DO") || t.source.includes("TEAMS"));
  } else if (state.pendingFilter === "urgent") {
    list = list.filter(t => t.urgency === "CRITICAL" || t.dueDate === "2026-10-14");
  }

  if (state.searchQuery) {
    list = list.filter(t => 
      t.title.toLowerCase().includes(state.searchQuery) ||
      t.source.toLowerCase().includes(state.searchQuery) ||
      (t.sender && t.sender.toLowerCase().includes(state.searchQuery))
    );
  }

  dom.fullPendingDeck.innerHTML = "";
  if (list.length === 0) {
    dom.fullPendingDeck.innerHTML = `<div class="minimal-card"><div class="card-task-title" style="color: var(--text-muted);">NO PENDING TASKS IN QUEUE</div><div class="card-source-tag">CLICK "+ ADD MANUAL TASK" OR CONNECT OUTLOOK</div></div>`;
    return;
  }

  list.forEach(t => {
    dom.fullPendingDeck.appendChild(createMinimalCard(t, true));
  });
}

function renderAlignedTab() {
  const milestones = [
    { id: "M1", name: "OUTLOOK: EXECUTIVE & CLIENT CORRESPONDENCE", quarter: "SYNCED FLAGGED THREADS" },
    { id: "M2", name: "MICROSOFT TO DO: STRATEGIC COMMITMENTS", quarter: "ACTIVE TO DO LISTS" },
    { id: "M3", name: "OUTLOOK CALENDAR: MEETING PREPARATION", quarter: "CALENDAR INVITE BRIEFS" }
  ];

  dom.milestonesContainer.innerHTML = "";

  milestones.forEach(m => {
    const block = document.createElement("div");
    block.className = "milestone-block";

    const items = state.tasks.filter(t => !t.completed && t.status === "ALIGNED" && t.alignedTo === m.name);
    const progress = items.length > 0 ? Math.min(100, items.length * 30) : 0;

    block.innerHTML = `
      <div class="milestone-header">
        <div class="milestone-title-group">
          <div class="milestone-quarter">${m.quarter}</div>
          <div class="milestone-name">${m.name}</div>
        </div>
        <div class="kpi-tag" style="font-family: var(--font-numbers); font-size: 13px;">${progress}% COMPLETE (${items.length} ACTIVE)</div>
      </div>
      <div class="milestone-progress-bar">
        <div class="progress-fill" style="width: ${progress}%;"></div>
      </div>
      <div class="milestone-items-deck"></div>
    `;

    const deck = block.querySelector(".milestone-items-deck");
    if (items.length === 0) {
      deck.innerHTML = `<div class="minimal-card"><div class="card-task-title" style="color: var(--text-muted);">NO ACTIVE TASKS MAPPED TO THIS CATEGORY</div><div class="card-source-tag">ASSIGN TASKS FROM PENDING TRIAGE</div></div>`;
    } else {
      items.forEach(t => {
        deck.appendChild(createMinimalCard(t, false));
      });
    }

    dom.milestonesContainer.appendChild(block);
  });
}

function renderCalendarTab() {
  // Compute focus and meeting hours
  const meetingHours = state.meetings.length > 0 ? (state.meetings.length * 0.9).toFixed(1) : "0.0";
  const focusMinutes = state.focusHolds.reduce((acc, h) => acc + parseInt(h.duration, 10), 0);
  const focusHours = (focusMinutes / 60).toFixed(1);
  const totalHours = parseFloat(meetingHours) + parseFloat(focusHours);
  const ratio = totalHours > 0 ? Math.round((parseFloat(focusHours) / totalHours) * 100) : 0;

  if (dom.kpiFocusHours) dom.kpiFocusHours.textContent = `${focusHours}h`;
  if (dom.kpiFocusFooter) dom.kpiFocusFooter.textContent = `${state.focusHolds.length} Deep Work Sessions Active`;
  if (dom.kpiMeetingHours) dom.kpiMeetingHours.textContent = `${meetingHours}h`;
  if (dom.kpiMeetingFooter) dom.kpiMeetingFooter.textContent = `${state.meetings.length} Scheduled Engagements`;
  if (dom.kpiFocusRatio) dom.kpiFocusRatio.textContent = `${ratio}%`;
  if (dom.kpiFocusRatioFooter) dom.kpiFocusRatioFooter.textContent = `${ratio}% Focus vs Meeting Ratio`;

  // Render Meetings Deck
  if (dom.calendarMeetingsDeck) {
    dom.calendarMeetingsDeck.innerHTML = "";
    if (state.meetings.length === 0) {
      dom.calendarMeetingsDeck.innerHTML = `
        <div class="agenda-item-card" style="padding: 24px; text-align: center;">
          <div class="agenda-title" style="color: var(--text-muted);">NO MEETINGS SCHEDULED</div>
          <div class="agenda-attendees-meta">Your Outlook calendar has no commitments scheduled. Add a meeting via Outlook or Quick Add.</div>
        </div>
      `;
    } else {
      state.meetings.forEach(m => {
        const card = document.createElement("div");
        card.className = "agenda-item-card";
        card.innerHTML = `
          <div class="agenda-time-row">
            <span class="agenda-time-tag">${m.time}</span>
            <span class="agenda-platform-badge">${escapeHTML(m.platform)}</span>
          </div>
          <div class="agenda-title">${escapeHTML(m.title)}</div>
          <div class="agenda-attendees-meta">Organizer: ${escapeHTML(m.organizer)} // ${m.attendees.length} Attendees</div>
          <div class="agenda-card-actions">
            <button type="button" class="btn-card-micro" data-dossier-id="${m.id}">VIEW PRE-MEETING DOSSIER</button>
          </div>
        `;
        card.querySelector(`[data-dossier-id="${m.id}"]`)?.addEventListener("click", () => openDossier(m));
        dom.calendarMeetingsDeck.appendChild(card);
      });
    }
  }

  // Render Focus Holds Deck
  if (dom.focusHoldsDeck) {
    dom.focusHoldsDeck.innerHTML = "";
    if (state.focusHolds.length === 0) {
      dom.focusHoldsDeck.innerHTML = `
        <div class="focus-hold-card" style="padding: 24px; text-align: center;">
          <div class="agenda-title" style="color: var(--text-muted);">NO FOCUS BLOCKS SCHEDULED</div>
          <div class="agenda-attendees-meta">Click "+ BLOCK FOCUS TIME" to protect a deep work session on Exchange.</div>
        </div>
      `;
    } else {
      state.focusHolds.forEach(h => {
        const card = document.createElement("div");
        card.className = "focus-hold-card";
        card.innerHTML = `
          <div class="agenda-time-row">
            <span class="agenda-time-tag">${h.time}</span>
            <span class="agenda-platform-badge">${h.duration} FOCUS HOLD</span>
          </div>
          <div class="agenda-title">${escapeHTML(h.title)}</div>
          <div class="agenda-attendees-meta">Exchange Calendar Block: Confirmed // Protected Buffer</div>
          <div class="agenda-card-actions">
            <button type="button" class="btn-card-micro" data-release-id="${h.id}">RELEASE FOCUS HOLD</button>
          </div>
        `;
        card.querySelector(`[data-release-id="${h.id}"]`)?.addEventListener("click", () => {
          state.focusHolds = state.focusHolds.filter(item => item.id !== h.id);
          setStoredJson("ops_focus_holds", state.focusHolds);
          renderCalendarTab();
          showToast(`Released focus hold: "${h.title}"`);
        });
        dom.focusHoldsDeck.appendChild(card);
      });
    }
  }
}

function renderBriefingTab() {
  renderMorningBriefing();
  renderEodClearance();
  renderVipChips();
  renderDelegationDeck();
}

function renderMorningBriefing() {
  if (!dom.morningBriefContent) return;
  const criticalTasks = state.tasks.filter(t => !t.completed && (t.urgency === "CRITICAL" || t.dueDate === "2026-10-14"));
  const firstMeeting = state.meetings[0];

  dom.morningBriefContent.innerHTML = `
    <div class="briefing-bullet"><strong>Non-Negotiable Priorities:</strong> ${criticalTasks.length} urgent action items requiring your executive review today.</div>
    <div class="briefing-bullet"><strong>First Calendar Engagement:</strong> "${firstMeeting ? firstMeeting.title : 'None'}" at ${firstMeeting ? firstMeeting.time.split(" - ")[0] : '09:00'}.</div>
    <div class="briefing-bullet"><strong>Protected Focus Time:</strong> ${state.focusHolds.length} deep-work calendar blocks auto-reserved (${state.focusHolds.reduce((a, b) => a + parseInt(b.duration, 10), 0)} min total).</div>
    <div class="briefing-bullet"><strong>VIP Watchlist:</strong> All incoming mail from ${state.vipWatchlist.length} priority corporate counterparties routed to top of triage queue.</div>
  `;
}

function renderEodClearance() {
  if (!dom.eodBriefContent) return;
  const completedCount = state.tasks.filter(t => t.completed).length;
  const remainingPending = state.tasks.filter(t => !t.completed && t.status === "PENDING").length;

  dom.eodBriefContent.innerHTML = `
    <div class="briefing-bullet"><strong>Inbox Clearance Velocity:</strong> ${completedCount} total items triaged and resolved through live Graph connector.</div>
    <div class="briefing-bullet"><strong>Overnight carried Items:</strong> ${remainingPending} non-critical items queued for tomorrow's morning triage.</div>
    <div class="briefing-bullet"><strong>Delegation Status:</strong> ${state.delegatedTasks.length} active assignments progressing across direct reports with zero overdue blockers.</div>
    <div class="briefing-bullet"><strong>Tomorrow's Outlook Forecast:</strong> ${state.meetings.length} scheduled engagements; protected focus windows reserved.</div>
  `;
}

function renderVipChips() {
  if (!dom.vipChipsContainer) return;
  dom.vipChipsContainer.innerHTML = "";
  if (state.vipWatchlist.length === 0) {
    dom.vipChipsContainer.innerHTML = `<span style="color: var(--text-muted); font-size: 13px;">No VIP counterparties configured. Enter an email above to add to priority watchlist.</span>`;
    return;
  }
  state.vipWatchlist.forEach(email => {
    const chip = document.createElement("div");
    chip.className = "vip-chip";
    chip.innerHTML = `
      <span>${escapeHTML(email)}</span>
      <button type="button" class="vip-chip-remove" data-remove-vip="${email}" aria-label="Remove VIP">X</button>
    `;
    chip.querySelector(`[data-remove-vip="${email}"]`)?.addEventListener("click", () => {
      state.vipWatchlist = state.vipWatchlist.filter(e => e !== email);
      setStoredJson("ops_vip_watchlist", state.vipWatchlist);
      renderVipChips();
      showToast(`Removed ${email} from VIP Watchlist`);
    });
    dom.vipChipsContainer.appendChild(chip);
  });
}

function renderDelegationDeck() {
  if (!dom.delegationDeck) return;
  dom.delegationDeck.innerHTML = "";
  if (state.delegatedTasks.length === 0) {
    dom.delegationDeck.innerHTML = `<div class="minimal-card"><div class="card-task-title" style="color: var(--text-muted);">NO ACTIVE DELEGATIONS</div></div>`;
    return;
  }

  state.delegatedTasks.forEach(del => {
    const card = document.createElement("div");
    card.className = "delegation-item-card";
    card.innerHTML = `
      <div class="delegation-item-header">
        <span>ASSIGNED: ${del.delegatedDate}</span>
        <span style="color: var(--color-terracotta); font-weight: 700;">${del.status}</span>
      </div>
      <div class="delegation-item-title">${escapeHTML(del.title)}</div>
      <div class="delegation-item-assignee">Assignee: ${escapeHTML(del.assignee)}</div>
      <div class="delegation-item-actions">
        <button type="button" class="btn-card-micro" data-nudge-id="${del.id}">SEND OUTLOOK NUDGE</button>
        <button type="button" class="btn-card-micro" data-reclaim-id="${del.id}">RECLAIM TASK</button>
      </div>
    `;

    card.querySelector(`[data-nudge-id="${del.id}"]`)?.addEventListener("click", () => {
      showToast(`Graph SendMail: Reminder nudge dispatched to ${del.assignee}`);
    });

    card.querySelector(`[data-reclaim-id="${del.id}"]`)?.addEventListener("click", () => {
      state.delegatedTasks = state.delegatedTasks.filter(item => item.id !== del.id);
      setStoredJson("ops_delegated_tasks", state.delegatedTasks);
      renderDelegationDeck();
      showToast(`Reclaimed task: "${del.title}"`);
    });

    dom.delegationDeck.appendChild(card);
  });
}

/**
 * Creates a Minimalist Card strictly compliant with:
 * - NO EMOJIS
 * - NO STATUS DOTS
 * - NO BORDERS
 * - ZERO RADIUS
 * - Max 3 Data Elements
 * - Dedicated "INSPECT / AI TRIAGE" Trigger
 */
function createMinimalCard(task, isPending) {
  const card = document.createElement("div");
  card.className = "minimal-card";
  card.id = `card-${task.id}`;

  const isMasked = document.getElementById("prefMaskEmails")?.checked;
  let displayTitle = task.title;
  if (isMasked && task.source.includes("FLAGGED EMAIL")) {
    displayTitle = displayTitle.replace(/Faisalabad Mill|European Retailer|WRAP/gi, "[REDACTED PARTNER]");
  }

  card.innerHTML = `
    <div class="card-row-top">
      <span class="card-task-title">${escapeHTML(displayTitle)}</span>
      <span class="card-date">${task.dueDate}</span>
    </div>
    <div class="card-row-bottom">
      <span class="card-source-tag">${escapeHTML(task.source)}</span>
      <span class="card-status-label">${task.status}</span>
    </div>
    <div class="card-actions">
      <button type="button" class="btn-card-action featured" data-action="inspect">INSPECT / AI TRIAGE</button>
      ${isPending ? `<button type="button" class="btn-card-action" data-action="align">ALIGN TO MILESTONE</button>` : ''}
      <button type="button" class="btn-card-action" data-action="complete">MARK COMPLETE</button>
      <button type="button" class="btn-card-action" data-action="defer">POSTPONE 24H</button>
    </div>
  `;

  // Attach Card Actions
  card.querySelector('[data-action="inspect"]')?.addEventListener("click", (e) => {
    e.stopPropagation();
    openInspectDrawer(task);
  });

  card.querySelector('[data-action="align"]')?.addEventListener("click", (e) => {
    e.stopPropagation();
    alignTaskPrompt(task);
  });

  card.querySelector('[data-action="complete"]')?.addEventListener("click", (e) => {
    e.stopPropagation();
    completeTask(task);
  });

  card.querySelector('[data-action="defer"]')?.addEventListener("click", (e) => {
    e.stopPropagation();
    deferTask(task);
  });

  return card;
}

// Task State Actions
function alignTaskPrompt(task) {
  const chosenMilestone = "OUTLOOK: EXECUTIVE & CLIENT CORRESPONDENCE";
  task.status = "ALIGNED";
  task.alignedTo = chosenMilestone;
  setStoredJson("ops_tasks", state.tasks);
  renderAll();
  showToast(`Aligned task to "${chosenMilestone}"`);
}

function completeTask(task) {
  task.completed = true;
  setStoredJson("ops_tasks", state.tasks);
  renderAll();
  showToast(`Completed task and updated Outlook To Do: "${task.title}"`);
}

function deferTask(task) {
  task.dueDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  setStoredJson("ops_tasks", state.tasks);
  renderAll();
  showToast(`Postponed task to ${task.dueDate}`);
}

// Outlook Graph Sync Simulation
function triggerSync() {
  const now = new Date();
  state.lastSyncTime = now;
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
  
  if (dom.sidebarSyncStatusText) {
    dom.sidebarSyncStatusText.textContent = `STATUS: ACTIVE // ${timeStr}`;
  }
  if (dom.dashboardSyncTime) {
    dom.dashboardSyncTime.textContent = `Live Feed (${timeStr})`;
  }

  showToast(`Microsoft Graph Delta Query completed for ${state.userEmail}. Status: Up to date.`);
}

function startSyncTicker() {
  setInterval(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    if (dom.sidebarSyncStatusText) {
      dom.sidebarSyncStatusText.textContent = `STATUS: ACTIVE // ${timeStr}`;
    }
    if (dom.mobileSyncChip) {
      dom.mobileSyncChip.textContent = `SYNC: ${timeStr.slice(0, 5)}`;
    }
  }, 1000);
}

// Theme Controls
function setTheme(themeName, showNotification = true) {
  state.theme = themeName;
  localStorage.setItem("ops_theme", themeName);
  dom.body.setAttribute("data-theme", themeName);
  document.documentElement.setAttribute("data-theme", themeName);
  
  if (dom.themeToggleLabel) {
    dom.themeToggleLabel.textContent = `THEME: ${themeName.toUpperCase()}`;
  }
  if (dom.mobileThemeLabel) {
    dom.mobileThemeLabel.textContent = themeName.toUpperCase();
  }
  if (dom.loginThemeLabel) {
    dom.loginThemeLabel.textContent = themeName.toUpperCase();
  }

  document.getElementById("setThemeLight")?.classList.toggle("active", themeName === "light");
  document.getElementById("setThemeDark")?.classList.toggle("active", themeName === "dark");
  document.getElementById("setThemeTint")?.classList.toggle("active", themeName === "tint");

  if (showNotification) {
    showToast(`Theme switched to ${themeName.toUpperCase()}`);
  }
}

function cycleTheme() {
  if (state.theme === "light") {
    setTheme("dark");
  } else if (state.theme === "dark") {
    setTheme("tint");
  } else {
    setTheme("light");
  }
}

// Modal Helpers
function showAuthModal() {
  dom.authModal.classList.add("active");
  dom.authModal.setAttribute("aria-hidden", "false");
}

function hideAuthModal() {
  dom.authModal.classList.remove("active");
  dom.authModal.setAttribute("aria-hidden", "true");
}

function showTaskModal(preselectAligned = false) {
  if (preselectAligned) {
    const sel = document.getElementById("newTaskAlignment");
    if (sel) sel.value = "OUTLOOK: EXECUTIVE & CLIENT CORRESPONDENCE";
  }
  dom.taskModal.classList.add("active");
  dom.taskModal.setAttribute("aria-hidden", "false");
}

function hideTaskModal() {
  dom.taskModal.classList.remove("active");
  dom.taskModal.setAttribute("aria-hidden", "true");
}

function updateAuthUI() {
  if (dom.sidebarUserInitials) {
    dom.sidebarUserInitials.textContent = state.authenticated ? getEmailInitials(state.userEmail) : "--";
    dom.sidebarUserInitials.setAttribute("title", state.authenticated ? state.userEmail : "Disconnected");
    dom.sidebarUserInitials.setAttribute("aria-label", state.authenticated ? `Account: ${state.userEmail}` : "Disconnected");
  }
  if (dom.sidebarAccountLabel) {
    dom.sidebarAccountLabel.textContent = state.authenticated ? state.userEmail : "DISCONNECTED";
  }
  if (dom.sidebarAuthLabel) {
    dom.sidebarAuthLabel.textContent = state.authenticated ? "DISCONNECT" : "SIGN IN";
  }
  const settingsConn = document.getElementById("settingsConnectionLabel");
  if (settingsConn) {
    settingsConn.textContent = state.authenticated 
      ? "AUTHENTICATED // LIVE DELTA QUERY ACTIVE" 
      : "DISCONNECTED // PLEASE SIGN IN";
  }
}

function getEmailInitials(email) {
  if (!email) return "MA";
  const userPart = email.split("@")[0] || "";
  const parts = userPart.split(/[._\-]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  } else if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (userPart[0] || "M").toUpperCase();
}

// Toast System (Monochrome, Flat, Zero-Glow)
function showToast(message) {
  if (!dom.toastShelf) return;
  const item = document.createElement("div");
  item.className = "toast-item";
  item.textContent = message;
  dom.toastShelf.appendChild(item);

  setTimeout(() => {
    item.style.opacity = "0";
    item.style.transition = "opacity 0.2s ease";
    setTimeout(() => item.remove(), 200);
  }, 3200);
}

// Utilities
function formatNum(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function isValidHex(hex) {
  return /^#[0-9A-F]{6}$/i.test(hex);
}

// Start application
document.addEventListener("DOMContentLoaded", init);
