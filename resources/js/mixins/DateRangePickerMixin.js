/**
 * Mixin for vue2-daterange-picker with translated labels.
 * Provides localeData (Cancel, Apply) and customRanges (Today, Yesterday, etc.)
 */
export default {
    computed: {
        dateRangePickerLocale() {
            return {
                cancelLabel: __('cancel'),
                applyLabel: __('apply'),
            };
        },
        dateRangePickerRanges() {
            return {
                [__('today')]: this.getTodayRange(),
                [__('yesterday')]: this.getYesterdayRange(),
                [__('this_week')]: this.getThisWeekRange(),
                [__('this_month')]: this.getThisMonthRange(),
                [__('this_year')]: this.getThisYearRange(),
                [__('last_month')]: this.getLastMonthRange(),
            };
        },
    },
    methods: {
        getTodayRange() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);
            return [today, todayEnd];
        },
        getYesterdayRange() {
            const yesterdayStart = new Date();
            yesterdayStart.setDate(yesterdayStart.getDate() - 1);
            yesterdayStart.setHours(0, 0, 0, 0);
            const yesterdayEnd = new Date();
            yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
            yesterdayEnd.setHours(23, 59, 59, 999);
            return [yesterdayStart, yesterdayEnd];
        },
        getThisWeekRange() {
            const today = new Date();
            const first = new Date(today);
            first.setDate(today.getDate() - today.getDay());
            first.setHours(0, 0, 0, 0);
            const last = new Date(first);
            last.setDate(first.getDate() + 6);
            last.setHours(23, 59, 59, 999);
            return [first, last];
        },
        getThisMonthRange() {
            const today = new Date();
            const start = new Date(today.getFullYear(), today.getMonth(), 1);
            const end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
            return [start, end];
        },
        getThisYearRange() {
            const today = new Date();
            const start = new Date(today.getFullYear(), 0, 1);
            const end = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
            return [start, end];
        },
        getLastMonthRange() {
            const today = new Date();
            const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const end = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
            return [start, end];
        },
    },
};
