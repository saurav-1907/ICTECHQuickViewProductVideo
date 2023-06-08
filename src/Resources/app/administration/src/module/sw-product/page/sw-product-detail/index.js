import  template from "./sw-product-detail.html.twig";
const { Component, Mixin } = Shopware;
const { Criteria } = Shopware.Data;
Component.override('sw-product-detail', {
    template,
    inject: [
        'acl',
        'cmsService',
        'repositoryFactory',
        'seoUrlService',
    ],

    mixins: [
        Mixin.getByName('notification'),
        Mixin.getByName('placeholder'),
    ],

    metaInfo() {
        return {
            title: this.$createTitle(this.identifier),
        };
    },

    props: {

        productId: {
            type: String,
            required: false,
            default: null,
        },
        landingPageId: {
            type: String,
            required: false,
            default: null,
        },
    },

    data() {
        return {
            isSaveSuccessful: false,
            bundle: null,
            overviewId: null,
        };
    },

    created() {
        this.createdComponent();
    },

    computed: {
        productCriteria() {
            const criteria = this.$super('productCriteria');
            criteria.addAssociation('productOverviewVideo');
            // criteria.addAssociation('productOverviewVideo.media');
            return criteria;
        },
        mediaRepository() {
            return this.repositoryFactory.create('media');
        },

        identifier() {
            return this.product ? this.placeholder(this.product, 'name') : '';
        },

        productRepository() {
            return this.repositoryFactory.create('product');
        },

        customFieldSetRepository() {
            return this.repositoryFactory.create('custom_field_set');
        },
    },


    methods: {
        createdComponent() {
            this.repository = this.repositoryFactory.create('product_overview_video');
            this.$super('createdComponent')
        },

        getBundle() {
            const productId = this.$route.params.id;
            const customCriteria = new Criteria();
            customCriteria.addSorting(Criteria.sort('createdAt', 'DESC'));
            customCriteria.addFilter(Criteria.equals('productId', productId ));
            this.repository.search(customCriteria, Shopware.Context.api).then((entity) => {
                this.log('entity', entity)
                this.bundle = entity;
            });
        },

        async onSave() {
            this.$super('onSave');
            this.repository.save(this.product.extensions.productOverviewVideo, Shopware.Context.api).then(() => {
                this.getBundle();
            });
            this.isSaveSuccessful = true;
        },

        Finish() {
            this.isSaveSuccessful = true;
        },
    }

})
