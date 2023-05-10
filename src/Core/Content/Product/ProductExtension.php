<?php declare(strict_types=1);

namespace ICTECHQuickViewProductVideo\Core\Content\Product;

use ICTECHQuickViewProductVideo\Core\Content\ProductOverviewVideo\ProductOverviewVideoDefinition;
use Shopware\Core\Content\Product\ProductDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityExtension;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\CascadeDelete;
use Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToOneAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class ProductExtension extends EntityExtension
{
    public function extendFields(FieldCollection $collection): void
    {
        $collection->add((new ManyToOneAssociationField('productOverviewVideo', 'id', ProductOverviewVideoDefinition::class, 'product_id'))->addFlags(new CascadeDelete()));
    }

    public function getDefinitionClass(): string
    {
        return ProductDefinition::class;
    }
}
