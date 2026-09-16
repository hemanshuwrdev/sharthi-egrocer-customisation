<template>
    <b-modal ref="my-modal" :title="modal_title" @hidden="$emit('modalClose')" scrollable no-close-on-backdrop no-fade static>
        <div slot="modal-footer">
            <b-button variant="primary" @click="$refs['dummy_submit'].click()" :disabled="isLoading">
                {{ __('save') }}
                <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
            </b-button>
            <b-button variant="secondary" @click="hideModal">{{ __('cancel') }}</b-button>
        </div>

        <form ref="my-form" @submit.prevent="saveRecord" novalidate>
            <div class="form-group">
                <label>{{ __('name') }} <i class="text-danger">*</i></label>
                <input type="text" class="form-control" v-model="name" :placeholder="__('eg_standard_rate')" required>
                <small class="form-text text-muted">{{ __('admin_only_label_customers_see_the_tax_component_name_set_on_the_tax_rule') }}</small>
            </div>
            <div class="form-group">
                <label>{{ __('code') }} <i class="text-danger">*</i></label>
                <input type="text" class="form-control" v-model="code" :placeholder="__('eg_gst')" required>
                <small class="form-text text-muted">{{ __('a_stable_identifier_used_by_imports_and_integrations') }}</small>
            </div>
            <div class="form-group">
                <label>{{ __('description') }}</label>
                <textarea class="form-control" v-model="description" rows="2"></textarea>
            </div>
            <div class="form-group" v-if="id">
                <label>{{ __('status') }}</label>
                <div class="col-md-9 text-left mt-1">
                    <b-form-radio-group v-model="status" :options="[
                        { text: __('deactivate'), value: 0 },
                        { text: __('activate'), value: 1 },
                    ]" buttons button-variant="outline-primary"></b-form-radio-group>
                </div>
            </div>
            <button ref="dummy_submit" style="display:none;"></button>
        </form>
    </b-modal>
</template>

<script>
export default {
    props: ['record'],
    data() {
        return {
            id: null,
            name: '',
            code: '',
            description: '',
            status: 1,
            isLoading: false,
        };
    },
    watch: {
        record: {
            immediate: true,
            handler(newVal) {
                if (newVal && newVal.id) {
                    this.id = newVal.id;
                    this.name = newVal.name;
                    this.code = newVal.code;
                    this.description = newVal.description;
                    this.status = newVal.status;
                } else {
                    this.id = null;
                    this.name = '';
                    this.code = '';
                    this.description = '';
                    this.status = 1;
                }
            },
        },
    },
    computed: {
        modal_title() {
            return this.id ? __('edit_tax_category') : __('add_tax_category');
        },
    },
    methods: {
        showModal() {
            this.$refs['my-modal'].show();
        },
        hideModal() {
            this.$refs['my-modal'].hide();
        },
        saveRecord() {
            this.isLoading = true;

            const postData = {
                name: this.name,
                code: this.code,
                description: this.description,
            };

            if (this.id) {
                postData.id = this.id;
                postData.status = this.status;
            }

            const url = this.id
                ? this.$apiUrl + '/tax-categories/update'
                : this.$apiUrl + '/tax-categories/save';

            axios.post(url, postData)
                .then((response) => {
                    const data = response.data;
                    if (!data.status) {
                        this.showError(data.message);
                        return;
                    }
                    this.$eventBus.$emit('taxCategorySaved', data.message);
                    this.hideModal();
                })
                .catch((err) => {
                    this.showError(err.response?.data?.message || err.message || __('something_went_wrong'));
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
    },
    mounted() {
        this.showModal();
    },
};
</script>
