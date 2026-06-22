/* ============================================
   Lead Tracker — Full Feature JavaScript
   ============================================ */

// ---- DOM Elements ----
const nameEl = document.getElementById("name-el");
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const tabBtn = document.getElementById("tab-btn");
const ulEl = document.getElementById("ul-el");
const searchInput = document.getElementById("search-input");
const deleteBtn = document.getElementById("delete-btn");
const exportBtn = document.getElementById("export-btn");
const emptyState = document.getElementById("empty-state");
const actionBar = document.getElementById("action-bar");
const leadCountBadge = document.getElementById("lead-count");
const modalOverlay = document.getElementById("modal-overlay");
const modalCancel = document.getElementById("modal-cancel");
const modalConfirm = document.getElementById("modal-confirm");
const toastContainer = document.getElementById("toast-container");

// ---- State ----
let myLeads = [];
let editingId = null;

// ---- Init ----
loadLeads();
renderLeads();

// ---- LocalStorage ----
function loadLeads() {
    const stored = localStorage.getItem("leadTracker_leads");
    if (stored) {
        try {
            myLeads = JSON.parse(stored);
        } catch (e) {
            myLeads = [];
        }
    }
}

function saveLeads() {
    localStorage.setItem("leadTracker_leads", JSON.stringify(myLeads));
}

// ---- Helpers ----
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function normalizeUrl(url) {
    url = url.trim();
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }
    return url;
}

function getDomain(url) {
    try {
        return new URL(url).hostname.replace("www.", "");
    } catch {
        return url;
    }
}

function getFaviconUrl(url) {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
        return null;
    }
}

function getRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    if (weeks < 4) return `${weeks}w ago`;
    return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isDuplicate(url) {
    return myLeads.some(lead => lead.url.toLowerCase() === url.toLowerCase());
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// ---- Toast Notifications ----
function showToast(message, type = "info") {
    const icons = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
        warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
    };

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span>${escapeHtml(message)}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("fade-out");
        toast.addEventListener("animationend", () => toast.remove());
    }, 2500);
}

// ---- Add Lead ----
function addLead(url, title, favicon) {
    url = normalizeUrl(url);
    if (!url) {
        showToast("Please enter a valid URL", "error");
        inputEl.style.animation = "shake 0.3s ease";
        setTimeout(() => inputEl.style.animation = "", 300);
        return;
    }

    if (isDuplicate(url)) {
        showToast("This URL is already saved", "warning");
        return;
    }

    const lead = {
        id: generateId(),
        url: url,
        title: title || getDomain(url),
        favicon: favicon || getFaviconUrl(url),
        createdAt: Date.now()
    };

    myLeads.unshift(lead);
    saveLeads();
    renderLeads();
    showToast("Lead saved!", "success");
}

// ---- Save Lead Button ----
inputBtn.addEventListener("click", function () {
    const url = inputEl.value.trim();
    const name = nameEl.value.trim();
    if (!url) {
        showToast("Please enter a URL", "error");
        inputEl.style.animation = "shake 0.3s ease";
        setTimeout(() => inputEl.style.animation = "", 300);
        return;
    }
    addLead(url, name || "", null);
    inputEl.value = "";
    nameEl.value = "";
    nameEl.focus();
});

// Enter key on URL input
inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        inputBtn.click();
    }
});

// Enter key on name input — move to URL input
nameEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        inputEl.focus();
    }
});

// ---- Save Current Tab Button ----
tabBtn.addEventListener("click", function () {
    // Check if we're in a Chrome extension context
    if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs && tabs.length > 0 && tabs[0].url) {
                const tab = tabs[0];
                const tabUrl = tab.url;
                const tabTitle = tab.title || getDomain(tabUrl);
                const tabFavicon = tab.favIconUrl || getFaviconUrl(tabUrl);

                // Check for restricted URLs
                if (tabUrl.startsWith("chrome://") || tabUrl.startsWith("chrome-extension://") || tabUrl.startsWith("about:")) {
                    showToast("Cannot save browser internal pages", "warning");
                    return;
                }

                addLead(tabUrl, tabTitle, tabFavicon);
            } else {
                showToast("Could not access the current tab", "error");
            }
        });
    } else {
        // Fallback for non-Chrome environment (testing in browser)
        showToast("Save Tab only works as a Chrome extension", "info");
    }
});

// ---- Search / Filter ----
searchInput.addEventListener("input", function () {
    renderLeads();
});

// ---- Render Leads ----
function renderLeads() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let filtered = myLeads;

    if (searchTerm) {
        filtered = myLeads.filter(lead =>
            lead.url.toLowerCase().includes(searchTerm) ||
            lead.title.toLowerCase().includes(searchTerm)
        );
    }

    // Update count badge
    leadCountBadge.textContent = myLeads.length;

    // Toggle empty state and action bar
    if (myLeads.length === 0) {
        emptyState.classList.add("visible");
        actionBar.classList.remove("visible");
        ulEl.innerHTML = "";
        return;
    } else {
        emptyState.classList.remove("visible");
        actionBar.classList.add("visible");
    }

    if (filtered.length === 0 && searchTerm) {
        ulEl.innerHTML = `<li class="lead-item" style="justify-content: center; padding: 20px;">
            <span style="color: var(--text-muted); font-size: 0.82rem;">No leads matching "${escapeHtml(searchTerm)}"</span>
        </li>`;
        return;
    }

    let html = "";
    for (const lead of filtered) {
        const isEditing = editingId === lead.id;
        const relativeTime = getRelativeTime(lead.createdAt);
        const domain = getDomain(lead.url);

        if (isEditing) {
            html += `
                <li class="lead-item editing" data-id="${lead.id}">
                    <div class="lead-info" style="gap: 6px;">
                        <input class="edit-input" id="edit-title-${lead.id}" type="text" value="${escapeHtml(lead.title)}" placeholder="Lead name">
                        <div class="edit-actions">
                            <button class="lead-action-btn" data-action="save" data-id="${lead.id}" title="Save">
                                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue-bright)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </button>
                            <button class="lead-action-btn" data-action="cancel" title="Cancel">
                                <svg viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                    </div>
                </li>`;
        } else {
            html += `
                <li class="lead-item" data-id="${lead.id}">
                    ${lead.favicon
                        ? `<img class="lead-favicon" src="${escapeHtml(lead.favicon)}" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                           <span class="lead-favicon-fallback" style="display:none;">${domain.charAt(0).toUpperCase()}</span>`
                        : `<span class="lead-favicon-fallback">${domain.charAt(0).toUpperCase()}</span>`
                    }
                    <div class="lead-info">
                        <span class="lead-title">${escapeHtml(lead.title)}</span>
                        <div class="lead-url-row">
                            <a class="lead-url" href="${escapeHtml(lead.url)}" target="_blank" title="${escapeHtml(lead.url)}">${escapeHtml(domain)}</a>
                            <span class="lead-time">${relativeTime}</span>
                        </div>
                    </div>
                    <div class="lead-actions">
                        <button class="lead-action-btn" data-action="edit" data-id="${lead.id}" title="Edit">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="lead-action-btn delete-lead-btn" data-action="delete" data-id="${lead.id}" title="Delete">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </li>`;
        }
    }

    ulEl.innerHTML = html;
}

// ---- Event Delegation for Lead Actions ----
// Using event delegation instead of inline onclick — this is the fix for
// edit/delete buttons not working. Inline onclick="fn()" in innerHTML
// can't find functions that aren't on the global window object.
ulEl.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    switch (action) {
        case "delete":
            deleteLead(id);
            break;
        case "edit":
            startEdit(id);
            break;
        case "save":
            saveEdit(id);
            break;
        case "cancel":
            cancelEdit();
            break;
    }
});

// ---- Delete Individual Lead ----
function deleteLead(id) {
    myLeads = myLeads.filter(lead => lead.id !== id);
    saveLeads();
    renderLeads();
    showToast("Lead deleted", "info");
}

// ---- Edit Lead ----
function startEdit(id) {
    editingId = id;
    renderLeads();
    // Focus the title input after render
    setTimeout(() => {
        const titleInput = document.getElementById(`edit-title-${id}`);
        if (titleInput) {
            titleInput.focus();
            titleInput.select();
        }
    }, 10);
}

function saveEdit(id) {
    const titleInput = document.getElementById(`edit-title-${id}`);
    const lead = myLeads.find(l => l.id === id);
    if (lead && titleInput) {
        const newTitle = titleInput.value.trim();
        if (!newTitle) {
            showToast("Name cannot be empty", "error");
            return;
        }
        lead.title = newTitle;
        saveLeads();
        showToast("Lead updated!", "success");
    }
    editingId = null;
    renderLeads();
}

function cancelEdit() {
    editingId = null;
    renderLeads();
}

// ---- Delete All (with Modal) ----
deleteBtn.addEventListener("click", function () {
    modalOverlay.classList.add("visible");
});

modalCancel.addEventListener("click", function () {
    modalOverlay.classList.remove("visible");
});

modalConfirm.addEventListener("click", function () {
    myLeads = [];
    saveLeads();
    renderLeads();
    modalOverlay.classList.remove("visible");
    showToast("All leads deleted", "info");
});

// Close modal on overlay click
modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove("visible");
    }
});

// ---- Export ----
exportBtn.addEventListener("click", function () {
    if (myLeads.length === 0) {
        showToast("No leads to export", "warning");
        return;
    }

    const data = JSON.stringify(myLeads, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${myLeads.length} leads`, "success");
});

// ---- Keyboard Shortcuts ----
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        // Close modal
        if (modalOverlay.classList.contains("visible")) {
            modalOverlay.classList.remove("visible");
        }
        // Cancel edit
        if (editingId) {
            cancelEdit();
        }
    }
});

// Handle Enter in edit mode
document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && editingId) {
        const target = e.target;
        if (target && target.classList.contains("edit-input")) {
            saveEdit(editingId);
        }
    }
});
