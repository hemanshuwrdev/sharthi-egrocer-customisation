<template>
    <div class="list-page">
        <div class="page-head d-flex justify-content-between align-items-center">
            <h3 class="page-head-title">{{ __('activity_logs') }}</h3>
            <button class="btn btn-outline-danger d-inline-flex align-items-center gap-2" @click="showClearModal = true">
                <i class="fa fa-trash" aria-hidden="true"></i>
                <span>{{ __('clear_logs') }}</span>
            </button>
        </div>

        <div class="list-surface">
            <div class="list-toolbar flex-wrap gap-2">
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input id="filter-input" v-model="filter" type="search"
                        :placeholder="__('search')" @input="onFilterChange"></b-form-input>
                </div>

                <b-form-select v-model="selectedLogType" :options="logTypeOptions" size="sm"
                    class="form-control form-select w-auto" @change="fetchLogs(1)"></b-form-select>

                <b-form-select v-model="selectedEvent" :options="eventOptions" size="sm"
                    class="form-control form-select w-auto" @change="fetchLogs(1)"></b-form-select>

                <b-form-select v-model="selectedModule" :options="moduleOptions" size="sm"
                    class="form-control form-select w-auto" @change="fetchLogs(1)"></b-form-select>

                <b-form-select v-model="selectedUser" :options="userOptions" size="sm"
                    class="form-control form-select w-auto" @change="fetchLogs(1)"></b-form-select>

                <b-form-input v-model="selectedDate" type="date" size="sm" class="form-control w-auto"
                    @change="fetchLogs(1)"></b-form-input>

                <button class="list-icon-btn" v-if="selectedDate" v-b-tooltip.hover :title="__('clear')" @click="clearDate">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>

                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="fetchLogs(currentPage)">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table :items="logs" :fields="fields" :busy="isLoading" :bordered="true" stacked="md" show-empty small>
                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>
                    <template #cell(date)="row">
                        {{ row.item.date }}
                    </template>
                    <template #cell(event)="row">
                        <span class="badge" :class="eventBadgeClass(row.item.event)">{{ eventLabel(row.item.event) }}</span>
                    </template>
                    <template #cell(module)="row">
                        <div><strong>{{ row.item.module }} #{{ row.item.subject_id }}</strong></div>
                        <div class="text-muted small" v-if="row.item.subject_label">{{ row.item.subject_label }}</div>
                    </template>
                    <template #cell(description)="row">
                        {{ row.item.description }}
                    </template>
                    <template #cell(user)="row">
                        <div v-if="row.item.user">
                            <div>{{ row.item.user.name }}</div>
                            <div class="text-muted small">{{ row.item.user.role }}</div>
                        </div>
                        <span v-else>-</span>
                    </template>
                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button class="list-action-btn is-edit" @click="viewDetail(row.item)" v-b-tooltip.hover
                                :title="__('view')"><i class="fa fa-eye"></i></button>
                        </div>
                    </template>
                </b-table>
            </div>

            <div class="list-footer">
                <div class="list-perpage">
                    <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                        label-size="sm" class="mb-0">
                        <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" size="sm"
                            class="form-control form-select" @change="fetchLogs(1)"></b-form-select>
                    </b-form-group>
                </div>
                <div class="text-muted small">{{ __('total_records') }}: {{ totalRows }}</div>
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill"
                    size="sm" class="list-pagination" @change="fetchLogs"></b-pagination>
            </div>
        </div>

        <b-modal v-model="showDetailModal" :title="__('activity_log_details')" hide-footer size="lg">
            <div v-if="detailRecord">
                <p><strong>{{ __('date') }}:</strong> {{ detailRecord.date }}</p>
                <p><strong>{{ __('event') }}:</strong> {{ eventLabel(detailRecord.event) }}</p>
                <p><strong>{{ __('module') }}:</strong> {{ detailRecord.module }} #{{ detailRecord.subject_id }}</p>
                <p><strong>{{ __('description') }}:</strong> {{ detailRecord.description }}</p>
                <p v-if="detailRecord.user"><strong>{{ __('user') }}:</strong> {{ detailRecord.user.name }} ({{ detailRecord.user.role }})</p>
                <pre v-if="detailRecord.properties">{{ JSON.stringify(detailRecord.properties, null, 2) }}</pre>
            </div>
        </b-modal>

        <b-modal v-model="showClearModal" :title="__('clear_logs')" @ok="clearLogs" :ok-title="__('clear_logs')"
            ok-variant="danger" :cancel-title="__('cancel')" :ok-disabled="clearing">
            <p class="text-muted">{{ __('clear_logs_hint') }}</p>
            <b-form-group :label="__('delete_entries_older_than')">
                <b-form-select v-model="clearOlderThan" :options="clearOlderThanOptions"></b-form-select>
            </b-form-group>
        </b-modal>
    </div>
</template>
<script>
import axios from "axios";

export default {
    data: function () {
        return {
            fields: [
                { key: 'date', label: __('date'), sortable: false },
                { key: 'event', label: __('event') },
                { key: 'module', label: __('module') },
                { key: 'description', label: __('description') },
                { key: 'user', label: __('user') },
                { key: 'actions', label: __('actions'), class: 'text-center' }
            ],
            logs: [],
            totalRows: 0,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            filter: null,
            filterTimeout: null,

            isLoading: false,

            logTypeOptions: [{ value: '', text: __('all_log_types') }],
            eventOptions: [{ value: '', text: __('all_events') }],
            moduleOptions: [{ value: '', text: __('all_modules') }],
            userOptions: [{ value: '', text: __('all_users') }],

            selectedLogType: '',
            selectedEvent: '',
            selectedModule: '',
            selectedUser: '',
            selectedDate: '',

            showDetailModal: false,
            detailRecord: null,

            showClearModal: false,
            clearing: false,
            clearOlderThan: '90',
            clearOlderThanOptions: [
                { value: '90', text: '90 ' + __('days') },
                { value: '30', text: '30 ' + __('days') },
                { value: '7', text: '7 ' + __('days') },
                { value: 'everything', text: __('everything') },
            ],
        }
    },
    created() {
        this.fetchFilters();
        this.fetchLogs(1);
    },
    methods: {
        fetchFilters() {
            axios.get(this.$apiUrl + '/activity_logs/filters')
                .then(response => {
                    const data = (response.data && response.data.data) || {};

                    this.logTypeOptions = [{ value: '', text: __('all_log_types') }].concat(
                        (data.log_types || []).map(t => ({ value: t, text: t }))
                    );
                    this.eventOptions = [{ value: '', text: __('all_events') }].concat(
                        (data.events || []).map(e => ({ value: e, text: this.eventLabel(e) }))
                    );
                    this.moduleOptions = [{ value: '', text: __('all_modules') }].concat(
                        (data.modules || []).map(m => ({ value: m.value, text: m.label }))
                    );
                    this.userOptions = [{ value: '', text: __('all_users') }].concat(
                        (data.users || []).map(u => ({ value: u.id, text: u.name + (u.role ? ' (' + u.role + ')' : '') }))
                    );
                })
                .catch(() => {});
        },
        onFilterChange() {
            clearTimeout(this.filterTimeout);
            this.filterTimeout = setTimeout(() => {
                this.fetchLogs(1);
            }, 400);
        },
        clearDate() {
            this.selectedDate = '';
            this.fetchLogs(1);
        },
        fetchLogs(page) {
            this.currentPage = page || this.currentPage;
            this.isLoading = true;

            const params = {
                page: this.currentPage,
                per_page: this.perPage,
                search: this.filter || undefined,
                log_type: this.selectedLogType || undefined,
                event: this.selectedEvent || undefined,
                module: this.selectedModule || undefined,
                user_id: this.selectedUser || undefined,
                date: this.selectedDate || undefined,
            };

            axios.get(this.$apiUrl + '/activity_logs', { params })
                .then(response => {
                    const data = (response.data && response.data.data) || {};
                    this.logs = Array.isArray(data.records) ? data.records : [];
                    this.totalRows = typeof data.total === 'number' ? data.total : 0;
                    this.isLoading = false;
                })
                .catch(() => {
                    this.logs = [];
                    this.totalRows = 0;
                    this.isLoading = false;
                });
        },
        eventLabel(event) {
            if (!event) return '';
            return event.charAt(0).toUpperCase() + event.slice(1);
        },
        eventBadgeClass(event) {
            switch (event) {
                case 'created': return 'bg-success';
                case 'updated': return 'bg-info';
                case 'deleted': return 'bg-danger';
                case 'login': return 'bg-primary';
                case 'logout': return 'bg-secondary';
                default: return 'bg-secondary';
            }
        },
        viewDetail(item) {
            this.isLoading = true;
            axios.get(this.$apiUrl + '/activity_logs/' + item.id)
                .then(response => {
                    this.detailRecord = (response.data && response.data.data) || null;
                    this.showDetailModal = true;
                    this.isLoading = false;
                })
                .catch(() => {
                    this.isLoading = false;
                });
        },
        clearLogs(bvModalEvent) {
            bvModalEvent.preventDefault();
            this.clearing = true;
            axios.post(this.$apiUrl + '/activity_logs/clear', { older_than: this.clearOlderThan })
                .then(response => {
                    this.clearing = false;
                    this.showClearModal = false;
                    this.showMessage('success', (response.data && response.data.message) || __('logs_cleared_successfully'));
                    this.fetchLogs(1);
                })
                .catch(() => {
                    this.clearing = false;
                });
        },
    }
};
</script>
