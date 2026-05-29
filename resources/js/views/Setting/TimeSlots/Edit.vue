<template>
    <b-modal ref="my-modal" :title="modal_title" @hidden="$emit('modalClose')" no-fade static>
        <div slot="modal-footer">
            <b-button variant="primary" @click="saveRecord" :disabled="isLoading">
                {{ __('save') }}
                <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
            </b-button>

            <b-button variant="secondary" @click="hideModal">{{ __('cancel') }}</b-button>
        </div>
        <form ref="my-form" @submit.prevent="saveRecord">
            <b-tabs v-model="activeLanguageTab" content-class="mt-3" v-if="languages.length > 0">
                <b-tab v-for="language in languages" :key="language.id" :title="language.name" lazy>
                    <template #title>
                        <span :class="{ 'text-primary font-weight-bold': language.is_default }">
                            {{ language.name }}
                        </span>
                    </template>

                    <!-- Translate buttons -->
                    <div class="mb-3" v-if="language.is_default && languages.length > 1">
                        <b-button size="sm" variant="outline-primary" class="mr-2" @click="translateEmpty(language)"
                            v-b-tooltip.hover
                            :title="__('only_empty_fields_will_be_translated_existing_content_will_not_be_changed')"
                            :disabled="loadingEmpty">
                            <span v-if="!loadingEmpty">{{ __('translate_empty_fields') }}</span>
                            <b-spinner v-else small></b-spinner>
                        </b-button>
                        <b-button size="sm" variant="outline-danger" @click="translateOverwrite(language)"
                            v-b-tooltip.hover
                            :title="__('all_fields_will_be_translated_and_existing_content_will_be_overwritten')"
                            :disabled="loadingOverwrite">
                            <span v-if="!loadingOverwrite">{{ __('translate_and_overwrite') }}</span>
                            <b-spinner v-else small></b-spinner>
                        </b-button>
                        <div v-if="translateSuccessMessage" class="text-success mt-2 font-weight-bold">
                            {{ translateSuccessMessage }}
                        </div>
                    </div>

                    <div class="row">
                        <div class="form-group">
                            <label>{{ __('title') }}</label>
                            <i class="text-danger" v-if="language.is_default">*</i>
                            <input type="text" class="form-control" :required="language.is_default ? true : undefined"
                                v-model="translations[language.id].title" :placeholder="__('morning_9am_to_12pm')">
                        </div>
                        <div class="form-group" v-if="language.is_default">
                            <label>{{ __('from_time') }}<small>({{ __('24_hours_formate') }})</small></label>
                            <i class="text-danger">*</i>
                            <input type="time" class="form-control" required v-model="from_time">
                        </div>
                        <div class="form-group" v-if="language.is_default">
                            <label> {{ __('to_time') }}<small>({{ __('24_hours_formate') }})</small></label>
                            <i class="text-danger">*</i>
                            <input type="time" class="form-control" required v-model="to_time">
                        </div>
                        <div class="form-group" v-if="language.is_default">
                            <label> {{ __('last_order_time') }}<small>({{ __('24_hours_formate') }})</small></label>
                            <i class="text-danger">*</i>
                            <input type="time" class="form-control" required v-model="last_order_time">
                        </div>
                        <div class="form-group" v-if="language.is_default">
                            <label>{{ __('free_delivery') }}</label>
                            <div class="col-md-9 text-left mt-1">
                                <div class="position-relative d-inline-block">
                                    <input type="checkbox" id="is_free_delivery" v-model="is_free_delivery"
                                        class="form-check-input" :value="1" :disabled="hasActiveSubscriptionPlans"
                                        v-b-tooltip.hover
                                        :title="hasActiveSubscriptionPlans ? __('free_delivery_disabled_active_subscription_plans_tooltip') : ''">
                                    <label for="is_free_delivery" class="form-check-label ml-2"
                                        :class="{ 'text-muted': hasActiveSubscriptionPlans }">
                                        {{ __('enable_free_delivery') }}
                                    </label>
                                </div>
                                <div v-if="hasActiveSubscriptionPlans && language.is_default"
                                    class="alert alert-success mt-2 mb-0" role="alert">
                                    <small>
                                        <i class="fa fa-info-circle"></i>
                                        <strong>{{ __('note') }}:</strong> {{
                                            __('free_delivery_disabled_active_subscription_plans_message')
                                        }}
                                        <router-link to="/subscriptions" class="alert-link">
                                            {{ __('go_to_subscriptions') }} <i class="fa fa-external-link-alt"></i>
                                        </router-link>
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="form-group" v-if="language.is_default">
                            <label>{{ __('status') }}</label>
                            <div class="col-md-9 text-left mt-1">
                                <b-form-radio-group v-model="status" :options="[
                                    { text: __('deactivate'), 'value': 0 },
                                    { text: __('activate'), 'value': 1 },
                                ]" buttons button-variant="outline-primary" required></b-form-radio-group>
                            </div>
                        </div>
                    </div>
                    <button ref="dummy_submit" style="display:none;"></button>
                </b-tab></b-tabs>
        </form>
    </b-modal>
</template>
<script>
import axios from 'axios';
import TranslationHelper from '../../../mixins/TranslationHelper.js';

export default {
    props: ['record'],
    mixins: [TranslationHelper],
    data: function () {
        return {
            isLoading: false,
            id: this.record ? this.record.id : null,
            title: this.record ? this.record.title : null,
            from_time: this.record ? this.record.from_time : null,
            to_time: this.record ? this.record.to_time : null,
            last_order_time: this.record ? this.record.last_order_time : null,
            status: this.record && this.record.status !== undefined ? this.record.status : 1,
            is_free_delivery: this.record && this.record.is_free_delivery !== undefined ? this.record.is_free_delivery : 0,
            hasActiveSubscriptionPlans: false, // Track if there are active subscription plans
            activeLanguageTab: 0,
            languages: [],
            defaultLanguageId: null,
            translations: {},
            translatableFields: ['title'],
            translateSuccessMessage: '',
            loadingEmpty: false,
            loadingOverwrite: false,
        };
    },
    computed: {
        modal_title: function () {
            let title = this.id ? __('edit') : __('add');
            title += " ";
            title += __('time_slot');
            return title;
        },
    },
    methods: {
        async loadLanguages() {
            const res = await axios.get(this.$apiUrl + '/active_languages');
            this.languages = res.data.data;

            const defaultLang = this.languages.find(l => l.is_default);
            this.defaultLanguageId = defaultLang.id;

            // init translations
            this.languages.forEach(lang => {
                this.$set(this.translations, lang.id, { title: '' });
            });

            // fill edit data
            if (this.record?.translations) {
                this.record.translations.forEach(t => {
                    if (this.translations[t.language_id]) {
                        this.translations[t.language_id].title = t.title;
                    }
                });
            }

            // fallback: base title → default language
            if (this.record?.title && this.defaultLanguageId) {
                this.translations[this.defaultLanguageId].title ||= this.record.title;
            }
        },
        // Check if there are active subscription plans
        async checkActiveSubscriptionPlans() {
            try {
                const response = await axios.get(this.$apiUrl + '/delivery_settings/check_active_subscription_plans');
                if (response.data.status === 1) {
                    this.hasActiveSubscriptionPlans = response.data.data.has_active_subscription_plans;
                }
            } catch (error) {
                console.error('Error checking active subscription plans:', error);
            }
        },
        showModal() {
            this.$refs['my-modal'].show()
            // Check for active subscription plans when modal opens
            this.checkActiveSubscriptionPlans();
        },
        hideModal() {
            this.$refs['my-modal'].hide()
        },

        validateDefaultLanguageForTranslation() {
            const form = this.$refs['my-form'];
            if (form && !form.reportValidity()) {
                this.$nextTick(() => this.switchToDefaultLanguageTab());
                return false;
            }
            const defaultData = this.translations[this.defaultLanguageId];
            if (!defaultData || !defaultData.title || !String(defaultData.title).trim()) {
                this.showError(__('please_fill_default_language_required_fields') || 'Please fill title in default language');
                this.$nextTick(() => this.switchToDefaultLanguageTab());
                return false;
            }
            return true;
        },

        switchToDefaultLanguageTab() {
            const index = this.languages.findIndex(lang => lang.id === this.defaultLanguageId);
            if (index !== -1) this.activeLanguageTab = index;
        },

        saveRecord() {
            if (!this.validateDefaultLanguageForTranslation()) return;

            let vm = this;
            this.isLoading = true;

            const saveSequentially = async () => {
                let timeSlotId = this.id;

                for (const language of this.languages) {
                    const title = this.translations[language.id].title;
                    if (!language.is_default && !title) continue;

                    const formData = new FormData();
                    if (timeSlotId) formData.append('id', timeSlotId);

                    formData.append('language_id', language.id);
                    formData.append('title', title);

                    if (language.is_default) {
                        formData.append('from_time', this.from_time);
                        formData.append('to_time', this.to_time);
                        formData.append('last_order_time', this.last_order_time);
                        formData.append('status', this.status);
                        formData.append('is_free_delivery', this.is_free_delivery ? 1 : 0);
                    }

                    const url = timeSlotId
                        ? this.$apiUrl + '/delivery_settings/update'
                        : this.$apiUrl + '/delivery_settings/save';

                    const res = await axios.post(url, formData);

                    if (!timeSlotId && res.data.data?.id) {
                        timeSlotId = res.data.data.id;
                    }
                }
            };

            saveSequentially()
                .then(() => {
                    this.$eventBus.$emit('TimeSlotsSaved', __('time_slot_saved_successfully'));
                    this.hideModal();
                })
                .catch(() => {
                    this.isLoading = false;
                    this.showError(__('something_went_wrong'));
                });
        }

    },
    mounted() {
        this.showModal();
        this.loadLanguages();
    }
}
</script>
<style scoped>
.image_preview {
    margin-top: 5px;
}
</style>
