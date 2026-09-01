<style scoped>
@import "../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";

/* Dashboard Custom Premium Styles */
.dashboard-custom-wrapper {
    background-color: #f8f9fa;
    padding-bottom: 2rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.custom-card {
    border-radius: 16px;
    border: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    background-color: #ffffff;
}

.custom-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
}

.top-metric-card .card-body {
    padding: 1.5rem;
}

/* Icon Wrappers */
.icon-wrapper {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}
.icon-sm {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
}
.store-icon, .cat-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
}

/* Colors based on design */
.bg-soft-blue { background-color: #e3f2fd; }
.text-blue { color: #1e88e5; }
.bg-soft-green { background-color: #e8f5e9; }
.text-green { color: #43a047; }
.bg-soft-orange { background-color: #fff3e0; }
.text-orange { color: #fb8c00; }
.bg-soft-red { background-color: #ffebee; }
.text-red { color: #e53935; }
.bg-soft-purple { background-color: #f3e5f5; }
.text-purple { color: #8e24aa; }
.bg-soft-info { background-color: #e0f7fa; }
.bg-soft-warning { background-color: #fff8e1; }
.bg-soft-danger { background-color: #ffebee; }
.bg-soft-success { background-color: #e8f5e9; }
.bg-soft-primary { background-color: #e3f2fd; }

/* Badges */
.badge.bg-soft-success {
    background-color: #e8f5e9 !important;
    color: #43a047 !important;
    padding: 0.35em 0.65em;
    font-weight: 600;
}
.rank-badge {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #e0e0e0;
    color: #424242;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
}
.rank-badge-light {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    background-color: #f5f5f5;
    color: #757575;
    font-size: 0.85rem;
    font-weight: 600;
}

/* Lists and Tables */
.custom-list .list-group-item {
    border-bottom: 1px solid #f0f0f0 !important;
}
.custom-list .list-group-item:last-child {
    border-bottom: none !important;
}
.custom-table th {
    font-weight: 600;
    letter-spacing: 0.5px;
    color: #757575;
    border-bottom: none;
    padding: 1rem 0.5rem;
}
.custom-table td {
    padding: 1rem 0.5rem;
    border-bottom: 1px solid #f0f0f0;
}
.custom-table tbody tr:last-child td {
    border-bottom: none;
}

/* Typography tweaks */
.fw-bold { font-weight: 700 !important; }
.fw-semibold { font-weight: 600 !important; }
.text-dark { color: #2d3748 !important; }
h3 { letter-spacing: -0.5px; }
h4 { letter-spacing: -0.3px; }
</style>
