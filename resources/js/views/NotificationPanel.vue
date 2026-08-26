<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('notifications') }}</h3>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input id="filter-input" v-model="filter" type="search"
                        :placeholder="__('search')"></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getNotifications()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table :items="notifications" :fields="fields" :filter="filter"
                    :filter-included-fields="filterOn" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                    :sort-direction="sortDirection" :bordered="true" :busy="isLoading" stacked="md" show-empty
                    small>
                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>

                    <template #cell(title)="row">
                        <router-link :to="'/orders/view/' + row.item.data.order_id"
                            :style="{ fontWeight: row.item.read_at == null ? 'bold' : 'normal' }"
                            @click.prevent="markAsRead(row.item, $event)">
                            {{ row.item.data.text }}
                        </router-link>
                    </template>

                </b-table>
            </div>

            <div class="list-footer">
                <div class="list-perpage">
                    <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                        label-size="sm" class="mb-0">
                        <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" size="sm"
                            class="form-control form-select"></b-form-select>
                    </b-form-group>
                </div>
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill"
                    size="sm" class="list-pagination"></b-pagination>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    components: {
        // InfiniteLoading,
    },
    data: function () {
        return {
            fields: [

                { key: 'title', label: __('title'), class: 'text-center' },

            ],
            totalRows: 1,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: [],
            page: 1,
            isLoading: false,
            notifications: [],
        }
    },
    computed: {
        sortOptions() {
            // Create an options list from our fields
            return this.fields
                .filter(f => f.sortable)
                .map(f => {
                    return { text: f.label, value: f.key }
                })
        }
    },
    mounted() {
        this.totalRows = this.notifications.length
    },
    created: function () {
        this.getNotifications();
    },
    watch: {
        currentPage() {
            this.getNotifications();
        },
        perPage() {
            this.getNotifications();
        },
    },
    methods: {


        getNotifications() {
            this.isLoading = true
            let param = {
                page: this.currentPage,
                per_page: this.perPage
            }
            axios.get(this.$apiUrl + '/panel_notification', {
                params: param
            }).then((response) => {
                this.isLoading = false;
                let data = response.data;
                this.notifications = data.data;
                this.totalRows = response.data.total

            });
        },
        async markAsRead(item, event) {
            if (item.read_at === null) {
                try {
                    await axios.post('/api/mark-as-read', { order_id: item.data.order_id });
                    item.read_at = new Date().toISOString(); // Update locally for immediate UI change
                    this.$router.push('/orders/view/' + item.data.order_id); // Manually navigate
                } catch (error) {
                    console.error("Failed to mark as read", error);
                }
            }
        }

    }
};
</script>
