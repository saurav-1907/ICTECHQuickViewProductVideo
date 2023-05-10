import template from './sw-product-detail-base.html.twig';

const { Criteria } = Shopware.Data;
const { Component} = Shopware;
const { mapState, mapGetters } = Component.getComponentHelper();

Component.override('sw-product-detail-base', {
    template,

    created() {
      
    },

});
