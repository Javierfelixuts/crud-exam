```bash
npm install -g @angular/cli
```

---

### Cloning the Repository

Clone the repository:

```bash
git clone https://github.com/TailAdmin/free-angular-admin-dashboard.git
```

---

### Install Dependencies

```bash
npm install
# or
yarn install
```

---

### Start Development Server

```bash
npm start
```

Then open:
👉 `http://localhost:4200`

---

## Angualr.js Tailwind Components

TailAdmin Angular ships with a rich set of **ready-to-use dashboard features**:

* **Ecommerce Dashboard** with essential elements
* Modern, accessible **sidebar navigation**
* **Data visualization** with charts and graphs
* **User profile management** and a **custom 404 page**
* **Tables** and **charts** (line, bar, etc.)
* **Authentication forms** and reusable input components
* **UI elements**: alerts, dropdowns, modals, buttons, and more
* Built-in **Dark Mode** 🕶️
* and many more


## Changelog

### v1.0.2 (2025-12-30)

- **Upgrade**: Successfully upgraded project to **Angular 21**.
- **New Feature**: Implementing **Dynamic API Keys** management.
  - Added functionalities to **Add**, **Edit**, **Delete**, and **Regenerate** API Keys.
- **Enhancement**: Integrated **Flatpickr** date range picker in `StatisticsChartComponent`.
- **Bug Fix**: Resolved `NG0100` ExpressionChangedAfterItHasBeenCheckedError in `PieChartTwoComponent`.
- **Bug Fix**: Fixed `NG8113` warning in `AddApiKeyModalComponent` by removing unused imports.
- **Cleanup**: Removed unused imports and optimized code across various components.
