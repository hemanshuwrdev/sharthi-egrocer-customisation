<template>
    <div id="app">
        <div id="sidebar" class="active">
            <div class="sidebar-wrapper active">
                <div class="sidebar-header">
                    <div class="d-flex justify-content-center align-items-center" style="position: relative;">
                        <div class="logo">
                            <router-link to="/delivery_boy"
                                style="display: flex; align-items: center; justify-content: flex-start;">
                                <img class="container-logo" v-if="$appLogo != ''" :src="$storageUrl + $appLogo"
                                    alt='Logo' srcset="" />
                                <img class="container-logo" v-else :src="$baseUrl + '/images/logo.png'" alt='Logo'
                                    srcset="" />
                                <span class="sidebar-brand-text">{{ $appName }}</span>
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="sidebar-menu">
                    <ul class="menu">

                        <template v-for="item in sidebarItems">

                            <li class="sidebar-item"
                                :class="{ 'active': isActive(item.url) || subIsActive(item), 'has-sub': isHasSub(item) }"
                                v-if="item.role == true ? ($role('Super Admin') && (item.name == 'Role' || item.name == 'System Users')) : (item.permission && $can(item.permission))">

                                <template v-if="isHasSub(item)">
                                    <a class="sidebar-link">
                                        <i :class="`fa fa-${item.icon}`"></i>
                                        <span>{{ item.name }}</span>
                                    </a>
                                    <ul class="submenu" :class="{ 'active': subIsActive(item) }">
                                        <template v-for="sub in item.submenu">
                                            <li class="submenu-item" :class="{ 'active': isActive(sub.url) }"
                                                :key="sub.key">
                                                <router-link :to="sub.url">
                                                    {{ sub.name }}
                                                </router-link>
                                            </li>
                                        </template>
                                    </ul>
                                </template>
                                <template v-else>
                                    <router-link class="sidebar-link" :to="item.url">
                                        <i :class="`fa fa-${item.icon}`"></i>
                                        <span>{{ item.name }}</span>
                                    </router-link>
                                </template>
                            </li>
                        </template>

                    </ul>
                </div>
                <button class="sidebar-toggler btn x"><i data-feather="x"></i></button>
            </div>
        </div>

        <div id="main">
            <vertical-header></vertical-header>
            <div id="main-content">
                <router-view></router-view>
            </div>
        </div>

        <!-- Blocked Status Modal -->
        <b-modal id="delivery-boy-blocked-modal" title="Account Blocked" :no-close-on-backdrop="true"
            :no-close-on-esc="true" :hide-header-close="true" centered @ok="handleBlockedLogout">
            <div class="text-center">
                <i class="fa fa-ban" style="font-size: 48px;"></i>
                <h5 class="mt-3">You are blocked by admin</h5>
                <h6>Reason: {{ remark }}</h6>
                <p class="text-muted">Your account has been blocked by admin. Please contact admin to unblock your
                    account.</p>
            </div>
            <template #modal-footer="{ ok }">
                <b-button variant="primary" @click="ok()">
                    OK
                </b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
import TheSidebar from './TheSidebar'

import TheFooter from './TheFooter'
import VerticalHeader from './VerticalHeader'
import Auth from "../Auth";
import axios from "axios";

export default {
    name: 'TheContainerDeliveryBoy',
    components: {
        TheSidebar,

        TheFooter,
        VerticalHeader
    },
    created() {
        this.checkPermissions();
        this.checkDeliveryBoyStatus();
    },
    watch: {
        '$route': 'checkPermissions'
    },
    mounted() {
        //lang
        if (window.localStorage.getItem('lang')) {
            this.lang = window.localStorage.getItem('lang');
        }

        // Start periodic status check every 30 seconds
        this.statusCheckInterval = setInterval(() => {
            this.checkDeliveryBoyStatus();
        }, 30000);

        function slideToggle(t, e, o) { 0 === t.clientHeight ? j(t, e, o, !0) : j(t, e, o) } function slideUp(t, e, o) { j(t, e, o) } function slideDown(t, e, o) { j(t, e, o, !0) } function j(t, e, o, i) { void 0 === e && (e = 400), void 0 === i && (i = !1), t.style.overflow = "hidden", i && (t.style.display = "block"); var p, l = window.getComputedStyle(t), n = parseFloat(l.getPropertyValue("height")), a = parseFloat(l.getPropertyValue("padding-top")), s = parseFloat(l.getPropertyValue("padding-bottom")), r = parseFloat(l.getPropertyValue("margin-top")), d = parseFloat(l.getPropertyValue("margin-bottom")), g = n / e, y = a / e, m = s / e, u = r / e, h = d / e; window.requestAnimationFrame(function l(x) { void 0 === p && (p = x); var f = x - p; i ? (t.style.height = g * f + "px", t.style.paddingTop = y * f + "px", t.style.paddingBottom = m * f + "px", t.style.marginTop = u * f + "px", t.style.marginBottom = h * f + "px") : (t.style.height = n - g * f + "px", t.style.paddingTop = a - y * f + "px", t.style.paddingBottom = s - m * f + "px", t.style.marginTop = r - u * f + "px", t.style.marginBottom = d - h * f + "px"), f >= e ? (t.style.height = "", t.style.paddingTop = "", t.style.paddingBottom = "", t.style.marginTop = "", t.style.marginBottom = "", t.style.overflow = "", i || (t.style.display = "none"), "function" == typeof o && o()) : window.requestAnimationFrame(l) }) }
        let sidebarItems = document.querySelectorAll('.sidebar-item.has-sub');
        const sidebarEl = document.getElementById('sidebar');
        const sidebarMenu = document.querySelector('.sidebar-menu');
        if (sidebarMenu && sidebarEl) {
            sidebarMenu.addEventListener('click', (e) => {
                if (window.innerWidth >= 1200 && !sidebarEl.classList.contains('active')) {
                    sidebarEl.classList.add('active');
                }
            });
        }
        for (var i = 0; i < sidebarItems.length; i++) {
            let sidebarItem = sidebarItems[i];
            sidebarItems[i].querySelector('.sidebar-link')?.addEventListener('click', function (e) {
                e.preventDefault();

                if (window.innerWidth >= 1200 && sidebarEl && !sidebarEl.classList.contains('active')) {
                    sidebarEl.classList.add('active');
                }

                let submenu = sidebarItem.querySelector('.submenu');
                if (submenu?.classList?.contains('active')) submenu.style.display = "block"
                if (submenu.style.display == "none") submenu?.classList?.add('active')
                else submenu?.classList?.remove('active')
                slideToggle(submenu, 300)
            })
        }
        window.addEventListener('DOMContentLoaded', (event) => {
            var w = window.innerWidth;
            if (w < 1200) {
                document.getElementById('sidebar')?.classList?.remove('active');
            }
        });
        // Update backdrop when sidebar opens/closes on small screens - click outside to close
        const updateSidebarBackdrop = () => {
            const sidebar = document.getElementById('sidebar');
            const backdrop = document.querySelector('.sidebar-backdrop');
            const isSmallScreen = window.innerWidth < 1200;
            const isActive = sidebar?.classList?.contains('active');
            if (backdrop) backdrop.remove();
            if (isSmallScreen && isActive) {
                const b = document.createElement('div');
                b.className = 'sidebar-backdrop';
                b.addEventListener('click', () => {
                    sidebar?.classList?.remove('active');
                    updateSidebarBackdrop();
                });
                document.body.appendChild(b);
            }
        };
        window.addEventListener('resize', (event) => {
            var w = window.innerWidth;
            if (w < 1200) {
                document.getElementById('sidebar')?.classList?.remove('active');
                updateSidebarBackdrop();
            } else {
                document.getElementById('sidebar')?.classList?.add('active');
                updateSidebarBackdrop();
            }
        });
        document.querySelector('.sidebar-hide')?.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList?.toggle('active');
            updateSidebarBackdrop();
        });
        // Perfect Scrollbar Init
        if (typeof PerfectScrollbar.default == 'function') {
            const container = document.querySelector(".sidebar-wrapper");
            if (container) {
                const ps = new PerfectScrollbar.default(container, {
                    wheelPropagation: false
                });
            }
        }
        // Scroll into active sidebar
        document.querySelector('.sidebar-item.active')?.scrollIntoView(false)


    },
    beforeDestroy() {
        // Clear the status check interval when component is destroyed
        if (this.statusCheckInterval) {
            clearInterval(this.statusCheckInterval);
        }
    },
    data: function () {
        return {
            lang: 'en',
            statusCheckInterval: null,
            remark: '',
            sidebarItems: [
                {
                    name: __('dashboard'),
                    icon: 'tachometer-alt',
                    url: '/delivery_boy',
                    permission: 'manage_dashboard'
                },
                {
                    name: __('orders'),
                    icon: 'shopping-cart',
                    url: '/delivery_boy/orders',
                    permission: 'order_list'
                },
                {
                    name: __('return_requests'),
                    icon: 'retweet',
                    url: '/delivery_boy/return_requests',
                    permission: 'return_request_list',
                },
                {
                    name: __('withdrawal_requests'),
                    icon: 'credit-card',
                    url: '/delivery_boy/withdrawal_requests',
                    permission: 'product_sales_reports',
                },
                {
                    name: __('fund_transfers'),
                    icon: 'exchange-alt',
                    url: '/delivery_boy/fund_transfers',
                    permission: 'order_list'
                },
                {
                    name: __('delivery_boy_cash'),
                    icon: 'money',
                    url: '/delivery_boy/cash_collection',
                    permission: 'order_list'
                },
                {
                    name: __('delivery_boy_salary'),
                    icon: 'money-bill',
                    url: '/delivery_boy/salary',
                    permission: 'salary_list'
                }


            ]
        }
    },
    methods: {
        subIsActive(item) {
            const paths = Array.isArray(item.submenu) ? item.submenu : [];
            return paths.some(path => {
                return this.$route.path.indexOf(path.url) === 0;
            });
        },
        isActive(url) {
            if (this.$route.path == url) {
                return true;
            }
            return false;
        },
        isHasSub(item) {
            if (item.hasOwnProperty("submenu")) {
                if (item.submenu.length > 0) {
                    return true;
                }
            }
            return false;
        },
        changeLanguage(event) {
            this.lang = event.target.value;
            window.localStorage.setItem('lang', this.lang);
            this.isLoading = true
            let data = {
                language: this.lang
            }
            axios.post(this.$apiUrl + '/change_language', data)
                .then((response) => {
                    this.isLoading = false;
                    window.location.reload();
                });
        },
        checkPermissions() {
            var current_path = this.$route.path;
            var permission = '';
            this.sidebarItems.forEach(menu => {
                //Only Main Categories
                if (menu.submenu && menu.submenu.length > 0) {

                    menu.submenu.forEach(submenu => {
                        if (submenu.url == current_path) {
                            permission = submenu.permission;
                        }
                    });

                } else {

                    if (menu.url == current_path) {
                        permission = menu.permission;
                    }
                }
            });


            if (Auth.check() && UserPermissions.length == 0) {
                //this.$router.push({path:'/login'});
                if (window.localStorage.getItem('loginCheck') == 1) {
                    Auth.logout();
                }
                window.localStorage.setItem('loginCheck', 1);
                window.location.reload();
            } else if (Auth.check() && permission && !this.$can(permission)) {
                this.$router.push({ path: '/unauthorized' });
            }

        },
        checkDeliveryBoyStatus() {
            // Check if delivery boy is blocked
            axios.post(this.$apiUrl + '/delivery_boy/get_delivery_boy_status')
                .then((response) => {
                    if (response.data.status === 1) {
                        const deliveryBoyStatus = response.data.data.status;
                        // Status 4 means blocked
                        if (deliveryBoyStatus === 4) {
                            this.remark = response.data.data.remark || 'No reason provided';
                            this.$bvModal.show('delivery-boy-blocked-modal');
                            // Clear the interval to stop further checks
                            if (this.statusCheckInterval) {
                                clearInterval(this.statusCheckInterval);
                            }
                        }
                    }
                })
                .catch((error) => {
                    // Silently fail - don't show errors for background checks
                    console.error('Status check error:', error);
                });
        },
        handleBlockedLogout() {
            // Logout the delivery boy
            Auth.logout();
            // Redirect to login page
            this.$router.push({ path: '/delivery_boy/login' });
        }

    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
