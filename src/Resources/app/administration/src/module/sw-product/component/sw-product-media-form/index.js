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
            default: 'video/mp4, video/mov, video/wmv, video/avi, video/avchd, video/flv, video/f4v, video/sfw, video/mkv, video/webm, video/html5, video/mpeg-2',
        },
    },
    data() {
        return {
            repositoryAddMedia: null,
            mediaUploadTag: 'sw-profile-upload-tag',
            quickViewProductVideo: null,
            productOverviewVideoUrl: null,
            showMediaModal : false,
            videoUrlName: {
                type: String,
                required: false,
            }
        };
    },

    computed: {

            get() {
                return this.product.extensions.productOverviewVideo;
            },

            set(link) {
                this.product.extensions.productOverviewVideo = link;
            },

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
        overViewVideoUrl(value) {
            if (!(this.product.extensions && this.product.extensions.productOverviewVideo)) {
                this.$set(
                    this.product.extensions,
                    'productOverviewVideo',
                    this.overViewVideoRepository.create()
                );

                this.product.extensions.productOverviewVideo.productId = this.product.id;
            }
            this.product.extensions.productOverviewVideo.videoUrl = value;
            console.log('this.product.extensions.productOverviewVideo', this.product.extensions.productOverviewVideo)
        },
        shortenVideoLink(link) {
            let incomingLink = link;

            /* shareLink is the link you get when you click the share button under a YouTube video.
             *  e.g. https://youtu.be/bG57TZPYsyw
             *
             * urlLink is the link of the YouTube video from the searchbar. e.g. https://www.youtube.com/watch?v=bG57TZPYsyw
             */

            const shareLink = /https\:\/\/youtu\.be\//;
            const linkType = shareLink.test(incomingLink) ? 'shareLink' : 'urlLink';

            if (linkType === 'shareLink') {
                const linkPrefix = /https\:\/\/youtu\.be\//;
                const linkPostfix = /\?/;

                incomingLink = incomingLink.replace(linkPrefix, '');

                if (linkPostfix.test(incomingLink)) {
                    const positionOfPostfix = linkPostfix.exec(incomingLink).index;
                    incomingLink = incomingLink.substring(0, positionOfPostfix);
                }
            } else {
                const linkPrefix = /https\:\/\/www\.youtube\.com\/watch\?v\=/;
                const linkPostfix = /\&/;

                if (linkPrefix.test(incomingLink)) {
                    // removing the https://www...
                    incomingLink = incomingLink.replace(linkPrefix, '');
                }

                if (linkPostfix.test(incomingLink)) {
                    /* removing everthing that comes after the video id.
                     * Example: bG57TZPYsyw&t=3s -> bG57TZPYsyw
                     */

                    const positionOfPostfix = linkPostfix.exec(incomingLink).index;
                    incomingLink = incomingLink.substring(0, positionOfPostfix);
                }
            }

            return incomingLink;
        },

        openMediaSidebar() {
            this.$refs.mediaSidebarItem.openContent();
        },

        loadMediaPreview(mediaId) {
            const newMediaFiles = this.$refs.fileInput;
            if (!mediaId) return
            this.mediaRepository.get(mediaId).then((response) => {
                this.product.extensions.productOverviewVideo.media = response;
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
            // /
        },

        onUnlinkLogo() {
            if (this.product.extensions.productOverviewVideo) {
                this.product.extensions.productOverviewVideo.mediaId = null
                this.product.extensions.productOverviewVideo.media = null
            }
        },

        onMediaSelectionChange(mediaItems) {
            const media = mediaItems[0];
            if (!media) {
                return;
            }


            if (! this.product.extensions.productOverviewVideo) {
                this.product.extensions.productOverviewVideo = this.overViewVideoRepository.create(Shopware.Context.api);
            }

            this.product.extensions.productOverviewVideo.mediaId = media.id;
            this.product.extensions.productOverviewVideo.media = media;
        },
    }
});
