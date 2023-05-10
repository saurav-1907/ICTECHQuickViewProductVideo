import template from './sw-product-media-form.html.twig';

const {Component, Mixin} = Shopware;
const { mapPropertyErrors, mapState, mapGetters } = Shopware.Component.getComponentHelper();
const {EntityCollection, Criteria} = Shopware.Data;

Component.override('sw-product-media-form', {
    template,

    inject: [
        'repositoryFactory'
    ],


    props:{
        fileAccept: {
            type: String,
            required: false,
            default: 'video/*',
        },
    },
    data() {
        return {
            repositoryAddMedia: null,
            mediaUploadTag: 'sw-profile-upload-tag',
            quickViewProductVideo: null,
            showMediaModal : false,
        };
    },

    computed: {
        ...mapState('swProductDetail', [
            'product'
        ]),
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },
        overViewVideoRepository() {
            return this.repositoryFactory.create('product_overview_video');
        },
    },

    created() {
        if (this.product.extensions.productOverviewVideo && this.product.extensions.productOverviewVideo.mediaId) {
            this.loadMediaPreview(this.product.extensions.productOverviewVideo.mediaId);
        }
    },

    methods: {
        openMediaSidebar() {
            this.$refs.mediaSidebarItem.openContent();
        },

        loadMediaPreview(mediaId) {
            if (!mediaId) return
            this.mediaRepository.get(mediaId).then((response) => {
                this.quickViewProductVideo = response;
            });
        },

        setMediaItem({ targetId }) {
            this.loadMediaPreview(targetId)
            if (!this.product.extensions.productOverviewVideo) {
                this.product.extensions.productOverviewVideo = this.overViewVideoRepository.create()
            }
            this.product.extensions.productOverviewVideo.productId = this.product.id
            this.product.extensions.productOverviewVideo.mediaId = targetId
        },

        onClickEditDomain(domain) {
            this.product = domain;
            this.setCurrentDomainBackup(this.product);
            if (this.product.extensions.productOverviewVideo) {
                this.loadMediaPreview(this.product.extensions.productOverviewVideo.mediaId)
            }
        },

        onCloseCreateDomainModal() {
            this.resetCurrentDomainToBackup();
            this.product = null;
            this.quickViewProductVideo = null
        },

        onUnlinkLogo() {
            if (this.product.extensions.productOverviewVideo) {
                this.product.extensions.productOverviewVideo.mediaId = null
            }
            this.quickViewProductVideo = null
        },

        onMediaSelectionChange(mediaItems) {
            const media = mediaItems[0];
            if (!media) {
                return;
            }

            this.mediaRepository.get(media.id).then((updatedMedia) => {
                this.product.mediaId = updatedMedia.id;
                this.product.media = updatedMedia;
            });
        },

    }

});
