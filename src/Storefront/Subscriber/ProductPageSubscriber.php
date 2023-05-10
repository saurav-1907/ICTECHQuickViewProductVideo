<?php declare(strict_types=1);

namespace ICTECHQuickViewProductVideo\Storefront\Subscriber;

use Shopware\Storefront\Page\Product\ProductPageCriteriaEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface;

class ProductPageSubscriber implements EventSubscriberInterface
{
    private $mediaFolderRepository;
    private $mediaRepository;
    private $ictMediaRedirectRepository;

    public function __construct(
        EntityRepositoryInterface $mediaFolderRepository,
        EntityRepositoryInterface $mediaRepository,
        EntityRepositoryInterface $ictMediaRedirectRepository
    ) {
        $this->mediaFolderRepository =  $mediaFolderRepository;
        $this->mediaRepository =  $mediaRepository;
        $this->ictMediaRedirectRepository =  $ictMediaRedirectRepository;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            ProductPageCriteriaEvent::class => 'onProductPageCriteriaLoaded',
        ];
    }

    public function onProductPageCriteriaLoaded(ProductPageCriteriaEvent $event): void
    {
        $event->getCriteria()->addAssociation('productOverviewVideo');
        $event->getCriteria()->addAssociation('media');
        $event->getCriteria()->getAssociation('productOverviewVideo')->addAssociation('media');
    }
}
