<template>
    <b-modal ref="my-modal" :title="__('manage_lines') + ' — ' + (brand ? brand.name : '')"
        @hidden="$emit('modalClose')" scrollable no-close-on-backdrop no-fade static hide-footer size="lg">
        <div class="d-flex gap-2 mb-3">
            <input type="text" class="form-control" v-model="newLineName" :placeholder="__('new_line_name_eg_bulk')"
                @keyup.enter="addLine" />
            <button class="btn btn-primary text-nowrap" @click="addLine" :disabled="isSaving || !newLineName.trim()">
                <i class="fa fa-plus"></i> {{ __('add_line') }}
            </button>
        </div>

        <div v-if="isLoading" class="text-center my-3">
            <b-spinner></b-spinner>
        </div>

        <table class="table table-bordered" v-else>
            <thead>
                <tr>
                    <th>{{ __('order') }}</th>
                    <th>{{ __('line_name') }}</th>
                    <th class="text-center">{{ __('products') }}</th>
                    <th class="text-center">{{ __('mappings') }}</th>
                    <th class="text-center">{{ __('status') }}</th>
                    <th class="text-center" v-b-tooltip.hover :title="__('overlap_allowed_for_line_hint')">{{ __('overlap') }}</th>
                    <th class="text-center">{{ __('actions') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!lines.length">
                    <td colspan="7" class="text-center text-muted">{{ __('no_lines_yet') }}</td>
                </tr>
                <tr v-for="(line, index) in lines" :key="line.id">
                    <td>{{ line.sort_order }}</td>
                    <td>
                        <input v-if="editingId === line.id" type="text" class="form-control form-control-sm"
                            v-model="editingName" @keyup.enter="saveRename(line)" @keyup.esc="cancelRename" />
                        <span v-else class="badge bg-light text-dark border">{{ line.name }}</span>
                    </td>
                    <td class="text-center">{{ line.products_count }}</td>
                    <td class="text-center">{{ line.mappings_count }}</td>
                    <td class="text-center">
                        <span class="badge" :class="line.status == 1 ? 'bg-success' : 'bg-secondary'">
                            {{ line.status == 1 ? __('active') : __('deactive') }}
                        </span>
                    </td>
                    <td class="text-center">
                        <button class="list-action-btn" @click="toggleOverlap(line)"
                            :disabled="brandOverlapAllowed" :class="{ 'opacity-50': brandOverlapAllowed }"
                            v-b-tooltip.hover
                            :title="brandOverlapAllowed
                                ? __('overlap_already_allowed_for_whole_brand')
                                : (line.is_overlap_allowed == 1 ? __('disallow_overlap') : __('allow_overlap'))">
                            <i class="fa" :class="(line.is_overlap_allowed == 1 || brandOverlapAllowed) ? 'fa-toggle-on' : 'fa-toggle-off'"></i>
                        </button>
                    </td>
                    <td class="text-center">
                        <div class="list-actions justify-content-center">
                            <template v-if="editingId === line.id">
                                <button class="list-action-btn is-edit" @click="saveRename(line)" v-b-tooltip.hover
                                    :title="__('save')"><i class="fa fa-check"></i></button>
                                <button class="list-action-btn" @click="cancelRename" v-b-tooltip.hover
                                    :title="__('cancel')"><i class="fa fa-times"></i></button>
                            </template>
                            <template v-else>
                                <button class="list-action-btn is-edit" @click="startRename(line)" v-b-tooltip.hover
                                    :title="__('rename')"><i class="fa fa-pencil-alt"></i></button>
                                <button class="list-action-btn" @click="toggleStatus(line)" v-b-tooltip.hover
                                    :title="line.status == 1 ? __('deactivate') : __('activate')">
                                    <i class="fa" :class="line.status == 1 ? 'fa-toggle-on' : 'fa-toggle-off'"></i>
                                </button>
                                <button class="list-action-btn is-delete" @click="deleteLine(line, index)"
                                    v-b-tooltip.hover :title="__('delete')"><i class="fa fa-trash"></i></button>
                            </template>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="alert alert-info py-2 px-3 mb-2" v-if="brandOverlapAllowed">
            <i class="fa fa-info-circle"></i>
            {{ __('brand_overlap_already_allowed_lines_locked_hint') }}
        </div>
        <small class="text-muted d-block">{{ __('a_line_that_products_or_mappings_still_use_cannot_be_deleted_deactivate_it_instead') }}</small>
    </b-modal>
</template>

<script>
import axios from 'axios';

export default {
    props: ['brand'],
    data() {
        return {
            lines: [],
            isLoading: false,
            isSaving: false,
            newLineName: '',
            editingId: null,
            editingName: '',
        };
    },
    computed: {
        brandOverlapAllowed() {
            return !!(this.brand && this.brand.is_overlap_allowed == 1);
        },
    },
    methods: {
        showModal() {
            this.$refs['my-modal'].show();
        },
        hideModal() {
            if (this.$refs['my-modal']) {
                this.$refs['my-modal'].hide();
            }
        },
        getLines() {
            if (!this.brand) return;
            this.isLoading = true;
            axios.get(this.$apiUrl + '/admin/brands/' + this.brand.id + '/lines')
                .then(res => {
                    this.lines = res.data.data || [];
                })
                .finally(() => { this.isLoading = false; });
        },
        addLine() {
            const name = this.newLineName.trim();
            if (!name || !this.brand) return;
            this.isSaving = true;
            axios.post(this.$apiUrl + '/admin/brands/' + this.brand.id + '/lines', { name })
                .then(res => {
                    if (res.data.status) {
                        this.newLineName = '';
                        this.getLines();
                    } else {
                        this.showError(res.data.message);
                    }
                })
                .catch(err => this.showError(err.response?.data?.message || __('something_went_wrong')))
                .finally(() => { this.isSaving = false; });
        },
        startRename(line) {
            this.editingId = line.id;
            this.editingName = line.name;
        },
        cancelRename() {
            this.editingId = null;
            this.editingName = '';
        },
        saveRename(line) {
            const name = this.editingName.trim();
            if (!name) return;
            axios.put(this.$apiUrl + '/admin/brand-lines/' + line.id, { name })
                .then(res => {
                    if (res.data.status) {
                        this.cancelRename();
                        this.getLines();
                    } else {
                        this.showError(res.data.message);
                    }
                })
                .catch(err => this.showError(err.response?.data?.message || __('something_went_wrong')));
        },
        toggleStatus(line) {
            const newStatus = line.status == 1 ? 0 : 1;
            axios.put(this.$apiUrl + '/admin/brand-lines/' + line.id, { status: newStatus })
                .then(res => {
                    if (res.data.status) {
                        line.status = newStatus;
                    } else {
                        this.showError(res.data.message);
                    }
                })
                .catch(err => this.showError(err.response?.data?.message || __('something_went_wrong')));
        },
        toggleOverlap(line) {
            const newValue = line.is_overlap_allowed == 1 ? 0 : 1;
            axios.put(this.$apiUrl + '/admin/brand-lines/' + line.id, { is_overlap_allowed: newValue })
                .then(res => {
                    if (res.data.status) {
                        line.is_overlap_allowed = newValue;
                    } else {
                        this.showError(res.data.message);
                    }
                })
                .catch(err => this.showError(err.response?.data?.message || __('something_went_wrong')));
        },
        deleteLine(line, index) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('this_cannot_be_undone'),
                confirmButtonText: __('yes_sure'),
                cancelButtonText: __('cancel'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
            }).then(result => {
                if (result.value) {
                    axios.delete(this.$apiUrl + '/admin/brand-lines/' + line.id)
                        .then(res => {
                            if (res.data.status) {
                                this.lines.splice(index, 1);
                                this.showMessage('success', res.data.message);
                            } else {
                                this.showError(res.data.message);
                            }
                        })
                        .catch(err => this.showError(err.response?.data?.message || __('something_went_wrong')));
                }
            });
        },
    },
    mounted() {
        this.getLines();
        this.showModal();
    },
};
</script>
