<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('system') }}</h3>
        </div>

        <div class="settings-grid">
            <router-link v-for="item in visibleItems" :key="item.url" :to="item.url" class="settings-card">
                <span class="settings-card-icon" v-html="icon(item.icon)"></span>
                <span class="settings-card-title">{{ item.title }}</span>
                <span class="settings-card-link">{{ __('go_to_settings') }} <span class="arrow">&rarr;</span></span>
            </router-link>
        </div>
    </div>
</template>

<script>
import { lucideIcon } from '../../utils/lucideIcons';

export default {
    name: 'SystemSettingsHub',
    data() {
        return {
            items: [
                { title: __('store_settings'), icon: 'grid-fill', url: '/store_settings', permission: 'manage_store_settings' },
                { title: __('additional_charge'), icon: 'credit-card', url: '/additional_charges', permission: 'additional_charges_list' },
                { title: __('contact_us'), icon: 'mail', url: '/contact_us', permission: 'manage_contact_us' },
                { title: __('about_us'), icon: 'info', url: '/about_us', permission: 'manage_about_us' },
                { title: __('firebase_settings'), icon: 'bell', url: '/firebase-settings', permission: 'manage_Notification_settings' },
                { title: __('notification_templates'), icon: 'clipboard-check', url: '/notification-templates', permission: 'manage_Notification_settings' },
                { title: __('sms_settings'), icon: 'gear', url: '/sms-settings', permission: 'manage_store_settings' },
                { title: __('sms_templates'), icon: 'clipboard-check', url: '/sms-templates', permission: 'manage_store_settings' },
                { title: __('seo_settings'), icon: 'search', url: '/seo-settings', permission: 'manage_store_settings' },
                { title: __('system_registration'), icon: 'check', url: '/purchase_code', permission: 'manage_system_registration' },
                { title: __('system_updater'), icon: 'refresh', url: '/system_updater', permission: 'manage_store_settings' },
            ],
        };
    },
    computed: {
        visibleItems() {
            return this.items.filter(item => this.$can(item.permission));
        },
    },
    methods: {
        icon(name) {
            return lucideIcon(name);
        },
    },
};
</script>

<style scoped>
.settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.settings-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 28px;
    min-height: 160px;
    background: var(--app-card-bg);
    border: 1px solid var(--app-card-border);
    border-radius: 0.9rem;
    text-decoration: none;
    transition: box-shadow 0.15s var(--app-ease), border-color 0.15s var(--app-ease);
}

.settings-card:hover {
    border-color: #37a279;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.settings-card-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 0.7rem;
    background: rgba(55, 162, 121, 0.1);
    color: #37a279;
}

.settings-card-icon >>> svg {
    width: 24px;
    height: 24px;
}

.settings-card-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--app-ink);
}

.settings-card-link {
    font-size: 0.85rem;
    font-weight: 600;
    color: #37a279;
}

.settings-card-link .arrow {
    transition: transform 0.15s var(--app-ease);
    display: inline-block;
}

.settings-card:hover .settings-card-link .arrow {
    transform: translateX(3px);
}
</style>
