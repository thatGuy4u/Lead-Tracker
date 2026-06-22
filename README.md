# Lead Tracker Chrome Extension

A modern Chrome Extension that helps users save, organize, search, and manage important leads, URLs, and resources directly from the browser.

Instead of losing useful links across tabs, bookmarks, or notes, Lead Tracker provides a fast and lightweight way to capture and manage leads with powerful productivity features.

---

## ✨ Features

### 📌 Save Current Tab

* Save the active browser tab with a single click.
* Automatically captures:

  * URL
  * Page title
  * Favicon

### 🔗 Manual URL Entry

* Add custom URLs manually.
* URL validation prevents invalid entries.
* Automatically prepends `https://` when omitted.

### 💾 Persistent Storage

* Leads are stored using Chrome's Local Storage.
* Data remains available even after closing the browser.

### 🔍 Real-Time Search

* Instantly search through saved leads.
* Searches across:

  * URL
  * Title

### ✏️ Edit Leads

* Update lead titles directly within the extension.
* Inline editing experience with instant updates.

### 🗑️ Delete Individual Leads

* Remove unwanted leads with a single click.
* Changes are reflected immediately.

### ⚠️ Delete All Leads

* Clear all saved leads at once.
* Includes confirmation modal to prevent accidental deletion.

### 📤 Export Leads

* Export all saved leads as a JSON file.
* Useful for backups or data migration.

### 🕒 Relative Timestamps

* Each lead stores its creation time.
* Displays user-friendly timestamps such as:

  * 2 minutes ago
  * 3 hours ago
  * Yesterday

### 🌐 Favicon Support

* Displays website favicons for easier recognition.
* Includes fallback generated icons when favicons are unavailable.

### 🔔 Toast Notifications

* Instant feedback for all actions:

  * Success
  * Error
  * Information

### ⌨️ Keyboard Shortcuts

* **Enter** → Save lead
* **Escape** → Close modal/dialog

### 🚫 Duplicate Detection

* Detects already saved URLs.
* Prevents duplicate entries.

### 📊 Lead Counter

* Real-time badge displaying total saved leads.

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (ES6+)

### Chrome APIs

* Chrome Tabs API (`chrome.tabs.query`)
* Chrome Extension APIs

### Storage

* Local Storage

### Browser Features

* JSON Export
* File Download API
* Event Listeners
* DOM Manipulation

---

## 🚀 Installation

### Method 1: Load Unpacked Extension

1. Clone the repository

```bash
git clone https://github.com/your-username/lead-tracker.git
```

2. Open Chrome and navigate to:

```text
chrome://extensions/
```

3. Enable **Developer Mode**

4. Click **Load Unpacked**

5. Select the project folder

6. Pin the extension to the toolbar

---

## 📖 How to Use

### Save Current Tab

1. Open any webpage.
2. Click the Lead Tracker extension.
3. Press **Save Tab**.

### Save a Custom URL

1. Paste a URL into the input field.
2. Press Enter or click Save.

### Search Leads

1. Type into the search bar.
2. Results update instantly.

### Export Leads

1. Click Export.
2. A JSON backup file is downloaded automatically.

---

## 🎯 Use Cases

* Job applications
* Sales lead tracking
* Startup research
* Bookmark management
* Resource collection
* Learning materials organization
* Competitive analysis

---

## 🔒 Data Privacy

Lead Tracker stores all data locally in your browser.

* No external servers
* No account required
* No tracking
* No analytics
* No data collection

Your data stays on your device.

---

## 📄 License

This project is licensed under the GNU AGPL v3.0.

---

Built with ❤️ by Aman, to make lead management simple, fast, and organized.