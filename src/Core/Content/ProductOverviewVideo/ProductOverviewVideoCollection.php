<?php declare(strict_types=1);

namespace ICTECHQuickViewProductVideo\Core\Content\ProductOverviewVideo;

use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @method void                add(ProductOverviewVideoEntity $entity)
 * @method void                set(string $key, ProductOverviewVideoEntity $entity)
 * @method ProductOverviewVideoEntity[]    getIterator()
 * @method ProductOverviewVideoEntity[]    getElements()
 * @method ProductOverviewVideoEntity|null get(string $key)
 * @method ProductOverviewVideoEntity|null first()
 * @method ProductOverviewVideoEntity|null last()
 */
 #[Package('core')]
class ProductOverviewVideoCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return ProductOverviewVideoEntity::class;
    }
}
