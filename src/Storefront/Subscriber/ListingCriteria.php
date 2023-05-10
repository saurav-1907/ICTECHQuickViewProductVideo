<?php

namespace ICTECHQuickViewProductVideo\Storefront\Subscriber;

use Shopware\Core\Framework\Context;
use Shopware\Core\Content\Product\Events\ProductListingCriteriaEvent;
use Shopware\Core\Content\Product\Events\ProductListingResultEvent;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ListingCriteria implements EventSubscriberInterface
{
    private $mediaFolderRepository;
    private $mediaRepository;
    private $productsQuickViewVideoRepository;

    public function __construct(
        EntityRepositoryInterface $mediaFolderRepository,
        EntityRepositoryInterface $mediaRepository,
        EntityRepositoryInterface $productsQuickViewVideoRepository
    ) {
        $this->mediaFolderRepository =  $mediaFolderRepository;
        $this->mediaRepository =  $mediaRepository;
        $this->productsQuickViewVideoRepository =  $productsQuickViewVideoRepository;
    }

    public static function getSubscribedEvents()
    {
        return [
            ProductListingCriteriaEvent::class => 'handleListingRequest',
            ProductListingResultEvent::class => 'onProductListingCriteria',
        ];
    }

    public function handleListingRequest(ProductListingCriteriaEvent $event): void
    {
        $event->getCriteria()->addAssociation('productOverviewVideo');
        $event->getCriteria()->addAssociation('media');
        $event->getCriteria()->getAssociation('productOverviewVideo')->addAssociation('media');
    }
    public function onProductListingCriteria(ProductListingResultEvent $productListingCriteriaEvent)
    {
        $productData = $this->getAllProducts();
        $listingElements = $productListingCriteriaEvent->getResult();
        $listingElements->setExtensions($productData);
    }

    private function getAllProducts()
    {
        $criteria = new Criteria();
        $criteria->addAssociation('products');
        $criteria->addAssociation('media');
        return $this->productsQuickViewVideoRepository->search($criteria, Context::createDefaultContext())->getElements();
    }
}
