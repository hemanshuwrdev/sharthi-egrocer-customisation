<template>
    <div>
        <div class="page-heading">
            <div class="row">
            <div class="col-12 col-md-6 order-md-1 order-last">
                <h3> {{__('seller_requests')}}</h3>
            </div>
            <div class="col-12 col-md-6 order-md-2 order-first">
                <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><router-link to="/dashboard">{{ __('dashboard') }}</router-link></li>
                        <li class="breadcrumb-item active" aria-current="page">{{__('seller_requests')}}</li>
                    </ol>
                </nav>
            </div>
        </div>
            <div class="row">
                <div class="col-12 col-md-12 order-md-1 order-last">
                    <div class="card">
                        <div class="card-header">
                            <h4>{{__('seller_requests')}}</h4>
                        </div>
                        <div class="card-body">
                            <b-row class="mb-2">

                                <b-col md="3" offset-md="8">
                                    <h6 class="box-title">{{ __('search') }}</h6>
                                    <b-form-input
                                        id="filter-input"
                                        v-model="filter"
                                        type="search"
                                        :placeholder="__('search')"
                                        @input="getRecords()"
                                    ></b-form-input>
                                </b-col>
                                <b-col md="1" class="text-center">
                                    <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                                        <i class="fa fa-refresh" aria-hidden="true"></i>
                                    </button>
                                </b-col>
                            </b-row>
                            <b-row class="table-responsive">
                            <b-table
                                :items="translatedRecords"
                                :fields="fields"
                                :current-page="currentPage"
                                :per-page="perPage"
                                :filter-included-fields="filterOn"
                                :sort-by.sync="sortBy"
                                :sort-desc.sync="sortDesc"
                                :sort-direction="sortDirection"
                                :bordered="true"
                                :busy="isLoading"
                                stacked="md"
                                show-empty
                                small>
                                <template #table-busy>
                                    <div class="text-center text-black my-2">
                                        <b-spinner class="align-middle"></b-spinner>
                                        <strong>{{ __('loading') }}...</strong>
                                    </div>
                                </template>

                                <template #cell(email)="row">
                                    {{ row.item.email | emailMask }}
                                </template>
                                <template #cell(mobile)="row">
                                    {{ row.item.mobile | mobileMask }}
                                </template>
                                <template #cell(seller_info)="row">
                                    <small :id="'seller'+row.item.id" class="d-inline-flex mb-3 px-2 py-1 text-muted bg-secondary bg-opacity-10 border border-secondary border-opacity-10 rounded-2">
                                        <i class="fa fa-info-circle"></i>
                                    </small>
                                    <b-popover :target="'seller'+row.item.id" triggers="hover" placement="left">
                                        <template #title>
                                           {{__('sellr_details')}}
                                        </template>
                                        <table class="table table-borderless">
                                            <tr>
                                                <th> {{__('name')}}</th>
                                                <td> : {{ row.item.name }}</td>
                                            </tr>
                                            <tr>
                                                <th> {{__('email')}}</th>
                                                <td> : {{ row.item.email }}</td>
                                            </tr>
                                            <tr>
                                                <th> {{__('mobile')}}</th>
                                                <td> : {{ row.item.mobile }}</td>
                                            </tr>
                                        </table>
                                    </b-popover>
                                    {{ row.item.name }}
                                </template>
                                <template #cell(store_info)="row">
                                    <small :id="'store'+row.item.id" class="d-inline-flex mb-3 px-2 py-1 text-muted bg-secondary bg-opacity-10 border border-secondary border-opacity-10 rounded-2">
                                        <i class="fa fa-info-circle"></i>
                                    </small>
                                    <b-popover :target="'store'+row.item.id" triggers="hover" placement="left">
                                        <template #title>
                                            {{__('store_details')}}
                                        </template>
                                        <table class="table table-borderless">
                                            <tr>
                                                <th> {{__('name')}}</th>
                                                <td> : {{ row.item.store_name }}</td>
                                            </tr>
                                            <tr>
                                                <th> {{__('url')}}</th>
                                                <td> : {{ row.item.store_url }}</td>
                                            </tr>
                                            <tr>
                                                <th> {{__('description')}}</th>
                                                <td> : {{ strip_tags(row.item.store_description) }}</td>

                                            </tr>
                                        </table>
                                    </b-popover>
                                    {{ row.item.store_name }}
                                </template>
                                <template #cell(cities)="row">
                                    <span v-if="row.item.cities && row.item.cities.length">
                                        {{ row.item.cities.map(c => c.zone).filter(Boolean).join(', ') }}
                                    </span>
                                </template>
                                <template #cell(other_info)="row">
                                    <small :id="'other'+row.item.id" class="d-inline-flex mb-3 px-2 py-1 text-muted bg-secondary bg-opacity-10 border border-secondary border-opacity-10 rounded-2">
                                        <i class="fa fa-info-circle"></i>
                                    </small>
                                    <b-popover :target="'other'+row.item.id" triggers="hover" placement="left">
                                        <template #title>
                                             {{__('store_details')}}
                                        </template>
                                        <table class="table table-borderless">
                                           <tr>
                                                <th>{{__('tax_name')}}</th>
                                                <td> : {{ row.item.tax_name }}</td>
                                            </tr>
                                                <tr>
                                                <th> {{__('tax_no')}}</th>
                                                <td> : {{ row.item.tax_number }}</td>
                                            </tr>
                                            <tr>
                                                <th> {{__('pan_no')}}</th>
                                                <td> : {{ row.item.pan_number }}</td>
                                            </tr>
                                            <tr v-if="row.item.bank_name">
                                                <th> {{__('bank_name')}}</th>
                                                <td> : {{ row.item.bank_name }}</td>
                                            </tr>
                                            <tr v-if="row.item.account_number">
                                                <th> {{__('account_number')}}</th>
                                                <td> : {{ row.item.account_number }}</td>
                                            </tr>
                                            <tr v-if="row.item.bank_ifsc_code || row.item.ifsc_code">
                                                <th> {{__('bank_ifsc_code')}}</th>
                                                <td> : {{ row.item.bank_ifsc_code || row.item.ifsc_code }}</td>
                                            </tr>
                                        </table>
                                        <p> <a target="_blank" :href="row.item.national_identity_card_url" class="badge bg-success"> <i class="fa fa-eye"></i>  {{__('national_identity_card')}}</a></p>
                                        <p><a target="_blank" :href="row.item.address_proof_url" class="badge bg-success"> <i class="fa fa-eye"></i>  {{__('address_proof')}} </a></p>
                                    </b-popover>
                                    {{ row.item.store_name }}
                                </template>
                                <template #cell(logo)="row">
                                    <span v-if="!row.item.logo">{{__('no_image')}}</span>
                                    <img v-else :src="$storageUrl + row.item.logo" height="50" />
                                </template>
                                <template #cell(created_at)="row">
                                    {{ row.item.created_at }}
                                </template>
                                <template #cell(status)="row">
                                    <label v-if="row.item.status == 0" class='badge bg-primary'>{{ __('registered') }}</label>
                                    <label v-else-if="row.item.status == 1" class='badge bg-success'>{{ __('approved') }}</label>
                                    <label v-else-if="row.item.status == 2" class='badge bg-warning'>{{ __('reject') }}</label>
                                    <label v-else-if="row.item.status == 3" class='badge bg-danger'>{{ __('deactive') }}</label>
                                    <label v-else-if="row.item.status == 7" class='badge bg-danger'>{{ __('removed') }}</label>
                                </template>

                                <template #cell(require_products_approval)="row">
                                    <label v-if="row.item.require_products_approval == 1" class='badge bg-success'>{{ __('yes') }}</label>
                                    <label v-else-if="row.item.require_products_approval == 0" class='badge bg-danger'>{{ __('no') }}</label>
                                </template>
                                <template #cell(actions)="row">

                                    <button class="btn btn-sm btn-success"
                                            type="button"
                                            @click="updateStatus(row.index,row.item.id, 1)" v-if="$can('seller_delete')" v-b-tooltip.hover title="Change Status">
                                         {{__('approved')}}
                                    </button>
                                    <button class="btn btn-sm btn-danger"
                                            type="button"
                                            @click="updateStatus(row.index,row.item.id, 2)" v-if="$can('seller_delete')" v-b-tooltip.hover title="Change Status">
                                         {{__('reject')}}
                                    </button>

                                </template>

                            </b-table>
                            </b-row>

                            <b-row>
                                <b-col  md="2" class="my-1">
                                    <b-form-group
                                        :label="__('per_page')"
                                        label-for="per-page-select"
                                        label-align-sm="right"
                                        label-size="sm"
                                        class="mb-0">
                                        <b-form-select
                                            id="per-page-select"
                                            v-model="perPage"
                                            :options="pageOptions"
                                            size="sm"
                                            class="form-control form-select"
                                        ></b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col  md="4" class="my-1" offset-md="6">
                                    <label>{{__('total_records')}} :- {{ totalRows }} </label>
                                    <b-pagination
                                        v-model="currentPage"
                                        :total-rows="totalRows"
                                        :per-page="perPage"
                                        align="fill"
                                        size="sm"
                                        class="my-0"
                                    ></b-pagination>
                                </b-col>
                            </b-row>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            fields: [
                { key: 'id', label: __('id'), sortable: true, sortDirection: 'desc' },
                { key: 'seller_info', label: __('seller_info'), class: 'text-legt', sortable: true, sortDirection: 'desc' },
                { key: 'store_info', label: __('store_details'), class: 'text-left', sortable: true, sortDirection: 'desc' },
                { key: 'categories_array', label: __('category'), class: 'text-center', sortable: true, sortDirection: 'desc' },
                { key: 'cities', label: __('city'), class: 'text-center' },
                { key: 'logo', label: __('logo'), class: 'text-center', sortable: true, sortDirection: 'desc' },
                { key: 'other_info', label: __('other_info'), class: 'text-left', sortable: true, sortDirection: 'desc' },
                { key: 'commission', label: __('commission'), class: 'text-center', sortable: true, sortDirection: 'desc' },
                { key: 'created_at', label: __('date'), class: 'text-center', sortable: true, sortDirection: 'desc' },
                { key: 'status', label: __('status'), class: 'text-center', sortable: true, sortDirection: 'desc' },
                { key: 'actions', label: __('actions')}
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
            sectionStyle : 'style_1',
            max_visible_units : 12,
            max_col_in_single_row : 3,
            records: [],

            filterStatus : 0,
            currentLanguageId: null,
            activeLanguages: []
        }
    },
    computed: {
        translatedRecords() {
            if (!this.currentLanguageId || !Array.isArray(this.records)) {
                return this.records;
            }
            return this.records.map(seller => {
                const translatedSeller = { ...seller };
                if (seller.translations && Array.isArray(seller.translations)) {
                    const translation = seller.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );
                    if (translation) {
                        if (translation.name && translation.name.trim() !== '') {
                            translatedSeller.name = translation.name;
                        }
                        if (translation.store_name && translation.store_name.trim() !== '') {
                            translatedSeller.store_name = translation.store_name;
                        }
                    }
                }
                return translatedSeller;
            });
        }
    },
    created: function() {
        this.category_id = this.$route.params.id;
        this.$eventBus.$on('recordSaved', (message) => {
            this.showMessage('success', message);
            this.getRecords();
        });

        this.fetchActiveLanguages().then(() => {
            this.getRecords();
        });
    },
    methods: {
        async fetchActiveLanguages() {
            try {
                const res = await axios.get(this.$apiUrl + '/active_languages');
                if (res.data.status === 1 && Array.isArray(res.data.data)) {
                    this.activeLanguages = res.data.data;
                    const appLocale = window.appLocale || 'en';
                    const currentLang = this.activeLanguages.find(
                        l => l.code === appLocale
                    );
                    if (currentLang) {
                        this.currentLanguageId = currentLang.id;
                    } else {
                        const def = this.activeLanguages.find(l => l.is_default === 1);
                        if (def) this.currentLanguageId = def.id;
                    }
                }
            } catch (e) {
                console.error('Language load failed', e);
            }
        },
        strip_tags(input) {
            return input.replace(/<\/?[^>]+(>|$)/g, "");
        },
        getRecords(){
            this.isLoading = true;
            axios.get(this.$apiUrl + '/sellers', {
                params: {
                        filterStatus: this.filterStatus,
                        search: this.filter
                }
            }).then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.records = data.data;
                    this.totalRows = this.records.length
                });
        },


       updateStatus(index, id, selectedStatus){
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('you_want_be_able_to_revert_this'),
                confirmButtonText: __('yes_sure'),
                cancelButtonText: __('cancel'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
            }).then(async result => {
                if (result.value) {
                    let remarks = "";
                    if (selectedStatus === 2) {
                        const {value: text} = await this.$swal.fire({
                            title: __('remarks'),
                            input: 'textarea',
                            /*inputLabel: 'Remarks',*/
                            inputPlaceholder: 'Type your remarks here...',
                            inputAttributes: {
                                'aria-label': 'Type your remarks here'
                            },
                            confirmButtonText: "Submit",
                            cancelButtonText: "Cancel",
                            showCancelButton: true,

                            inputValidator: (value) => {
                                return new Promise((resolve) => {
                                    if (value !== '') {
                                        resolve()
                                    } else {
                                        resolve('The Remarks field is required')
                                    }
                                })
                            }
                        })
                        if (text) {
                            remarks = text;
                        }
                    }
                    if (selectedStatus === 1 || (selectedStatus === 2 && remarks !== "") ){
                        this.isLoading = true
                        let postData = {
                            id : id,
                            status: selectedStatus,
                            remark : remarks
                        }
                        axios.post(this.$apiUrl + '/sellers/update_status',postData)
                            .then((response) => {
                                this.isLoading = false
                                let data = response.data;
                                this.getRecords();
                                this.showMessage('success', data.message);
                            });
                    }
                }
            });
        },

        deleteSeller(index, id){
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('you_want_be_able_to_revert_this'),
                confirmButtonText: __('yes_sure'),
                cancelButtonText: __('cancel'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
            }).then(result => {
                if (result.value) {
                    this.isLoading = true
                    let postData = {
                        id : id
                    }
                    axios.post(this.$apiUrl + '/sellers/delete',postData)
                        .then((response) => {
                            this.isLoading = false
                            let data = response.data;
                            this.records.splice(index, 1)
                            this.showSuccess(data.message)
                        });
                }
            });
        },
    }
};
</script>

