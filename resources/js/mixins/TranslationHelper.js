import axios from "axios";

export default {
    methods: {
        translateEmpty(language) {
            this.$root.$emit('bv::hide::tooltip');
            if (
                typeof this.validateDefaultLanguageForTranslation === "function"
            ) {
                if (!this.validateDefaultLanguageForTranslation()) return;
            }

            if (this.hasOwnProperty("loadingEmpty")) {
                this.loadingEmpty = true;
            } else {
                this.isTranslating = true;
            }

            const fields = this.translatableFields || [];

            // Check if any field is empty in non-default language tabs
            const hasEmptyFields =
                this.checkNonDefaultLanguagesHaveEmptyFields(fields);

            if (!hasEmptyFields) {
                // All fields in all non-default languages already have values
                const errorMsg =
                    __("translation_error_all_fields_filled") ||
                    "All fields already have values. There is nothing to translate.";

                if (this.hasOwnProperty("loadingEmpty")) {
                    this.loadingEmpty = false;
                } else {
                    this.isTranslating = false;
                }

                this.showError(errorMsg);
                return;
            }

            this.translateEmptyHelper(language, fields)
                .then(() => {
                    this.showSuccess(
                        __("translation_completed_successfully") ||
                            "Translation completed successfully"
                    );
                })
                .catch(() => {
                    // Error handling is done in translateEmptyHelper
                })
                .finally(() => {
                    if (this.hasOwnProperty("loadingEmpty")) {
                        this.loadingEmpty = false;
                    } else {
                        this.isTranslating = false;
                    }
                });
        },

        translateOverwrite(language) {
            this.$root.$emit('bv::hide::tooltip');
            if (
                typeof this.validateDefaultLanguageForTranslation === "function"
            ) {
                if (!this.validateDefaultLanguageForTranslation()) return;
            }

            if (this.hasOwnProperty("loadingOverwrite")) {
                this.loadingOverwrite = true;
            } else {
                this.isTranslating = true;
            }

            const fields = this.translatableFields || [];

            this.translateOverwriteHelper(language, fields)
                .then(() => {
                    this.showSuccess(
                        __("translation_overwritten_successfully") ||
                            "Translation overwritten successfully"
                    );
                })
                .finally(() => {
                    if (this.hasOwnProperty("loadingOverwrite")) {
                        this.loadingOverwrite = false;
                    } else {
                        this.isTranslating = false;
                    }
                });
        },

        getDefaultLanguageData() {
            if (
                this.translations &&
                this.translations[this.defaultLanguageId]
            ) {
                return this.translations[this.defaultLanguageId];
            } else if (this.form && this.form[this.defaultLanguageId]) {
                return this.form[this.defaultLanguageId];
            }
            return {};
        },

        checkNonDefaultLanguagesHaveEmptyFields(fieldsToTranslate = []) {
            // Determine target object (translations or form)
            let targetObj = null;
            if (this.translations) {
                targetObj = this.translations;
            } else if (this.form) {
                targetObj = this.form;
            }

            if (!targetObj || !this.languages || this.languages.length <= 1) {
                return true; // If no languages or only one language, allow translation
            }

            const fields =
                fieldsToTranslate.length > 0
                    ? fieldsToTranslate
                    : this.translatableFields || [];

            if (fields.length === 0) {
                return true; // If no fields to check, allow translation
            }

            // Check if any non-default language has at least one empty field
            for (const lang of this.languages) {
                if (lang.is_default) continue; // Skip default language

                const langData = targetObj[lang.id];
                if (!langData) {
                    return true; // If language data doesn't exist, there are empty fields
                }

                // Check if any field is empty for this language
                for (const field of fields) {
                    const value = langData[field];
                    if (
                        value === null ||
                        value === undefined ||
                        value === "" ||
                        (typeof value === "string" && value.trim() === "")
                    ) {
                        return true; // Found at least one empty field
                    }
                }
            }

            return false; // All fields in all non-default languages have values
        },
        translateEmptyHelper(language, fieldsToTranslate = []) {
            const source = this.getDefaultLanguageData();

            if (!source || Object.keys(source).length === 0) {
                const errorMsg = __("default_language_data_missing");
                this.showError(errorMsg);
                return Promise.reject("default_language_data_missing");
            }

            // Determine target object (translations or form)
            let targetObj = null;
            if (this.translations) {
                targetObj = this.translations;
            } else if (this.form) {
                targetObj = this.form;
            }

            const dataToSend = {};
            if (fieldsToTranslate.length > 0) {
                fieldsToTranslate.forEach((field) => {
                    dataToSend[field] = source[field];
                });
            } else {
                Object.keys(source).forEach((key) => {
                    if (typeof source[key] !== "object") {
                        dataToSend[key] = source[key];
                    }
                });
            }

            // Check if all fields in dataToSend are null or empty
            const allFieldsNull =
                Object.keys(dataToSend).length > 0 &&
                Object.keys(dataToSend).every((field) => {
                    const value = dataToSend[field];
                    return (
                        value === null ||
                        value === undefined ||
                        value === "" ||
                        (typeof value === "string" && value.trim() === "")
                    );
                });

            if (allFieldsNull) {
                const errorMsg =
                    __("translation_error_all_fields_empty") ||
                    "All fields are empty. Please fill at least one field in default language before translating.";

                this.showError(errorMsg);
                return Promise.reject(new Error(errorMsg));
            }

            return axios
                .post("/api/languages/translate-empty", {
                    target_language: language.code,
                    data: dataToSend,
                })
                .then((res) => {
                    if (res.data.status === 0) {
                        throw new Error(res.data.message || __("something_went_wrong"));
                    }

                    const allTranslations = res.data.data;

                    this.languages.forEach((lang) => {
                        if (lang.is_default) return; // skip default language

                        const translated = allTranslations[lang.code];
                        if (!translated) return;

                        Object.keys(translated).forEach((field) => {
                            if (targetObj && targetObj[lang.id]) {
                                if (
                                    !targetObj[lang.id][field] ||
                                    targetObj[lang.id][field] === ""
                                ) {
                                    this.$set(
                                        targetObj[lang.id],
                                        field,
                                        translated[field]
                                    );
                                }
                            }
                        });
                    });
                    if (typeof this.convertTagNamesToIds === "function") {
                        this.$nextTick(() => {
                            this.convertTagNamesToIds();
                        });
                    }
                    return res;
                })
                .catch((error) => {
                    let msg = error.message;
                    if (
                        error.response &&
                        error.response.data &&
                        error.response.data.message
                    ) {
                        msg = error.response.data.message;
                    }

                    const errorMessage = msg || __("something_went_wrong");
                    this.showError(errorMessage);
                    throw error;
                });
        },

        translateOverwriteHelper(language, fieldsToTranslate = []) {
            const source = this.getDefaultLanguageData();

            if (!source || Object.keys(source).length === 0) {
                const errorMsg = __("default_language_data_missing");
                this.showError(errorMsg);
                return Promise.reject("default_language_data_missing");
            }

            // Determine target object (translations or form)
            let targetObj = null;
            if (this.translations) {
                targetObj = this.translations;
            } else if (this.form) {
                targetObj = this.form;
            }

            const dataToSend = {};
            if (fieldsToTranslate.length > 0) {
                fieldsToTranslate.forEach((field) => {
                    dataToSend[field] = source[field];
                });
            } else {
                Object.keys(source).forEach((key) => {
                    if (typeof source[key] !== "object") {
                        dataToSend[key] = source[key];
                    }
                });
            }

            // Check if all fields in dataToSend are null or empty
            const allFieldsNull =
                Object.keys(dataToSend).length > 0 &&
                Object.keys(dataToSend).every((field) => {
                    const value = dataToSend[field];
                    return (
                        value === null ||
                        value === undefined ||
                        value === "" ||
                        (typeof value === "string" && value.trim() === "")
                    );
                });

            if (allFieldsNull) {
                const errorMsg =
                    __("translation_error_all_fields_empty") ||
                    "All fields are empty. Please fill at least one field in default language before translating.";
                this.showError(errorMsg);
                return Promise.reject(new Error(errorMsg));
            }

            return axios
                .post("/api/languages/translate-overwrite", {
                    target_language: language.code,
                    data: dataToSend,
                })
                .then((res) => {
                    if (res.data.status === 0) {
                        throw new Error(res.data.message || __("something_went_wrong"));
                    }

                    const allTranslations = res.data.data;

                    this.languages.forEach((lang) => {
                        if (lang.is_default) return;

                        const translated = allTranslations[lang.code];
                        if (!translated) return;

                        Object.keys(translated).forEach((field) => {
                            if (targetObj && targetObj[lang.id]) {
                                this.$set(
                                    targetObj[lang.id],
                                    field,
                                    translated[field]
                                );
                            }
                        });
                    });
                    if (typeof this.convertTagNamesToIds === "function") {
                        this.$nextTick(() => {
                            this.convertTagNamesToIds();
                        });
                    }
                    return res;
                })
                .catch((error) => {
                    let msg = error.message;
                    if (
                        error.response &&
                        error.response.data &&
                        error.response.data.message
                    ) {
                        msg = error.response.data.message;
                    }

                    const errorMessage = msg || __("something_went_wrong");
                    this.showError(errorMessage);
                    throw error;
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
    },
};
