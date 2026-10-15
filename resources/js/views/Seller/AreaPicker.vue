<template>
    <div class="ap">
        <div v-if="!rows.length" class="ap-empty">{{ __('area_picker_no_areas') }}</div>

        <template v-else>
            <!-- Search / district / paste -->
            <div class="ap-toolbar">
                <div class="ap-search">
                    <i class="fa fa-search ap-search__icon"></i>
                    <input type="text" class="form-control" :value="searchInput"
                        :placeholder="__('area_picker_search_placeholder')" @input="onSearchInput($event.target.value)">
                    <button v-if="searchInput" type="button" class="ap-search__clear" :aria-label="__('clear')"
                        @click="clearSearch"><i class="fa fa-times"></i></button>
                </div>
                <select class="form-control ap-district" v-model="district">
                    <option :value="null">{{ __('area_picker_all_districts') }} ({{ rows.length }})</option>
                    <option v-for="d in districtList" :key="d.key" :value="d.key">{{ d.label }} ({{ d.count }})</option>
                </select>
                <button type="button" class="ap-btn" :class="{ 'ap-btn--on': showPaste }" @click="showPaste = !showPaste">
                    <i class="fa fa-paste"></i> {{ __('area_picker_paste_pincodes') }}
                </button>
            </div>

            <div v-if="zoneDistrictSet.size || selectedCount" class="ap-checks">
                <label v-if="zoneDistrictSet.size" class="ap-check">
                    <input type="checkbox" v-model="zoneOnly">
                    <span>{{ __('area_picker_match_zone_cities') }}
                        <span class="ap-muted">({{ zoneMatchLabel }})</span></span>
                </label>
                <label v-if="selectedCount" class="ap-check">
                    <input type="checkbox" v-model="selectedOnly">
                    <span>{{ __('area_picker_selected_only') }}</span>
                </label>
            </div>

            <div v-if="showPaste" class="ap-paste">
                <textarea class="form-control" rows="2" v-model="pasteText"
                    :placeholder="__('area_picker_paste_placeholder')"></textarea>
                <div class="ap-paste__row">
                    <button type="button" class="ap-btn ap-btn--solid" :disabled="!pasteText.trim()"
                        @click="applyPaste">{{ __('area_picker_paste_add') }}</button>
                    <span v-if="pasteResult" class="ap-paste__result">
                        <strong>{{ pasteResult.added }}</strong> {{ __('area_picker_paste_added') }}
                        &middot; {{ pasteResult.matched }} {{ __('area_picker_paste_matched') }}
                        <span v-if="pasteResult.missing.length" class="ap-paste__missing">
                            &middot; {{ __('area_picker_paste_not_found') }}: {{ pasteResult.missing.join(', ') }}
                        </span>
                    </span>
                </div>
            </div>

            <!-- Selected summary -->
            <div class="ap-selected">
                <div class="ap-selected__head">
                    <strong>{{ __('area_picker_selected') }} ({{ selectedCount }})</strong>
                    <button v-if="selectedCount" type="button" class="ap-link" @click="clearAll">{{ __('area_picker_clear_all') }}</button>
                </div>
                <div v-if="selectedCount" class="ap-chips">
                    <span v-for="chip in chips" :key="chip.id" class="ap-chip" :class="{ 'ap-chip--missing': chip.missing }">
                        {{ chip.label }}
                        <button type="button" :aria-label="__('remove')" @click="remove(chip.id)"><i class="fa fa-times"></i></button>
                    </span>
                </div>
                <p v-else class="ap-muted mb-0">{{ __('area_picker_none_selected') }}</p>
            </div>

            <!-- Results -->
            <div class="ap-listhead">
                <span class="ap-muted">{{ fmt('area_picker_showing', { shown: shown.length, total: filtered.length }) }}</span>
                <span class="ap-listhead__actions">
                    <button v-if="isFiltering && filtered.length && filteredSelectedCount < filtered.length" type="button"
                        class="ap-link" @click="selectFiltered">{{ fmt('area_picker_select_matches', { n: filtered.length }) }}</button>
                    <button v-if="isFiltering && filteredSelectedCount" type="button" class="ap-link"
                        @click="deselectFiltered">{{ __('area_picker_deselect_matches') }}</button>
                </span>
            </div>
            <p v-if="!isFiltering" class="ap-hint">{{ __('area_picker_narrow_hint') }}</p>

            <div class="ap-list">
                <div v-if="!filtered.length" class="ap-empty">{{ __('area_picker_no_matches') }}</div>
                <template v-for="group in groups">
                    <label :key="'h' + group.key" class="ap-group">
                        <input type="checkbox" :checked="groupMeta[group.key].selected === groupMeta[group.key].total"
                            :indeterminate.prop="groupMeta[group.key].selected > 0 && groupMeta[group.key].selected < groupMeta[group.key].total"
                            @change="toggleGroup(group.key, $event.target.checked)">
                        <span class="ap-group__name">{{ group.key || __('area_picker_other_district') }}</span>
                        <span class="ap-muted">{{ groupMeta[group.key].selected }}/{{ groupMeta[group.key].total }}</span>
                    </label>
                    <label v-for="row in group.rows" :key="row.id" class="ap-row" :class="{ 'ap-row--on': selectedSet.has(row.id) }">
                        <input type="checkbox" :checked="selectedSet.has(row.id)" @change="toggle(row.id, $event.target.checked)">
                        <span class="ap-row__name">{{ row.name }}</span>
                        <span class="ap-row__pin">{{ row.pincode }}</span>
                    </label>
                </template>
                <button v-if="shown.length < filtered.length" type="button" class="ap-more" @click="limit += PAGE">
                    {{ fmt('area_picker_show_more', { n: Math.min(PAGE, filtered.length - shown.length) }) }}
                </button>
            </div>
        </template>
    </div>
</template>

<script>
// Searchable checklist for assigning many areas to a distributor. v-model is an array of area ids (strings),
// the same shape the Select2 it replaces produced, so saving/autosave on the parent is unchanged.
const PAGE = 150;

export default {
    name: 'AreaPicker',
    props: {
        value: { type: Array, default: () => [] },
        areas: { type: Array, default: () => [] },
        // City names of the zones this distributor serves; used to offer a "match zone cities" shortcut.
        zoneCities: { type: Array, default: () => [] },
    },
    data() {
        return {
            PAGE,
            searchInput: '',
            search: '',
            district: null, // null = all districts
            zoneOnly: false,
            selectedOnly: false,
            showPaste: false,
            pasteText: '',
            pasteResult: null,
            limit: PAGE,
            searchTimer: null,
        };
    },
    computed: {
        // Sorted once; each row carries a lower-cased haystack so typing doesn't rebuild strings per keystroke.
        rows() {
            return (Array.isArray(this.areas) ? this.areas : []).map(a => {
                const district = (a.district || '').trim();
                const pincode = (a.pincode || '').toString().trim();
                const name = (a.name || '').trim();
                return {
                    id: String(a.id),
                    name,
                    pincode,
                    district,
                    hay: [name, pincode, district, a.state || ''].join(' ').toLowerCase(),
                };
            }).sort((x, y) =>
                x.district.localeCompare(y.district) || x.name.localeCompare(y.name) || x.pincode.localeCompare(y.pincode));
        },
        rowById() {
            const map = new Map();
            this.rows.forEach(r => map.set(r.id, r));
            return map;
        },
        pincodeIndex() {
            const map = new Map();
            this.rows.forEach(r => {
                if (!r.pincode) return;
                if (!map.has(r.pincode)) map.set(r.pincode, []);
                map.get(r.pincode).push(r.id);
            });
            return map;
        },
        districtList() {
            const counts = new Map();
            this.rows.forEach(r => counts.set(r.district, (counts.get(r.district) || 0) + 1));
            return Array.from(counts, ([key, count]) => ({ key, count, label: key || this.__('area_picker_other_district') }));
        },
        zoneDistrictSet() {
            const wanted = new Set((this.zoneCities || []).map(c => String(c).trim().toLowerCase()).filter(Boolean));
            const matched = new Set();
            if (!wanted.size) return matched;
            this.districtList.forEach(d => { if (wanted.has(d.key.toLowerCase())) matched.add(d.key.toLowerCase()); });
            return matched;
        },
        zoneMatchLabel() {
            return this.districtList.filter(d => this.zoneDistrictSet.has(d.key.toLowerCase())).map(d => d.label).join(', ');
        },
        selectedSet() {
            return new Set((this.value || []).map(String));
        },
        selectedCount() {
            return this.selectedSet.size;
        },
        isFiltering() {
            return !!this.search || this.district !== null || this.zoneOnly || this.selectedOnly;
        },
        filtered() {
            const tokens = this.search.toLowerCase().split(/\s+/).filter(Boolean);
            const zoneSet = this.zoneOnly ? this.zoneDistrictSet : null;
            return this.rows.filter(r => {
                if (this.district !== null && r.district !== this.district) return false;
                if (zoneSet && !zoneSet.has(r.district.toLowerCase())) return false;
                if (this.selectedOnly && !this.selectedSet.has(r.id)) return false;
                return tokens.every(t => r.hay.indexOf(t) !== -1);
            });
        },
        filteredSelectedCount() {
            let n = 0;
            this.filtered.forEach(r => { if (this.selectedSet.has(r.id)) n++; });
            return n;
        },
        shown() {
            return this.filtered.slice(0, this.limit);
        },
        // Per-district totals across ALL filtered rows (not just the rendered slice) so the group checkbox is accurate.
        groupMeta() {
            const meta = {};
            this.filtered.forEach(r => {
                const m = meta[r.district] || (meta[r.district] = { total: 0, selected: 0, ids: [] });
                m.total++;
                m.ids.push(r.id);
                if (this.selectedSet.has(r.id)) m.selected++;
            });
            return meta;
        },
        groups() {
            const out = [];
            let current = null;
            this.shown.forEach(r => {
                if (!current || current.key !== r.district) {
                    current = { key: r.district, rows: [] };
                    out.push(current);
                }
                current.rows.push(r);
            });
            return out;
        },
        chips() {
            return (this.value || []).map(String).map(id => {
                const r = this.rowById.get(id);
                if (!r) return { id, label: this.fmt('area_picker_unknown', { id }), missing: true };
                return { id, label: r.pincode ? r.name + ' · ' + r.pincode : r.name, missing: false };
            });
        },
    },
    watch: {
        search() { this.limit = PAGE; },
        district() { this.limit = PAGE; },
        zoneOnly() { this.limit = PAGE; },
        selectedOnly() { this.limit = PAGE; },
        selectedCount(n) { if (n === 0) this.selectedOnly = false; },
    },
    beforeDestroy() {
        if (this.searchTimer) clearTimeout(this.searchTimer);
    },
    methods: {
        // __() has no placeholders, so substitute {name} tokens here.
        fmt(key, vars) {
            return Object.keys(vars).reduce((s, k) => s.replace('{' + k + '}', vars[k]), this.__(key));
        },
        onSearchInput(value) {
            this.searchInput = value;
            if (this.searchTimer) clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => { this.search = value.trim(); }, 150);
        },
        clearSearch() {
            if (this.searchTimer) clearTimeout(this.searchTimer);
            this.searchInput = '';
            this.search = '';
        },
        emit(set) {
            this.$emit('input', Array.from(set));
        },
        toggle(id, on) {
            const next = new Set(this.selectedSet);
            if (on) next.add(id); else next.delete(id);
            this.emit(next);
        },
        remove(id) {
            this.toggle(id, false);
        },
        toggleGroup(key, on) {
            const next = new Set(this.selectedSet);
            ((this.groupMeta[key] || {}).ids || []).forEach(id => { if (on) next.add(id); else next.delete(id); });
            this.emit(next);
        },
        selectFiltered() {
            const next = new Set(this.selectedSet);
            this.filtered.forEach(r => next.add(r.id));
            this.emit(next);
        },
        deselectFiltered() {
            const next = new Set(this.selectedSet);
            this.filtered.forEach(r => next.delete(r.id));
            this.emit(next);
        },
        clearAll() {
            this.emit(new Set());
        },
        applyPaste() {
            const tokens = Array.from(new Set(this.pasteText.split(/[^0-9A-Za-z]+/).filter(Boolean)));
            const next = new Set(this.selectedSet);
            const before = next.size;
            const missing = [];
            let matched = 0;
            tokens.forEach(pin => {
                const ids = this.pincodeIndex.get(pin);
                if (!ids) { missing.push(pin); return; }
                matched++;
                ids.forEach(id => next.add(id));
            });
            this.pasteResult = { added: next.size - before, matched, missing: missing.slice(0, 10).concat(missing.length > 10 ? ['…'] : []) };
            this.emit(next);
            if (!missing.length) this.pasteText = '';
        },
    },
};
</script>

<style scoped>
.ap-muted { color: var(--app-muted, #67748e); font-size: 0.85em; }
.ap-empty { padding: 18px 12px; text-align: center; color: var(--app-muted, #67748e); }

.ap-toolbar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.ap-search { position: relative; flex: 1 1 220px; min-width: 0; }
.ap-search .form-control { padding-left: 34px; padding-right: 32px; }
.ap-search__icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--app-muted, #67748e); pointer-events: none; }
.ap-search__clear { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); border: 0; background: transparent; color: var(--app-muted, #67748e); padding: 4px 8px; cursor: pointer; }
.ap-district { flex: 0 1 240px; }

.ap-btn { border: 1px solid var(--app-control-border, #d9dde3); background: transparent; color: var(--app-ink, #25396f); border-radius: 6px; padding: 7px 12px; cursor: pointer; white-space: nowrap; }
.ap-btn:hover { background: var(--app-hover, rgba(67, 94, 190, 0.08)); }
.ap-btn--on { border-color: var(--brand, #042A5F); color: var(--brand, #042A5F); background: var(--brand-tint, #e3eaf5); }
.ap-btn--solid { background: var(--brand, #042A5F); border-color: var(--brand, #042A5F); color: #fff; }
.ap-btn--solid:hover { background: var(--brand-dark, #021B40); }
.ap-btn--solid:disabled { opacity: 0.5; cursor: not-allowed; }

.ap-checks { display: flex; flex-wrap: wrap; gap: 6px 18px; margin-top: 10px; }
.ap-check { display: inline-flex; align-items: center; gap: 6px; margin: 0; cursor: pointer; }

.ap-paste { margin-top: 10px; }
.ap-paste__row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; margin-top: 8px; }
.ap-paste__result { font-size: 0.9em; }
.ap-paste__missing { color: #dc3545; }

.ap-selected { margin-top: 14px; padding: 10px 12px; border: 1px dashed var(--app-card-border, #e6eaf2); border-radius: 8px; background: var(--app-thead-bg, #f7f9fc); }
.ap-selected__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.ap-chips { display: flex; flex-wrap: wrap; gap: 6px; max-height: 120px; overflow-y: auto; }
.ap-chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 4px 3px 10px; border-radius: 999px; background: var(--brand-tint, #e3eaf5); color: var(--brand, #042A5F); font-size: 0.85em; }
.ap-chip--missing { background: rgba(220, 53, 69, 0.12); color: #dc3545; }
.ap-chip button { border: 0; background: transparent; color: inherit; padding: 0 6px; cursor: pointer; line-height: 1; }
.ap-chip button:hover { opacity: 0.7; }

.ap-link { border: 0; background: transparent; color: var(--brand, #042A5F); padding: 0; margin-left: 12px; cursor: pointer; font-size: 0.9em; }
.ap-link:hover { text-decoration: underline; }
.ap-listhead { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4px 12px; margin: 14px 0 6px; }
.ap-listhead__actions .ap-link:first-child { margin-left: 0; }
.ap-hint { margin: 0 0 6px; font-size: 0.85em; color: var(--app-muted, #67748e); }

.ap-list { max-height: 360px; overflow-y: auto; border: 1px solid var(--app-card-border, #e6eaf2); border-radius: 8px; background: var(--app-card-bg, #fff); }
.ap-group { position: sticky; top: 0; z-index: 1; display: flex; align-items: center; gap: 8px; margin: 0; padding: 7px 12px; background: var(--app-thead-bg, #f7f9fc); border-bottom: 1px solid var(--app-card-border, #e6eaf2); font-weight: 600; cursor: pointer; }
.ap-group__name { flex: 1 1 auto; }
.ap-row { display: flex; align-items: center; gap: 8px; margin: 0; padding: 7px 12px 7px 32px; cursor: pointer; border-bottom: 1px solid var(--app-card-border, #e6eaf2); }
.ap-row:last-child { border-bottom: 0; }
.ap-row:hover { background: var(--app-hover, rgba(67, 94, 190, 0.08)); }
.ap-row--on { background: var(--brand-tint, #e3eaf5); }
.ap-row__name { flex: 1 1 auto; min-width: 0; }
.ap-row__pin { color: var(--app-muted, #67748e); font-variant-numeric: tabular-nums; }
.ap-more { display: block; width: 100%; border: 0; border-top: 1px solid var(--app-card-border, #e6eaf2); background: transparent; color: var(--brand, #042A5F); padding: 10px; cursor: pointer; }
.ap-more:hover { background: var(--app-hover, rgba(67, 94, 190, 0.08)); }
</style>
