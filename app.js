const DEFAULT_HE_CLASSES = [
    { id: "he-db", owner: "he", name: "Base de Datos G01", code: "SIST0008-G01", professor: "HERRERA BEDOYA OSCAR ELIAS", color: "sky", sessions: [{ day: 1, start: "07:00", end: "09:00", room: "Sala de Sistemas F404" }, { day: 3, start: "07:00", end: "09:00", room: "Sala de Sistemas F404" }, { day: 5, start: "07:00", end: "09:00", room: "Sala de Sistemas F404" }] },
    { id: "he-prog", owner: "he", name: "Leng. de Prog. y Transducción G02", code: "PCIA5007-G02", professor: "SANCHEZ CIFUENTES JOAQUIN FERNANDO", color: "amber", sessions: [{ day: 2, start: "07:00", end: "09:00", room: "Salón F603" }, { day: 4, start: "07:00", end: "09:00", room: "Sala de Sistemas F404" }] },
    { id: "he-cienc", owner: "he", name: "Cienc. Computacional Avanzada G02", color: "purple", code: "PCIA5005-G02", professor: "ZAMBRANO LUNA BRIAN ANDRES", sessions: [{ day: 3, start: "09:00", end: "11:00", room: "Salón F601" }, { day: 5, start: "09:00", end: "11:00", room: "Salón F601" }] },
    { id: "he-hist", owner: "he", name: "Electiva 1 - Historia G01", code: "HUMB0003-G01", professor: "GOMEZ CASABIANCA LUIS HENRIQUE", color: "rose", sessions: [{ day: 2, start: "11:00", end: "13:00", room: "Salón A204" }] },
    { id: "he-intel", owner: "he", name: "Opt 14 Sistemas Inteligentes G01", code: "PCIA5041-G01", professor: "FONSECA PERDOMO RICARDO ANDRES", color: "emerald", sessions: [{ day: 2, start: "14:00", end: "16:00", room: "Salón F602" }, { day: 4, start: "14:00", end: "16:00", room: "Sala de Sistemas F403" }] },
    { id: "he-so", owner: "he", name: "Sistemas Operativos G02", code: "PCIA5046-G02", professor: "MENDEZ AGUILERA IVAN DARIO", color: "indigo", sessions: [{ day: 4, start: "16:00", end: "18:00", room: "Laboratorio de Comunicaciones B201" }] }
];

const DEFAULT_SHE_CLASSES = [
    { id: "she-ger", owner: "she", name: "Gerencia Aeronáutica", code: "GER401", professor: "Por asignar", color: "pink", sessions: [{ day: 1, start: "12:00", end: "15:00", room: "Salón 101" }] },
    { id: "she-com", owner: "she", name: "Combustibles y Lubricantes", code: "COM401", professor: "Por asignar", color: "amber", sessions: [{ day: 2, start: "12:00", end: "14:00", room: "Salón 103" }] },
    { id: "she-mat", owner: "she", name: "Cálculo Multivariado", code: "MAT501", professor: "Por asignar", color: "purple", sessions: [{ day: 2, start: "14:00", end: "17:00", room: "Salón 103" }] },
    { id: "she-con", owner: "she", name: "Confiabilidad", code: "CON401", professor: "Por asignar", color: "sky", sessions: [{ day: 3, start: "13:00", end: "16:00", room: "Salón 203" }] },
    { id: "she-mec", owner: "she", name: "Mecánica de Fluidos", code: "MEC401", professor: "Por asignar", color: "indigo", sessions: [{ day: 4, start: "13:00", end: "15:00", room: "Salón 102" }] },
    { id: "she-int", owner: "she", name: "Inglés Técnico I", code: "INT401", professor: "Por asignar", color: "rose", sessions: [{ day: 5, start: "13:00", end: "15:00", room: "Salón 101" }] },
    { id: "she-ele", owner: "she", name: "Electrónica", code: "ELE401", professor: "Por asignar", color: "emerald", sessions: [{ day: 5, start: "15:00", end: "18:00", room: "Salón 203" }] }
];

const DEFAULT_LOVE_NOTES = [
    { id: "note-1", sender: "he", color: "pink", content: "¡Hola mi amor! Te dejé la app lista para que veas mi horario con profesores y el tuyo ❤️", date: Date.now() },
    { id: "note-2", sender: "she", color: "yellow", content: "¡Me encanta el tema de Chiikawa! Nos vemos a las 3pm en el salón 101 🥰", date: Date.now() }
];

const DEFAULT_TASKS = [
    { id: "task-1", assigned: "both", name: "Estudiar juntos los martes a las 17:00", dueDate: "2026-08-04", priority: "high", completed: false },
    { id: "task-2", assigned: "he", name: "Taller 3 de Base de Datos", dueDate: "2026-08-05", priority: "medium", completed: false },
    { id: "task-3", assigned: "she", name: "Taller de Cálculo Multivariado", dueDate: "2026-08-06", priority: "high", completed: false }
];

let HE_CLASSES = [];
let SHE_CLASSES = [];
let currentlySelectedClassObj = null;

const DAYS_MAP = { 1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes" };
const MIN_HOUR = 7;
const MAX_HOUR = 20;
const HOUR_HEIGHT = 60;

// Dynamic relative date formatter: evaluates "Hoy", "Ayer", "Hace X días", or DD/MM/YYYY
function formatRelativeDate(timestamp) {
    if (typeof timestamp === "string") return timestamp;
    const now = new Date();
    const noteDate = new Date(timestamp);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const noteDay = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate());
    const diffDays = Math.round((today - noteDay) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays >= 2 && diffDays <= 6) return `Hace ${diffDays} días`;
    const dd = String(noteDate.getDate()).padStart(2, "0");
    const mm = String(noteDate.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}/${noteDate.getFullYear()}`;
}

// Migrate legacy notes with string dates to numeric timestamps
function migrateNoteDates(notes) {
    notes.forEach(n => {
        if (typeof n.date === "string") {
            const idTs = parseInt((n.id || "").replace("note-", ""));
            n.date = (idTs && idTs > 1000000000) ? idTs : Date.now();
        }
    });
}

// Application Global State
let activeTab = "horarios";
let currentScheduleView = "he"; // 'he' | 'she' | 'match'
let currentTheme = "pink"; // 'pink' | 'white' | 'dark'
let currentMobileDay = 1;
let loveNotes = [];
let duoTasks = [];
let attendance = {};
let currentTaskFilter = "all";
let currentAttendanceOwner = "he";
let syncPin = "";

// DOM Elements
const gridBody = document.getElementById("grid-body-schedule");
const subtabBtns = document.querySelectorAll(".subtab-btn");
const tabViews = document.querySelectorAll(".tab-view");
const sidebarNavBtns = document.querySelectorAll(".sidebar-nav .tab-trigger");
const bottomNavBtns = document.querySelectorAll(".bottom-nav-btn");
const matchPanel = document.getElementById("match-free-hours-panel");
const matchSlotsList = document.getElementById("match-slots-list");
const loveNotesBoard = document.getElementById("love-notes-board");
const tasksListContainer = document.getElementById("tasks-list");
const attendanceTrackerList = document.getElementById("attendance-tracker-list");
const toast = document.getElementById("toast");
const MASTER_BLOB_ID = "019fc020-630f-7040-ae70-d6f6c30908ef";
const DEFAULT_BLOB_URL = `https://jsonblob.com/api/jsonBlob/${MASTER_BLOB_ID}`;
// Force all devices (PC, iPhone, Android) to connect to the master couple room endpoint
let CLOUD_SYNC_URL = DEFAULT_BLOB_URL;
localStorage.setItem("duo_cloud_url", CLOUD_SYNC_URL);

let isPushing = false;
let isPushingTimer = null;
let syncIntervalId = null;
let syncBackoffMs = 2000;
const SYNC_BASE_MS = 2000;
const SYNC_MAX_MS = 10000;
const FETCH_TIMEOUT_MS = 8000;
const PUSH_SAFETY_TIMEOUT_MS = 8000;

// Simple string snapshot of what we last saw from cloud, to detect changes
let lastCloudSnapshot = "";
let lastPushTimestamp = 0;
let pushCooldownUntil = 0;

// Setup BroadcastChannel for instant same-device cross-tab realtime sync
let syncChannel = null;
try {
    syncChannel = new BroadcastChannel("academiq_duo_live_sync");
    syncChannel.onmessage = (e) => {
        if (e.data && e.data.type === "data_updated") {
            // Reload from localStorage (the other tab already saved there)
            loadFromLocalStorage();
            renderCurrentSchedule();
            renderTasks();
            renderAttendance();
            renderLoveNotes();
        }
    };
} catch(e) {}

// Auto link sync URL if query string contains ?sync=BLOB_ID
function checkUrlSyncParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const syncParam = urlParams.get("sync") || urlParams.get("code");
    if (syncParam) {
        let targetUrl = syncParam;
        if (!targetUrl.startsWith("http")) {
            targetUrl = `https://jsonblob.com/api/jsonBlob/${syncParam}`;
        }
        CLOUD_SYNC_URL = targetUrl;
        localStorage.setItem("duo_cloud_url", CLOUD_SYNC_URL);
        try {
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch(e) {}
        setTimeout(() => showToast("¡Conectado al espacio de tu pareja! 💖"), 800);
    }
}

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    checkUrlSyncParams();
    registerServiceWorker();
    loadTheme();
    loadFromLocalStorage();
    setupTabNavigation();
    setupThemeSwitchers();
    setupScheduleSubtabs();
    setupMobileDaySelector();
    setupSyncPin();
    setupEventListeners();
    setupClassEditor();
    updateHeaderDate();
    scheduleMidnightRefresh();

    // Initial render
    renderCurrentSchedule();
    renderTasks();
    renderAttendance();
    renderLoveNotes();

    // Start sync AFTER first render
    pullFromCloud();
    setupSyncLifecycle();
    
    window.addEventListener("resize", renderCurrentSchedule);
    setInterval(renderCurrentTimeIndicator, 60000);
});

function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("service-worker.js?v=31.0", { updateViaCache: 'none' }).then(reg => {
            reg.update();
        }).catch(() => {});
    }
}

// Theme Switcher Logic (3 Themes: pink, white, dark)
function loadTheme() {
    const savedTheme = localStorage.getItem("duo_theme") || "pink";
    setTheme(savedTheme);
}

function setTheme(themeName) {
    currentTheme = themeName;
    document.body.className = `theme-${themeName}`;
    localStorage.setItem("duo_theme", themeName);

    // Update active state in theme buttons
    document.querySelectorAll(".btn-theme-select").forEach(btn => {
        if (btn.dataset.theme === themeName) btn.classList.add("active");
        else btn.classList.remove("active");
    });

    const mobileSelect = document.getElementById("select-theme-mobile");
    if (mobileSelect) mobileSelect.value = themeName;
}

function setupThemeSwitchers() {
    document.querySelectorAll(".btn-theme-select").forEach(btn => {
        btn.addEventListener("click", () => setTheme(btn.dataset.theme));
    });

    const mobileSelect = document.getElementById("select-theme-mobile");
    if (mobileSelect) {
        mobileSelect.addEventListener("change", (e) => setTheme(e.target.value));
    }
}

// Fetch helper with AbortController timeout
function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT_MS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { ...options, signal: controller.signal })
        .finally(() => clearTimeout(timer));
}

// Auto-heal cloud storage if blob is missing or expired (404)
async function recreateCloudBlob() {
    try {
        const payload = {
            heClasses: HE_CLASSES,
            sheClasses: SHE_CLASSES,
            notes: loveNotes,
            tasks: duoTasks,
            attendance: attendance,
            lastUpdated: Date.now()
        };
        const res = await fetchWithTimeout("https://jsonblob.com/api/jsonBlob", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const blobId = res.headers.get("x-jsonblob-id");
        const locationHeader = res.headers.get("Location") || res.headers.get("location");

        if (blobId) {
            CLOUD_SYNC_URL = `https://jsonblob.com/api/jsonBlob/${blobId}`;
            localStorage.setItem("duo_cloud_url", CLOUD_SYNC_URL);
            updateSyncBadge(true);
            return true;
        } else if (locationHeader) {
            CLOUD_SYNC_URL = locationHeader.startsWith("http") ? locationHeader : `https://jsonblob.com${locationHeader}`;
            localStorage.setItem("duo_cloud_url", CLOUD_SYNC_URL);
            updateSyncBadge(true);
            return true;
        }
    } catch(e) {
        console.error("Auto-heal blob failed:", e);
    }
    return false;
}

// Load state from localStorage only (no cloud)
function loadFromLocalStorage() {
    const savedHe = localStorage.getItem("duo_he_classes");
    if (savedHe) {
        try { HE_CLASSES = JSON.parse(savedHe); } catch(e) { HE_CLASSES = JSON.parse(JSON.stringify(DEFAULT_HE_CLASSES)); }
    } else {
        HE_CLASSES = JSON.parse(JSON.stringify(DEFAULT_HE_CLASSES));
    }

    const savedShe = localStorage.getItem("duo_she_classes");
    if (savedShe) {
        try { SHE_CLASSES = JSON.parse(savedShe); } catch(e) { SHE_CLASSES = JSON.parse(JSON.stringify(DEFAULT_SHE_CLASSES)); }
    } else {
        SHE_CLASSES = JSON.parse(JSON.stringify(DEFAULT_SHE_CLASSES));
    }

    const savedNotes = localStorage.getItem("duo_love_notes");
    if (savedNotes) {
        try { loveNotes = JSON.parse(savedNotes); } catch(e) { loveNotes = JSON.parse(JSON.stringify(DEFAULT_LOVE_NOTES)); }
    } else {
        loveNotes = JSON.parse(JSON.stringify(DEFAULT_LOVE_NOTES));
    }
    migrateNoteDates(loveNotes);

    const savedTasks = localStorage.getItem("duo_tasks");
    if (savedTasks) {
        try { duoTasks = JSON.parse(savedTasks); } catch(e) { duoTasks = JSON.parse(JSON.stringify(DEFAULT_TASKS)); }
    } else {
        duoTasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
    }

    const savedAttendance = localStorage.getItem("duo_attendance");
    if (savedAttendance) {
        try { attendance = JSON.parse(savedAttendance); } catch(e) { attendance = {}; }
    } else {
        attendance = {};
    }

    [...HE_CLASSES, ...SHE_CLASSES].forEach(c => {
        if (!attendance[c.id]) {
            attendance[c.id] = { present: 0, absent: 0 };
        }
    });
}

function saveToLocalStorage() {
    localStorage.setItem("duo_he_classes", JSON.stringify(HE_CLASSES));
    localStorage.setItem("duo_she_classes", JSON.stringify(SHE_CLASSES));
    localStorage.setItem("duo_love_notes", JSON.stringify(loveNotes));
    localStorage.setItem("duo_tasks", JSON.stringify(duoTasks));
    localStorage.setItem("duo_attendance", JSON.stringify(attendance));

    // Notify other tabs on same device
    try {
        if (syncChannel) syncChannel.postMessage({ type: "data_updated" });
    } catch(e) {}
}

function pushToCloud() {
    saveToLocalStorage();
    isPushing = true;

    clearTimeout(isPushingTimer);
    isPushingTimer = setTimeout(() => { isPushing = false; }, PUSH_SAFETY_TIMEOUT_MS);

    const payload = {
        heClasses: HE_CLASSES,
        sheClasses: SHE_CLASSES,
        notes: loveNotes,
        tasks: duoTasks,
        attendance: attendance,
        lastUpdated: Date.now()
    };

    lastCloudSnapshot = JSON.stringify(payload.heClasses) + JSON.stringify(payload.sheClasses) + 
                        JSON.stringify(payload.notes) + JSON.stringify(payload.tasks) + 
                        JSON.stringify(payload.attendance);

    fetchWithTimeout(CLOUD_SYNC_URL, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(async res => {
        if (res.status === 404) {
            const healed = await recreateCloudBlob();
            if (healed) return pushToCloud();
        }
        if (!res.ok) throw new Error(`Push failed: ${res.status}`);
        isPushing = false;
        clearTimeout(isPushingTimer);
        syncBackoffMs = SYNC_BASE_MS;
        updateSyncBadge(true);
    }).catch((err) => {
        isPushing = false;
        clearTimeout(isPushingTimer);
        updateSyncBadge(false);
    });
}

function pullFromCloud() {
    if (isPushing) {
        scheduleSyncPoll();
        return;
    }

    fetchWithTimeout(CLOUD_SYNC_URL, {
        headers: { 
            "Accept": "application/json"
        }
    })
        .then(async res => {
            if (res.status === 404) {
                await recreateCloudBlob();
                throw new Error("Blob recreated");
            }
            if (!res.ok) throw new Error(`Pull failed: ${res.status}`);
            return res.json();
        })
        .then(cloud => {
            if (!cloud || typeof cloud !== "object") {
                scheduleSyncPoll();
                return;
            }

            const snapshot = JSON.stringify(cloud.heClasses || []) + JSON.stringify(cloud.sheClasses || []) + 
                            JSON.stringify(cloud.notes || []) + JSON.stringify(cloud.tasks || []) + 
                            JSON.stringify(cloud.attendance || {});

            if (snapshot !== lastCloudSnapshot) {
                lastCloudSnapshot = snapshot;

                if (Array.isArray(cloud.heClasses) && cloud.heClasses.length > 0) HE_CLASSES = cloud.heClasses;
                if (Array.isArray(cloud.sheClasses) && cloud.sheClasses.length > 0) SHE_CLASSES = cloud.sheClasses;
                if (Array.isArray(cloud.notes)) loveNotes = cloud.notes;
                if (Array.isArray(cloud.tasks)) duoTasks = cloud.tasks;
                if (cloud.attendance && typeof cloud.attendance === "object") attendance = cloud.attendance;

                migrateNoteDates(loveNotes);
                saveToLocalStorage();

                renderCurrentSchedule();
                renderTasks();
                renderAttendance();
                renderLoveNotes();
                try { updateQuickWidgets(); } catch(e) {}
            }

            syncBackoffMs = SYNC_BASE_MS;
            updateSyncBadge(true);
            scheduleSyncPoll();
        })
        .catch((err) => {
            syncBackoffMs = Math.min(syncBackoffMs * 1.5, SYNC_MAX_MS);
            updateSyncBadge(false);
            scheduleSyncPoll();
        });
}

// Adaptive polling with fast interval
function scheduleSyncPoll() {
    clearTimeout(syncIntervalId);
    syncIntervalId = setTimeout(pullFromCloud, syncBackoffMs);
}

// Lifecycle-aware sync: handles tab visibility, focus, online/offline
function setupSyncLifecycle() {
    scheduleSyncPoll();

    const triggerImmediatePull = () => {
        syncBackoffMs = SYNC_BASE_MS;
        clearTimeout(syncIntervalId);
        pullFromCloud();
    };

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            triggerImmediatePull();
            updateHeaderDate();
        }
    });

    window.addEventListener("focus", triggerImmediatePull);

    window.addEventListener("online", () => {
        triggerImmediatePull();
        updateSyncBadge(true);
    });

    window.addEventListener("offline", () => {
        clearTimeout(syncIntervalId);
        updateSyncBadge(false);
    });
}

// Navigation between Tabs
function setupTabNavigation() {
    function changeTab(tabId) {
        activeTab = tabId;
        
        tabViews.forEach(view => {
            if (view.id === `view-${tabId}`) {
                view.classList.remove("hidden");
                view.classList.add("active");
            } else {
                view.classList.add("hidden");
                view.classList.remove("active");
            }
        });

        bottomNavBtns.forEach(btn => {
            if (btn.dataset.tab === tabId) btn.classList.add("active");
            else btn.classList.remove("active");
        });

        sidebarNavBtns.forEach(btn => {
            if (btn.dataset.tab === tabId) btn.classList.add("active");
            else btn.classList.remove("active");
        });

        // Trigger view renders
        if (tabId === "horarios") renderCurrentSchedule();
        if (tabId === "tareas") renderTasks();
        if (tabId === "asistencias") renderAttendance();
        if (tabId === "rincon") renderLoveNotes();
    }

    bottomNavBtns.forEach(btn => btn.addEventListener("click", () => changeTab(btn.dataset.tab)));
    sidebarNavBtns.forEach(btn => btn.addEventListener("click", () => changeTab(btn.dataset.tab)));
}

// Schedule Subtabs (Él vs Ella)
function setupScheduleSubtabs() {
    subtabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            subtabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentScheduleView = btn.dataset.schedule;
            renderCurrentSchedule();
        });
    });
}

// Mobile Day Selector for grid
function setupMobileDaySelector() {
    const buttons = document.querySelectorAll(".mobile-day-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentMobileDay = btn.dataset.day === "all" ? "all" : parseInt(btn.dataset.day);
            renderMobileView();
        });
    });

    const now = new Date();
    const today = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const initialDay = (today >= 1 && today <= 5) ? today : 1;
    currentMobileDay = initialDay;

    const initialBtn = document.querySelector(`.mobile-day-btn[data-day="${initialDay}"]`);
    if (initialBtn) {
        buttons.forEach(b => b.classList.remove("active"));
        initialBtn.classList.add("active");
    }
}

function renderMobileView() {
    const isMobileView = window.innerWidth <= 1024 || ('ontouchstart' in window && window.innerWidth <= 1024);
    
    let mobileAgendaContainer = document.getElementById("mobile-agenda-list-view");
    const desktopGrid = document.getElementById("schedule-grid-couple");

    if (!isMobileView) {
        if (mobileAgendaContainer) mobileAgendaContainer.style.display = "none";
        if (desktopGrid) desktopGrid.style.display = "grid";
        return;
    }

    // Highlight active button in day selector
    document.querySelectorAll(".mobile-day-btn").forEach(btn => {
        if ((btn.dataset.day === "all" && currentMobileDay === "all") || (parseInt(btn.dataset.day) === currentMobileDay)) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    if (currentMobileDay === "all") {
        // MODE 1: Clean List Agenda View (Reference Screenshot 2)
        if (desktopGrid) desktopGrid.style.display = "none";

        if (!mobileAgendaContainer) {
            mobileAgendaContainer = document.createElement("div");
            mobileAgendaContainer.id = "mobile-agenda-list-view";
            mobileAgendaContainer.className = "mobile-agenda-container";
            const wrapper = document.getElementById("schedule-wrapper-element");
            if (wrapper) wrapper.appendChild(mobileAgendaContainer);
        }
        mobileAgendaContainer.style.display = "flex";
        mobileAgendaContainer.innerHTML = "";

        const activeList = currentScheduleView === "he" ? HE_CLASSES : SHE_CLASSES;

        [1, 2, 3, 4, 5].forEach(dayNum => {
            const daySessions = [];
            activeList.forEach(c => {
                c.sessions.forEach(s => {
                    if (s.day === dayNum) {
                        daySessions.push({ classObj: c, session: s });
                    }
                });
            });

            daySessions.sort((a, b) => timeToDecimal(a.session.start) - timeToDecimal(b.session.start));

            const dayHeader = document.createElement("div");
            dayHeader.className = "mobile-day-header-title";
            dayHeader.innerHTML = `<span class="day-dot">●</span> <span>${DAYS_MAP[dayNum].toUpperCase()}</span>`;
            mobileAgendaContainer.appendChild(dayHeader);

            if (daySessions.length === 0) {
                const emptyEl = document.createElement("div");
                emptyEl.className = "mobile-empty-day";
                emptyEl.textContent = "Sin clases este día 🎉";
                mobileAgendaContainer.appendChild(emptyEl);
            } else {
                daySessions.forEach(({ classObj, session }) => {
                    const card = document.createElement("div");
                    card.className = `mobile-agenda-card color-${classObj.color} owner-${classObj.owner}`;
                    card.innerHTML = `
                        <div class="mobile-card-accent-bar"></div>
                        <div class="mobile-card-time">
                            <span class="start-time">${session.start}</span>
                            <span class="end-time">${session.end}</span>
                        </div>
                        <div class="mobile-card-info">
                            <h4 class="mobile-card-title">${classObj.name}</h4>
                            <span class="mobile-card-room">Salón: ${session.room}</span>
                            ${classObj.professor ? `<span class="mobile-card-prof">${classObj.professor}</span>` : ''}
                        </div>
                        <div class="mobile-card-code">${classObj.code}</div>
                    `;
                    card.addEventListener("click", () => openDetailsModal(classObj, session));
                    mobileAgendaContainer.appendChild(card);
                });
            }
        });
    } else {
        // MODE 2: Timetable Grid View (L, M, M, J, V with Hours & Grid Slots)
        if (mobileAgendaContainer) mobileAgendaContainer.style.display = "none";
        if (desktopGrid) desktopGrid.style.display = "grid";
        if (gridBody) gridBody.style.height = "780px";

        if (!currentMobileDay || currentMobileDay < 1 || currentMobileDay > 5) {
            currentMobileDay = 1;
        }

        document.querySelectorAll(".day-header").forEach(h => {
            if (parseInt(h.dataset.day) === currentMobileDay) {
                h.classList.add("active-mobile-day");
                h.style.display = "block";
                h.style.gridColumn = "2";
            } else {
                h.classList.remove("active-mobile-day");
                h.style.display = "none";
            }
        });

        document.querySelectorAll(".class-card").forEach(card => {
            const cardDay = parseInt(card.dataset.day);
            const sh = parseFloat(card.dataset.sh || "7");
            const eh = parseFloat(card.dataset.eh || "8");

            const topPos = (sh - MIN_HOUR) * HOUR_HEIGHT + 4;
            const heightPos = (eh - sh) * HOUR_HEIGHT - 8;

            if (cardDay === currentMobileDay) {
                card.classList.remove("hidden");
                card.style.display = "flex";
                card.style.position = "absolute";
                card.style.top = `${topPos}px`;
                card.style.height = `${heightPos}px`;
                card.style.left = "calc(70px + 4px)";
                card.style.width = "calc(100% - 70px - 8px)";
            } else {
                card.classList.add("hidden");
                card.style.display = "none";
            }
        });
    }
}

// Render Schedule Grid
function renderCurrentSchedule() {
    if (!gridBody) return;
    gridBody.innerHTML = "";

    const activeClassList = currentScheduleView === "he" ? HE_CLASSES : SHE_CLASSES;

    // 1. Draw Hour Row Background lines
    for (let h = MIN_HOUR; h <= MAX_HOUR; h++) {
        const row = document.createElement("div");
        row.className = "grid-hour-row";
        row.style.top = `${(h - MIN_HOUR) * HOUR_HEIGHT}px`;
        
        const label = document.createElement("div");
        label.className = "grid-hour-label";
        label.textContent = `${String(h).padStart(2, "0")}:00`;
        
        row.appendChild(label);
        gridBody.appendChild(row);
    }

    // 2. Vertical day lines
    for (let idx = 0; idx < 5; idx++) {
        const colLine = document.createElement("div");
        colLine.className = "grid-day-col-line";
        colLine.style.left = `calc(70px + ((100% - 70px) / 5) * ${idx})`;
        colLine.style.width = `calc((100% - 70px) / 5)`;
        gridBody.appendChild(colLine);
    }

    // 3. Render Class Blocks
    activeClassList.forEach(classObj => {
        classObj.sessions.forEach(session => {
            const card = document.createElement("div");
            card.className = `class-card color-${classObj.color} owner-${classObj.owner}`;
            card.dataset.id = classObj.id;
            card.dataset.day = session.day;
            
            const sh = timeToDecimal(session.start);
            const eh = timeToDecimal(session.end);
            card.dataset.sh = sh;
            card.dataset.eh = eh;
            
            const nameEl = document.createElement("div");
            nameEl.className = "class-name";
            nameEl.textContent = classObj.name;
            
            const roomEl = document.createElement("div");
            roomEl.className = "class-details";
            roomEl.textContent = `Salón: ${session.room}`;

            card.appendChild(nameEl);
            card.appendChild(roomEl);

            if (classObj.professor) {
                const profEl = document.createElement("div");
                profEl.className = "class-prof";
                profEl.textContent = classObj.professor;
                card.appendChild(profEl);
            }
            
            const timeEl = document.createElement("div");
            timeEl.className = "class-time";
            timeEl.textContent = `${session.start} - ${session.end}`;
            card.appendChild(timeEl);
            
            if (sh >= MIN_HOUR && eh <= MAX_HOUR + 1) {
                const topPos = (sh - MIN_HOUR) * HOUR_HEIGHT + 4;
                const heightPos = (eh - sh) * HOUR_HEIGHT - 8;
                const colIdx = session.day - 1;
                
                card.style.top = `${topPos}px`;
                card.style.height = `${heightPos}px`;
                card.style.left = `calc(70px + ((100% - 70px) / 5) * ${colIdx} + 4px)`;
                card.style.width = `calc(((100% - 70px) / 5) - 8px)`;
                
                card.addEventListener("click", () => openDetailsModal(classObj, session));
                gridBody.appendChild(card);
            }
        });
    });

    // 4. Highlight Today's Column Header
    const todayDay = new Date().getDay();
    document.querySelectorAll(".day-header").forEach(h => {
        const d = parseInt(h.dataset.day);
        if (d === todayDay) {
            h.classList.add("today-column-header");
            h.textContent = `${DAYS_MAP[d]} (HOY)`;
        } else {
            h.classList.remove("today-column-header");
            h.textContent = DAYS_MAP[d];
        }
    });

    const isMobileView = window.innerWidth <= 1024 || ('ontouchstart' in window && window.innerWidth <= 1024);
    if (isMobileView) {
        renderMobileView();
    } else {
        if (gridBody) gridBody.style.height = "780px";
        document.querySelectorAll(".active-mobile-day").forEach(el => el.classList.remove("active-mobile-day"));
        document.querySelectorAll(".day-header").forEach(h => {
            h.style.display = "block";
            h.style.position = "static";
            h.style.gridColumn = "auto";
        });
        document.querySelectorAll(".class-card").forEach(card => {
            const day = parseInt(card.dataset.day);
            const sh = parseFloat(card.dataset.sh || "7");
            const eh = parseFloat(card.dataset.eh || "8");
            const topPos = (sh - MIN_HOUR) * HOUR_HEIGHT + 4;
            const heightPos = (eh - sh) * HOUR_HEIGHT - 8;
            const colIdx = day - 1;

            card.classList.remove("hidden");
            card.style.display = "flex";
            card.style.position = "absolute";
            card.style.top = `${topPos}px`;
            card.style.height = `${heightPos}px`;
            card.style.left = `calc(70px + ((100% - 70px) / 5) * ${colIdx} + 4px)`;
            card.style.width = `calc(((100% - 70px) / 5) - 8px)`;
        });
    }

    renderCurrentTimeIndicator();
    updateQuickWidgets();
}

function updateHeaderDate() {
    const subtitleEl = document.getElementById("subtitle-main");
    if (!subtitleEl) return;
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateStr = now.toLocaleDateString('es-ES', options);
    const formatted = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    subtitleEl.textContent = `📅 ${formatted} • Horarios sincronizados en tiempo real`;
}

// Schedule a refresh at midnight so the header date and relative dates stay current
function scheduleMidnightRefresh() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow - now + 1000;
    setTimeout(() => {
        updateHeaderDate();
        if (activeTab === "rincon") renderLoveNotes();
        renderCurrentSchedule();
        scheduleMidnightRefresh();
    }, msUntilMidnight);
}

function renderCurrentTimeIndicator() {
    if (!gridBody) return;
    let line = document.getElementById("current-time-indicator");
    const now = new Date();
    const todayDay = now.getDay();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    
    if (todayDay >= 1 && todayDay <= 5 && currentHour >= MIN_HOUR && currentHour <= MAX_HOUR + 1) {
        if (!line) {
            line = document.createElement("div");
            line.id = "current-time-indicator";
            line.className = "current-time-line";
            const dot = document.createElement("div");
            dot.className = "current-time-dot";
            line.appendChild(dot);
            gridBody.appendChild(line);
        }
        const topPos = (currentHour - MIN_HOUR) * HOUR_HEIGHT;
        line.style.top = `${topPos}px`;
        line.style.display = "block";
    } else if (line) {
        line.style.display = "none";
    }
}

// Convert "HH:MM" to decimal hour
function timeToDecimal(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h + m / 60;
}

// Quick Widgets Controller
function updateQuickWidgets() {
    const nextClassTitle = document.getElementById("widget-next-class-title");
    const nextClassSub = document.getElementById("widget-next-class-sub");
    const latestNoteTitle = document.getElementById("widget-latest-note-title");
    const latestNoteSub = document.getElementById("widget-latest-note-sub");

    if (!nextClassTitle && !latestNoteTitle) return;

    if (latestNoteTitle && loveNotes.length > 0) {
        const topNote = loveNotes[0];
        const sender = topNote.sender === "he" ? "De Él" : "De Ella";
        latestNoteTitle.textContent = `"${topNote.content.substring(0, 22)}${topNote.content.length > 22 ? '...' : ''}"`;
        latestNoteSub.textContent = `${sender} • ${topNote.date}`;
    }

    if (nextClassTitle) {
        const todayDay = new Date().getDay() || 1;
        const activeList = currentScheduleView === "he" ? HE_CLASSES : SHE_CLASSES;
        const ownerName = currentScheduleView === "he" ? "Él" : "Ella";
        let foundSession = null;
        let foundClass = null;

        for (const c of activeList) {
            for (const s of c.sessions) {
                if (s.day === todayDay) {
                    foundSession = s;
                    foundClass = c;
                    break;
                }
            }
            if (foundSession) break;
        }

        if (foundClass && foundSession) {
            nextClassTitle.textContent = `${foundClass.name}`;
            nextClassSub.textContent = `Hoy (${DAYS_MAP[todayDay]}) ${foundSession.start} en ${foundSession.room}`;
        } else {
            nextClassTitle.textContent = `Sin clases de ${ownerName} hoy`;
            nextClassSub.textContent = "¡Día libre para descansar!";
        }
    }
}

// Tasks Section Logic
function renderTasks() {
    if (!tasksListContainer) return;
    tasksListContainer.innerHTML = "";

    const filtered = duoTasks.filter(t => {
        if (currentTaskFilter === "all") return true;
        return t.assigned === currentTaskFilter;
    });

    if (filtered.length === 0) {
        tasksListContainer.innerHTML = "<div class='agenda-empty-state'>No hay tareas registradas en esta categoría.</div>";
        return;
    }

    filtered.forEach(task => {
        const card = document.createElement("div");
        card.className = `task-item-card ${task.completed ? 'completed' : ''}`;

        const check = document.createElement("div");
        check.className = "task-checkbox";
        if (task.completed) check.innerHTML = "✓";
        check.addEventListener("click", () => {
            task.completed = !task.completed;
            pushToCloud();
            renderTasks();
        });

        const content = document.createElement("div");
        content.className = "task-content";

        const title = document.createElement("div");
        title.className = "task-title";
        title.textContent = task.name;

        const meta = document.createElement("div");
        meta.className = "task-meta";
        const ownerName = task.assigned === "he" ? "👦 Él" : (task.assigned === "she" ? "👧 Ella" : "👩‍❤️‍👨 Ambos");
        const priorityBadge = task.priority === "high" ? "🔴 Importante" : "💙 Normal";
        meta.innerHTML = `<span>Asignado: ${ownerName}</span> <span>•</span> <span>${priorityBadge}</span> <span>•</span> <span>Entrega: ${task.dueDate || 'Sin fecha'}</span>`;

        content.appendChild(title);
        content.appendChild(meta);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn-delete-task";
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.title = "Eliminar tarea";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        });

        card.appendChild(check);
        card.appendChild(content);
        card.appendChild(deleteBtn);

        tasksListContainer.appendChild(card);
    });
}

window.deleteTask = function(id) {
    duoTasks = duoTasks.filter(t => t.id !== id);
    pushToCloud();
    renderTasks();
    showToast("Tarea eliminada");
};

// Dual Attendance Tracker Logic
function renderAttendance() {
    if (!attendanceTrackerList) return;
    attendanceTrackerList.innerHTML = "";

    const activeList = currentAttendanceOwner === "he" ? HE_CLASSES : SHE_CLASSES;

    activeList.forEach(c => {
        const rec = attendance[c.id] || { present: 0, absent: 0 };
        const total = rec.present + rec.absent;
        const percentage = total === 0 ? 100 : Math.round((rec.present / total) * 100);

        const card = document.createElement("div");
        card.className = "attendance-card";
        card.innerHTML = `
            <div class="attendance-card-header">
                <div>
                    <h3 class="attendance-card-title">${c.name}</h3>
                    ${c.professor ? `<div class="attendance-card-prof">${c.professor}</div>` : ''}
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <div class="attendance-percentage-ring ${percentage < 80 ? 'warning' : ''}">${percentage}%</div>
                    <button class="btn-reset-attendance" onclick="resetAttendance('${c.id}')" title="Reiniciar asistencias de esta materia">🔄 Reiniciar</button>
                </div>
            </div>
            <div class="attendance-ratio">${rec.present} de ${total} clases asistidas (${rec.absent} faltas)</div>
            <div class="attendance-controls">
                <button class="btn-attendance btn-attendance-present" onclick="registerAttendance('${c.id}', true)">+ Asistí</button>
                <button class="btn-attendance btn-attendance-absent" onclick="registerAttendance('${c.id}', false)">+ Falté</button>
            </div>
        `;
        attendanceTrackerList.appendChild(card);
    });
}

window.registerAttendance = function(classId, present) {
    if (!attendance[classId]) attendance[classId] = { present: 0, absent: 0 };
    if (present) attendance[classId].present++;
    else attendance[classId].absent++;
    pushToCloud();
    renderAttendance();
};

window.resetAttendance = function(classId) {
    if (confirm("¿Reiniciar y borrar el registro de asistencias de esta materia?")) {
        attendance[classId] = { present: 0, absent: 0 };
        pushToCloud();
        renderAttendance();
        showToast("Asistencias reiniciadas 🔄");
    }
};

// Love Notes (Rincón del Amor) Logic
function renderLoveNotes() {
    if (!loveNotesBoard) return;
    loveNotesBoard.innerHTML = "";

    if (loveNotes.length === 0) {
        loveNotesBoard.innerHTML = "<div class='agenda-empty-state'>No hay notitas por ahora. ¡Escribe la primera!</div>";
        return;
    }

    loveNotes.forEach(n => {
        const card = document.createElement("div");
        card.className = `sticky-note note-${n.color}`;
        
        const senderTag = n.sender === "he" ? "👦 De Él" : "👧 De Ella";

        card.innerHTML = `
            <div class="sticky-note-header">
                <span>${senderTag} • ${formatRelativeDate(n.date)}</span>
                <button class="btn-delete-note" onclick="deleteLoveNote('${n.id}')" title="Eliminar notita">🗑️</button>
            </div>
            <div class="sticky-note-body">${n.content}</div>
        `;
        loveNotesBoard.appendChild(card);
    });
}

window.deleteLoveNote = function(id) {
    loveNotes = loveNotes.filter(n => n.id !== id);
    pushToCloud();
    renderLoveNotes();
    showToast("Notita eliminada");
};

// Modals and Triggers
function setupEventListeners() {
    // Attendance owner switch
    document.querySelectorAll(".attendance-owner-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".attendance-owner-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentAttendanceOwner = btn.dataset.owner;
            renderAttendance();
        });
    });

    // Task filters
    document.querySelectorAll(".todo-filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".todo-filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentTaskFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Task modal
    document.getElementById("btn-new-task").addEventListener("click", () => {
        document.getElementById("modal-task-form").classList.add("open");
    });

    document.getElementById("task-editor-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("form-task-name").value.trim();
        const assigned = document.getElementById("form-task-assigned").value;
        const dueDate = document.getElementById("form-task-date").value;
        const priority = document.getElementById("form-task-priority").value;

        if (!name) return;

        duoTasks.push({ id: `task-${Date.now()}`, assigned, name, dueDate, priority, completed: false });
        pushToCloud();
        renderTasks();
        closeAllModals();
        showToast("Tarea compartida agregada");
    });

    // Love Note modal
    document.getElementById("btn-add-love-note").addEventListener("click", () => {
        document.getElementById("modal-love-note").classList.add("open");
    });

    document.getElementById("love-note-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const sender = document.getElementById("note-sender").value;
        const color = document.getElementById("note-color").value;
        const content = document.getElementById("note-content").value.trim();

        if (!content) return;

        loveNotes.unshift({ 
            id: `note-${Date.now()}`, 
            sender, 
            color, 
            content, 
            date: Date.now() 
        });

        // Store up to 1000 notes
        if (loveNotes.length > 1000) {
            loveNotes = loveNotes.slice(0, 1000);
        }

        renderLoveNotes();
        closeAllModals();
        pushToCloud();
        showToast("Notita publicada");
    });

    // Chiikawa Dance Video Triggers
    document.querySelectorAll(".btn-chiikawa-dance-trigger").forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = document.getElementById("modal-chiikawa-dance");
            const player = document.getElementById("chiikawa-video-player");
            if (modal && player) {
                modal.classList.add("open");
                player.currentTime = 0;
                player.play().catch(e => console.log("Autoplay policy:", e));
                showToast("✨ ¡Chiikawa Dance! 🎵");
            }
        });
    });

    // Close Modals
    document.querySelectorAll(".modal-close-btn").forEach(btn => btn.addEventListener("click", closeAllModals));
    document.querySelectorAll(".btn-close-modal").forEach(btn => btn.addEventListener("click", closeAllModals));
    
    // Reset Data
    document.getElementById("btn-reset-all").addEventListener("click", () => {
        if (confirm("¿Restablecer los datos predeterminados de la app de pareja?")) {
            localStorage.clear();
            loadFromLocalStorage();
            renderCurrentSchedule();
            renderTasks();
            renderAttendance();
            renderLoveNotes();
            showToast("Datos restablecidos");
        }
    });
}

function openDetailsModal(classObj, session) {
    currentlySelectedClassObj = classObj;
    const modal = document.getElementById("modal-details");
    document.getElementById("detail-owner-tag").textContent = classObj.owner === "he" ? "👦 Horario de Él" : "👧 Horario de Ella";
    document.getElementById("detail-code").textContent = classObj.code || "SIN CÓDIGO";
    document.getElementById("detail-name").textContent = classObj.name;
    document.getElementById("detail-room").textContent = session.room;
    document.getElementById("detail-time-str").textContent = `${DAYS_MAP[session.day]} ${session.start} - ${session.end}`;
    const profEl = document.getElementById("detail-prof");
    if (profEl) profEl.textContent = classObj.professor || "Por asignar";
    modal.classList.add("open");
}

function openClassEditorModal(classObj = null) {
    currentlySelectedClassObj = classObj;
    const modal = document.getElementById("modal-edit-class");
    const titleEl = document.getElementById("class-editor-title");
    const idInput = document.getElementById("form-class-id");
    const nameInput = document.getElementById("form-class-name");
    const codeInput = document.getElementById("form-class-code");
    const profInput = document.getElementById("form-class-prof");
    const ownerSelect = document.getElementById("form-class-owner");
    const colorSelect = document.getElementById("form-class-color");
    const deleteBtn = document.getElementById("btn-delete-class");
    const sessionsContainer = document.getElementById("class-sessions-container");

    if (!modal) return;
    sessionsContainer.innerHTML = "";

    if (classObj) {
        titleEl.textContent = "Editar Materia ✏️";
        idInput.value = classObj.id;
        nameInput.value = classObj.name || "";
        codeInput.value = classObj.code || "";
        profInput.value = classObj.professor || "";
        ownerSelect.value = classObj.owner || "he";
        colorSelect.value = classObj.color || "sky";
        if (deleteBtn) deleteBtn.style.display = "inline-block";

        if (Array.isArray(classObj.sessions) && classObj.sessions.length > 0) {
            classObj.sessions.forEach(s => addSessionRow(s));
        } else {
            addSessionRow();
        }
    } else {
        titleEl.textContent = "Nueva Materia ➕";
        idInput.value = "";
        nameInput.value = "";
        codeInput.value = "";
        profInput.value = "";
        ownerSelect.value = currentScheduleView === "she" ? "she" : "he";
        colorSelect.value = "sky";
        if (deleteBtn) deleteBtn.style.display = "none";
        addSessionRow({ day: 1, start: "07:00", end: "09:00", room: "Salón 101" });
    }

    modal.classList.add("open");
}

function addSessionRow(session = { day: 1, start: "07:00", end: "09:00", room: "" }) {
    const container = document.getElementById("class-sessions-container");
    if (!container) return;

    const row = document.createElement("div");
    row.className = "session-edit-row";
    row.style.cssText = "display: flex; gap: 6px; align-items: center; background: var(--bg-app); padding: 8px; border-radius: 8px; border: 1px solid var(--border-main); flex-wrap: wrap;";

    row.innerHTML = `
        <select class="sess-day" style="padding: 6px; border-radius: 6px; border: 1px solid var(--border-main); font-size: 12px; font-weight: 700; background: var(--bg-card); color: var(--text-main);">
            <option value="1" ${session.day === 1 ? 'selected' : ''}>Lunes</option>
            <option value="2" ${session.day === 2 ? 'selected' : ''}>Martes</option>
            <option value="3" ${session.day === 3 ? 'selected' : ''}>Miércoles</option>
            <option value="4" ${session.day === 4 ? 'selected' : ''}>Jueves</option>
            <option value="5" ${session.day === 5 ? 'selected' : ''}>Viernes</option>
        </select>
        <input type="time" class="sess-start" value="${session.start || '07:00'}" style="padding: 6px; border-radius: 6px; border: 1px solid var(--border-main); font-size: 12px; background: var(--bg-card); color: var(--text-main);">
        <span style="font-size: 12px; font-weight: 700;">a</span>
        <input type="time" class="sess-end" value="${session.end || '09:00'}" style="padding: 6px; border-radius: 6px; border: 1px solid var(--border-main); font-size: 12px; background: var(--bg-card); color: var(--text-main);">
        <input type="text" class="sess-room" value="${session.room || ''}" placeholder="Salón / Aula" style="flex: 1; min-width: 100px; padding: 6px; border-radius: 6px; border: 1px solid var(--border-main); font-size: 12px; background: var(--bg-card); color: var(--text-main);">
        <button type="button" class="btn-remove-sess" style="border: none; background: transparent; cursor: pointer; font-size: 14px; padding: 4px;" title="Eliminar horario">🗑️</button>
    `;

    row.querySelector(".btn-remove-sess").addEventListener("click", () => {
        if (container.children.length > 1) {
            row.remove();
        } else {
            showToast("La materia debe tener al menos un horario");
        }
    });

    container.appendChild(row);
}

function setupClassEditor() {
    const addBtn = document.getElementById("btn-add-class");
    if (addBtn) addBtn.addEventListener("click", () => openClassEditorModal(null));

    const editDetailBtn = document.getElementById("btn-edit-detail-class");
    if (editDetailBtn) {
        editDetailBtn.addEventListener("click", () => {
            if (currentlySelectedClassObj) {
                const targetObj = currentlySelectedClassObj;
                closeAllModals();
                setTimeout(() => openClassEditorModal(targetObj), 150);
            }
        });
    }

    const addSessBtn = document.getElementById("btn-add-session-row");
    if (addSessBtn) addSessBtn.addEventListener("click", () => addSessionRow());

    const deleteBtn = document.getElementById("btn-delete-class");
    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            const classId = document.getElementById("form-class-id").value;
            if (!classId) return;
            if (confirm("¿Estás seguro de eliminar esta materia de tu horario?")) {
                HE_CLASSES = HE_CLASSES.filter(c => c.id !== classId);
                SHE_CLASSES = SHE_CLASSES.filter(c => c.id !== classId);
                delete attendance[classId];
                pushToCloud();
                renderCurrentSchedule();
                renderAttendance();
                closeAllModals();
                showToast("Materia eliminada 🗑️");
            }
        });
    }

    const form = document.getElementById("class-editor-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const id = document.getElementById("form-class-id").value;
            const owner = document.getElementById("form-class-owner").value;
            const name = document.getElementById("form-class-name").value.trim();
            const code = document.getElementById("form-class-code").value.trim();
            const professor = document.getElementById("form-class-prof").value.trim();
            const color = document.getElementById("form-class-color").value;

            if (!name) return;

            const sessionRows = document.querySelectorAll("#class-sessions-container .session-edit-row");
            const sessions = [];

            sessionRows.forEach(row => {
                const day = parseInt(row.querySelector(".sess-day").value);
                const start = row.querySelector(".sess-start").value || "07:00";
                const end = row.querySelector(".sess-end").value || "09:00";
                const room = row.querySelector(".sess-room").value.trim() || "Por definir";
                sessions.push({ day, start, end, room });
            });

            const classId = id || `${owner}-${Date.now()}`;
            const updatedObj = {
                id: classId,
                owner,
                name,
                code: code || "SIN CÓDIGO",
                professor: professor || "Por asignar",
                color,
                sessions
            };

            // Remove from both lists first
            HE_CLASSES = HE_CLASSES.filter(c => c.id !== classId);
            SHE_CLASSES = SHE_CLASSES.filter(c => c.id !== classId);

            // Add to appropriate list
            if (owner === "he") {
                HE_CLASSES.push(updatedObj);
            } else {
                SHE_CLASSES.push(updatedObj);
            }

            if (!attendance[classId]) {
                attendance[classId] = { present: 0, absent: 0 };
            }

            pushToCloud();
            renderCurrentSchedule();
            renderAttendance();
            closeAllModals();
            showToast("¡Materia guardada y sincronizada! 💖");
        });
    }
}

function closeAllModals() {
    if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
    }
    const player = document.getElementById("chiikawa-video-player");
    if (player) {
        player.pause();
    }
    document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("open"));
}

function getBlobIdFromUrl(url) {
    if (!url) return "";
    const parts = url.split("/");
    return parts[parts.length - 1];
}

function openSyncSettingsModal() {
    const modal = document.getElementById("modal-sync-settings");
    if (!modal) return;
    const currentBlobId = getBlobIdFromUrl(CLOUD_SYNC_URL);
    const shareUrl = `${window.location.origin}${window.location.pathname}?sync=${currentBlobId}`;

    const shareInput = document.getElementById("sync-share-url-input");
    if (shareInput) shareInput.value = shareUrl;

    const customIdInput = document.getElementById("sync-custom-id-input");
    if (customIdInput) customIdInput.value = currentBlobId;

    modal.classList.add("open");
}

function setupSyncPin() {
    const badge = document.getElementById("sync-status-badge");
    if (badge) {
        badge.style.cursor = "pointer";
        badge.title = "Toca para abrir la Configuración de Sincronización de Pareja";
        badge.addEventListener("click", openSyncSettingsModal);
    }

    const copyBtn = document.getElementById("btn-copy-sync-link");
    const connectBtn = document.getElementById("btn-connect-sync-id");
    const forceSyncBtn = document.getElementById("btn-force-sync-now");

    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const shareInput = document.getElementById("sync-share-url-input");
            if (shareInput) {
                navigator.clipboard.writeText(shareInput.value).then(() => {
                    showToast("¡Enlace copiado! Pásalo a tu pareja 💖");
                }).catch(() => {
                    shareInput.select();
                    document.execCommand("copy");
                    showToast("¡Enlace copiado! 💖");
                });
            }
        });
    }

    if (connectBtn) {
        connectBtn.addEventListener("click", () => {
            const customIdInput = document.getElementById("sync-custom-id-input");
            const rawVal = customIdInput ? customIdInput.value.trim() : "";
            if (!rawVal) return;
            let targetUrl = rawVal;
            if (!targetUrl.startsWith("http")) {
                targetUrl = `https://jsonblob.com/api/jsonBlob/${rawVal}`;
            }
            CLOUD_SYNC_URL = targetUrl;
            localStorage.setItem("duo_cloud_url", CLOUD_SYNC_URL);
            showToast("🔗 Conectando a nuevo espacio...");
            pullFromCloud();
            closeAllModals();
        });
    }

    if (forceSyncBtn) {
        forceSyncBtn.addEventListener("click", () => {
            showToast("🔄 Sincronizando en vivo...");
            pullFromCloud();
            pushToCloud();
        });
    }
}

function updateSyncBadge(isOnline) {
    const badge = document.getElementById("sync-status-badge");
    if (!badge) return;
    if (isOnline !== false) {
        badge.className = "sync-badge online";
        badge.textContent = "🟢 Sincronizado en Vivo";
    } else {
        badge.className = "sync-badge offline";
        badge.textContent = "⚪ Modo Local";
    }
}

function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}
