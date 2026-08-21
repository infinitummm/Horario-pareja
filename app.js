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

const DEFAULT_LOVE_NOTES = [];
const DEFAULT_TASKS = [];

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
const MASTER_BLOB_ID = "019fcee7-5ad8-7da9-835e-ad5d6b8362d7";
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

async function fetchMasterSyncRegistry() {
    try {
        const res = await fetchWithTimeout(`data-sync.json?v=${Date.now()}`);
        if (res.ok) {
            const data = await res.json();
            if (data && data.activeMasterBlobUrl) {
                CLOUD_SYNC_URL = data.activeMasterBlobUrl;
                localStorage.setItem("duo_cloud_url", CLOUD_SYNC_URL);
            }
        }
    } catch(e) {}
}

// Initialize Application
document.addEventListener("DOMContentLoaded", async () => {
    setupUserSessionSecurity();
    checkUrlSyncParams();
    await fetchMasterSyncRegistry();
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
    setupPushNotifications();
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

const APP_USERS = {
    he: {
        id: "he",
        name: "Javi",
        avatar: "J",
        themeColor: "sky",
        passHash: "755917ecbc61091ffa6b605d7f82bdaa4e4cbdc309124807b0fb63228d0696df"
    },
    she: {
        id: "she",
        name: "Mari",
        avatar: "M",
        themeColor: "pink",
        passHash: "c2aab9d664fe1c0de638fcef89728618e4ccf55d5f9f00e68eace57aaab0063e"
    }
};

let currentActiveUser = localStorage.getItem("duo_active_user") || "he";
if (!APP_USERS[currentActiveUser]) currentActiveUser = "he";

async function hashPassword(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function updateUserProfileChip() {
    const user = APP_USERS[currentActiveUser] || APP_USERS.he;
    const avatarEl = document.getElementById("chip-avatar-icon");
    const nameEl = document.getElementById("chip-username-text");
    if (avatarEl) avatarEl.textContent = user.avatar;
    if (nameEl) nameEl.textContent = user.name;

    const settingsAvatarEl = document.getElementById("settings-avatar-icon");
    const settingsNameEl = document.getElementById("settings-username-text");
    if (settingsAvatarEl) settingsAvatarEl.textContent = user.avatar;
    if (settingsNameEl) settingsNameEl.textContent = user.name;
}

function applyUserSessionDefaults(userKey) {
    currentActiveUser = userKey;
    localStorage.setItem("duo_active_user", userKey);
    updateUserProfileChip();

    // 1. Schedule default subtab
    currentScheduleView = userKey; // 'he' or 'she'
    document.querySelectorAll(".subtab-btn").forEach(btn => {
        if (btn.dataset.schedule === userKey) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    renderCurrentSchedule();

    // 2. Attendance owner default
    currentAttendanceOwner = userKey;
    document.querySelectorAll(".attendance-owner-btn").forEach(btn => {
        if (btn.dataset.owner === userKey) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    renderAttendance();
}

const SESSION_AUTH_VERSION = "v56_auth_clean_session";

function setupUserSessionSecurity() {
    const lockOverlay = document.getElementById("lock-screen-overlay");
    const lockForm = document.getElementById("lock-pin-form");
    const pinInput = document.getElementById("pin-input-field");
    const errorMsg = document.getElementById("pin-error-msg");
    const lockCard = document.querySelector(".lock-screen-card");
    const lockAppBtn = document.getElementById("btn-lock-app");
    const userButtons = document.querySelectorAll(".login-user-btn");

    // Force close all previous sessions across all devices for testing
    if (localStorage.getItem("duo_auth_version") !== SESSION_AUTH_VERSION) {
        localStorage.removeItem("horario_duo_unlocked");
        localStorage.setItem("duo_auth_version", SESSION_AUTH_VERSION);
    }

    let selectedLoginUser = currentActiveUser || "he";

    // Setup User Switching in Login Card
    userButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            userButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedLoginUser = btn.dataset.user;
            if (errorMsg) errorMsg.style.display = "none";
            pinInput.value = "";
            pinInput.focus();
        });
    });

    if (!lockOverlay || !lockForm || !pinInput) return;

    const isUnlocked = localStorage.getItem("horario_duo_unlocked") === "true";
    if (isUnlocked) {
        lockOverlay.classList.add("unlocked");
        applyUserSessionDefaults(currentActiveUser);
    } else {
        lockOverlay.classList.remove("unlocked");
        // Preselect current active user tab
        userButtons.forEach(b => {
            if (b.dataset.user === selectedLoginUser) b.classList.add("active");
            else b.classList.remove("active");
        });
        setTimeout(() => pinInput.focus(), 300);
    }

    lockForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const enteredPass = pinInput.value.trim();
        if (!enteredPass) return;

        const enteredHash = await hashPassword(enteredPass);
        const targetUser = APP_USERS[selectedLoginUser];

        if (targetUser && enteredHash === targetUser.passHash) {
            localStorage.setItem("horario_duo_unlocked", "true");
            applyUserSessionDefaults(selectedLoginUser);
            lockOverlay.classList.add("unlocked");
            if (errorMsg) errorMsg.style.display = "none";
            showToast(`¡Bienvenido(a), ${targetUser.name}!`);
        } else {
            if (errorMsg) {
                errorMsg.textContent = "Contraseña incorrecta. Intenta de nuevo.";
                errorMsg.style.display = "block";
            }
            pinInput.value = "";
            pinInput.focus();

            if (lockCard) {
                lockCard.classList.remove("shake");
                void lockCard.offsetWidth;
                lockCard.classList.add("shake");
            }
        }
    });

    if (lockAppBtn) {
        lockAppBtn.addEventListener("click", () => {
            localStorage.removeItem("horario_duo_unlocked");
            lockOverlay.classList.remove("unlocked");
            pinInput.value = "";
            if (errorMsg) errorMsg.style.display = "none";
            setTimeout(() => pinInput.focus(), 300);
            showToast("Sesión cerrada");
        });
    }
}

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

    // Update active state in sidebar theme buttons
    document.querySelectorAll(".btn-theme-select").forEach(btn => {
        if (btn.dataset.theme === themeName) btn.classList.add("active");
        else btn.classList.remove("active");
    });

    // Update active state in settings tab theme options
    document.querySelectorAll(".settings-theme-option").forEach(btn => {
        if (btn.dataset.theme === themeName) btn.classList.add("active");
        else btn.classList.remove("active");
    });
}

function setupThemeSwitchers() {
    document.querySelectorAll(".btn-theme-select").forEach(btn => {
        btn.addEventListener("click", () => setTheme(btn.dataset.theme));
    });

    document.querySelectorAll(".settings-theme-option").forEach(btn => {
        btn.addEventListener("click", () => setTheme(btn.dataset.theme));
    });
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

        // Always re-seed the Master Endpoint so BOTH devices stay paired to the exact same room!
        const res = await fetchWithTimeout(DEFAULT_BLOB_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            CLOUD_SYNC_URL = DEFAULT_BLOB_URL;
            localStorage.setItem("duo_cloud_url", CLOUD_SYNC_URL);
            updateSyncBadge(true);
            return true;
        }

        // If master blob returned 404, recreate it on JSONBlob
        const postRes = await fetchWithTimeout("https://jsonblob.com/api/jsonBlob", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const blobId = postRes.headers.get("x-jsonblob-id");
        const locationHeader = postRes.headers.get("Location") || postRes.headers.get("location");
        const newUrl = blobId ? `https://jsonblob.com/api/jsonBlob/${blobId}` : (locationHeader ? (locationHeader.startsWith("http") ? locationHeader : `https://jsonblob.com${locationHeader}`) : null);

        if (newUrl) {
            CLOUD_SYNC_URL = newUrl;
            localStorage.setItem("duo_cloud_url", CLOUD_SYNC_URL);
            updateSyncBadge(true);
            return true;
        }
    } catch(e) {
        console.error("Auto-heal blob failed:", e);
    }
    return false;
}

// Keepalive Heartbeat: Pings cloud storage every 4 hours so it NEVER expires or gets marked inactive
function sendKeepAlivePing() {
    const payload = {
        heClasses: HE_CLASSES,
        sheClasses: SHE_CLASSES,
        notes: loveNotes,
        tasks: duoTasks,
        attendance: attendance,
        lastUpdated: Date.now()
    };
    fetchWithTimeout(CLOUD_SYNC_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
    }).catch(() => {});
}
setInterval(sendKeepAlivePing, 4 * 60 * 60 * 1000);

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

    try { localStorage.removeItem("duo_deleted_tasks"); } catch(e) {}
    try { localStorage.removeItem("duo_deleted_notes"); } catch(e) {}

    const savedTasks = localStorage.getItem("duo_tasks");
    if (savedTasks) {
        try { 
            duoTasks = JSON.parse(savedTasks).filter(t => t && !t.completed); 
        } catch(e) { 
            duoTasks = JSON.parse(JSON.stringify(DEFAULT_TASKS)).filter(t => t && !t.completed); 
        }
    } else {
        duoTasks = JSON.parse(JSON.stringify(DEFAULT_TASKS)).filter(t => t && !t.completed);
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

function mergeCloudState(cloud) {
    if (!cloud || typeof cloud !== "object") return false;
    let changed = false;

    // 1. Synchronize Love Notes (cloud array is authoritative across all devices)
    if (Array.isArray(cloud.notes)) {
        if (JSON.stringify(cloud.notes) !== JSON.stringify(loveNotes)) {
            loveNotes = cloud.notes;
            migrateNoteDates(loveNotes);
            changed = true;
        }
    }

    // 2. Synchronize Tasks (cloud array is authoritative across all devices, filtering any completed tasks)
    if (Array.isArray(cloud.tasks)) {
        const cleanCloudTasks = cloud.tasks.filter(t => t && !t.completed);
        if (JSON.stringify(cleanCloudTasks) !== JSON.stringify(duoTasks)) {
            duoTasks = cleanCloudTasks;
            changed = true;
        }
    }

    // 3. Synchronize Attendance
    if (cloud.attendance && typeof cloud.attendance === "object") {
        Object.keys(cloud.attendance).forEach(classId => {
            const cloudRec = cloud.attendance[classId] || {};
            const localRec = attendance[classId] || { present: 0, absent: 0 };
            const maxPres = Math.max(localRec.present || 0, cloudRec.present || 0);
            const maxAbs = Math.max(localRec.absent || 0, cloudRec.absent || 0);
            if (!attendance[classId] || localRec.present !== maxPres || localRec.absent !== maxAbs) {
                attendance[classId] = { present: maxPres, absent: maxAbs };
                changed = true;
            }
        });
    }

    // 4. Synchronize Classes
    if (Array.isArray(cloud.heClasses) && cloud.heClasses.length > 0) {
        if (JSON.stringify(cloud.heClasses) !== JSON.stringify(HE_CLASSES)) {
            HE_CLASSES = cloud.heClasses;
            changed = true;
        }
    }
    if (Array.isArray(cloud.sheClasses) && cloud.sheClasses.length > 0) {
        if (JSON.stringify(cloud.sheClasses) !== JSON.stringify(SHE_CLASSES)) {
            SHE_CLASSES = cloud.sheClasses;
            changed = true;
        }
    }

    if (changed) {
        migrateNoteDates(loveNotes);
        saveToLocalStorage();
    }
    return changed;
}

let firebaseUnsubscribe = null;

function pushToCloud() {
    saveToLocalStorage();
    isPushing = true;

    clearTimeout(isPushingTimer);
    isPushingTimer = setTimeout(() => { isPushing = false; }, 1000);

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

    if (window.FirebaseSync && window.FirebaseSync.setDoc && window.FirebaseSync.docRef) {
        window.FirebaseSync.setDoc(window.FirebaseSync.docRef, payload, { merge: true })
            .then(() => {
                isPushing = false;
                clearTimeout(isPushingTimer);
                updateSyncBadge(true);
            })
            .catch((err) => {
                console.error("Firebase push error:", err);
                isPushing = false;
                clearTimeout(isPushingTimer);
                updateSyncBadge(false);
            });
    }
}

async function syncNow() {
    if (!window.FirebaseSync || !window.FirebaseSync.getDoc || !window.FirebaseSync.docRef) return;
    try {
        const docSnap = await window.FirebaseSync.getDoc(window.FirebaseSync.docRef);
        if (docSnap.exists()) {
            const cloudData = docSnap.data();
            mergeCloudState(cloudData);
            renderCurrentSchedule();
            renderTasks();
            renderAttendance();
            renderLoveNotes();
            try { updateQuickWidgets(); } catch(e) {}
            updateSyncBadge(true);
        }
    } catch(err) {
        console.warn("syncNow fetch error:", err);
    }
}

function pullFromCloud() {
    syncNow();
}

function setupFirebaseRealtimeSync() {
    if (!window.FirebaseSync || !window.FirebaseSync.onSnapshot || !window.FirebaseSync.docRef) {
        return false;
    }

    if (firebaseUnsubscribe) {
        try { firebaseUnsubscribe(); } catch(e) {}
    }

    const { onSnapshot, docRef } = window.FirebaseSync;

    firebaseUnsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const cloudData = docSnap.data();
            mergeCloudState(cloudData);
            renderCurrentSchedule();
            renderTasks();
            renderAttendance();
            renderLoveNotes();
            try { updateQuickWidgets(); } catch(e) {}
            updateSyncBadge(true);
        } else {
            pushToCloud();
        }
    }, (error) => {
        console.error("Firebase Realtime listener error:", error);
        updateSyncBadge(false);
    });

    return true;
}

function initFirebaseSyncWithRetry() {
    if (setupFirebaseRealtimeSync()) {
        syncNow();
    } else {
        const checkTimer = setInterval(() => {
            if (setupFirebaseRealtimeSync()) {
                syncNow();
                clearInterval(checkTimer);
            }
        }, 200);
        setTimeout(() => clearInterval(checkTimer), 8000);
    }
}

function setupSyncLifecycle() {
    initFirebaseSyncWithRetry();

    window.addEventListener("firebase-ready", () => {
        initFirebaseSyncWithRetry();
    });

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            updateHeaderDate();
            initFirebaseSyncWithRetry();
        }
    });

    window.addEventListener("focus", () => {
        initFirebaseSyncWithRetry();
    });

    window.addEventListener("online", () => {
        initFirebaseSyncWithRetry();
        updateSyncBadge(true);
    });

    window.addEventListener("offline", () => {
        updateSyncBadge(false);
    });

    // 8-second safety heartbeat poll for mobile background wakeups
    setInterval(() => {
        if (!document.hidden && navigator.onLine) {
            syncNow();
        }
    }, 8000);
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

let selectedRouteDay = "lunes";

const ESAVE_ROUTE_DATA = {
    title: "Horario de Ruta ESAVE 2026-2",
    subtitle: "Escuela de Aviación del Ejército • Ruta Puerta 6 ↔ ESAVE",
    days: {
        lunes: {
            name: "Lunes",
            schedule: [
                { salida: "06:20", salen: "-", espera: "10 min", ingreso: "06:40", ingresan: "5, 7, 9" },
                { salida: "09:20", salen: "5", espera: "10 min", ingreso: "09:40", ingresan: "-" },
                { salida: "11:20", salen: "7", espera: "10 min", ingreso: "11:40", ingresan: "4, 8" },
                { salida: "12:20", salen: "9", espera: "10 min", ingreso: "12:40", ingresan: "-" },
                { salida: "14:20", salen: "-", espera: "10 min", ingreso: "14:40", ingresan: "2" },
                { salida: "15:20", salen: "4", espera: "10 min", ingreso: "15:40", ingresan: "6" },
                { salida: "18:20", salen: "2, 6, 8", espera: "10 min", ingreso: "18:40", ingresan: "-" }
            ]
        },
        martes: {
            name: "Martes",
            schedule: [
                { salida: "06:20", salen: "-", espera: "10 min", ingreso: "06:40", ingresan: "1, 3, 5, 7" },
                { salida: "11:20", salen: "-", espera: "10 min", ingreso: "11:40", ingresan: "4, 8" },
                { salida: "12:20", salen: "5", espera: "10 min", ingreso: "12:40", ingresan: "2, 6" },
                { salida: "13:20", salen: "1, 3, 7", espera: "10 min", ingreso: "13:40", ingresan: "-" },
                { salida: "17:20", salen: "4, 8", espera: "10 min", ingreso: "17:40", ingresan: "-" },
                { salida: "18:20", salen: "6", espera: "10 min", ingreso: "18:40", ingresan: "-" },
                { salida: "19:20", salen: "2", espera: "10 min", ingreso: "19:40", ingresan: "-" }
            ]
        },
        miercoles: {
            name: "Miércoles",
            schedule: [
                { salida: "06:20", salen: "-", espera: "10 min", ingreso: "06:40", ingresan: "1, 5, 7" },
                { salida: "08:20", salen: "-", espera: "10 min", ingreso: "08:40", ingresan: "9" },
                { salida: "09:20", salen: "-", espera: "10 min", ingreso: "09:40", ingresan: "3" },
                { salida: "10:20", salen: "1", espera: "10 min", ingreso: "10:40", ingresan: "-" },
                { salida: "11:20", salen: "-", espera: "10 min", ingreso: "11:40", ingresan: "2" },
                { salida: "12:20", salen: "-", espera: "10 min", ingreso: "12:40", ingresan: "4, 6, 8" },
                { salida: "13:20", salen: "3, 5, 7", espera: "10 min", ingreso: "13:40", ingresan: "-" },
                { salida: "14:20", salen: "9", espera: "10 min", ingreso: "14:40", ingresan: "-" },
                { salida: "16:20", salen: "4", espera: "10 min", ingreso: "16:40", ingresan: "-" },
                { salida: "18:20", salen: "2, 6, 8", espera: "10 min", ingreso: "18:40", ingresan: "-" }
            ]
        },
        jueves: {
            name: "Jueves",
            schedule: [
                { salida: "06:20", salen: "-", espera: "10 min", ingreso: "06:40", ingresan: "1, 3, 5, 7, 9" },
                { salida: "10:20", salen: "5, 9", espera: "10 min", ingreso: "10:40", ingresan: "-" },
                { salida: "11:20", salen: "-", espera: "10 min", ingreso: "11:40", ingresan: "2, 8" },
                { salida: "12:20", salen: "1, 7", espera: "10 min", ingreso: "12:40", ingresan: "4, 6" },
                { salida: "13:20", salen: "3", espera: "10 min", ingreso: "13:40", ingresan: "-" },
                { salida: "15:20", salen: "4", espera: "10 min", ingreso: "15:40", ingresan: "-" },
                { salida: "17:20", salen: "8", espera: "10 min", ingreso: "17:40", ingresan: "-" },
                { salida: "18:20", salen: "2, 6", espera: "10 min", ingreso: "18:40", ingresan: "-" }
            ]
        },
        viernes: {
            name: "Viernes",
            schedule: [
                { salida: "06:20", salen: "-", espera: "10 min", ingreso: "06:40", ingresan: "1, 7" },
                { salida: "08:20", salen: "-", espera: "10 min", ingreso: "08:40", ingresan: "5, 9" },
                { salida: "09:20", salen: "-", espera: "10 min", ingreso: "09:40", ingresan: "3" },
                { salida: "11:20", salen: "1, 5", espera: "10 min", ingreso: "11:40", ingresan: "2, 8" },
                { salida: "12:20", salen: "-", espera: "10 min", ingreso: "12:40", ingresan: "4, 6" },
                { salida: "13:20", salen: "3, 7", espera: "10 min", ingreso: "13:40", ingresan: "-" },
                { salida: "14:20", salen: "8, 9", espera: "10 min", ingreso: "14:40", ingresan: "-" },
                { salida: "15:20", salen: "2", espera: "10 min", ingreso: "15:40", ingresan: "-" },
                { salida: "17:20", salen: "6", espera: "10 min", ingreso: "17:40", ingresan: "-" },
                { salida: "18:20", salen: "4", espera: "10 min", ingreso: "18:40", ingresan: "-" }
            ]
        }
    }
};

function renderRoutesView() {
    const wrapper = document.getElementById("schedule-wrapper-element");
    let routesContainer = document.getElementById("routes-schedule-view");
    
    if (!routesContainer) {
        routesContainer = document.createElement("div");
        routesContainer.id = "routes-schedule-view";
        routesContainer.className = "routes-view-wrapper";
        if (wrapper) wrapper.appendChild(routesContainer);
    }
    
    routesContainer.style.display = "flex";

    const desktopGrid = document.getElementById("schedule-grid-couple");
    const mobileAgenda = document.getElementById("mobile-agenda-list-view");
    const daySelector = document.querySelector(".mobile-day-selector");
    const addClassBtn = document.getElementById("btn-add-class");

    if (desktopGrid) desktopGrid.style.display = "none";
    if (mobileAgenda) mobileAgenda.style.display = "none";
    if (daySelector) daySelector.style.display = "none";
    if (addClassBtn) addClassBtn.style.display = "none";

    const dayKeys = ["lunes", "martes", "miercoles", "jueves", "viernes"];
    const currentJsDay = new Date().getDay(); // 1 = Mon, 5 = Fri
    if (!selectedRouteDay || selectedRouteDay === "default") {
        selectedRouteDay = (currentJsDay >= 1 && currentJsDay <= 5) ? dayKeys[currentJsDay - 1] : "lunes";
    }

    const dayFilterHtml = `
        <div class="routes-day-filter-bar">
            <button class="route-day-pill ${selectedRouteDay === 'lunes' ? 'active' : ''}" data-day="lunes">Lunes</button>
            <button class="route-day-pill ${selectedRouteDay === 'martes' ? 'active' : ''}" data-day="martes">Martes</button>
            <button class="route-day-pill ${selectedRouteDay === 'miercoles' ? 'active' : ''}" data-day="miercoles">Miércoles</button>
            <button class="route-day-pill ${selectedRouteDay === 'jueves' ? 'active' : ''}" data-day="jueves">Jueves</button>
            <button class="route-day-pill ${selectedRouteDay === 'viernes' ? 'active' : ''}" data-day="viernes">Viernes</button>
            <button class="route-day-pill ${selectedRouteDay === 'all' ? 'active' : ''}" data-day="all">Todos los días</button>
        </div>
    `;

    const activeKeys = selectedRouteDay === "all" ? dayKeys : [selectedRouteDay];

    const cardsHtml = activeKeys.map(key => {
        const dayInfo = ESAVE_ROUTE_DATA.days[key];
        if (!dayInfo) return "";

        const tableRows = dayInfo.schedule.map(item => `
            <tr>
                <td class="time-cell">${item.salida}</td>
                <td class="people-tag ${item.salen !== '-' ? 'has-people' : ''}">${item.salen !== '-' ? 'Salen: ' + item.salen : '—'}</td>
                <td><span class="wait-tag">${item.espera}</span></td>
                <td class="time-cell">${item.ingreso}</td>
                <td class="people-tag ${item.ingresan !== '-' ? 'has-people' : ''}">${item.ingresan !== '-' ? 'Ingresan: ' + item.ingresan : '—'}</td>
            </tr>
        `).join("");

        return `
            <div class="esave-day-card">
                <div class="esave-day-title">
                    <span>${dayInfo.name}</span>
                    <span style="font-size:12px; font-weight:500; color:var(--text-muted);">ESAVE 2026-2</span>
                </div>
                <div class="esave-table-container">
                    <table class="esave-table">
                        <thead>
                            <tr>
                                <th>Salida ESAVE</th>
                                <th>Pasajeros</th>
                                <th>Espera P6</th>
                                <th>Ingreso ESAVE</th>
                                <th>Pasajeros</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }).join("");

    routesContainer.innerHTML = `
        <div class="routes-header-banner">
            <div>
                <div class="routes-banner-title">${ESAVE_ROUTE_DATA.title}</div>
                <div class="routes-banner-sub">${ESAVE_ROUTE_DATA.subtitle}</div>
            </div>
            <span class="routes-tag-pill">Puerta 6 ↔ ESAVE</span>
        </div>

        ${dayFilterHtml}

        <div style="display:flex; flex-direction:column; gap:16px;">
            ${cardsHtml}
        </div>
    `;

    routesContainer.querySelectorAll(".route-day-pill").forEach(pill => {
        pill.addEventListener("click", (e) => {
            selectedRouteDay = e.target.dataset.day;
            renderRoutesView();
        });
    });
}

// Render Schedule Grid
function renderCurrentSchedule() {
    const routesContainer = document.getElementById("routes-schedule-view");
    const addClassBtn = document.getElementById("btn-add-class");

    if (currentScheduleView === "routes") {
        renderRoutesView();
        return;
    } else {
        if (routesContainer) routesContainer.style.display = "none";
        if (addClassBtn) addClassBtn.style.display = "inline-flex";
    }

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
        const sender = topNote.sender === "he" ? "De Javi" : "De Mari";
        latestNoteTitle.textContent = `"${topNote.content.substring(0, 22)}${topNote.content.length > 22 ? '...' : ''}"`;
        latestNoteSub.textContent = `${sender} • ${topNote.date}`;
    }

    if (nextClassTitle) {
        const todayDay = new Date().getDay() || 1;
        const activeList = currentScheduleView === "he" ? HE_CLASSES : SHE_CLASSES;
        const ownerName = currentScheduleView === "he" ? "Javi" : "Mari";
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

    // Automatically purge any completed task remnants
    duoTasks = duoTasks.filter(t => t && !t.completed);

    const filtered = duoTasks.filter(t => {
        if (!t || t.completed) return false;
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

        const content = document.createElement("div");
        content.className = "task-content";

        const title = document.createElement("div");
        title.className = "task-title";
        title.textContent = task.name;

        const meta = document.createElement("div");
        meta.className = "task-meta";
        const ownerName = task.assigned === "he" ? "Javi" : (task.assigned === "she" ? "Mari" : "Ambos");
        const priorityBadge = task.priority === "high" ? "Importante" : "Normal";
        
        let subjectBadgeHtml = "";
        if (task.subjectName) {
            const colorClass = task.subjectColor ? `badge-${task.subjectColor}` : (task.assigned === "she" ? "badge-pink" : "badge-sky");
            subjectBadgeHtml = `<span class="task-subject-tag ${colorClass}">${task.subjectName}</span> <span>•</span> `;
        }

        meta.innerHTML = `${subjectBadgeHtml}<span>Asignado: ${ownerName}</span> <span>•</span> <span>${priorityBadge}</span> <span>•</span> <span>Entrega: ${task.dueDate || 'Sin fecha'}</span>`;

        content.appendChild(title);
        content.appendChild(meta);

        const completeTaskHandler = (e) => {
            if (e) e.stopPropagation();
            showTaskCompletedModal();
            const actorName = currentActiveUser === "he" ? "Javi" : "Mari";
            sendPushNotification("Horario Duo - Tarea Completada", `${actorName} ha completado la tarea: ${task.name}`);
            deleteTask(task.id, false);
        };

        check.addEventListener("click", completeTaskHandler);
        content.style.cursor = "pointer";
        content.addEventListener("click", completeTaskHandler);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn-delete-task";
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.title = "Eliminar tarea";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteTask(task.id, true);
        });

        card.appendChild(check);
        card.appendChild(content);
        card.appendChild(deleteBtn);

        tasksListContainer.appendChild(card);
    });
}

let taskCompletedTimer = null;

function showTaskCompletedModal() {
    const modal = document.getElementById("modal-task-completed");
    if (!modal) return;

    modal.classList.add("open");
    
    modal.onclick = () => {
        modal.classList.remove("open");
        if (taskCompletedTimer) clearTimeout(taskCompletedTimer);
    };

    if (taskCompletedTimer) clearTimeout(taskCompletedTimer);
    
    taskCompletedTimer = setTimeout(() => {
        modal.classList.remove("open");
    }, 3000);
}

window.deleteTask = function(id, showNotice = true) {
    duoTasks = duoTasks.filter(t => t.id !== id);
    saveToLocalStorage();
    pushToCloud();
    renderTasks();
    if (showNotice) showToast("Tarea eliminada");
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
        
        const senderTag = n.sender === "he" ? "De Javi" : "De Mari";

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
    saveToLocalStorage();
    pushToCloud();
    renderLoveNotes();
    showToast("Notita eliminada 🗑️");
};

window.clearAllLoveNotes = function() {
    if (confirm("¿Estás seguro de que deseas eliminar todas las notitas actuales?")) {
        loveNotes = [];
        saveToLocalStorage();
        pushToCloud();
        renderLoveNotes();
        showToast("Todas las notitas han sido eliminadas 🗑️");
    }
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

    function updateTaskSubjectDropdown(assignedOwner, selectedSubjectId = "") {
        const subjectSelect = document.getElementById("form-task-subject");
        if (!subjectSelect) return;

        subjectSelect.innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "General / Sin materia asignada";
        subjectSelect.appendChild(defaultOption);

        if (assignedOwner === "he") {
            HE_CLASSES.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c.id;
                opt.dataset.name = c.name;
                opt.dataset.color = c.color || "sky";
                opt.textContent = c.name;
                if (c.id === selectedSubjectId) opt.selected = true;
                subjectSelect.appendChild(opt);
            });
        } else if (assignedOwner === "she") {
            SHE_CLASSES.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c.id;
                opt.dataset.name = c.name;
                opt.dataset.color = c.color || "pink";
                opt.textContent = c.name;
                if (c.id === selectedSubjectId) opt.selected = true;
                subjectSelect.appendChild(opt);
            });
        } else if (assignedOwner === "both") {
            if (HE_CLASSES.length > 0) {
                const groupHe = document.createElement("optgroup");
                groupHe.label = "Materias de Javi";
                HE_CLASSES.forEach(c => {
                    const opt = document.createElement("option");
                    opt.value = c.id;
                    opt.dataset.name = c.name;
                    opt.dataset.color = c.color || "sky";
                    opt.textContent = c.name;
                    if (c.id === selectedSubjectId) opt.selected = true;
                    groupHe.appendChild(opt);
                });
                subjectSelect.appendChild(groupHe);
            }
            if (SHE_CLASSES.length > 0) {
                const groupShe = document.createElement("optgroup");
                groupShe.label = "Materias de Mari";
                SHE_CLASSES.forEach(c => {
                    const opt = document.createElement("option");
                    opt.value = c.id;
                    opt.dataset.name = c.name;
                    opt.dataset.color = c.color || "pink";
                    opt.textContent = c.name;
                    if (c.id === selectedSubjectId) opt.selected = true;
                    groupShe.appendChild(opt);
                });
                subjectSelect.appendChild(groupShe);
            }
        }
    }

    // Task modal
    const taskAssignedSelect = document.getElementById("form-task-assigned");
    if (taskAssignedSelect) {
        taskAssignedSelect.addEventListener("change", (e) => {
            updateTaskSubjectDropdown(e.target.value);
        });
    }

    document.getElementById("btn-new-task").addEventListener("click", () => {
        const defaultUser = currentActiveUser || "he";
        if (taskAssignedSelect) taskAssignedSelect.value = defaultUser;
        updateTaskSubjectDropdown(defaultUser);
        document.getElementById("modal-task-form").classList.add("open");
    });

    document.getElementById("task-editor-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("form-task-name").value.trim();
        const assigned = document.getElementById("form-task-assigned").value;
        const dueDate = document.getElementById("form-task-date").value;
        const priority = document.getElementById("form-task-priority").value;

        const subjectSelect = document.getElementById("form-task-subject");
        const selectedOption = subjectSelect ? subjectSelect.options[subjectSelect.selectedIndex] : null;
        const subjectId = subjectSelect ? subjectSelect.value : "";
        const subjectName = (subjectId && selectedOption) ? (selectedOption.dataset.name || selectedOption.textContent.replace(/^[📘🌸]\s*/, '')) : "";
        const subjectColor = (subjectId && selectedOption) ? (selectedOption.dataset.color || "") : "";

        if (!name) return;

        duoTasks.push({ 
            id: `task-${Date.now()}`, 
            assigned, 
            subjectId,
            subjectName,
            subjectColor,
            name, 
            dueDate, 
            priority, 
            completed: false 
        });
        pushToCloud();
        renderTasks();
        closeAllModals();
        
        const actorName = currentActiveUser === "he" ? "Javi" : "Mari";
        sendPushNotification("Horario Duo - Nueva Tarea", `${actorName} ha agregado la tarea: ${name}`);
        showToast("Tarea compartida agregada");
    });

    // Love Note modal
    document.getElementById("btn-add-love-note").addEventListener("click", () => {
        const senderSelect = document.getElementById("note-sender");
        if (senderSelect) senderSelect.value = currentActiveUser || "he";
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

        const senderName = sender === "he" ? "Javi" : "Mari";
        const preview = content.length > 50 ? content.substring(0, 47) + "..." : content;
        sendPushNotification("Horario Duo - Notita Nueva", `${senderName} te ha dejado una notita: "${preview}"`);
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
    const handleResetAllData = () => {
        if (confirm("¿Restablecer los datos predeterminados de la app de pareja?")) {
            localStorage.clear();
            loadFromLocalStorage();
            renderCurrentSchedule();
            renderTasks();
            renderAttendance();
            renderLoveNotes();
            showToast("Datos restablecidos");
        }
    };

    const btnResetAll = document.getElementById("btn-reset-all");
    if (btnResetAll) btnResetAll.addEventListener("click", handleResetAllData);

    const btnResetAllSettings = document.getElementById("btn-reset-all-settings");
    if (btnResetAllSettings) btnResetAllSettings.addEventListener("click", handleResetAllData);

    // Settings Tab Listeners
    const btnLogoutSettings = document.getElementById("btn-logout-settings");
    if (btnLogoutSettings) {
        btnLogoutSettings.addEventListener("click", () => {
            localStorage.removeItem("horario_duo_unlocked");
            const lockOverlay = document.getElementById("lock-screen-overlay");
            if (lockOverlay) lockOverlay.classList.remove("unlocked");
            const pinInput = document.getElementById("pin-input-field");
            if (pinInput) {
                pinInput.value = "";
                setTimeout(() => pinInput.focus(), 300);
            }
            showToast("Sesión cerrada");
        });
    }

    const btnSyncSettingsNow = document.getElementById("btn-sync-settings-now");
    if (btnSyncSettingsNow) {
        btnSyncSettingsNow.addEventListener("click", () => {
            showToast("Sincronizando con la nube...");
            initFirebaseSyncWithRetry();
            pushToCloud();
        });
    }
}

function openDetailsModal(classObj, session) {
    currentlySelectedClassObj = classObj;
    const modal = document.getElementById("modal-details");
    document.getElementById("detail-owner-tag").textContent = classObj.owner === "he" ? "Horario de Javi" : "Horario de Mari";
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
    document.querySelectorAll(".modal-backdrop, .modal-overlay").forEach(m => m.classList.remove("open"));
}

function setupSyncPin() {
    const badge = document.getElementById("sync-status-badge");
    if (badge) {
        badge.style.cursor = "pointer";
        badge.title = "Toca para sincronizar en tiempo real con Firebase";
        badge.addEventListener("click", () => {
            showToast("Sincronizando con la nube...");
            initFirebaseSyncWithRetry();
            pushToCloud();
        });
    }
}

function updateSyncBadge(isOnline) {
    const badge = document.getElementById("sync-status-badge");
    const settingsBadge = document.getElementById("settings-sync-badge");
    if (badge) {
        if (isOnline !== false) {
            badge.className = "sync-badge online";
            badge.textContent = "Sincronizado en Vivo";
        } else {
            badge.className = "sync-badge offline";
            badge.textContent = "Modo Local";
        }
    }
    if (settingsBadge) {
        if (isOnline !== false) {
            settingsBadge.className = "settings-sync-pill online";
            settingsBadge.textContent = "Sincronizado en Vivo";
        } else {
            settingsBadge.className = "settings-sync-pill offline";
            settingsBadge.textContent = "Modo Local";
        }
    }
}

function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

/* ==========================================================================
   Push Notifications System (Background & Lock Screen Delivery - No Emojis)
   ========================================================================== */
const PUSH_CHANNEL_URL = "https://ntfy.sh/horario_duo_javi_mari_room_2026";

async function sendPushNotification(title, body) {
    if (!title || !body) return;
    try {
        await fetch(PUSH_CHANNEL_URL, {
            method: "POST",
            body: body,
            headers: {
                "Title": title,
                "Priority": "high"
            }
        });
    } catch (e) {
        console.warn("Push delivery notice:", e);
    }
}

function updateNotifStatusBadge() {
    const badge = document.getElementById("settings-notif-status-badge");
    const btn = document.getElementById("btn-toggle-notif");
    if (!badge || !btn) return;

    if (!("Notification" in window)) {
        badge.textContent = "No Soportado";
        badge.className = "settings-sync-pill offline";
        btn.disabled = true;
        btn.textContent = "No Soportado";
        return;
    }

    if (Notification.permission === "granted") {
        badge.textContent = "Notificaciones Activas";
        badge.className = "settings-sync-pill online";
        btn.textContent = "Notificaciones Activadas";
        btn.className = "btn btn-outline btn-sm";
    } else if (Notification.permission === "denied") {
        badge.textContent = "Permiso Bloqueado";
        badge.className = "settings-sync-pill offline";
        btn.textContent = "Desbloquear en Navegador";
        btn.className = "btn btn-outline btn-sm";
    } else {
        badge.textContent = "Notificaciones Inactivas";
        badge.className = "settings-sync-pill offline";
        btn.textContent = "Activar Notificaciones";
        btn.className = "btn btn-primary btn-sm";
    }
}

function setupPushNotifications() {
    updateNotifStatusBadge();

    const btnToggleNotif = document.getElementById("btn-toggle-notif");
    if (btnToggleNotif) {
        btnToggleNotif.addEventListener("click", async () => {
            if (!("Notification" in window)) {
                showToast("Tu navegador o dispositivo no soporta notificaciones");
                return;
            }
            if (Notification.permission === "granted") {
                showToast("Las notificaciones ya estan activas");
                return;
            }
            try {
                const permission = await Notification.requestPermission();
                updateNotifStatusBadge();
                if (permission === "granted") {
                    showToast("Notificaciones activadas correctamente");
                    subscribeToPushNotifications();
                    sendPushNotification("Horario Duo", "Notificaciones activadas en este dispositivo");
                } else {
                    showToast("Permiso de notificaciones denegado");
                }
            } catch (err) {
                console.error("Error al solicitar permiso:", err);
            }
        });
    }

    const btnTestNotif = document.getElementById("btn-test-notif");
    if (btnTestNotif) {
        btnTestNotif.addEventListener("click", async () => {
            if (!("Notification" in window)) {
                showToast("Tu navegador no soporta notificaciones");
                return;
            }
            if (Notification.permission !== "granted") {
                const permission = await Notification.requestPermission();
                updateNotifStatusBadge();
                if (permission !== "granted") {
                    showToast("Debes activar las notificaciones primero");
                    return;
                }
            }
            showToast("Enviando notificacion de prueba...");
            const userName = currentActiveUser === "he" ? "Javi" : "Mari";
            await sendPushNotification("Horario Duo", `Notificacion de prueba enviada por ${userName}`);

            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then(reg => {
                    reg.showNotification("Horario Duo", {
                        body: "Prueba exitosa. Recibiras avisos cuando tu pareja agregue notitas o tareas.",
                        icon: "icon-192.png",
                        badge: "icon-192.png",
                        vibrate: [200, 100, 200]
                    });
                });
            } else {
                new Notification("Horario Duo", {
                    body: "Prueba exitosa. Recibiras avisos cuando tu pareja agregue notitas o tareas.",
                    icon: "icon-192.png"
                });
            }
        });
    }

    if ("Notification" in window && Notification.permission === "granted") {
        subscribeToPushNotifications();
    }
}

function subscribeToPushNotifications() {
    if (window.notifEventSource) return;
    try {
        const source = new EventSource(`${PUSH_CHANNEL_URL}/sse`);
        window.notifEventSource = source;
        source.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.event === "message" && data.message) {
                    const title = data.title || "Horario Duo";
                    const body = data.message;
                    if (Notification.permission === "granted" && document.visibilityState !== "visible") {
                        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                            navigator.serviceWorker.ready.then(reg => {
                                reg.showNotification(title, {
                                    body: body,
                                    icon: "icon-192.png",
                                    badge: "icon-192.png",
                                    vibrate: [200, 100, 200]
                                });
                            });
                        } else {
                            new Notification(title, {
                                body: body,
                                icon: "icon-192.png"
                            });
                        }
                    }
                }
            } catch (err) {}
        };
    } catch (e) {
        console.warn("EventSource error:", e);
    }
}

