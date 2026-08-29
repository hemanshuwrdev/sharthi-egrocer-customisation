<template>
    <footer class="app-footer">
        <div class="footer clearfix mb-0">
            <div class="float-start footer-copyright" v-html="copyrightDetails"></div>
            <div v-if="currentVersion !== ''" class="float-end footer-version">
                {{ __('version') }} :
                <span class="footer-version-badge">{{ $currentVersion }}</span>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
  name: 'TheFooter',
  data() {
    return {
     copyrightDetails: window.copyrightDetails,
     currentVersion:window.currentVersion
    };
  }
}
</script>
