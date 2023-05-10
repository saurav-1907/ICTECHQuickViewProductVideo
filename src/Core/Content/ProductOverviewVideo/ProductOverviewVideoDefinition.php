<?php declare(strict_types=1);

namespace ICTECHQuickViewProductVideo\Core\Content\ProductOverviewVideo;

use Shopware\Core\Content\Product\ProductDefinition;
use Shopware\Core\Content\Media\MediaDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\FkField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToOneAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\ReferenceVersionField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class ProductOverviewVideoDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'product_overview_video';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getCollectionClass(): string
    {
        return ProductOverviewVideoCollection::class;
    }

    public function getEntityClass(): string
    {
        return ProductOverviewVideoEntity::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection(
            [
                (new IdField('id', 'id'))->addFlags(new PrimaryKey(), new Required()),
                (new FkField('media_id', 'mediaId', MediaDefinition::class))->addFlags(new Required()),
                (new FkField('product_id', 'productId', ProductDefinition::class))->addFlags(new Required()),
                (new ReferenceVersionField(ProductDefinition::class))->addFlags(new Required()),
                new ManyToOneAssociationField('media', 'media_id', MediaDefinition::class, 'id'),
                new ManyToOneAssociationField('product', 'product_id', ProductDefinition::class, 'id'),
            ]
        );
    }
}
