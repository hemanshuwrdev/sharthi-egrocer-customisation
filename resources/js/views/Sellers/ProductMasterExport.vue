<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('product_master_export') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item">
                                    <router-link to="/seller/dashboard">{{ __('dashboard') }}</router-link>
                                </li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('product_master_export') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">{{ __('product_master_export') }}</h4>
                    </div>
                    <div class="card-body">
                        <p class="text-muted">{{ __('product_master_export_hint') }}</p>
                        <button class="btn btn-primary" :disabled="isDownloading" @click="downloadXlsx()">
                            <i class="fa fa-download" aria-hidden="true"></i>
                            {{ isDownloading ? __('loading') + '...' : __('download_xlsx') }}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
<script>
export default {
    name: "SellerProductMasterExport",
    data: function () {
        return {
            isDownloading: false,
        }
    },
    methods: {
        downloadXlsx() {
            this.isDownloading = true;
            axios({
                url: this.$sellerApiUrl + '/products/export_xlsx',
                method: 'get',
                responseType: 'blob',
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Products.xlsx');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                this.isDownloading = false;
            }).catch(() => {
                this.isDownloading = false;
            });
        },
    }
};
</script>
