import template from './overview-product-media-form.html.twig';

const {Component, Context, Mixin} = Shopware;
const { mapPropertyErrors, mapState, mapGetters } = Shopware.Component.getComponentHelper();
const {EntityCollection, Criteria} = Shopware.Data;

Component.extend('overview-product-media-form', 'sw-product-media-form', {
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
            overViewVideoMediaDefaultFolderId: null,
            showOverViewVideoMediaModal: false,
            overViewVideoMediaAddDisabled: true,
            overViewVideo: {
                url: '',
                source: 'youtube',
                thumbnailId: ''
            },
            repositoryAddMedia: null,
            mediaUploadTag: 'sw-profile-upload-tag',
            quickViewVideo: null,
            quickViewProductVideo: null,
            showMediaModal : false,
        };
    },

   /* created() {
        this.createdComponent();
        console.log('quickViewProductVideo', this)
        this.repositoryAddMedia = this.repositoryFactory.create('product_overview_video');
    },*/

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

        /*mediaRepository() {
            return this.repositoryFactory.create('media');
        },*/

        overViewVideoMediaUploadTag() {
            return this.product.id + '-product-overview-video';
        },

        overViewVideoMediaDefaultFolderRepository() {
            return this.repositoryFactory.create('media_default_folder');
        },

        overViewVideoMediaDefaultFolderCriteria() {
            const criteria = new Criteria(1, 1);

            criteria.addAssociation('folder');
            criteria.addFilter(Criteria.equals('entity', 'product'));

            return criteria;
        },
    },

    watch: {
        'overViewVideo.thumbnailId': {
            handler(value) {
                this.onChangeoverViewVideoThumbnailId(value);
            }
        }
    },

    created() {
        this.getOverViewVideoMediaDefaultFolderId().then((mediaDefaultFolderId) => {
            this.overViewVideoMediaDefaultFolderId = mediaDefaultFolderId;
        });
    },

        /*productOverviewVideo: {

            get() {
                console.log("this.product?.extensions?.productOverviewVideo",this.product);
                console.log("dsa", this.product);
                return this.product?.extensions?.productOverviewVideo[0] || {};
            },

            set(values) {
                if (!this.product.extensions.productOverviewVideo) {
                    const collection = new EntityCollection(
                        this.overViewVideoRepository.route,
                        this.overViewVideoRepository.entityName,
                        Shopware.Context.api
                    )
                    this.$set(this.product.extensions, 'productOverviewVideo', collection)
                }
            }
        }*/



    methods: {

        getOverViewVideoMediaDefaultFolderId() {
            return this.overViewVideoMediaDefaultFolderRepository
                .search(this.overViewVideoMediaDefaultFolderCriteria, Context.api)
                .then((mediaDefaultFolder) => {
                    const defaultFolder = mediaDefaultFolder.first();

                    if (defaultFolder.folder?.id) {
                        return defaultFolder.folder.id;
                    }

                    return null;
                });
        },

        onChangeoverViewVideoThumbnailId(value) {
            if (value && this.overViewVideo.url) {
                this.overViewVideoMediaAddDisabled = false;
            } else {
                this.overViewVideoMediaAddDisabled = true;
            }
        },

        onOpenOverViewVideoMedia() {
            this.showOverViewVideoMediaModal = true;
        },

        onRemoveOverViewVideoMedia() {
            this.overViewVideo.thumbnailId = '';
        },

        onCloseOverViewVideoMediaModal() {
            this.showOverViewVideoMediaModal = false;
        },

        onUploadOverViewVideoMediaFinished({ targetId }) {
            this.overViewVideo.thumbnailId = targetId;
        },

        createMediaAssociation(targetId) {
            const productMedia = this.productMediaRepository.create(Shopware.Context.api);

            productMedia.productId = this.product.id;
            productMedia.mediaId = targetId;

            if (this.product.media.length <= 0) {
                productMedia.position = 0;

                this.mediaRepository
                    .get(productMedia.mediaId, Shopware.Context.api).then((entity) => {
                    if (entity.mimeType.split('/')[0] === 'image' &&
                        !this.isOverViewVideo(entity)) {
                        this.product.coverId = productMedia.id;
                    }
                });
            } else {
                productMedia.position = this.product.media.length;
            }

            return productMedia;
        },

        isOverViewVideo(mediaItem) {
            if (mediaItem.customFields &&
                mediaItem.customFields.pv_is_overview_video) {
                return true;
            }

            return false;
        },

        onSelectOverViewVideoMedia(media) {
            if (isEmpty(media)) {
                return;
            }

            this.overViewVideo.thumbnailId = media[0].id;
        },

        onChangeOverViewVideoUrl(value) {
            if (value && this.overViewVideo.thumbnailId) {
                this.overViewVideoMediaAddDisabled = false;
            } else {
                this.overViewVideoMediaAddDisabled = true;
            }
        },

        onChangeOverViewVideoThumbnailId(value) {
            if (value && this.overViewVideo.url) {
                this.overViewVideoMediaAddDisabled = false;
            } else {
                this.overViewVideoMediaAddDisabled = true;
            }
        },

        onAddOverViewVideoMedia() {
            this.mediaRepository
                .get(this.overViewVideo.thumbnailId, Context.api).then((entity) => {

                entity.customFields = {
                    pv_is_overview_video: true,
                    pv_url: this.overViewVideo.url,
                    pv_source: this.overViewVideo.source
                };

                this.overViewVideo = {
                    url: '',
                    source: 'youtube',
                    thumbnailId: ''
                }

                this.$emit('add-overView-video-media', entity);
            });
        },
    },

        /*openMediaSidebar() {
            this.$refs.mediaSidebarItem.openContent();
        },*/

        createdComponent() {
            console.log("dsa", this.product);
          /*  const proId = this.product.id;
            const $criteria = new Criteria();
            $criteria.addFilter(Criteria.equals('productId', this.$route.params.id));
            this.overViewVideoRepository.search($criteria, Shopware.Context.api).then((updatePrice) => {
                console.log('updatePrice', updatePrice)
                this.product.extensions.productOverviewVideo = updatePrice;
            });*/
        },
        loadMediaPreview(mediaId) {
            if (!mediaId) return
            this.mediaRepository.get(mediaId).then((response) => {
                console.log('mediaId', mediaId)
                console.log('response', response)
                this.quickViewProductVideo = mediaId;
            });
        },

     async   setMediaItem({ targetId }) {
          await  this.loadMediaPreview(targetId)
            console.log('this.quickViewProductVideo', this.quickViewProductVideo)
            console.log('this', targetId)
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
            this.quickViewVideo = null
        },

        onUnlinkLogo() {
            if (this.product.extensions.productOverviewVideo) {
                this.product.extensions.productOverviewVideo.mediaId = null
            }
            this.quickViewVideo = null
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

        /*onSetMediaItem({ targetId }) {
            this.mediaRepository.get(targetId).then((updatedMedia) => {
                this.product.mediaId = targetId;
                this.product.media = updatedMedia;
            });
        },*/


});
