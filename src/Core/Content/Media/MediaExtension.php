<?php declare(strict_types=1);

namespace ICTECHQuickViewProductVideo\Core\Content\Media;

use ICTECHQuickViewProductVideo\Core\Content\ProductOverviewVideo\ProductOverviewVideoDefinition;
use Shopware\Core\Content\Media\MediaDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityExtension;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\CascadeDelete;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Inherited;
use Shopware\Core\Framework\DataAbstractionLayer\Field\OneToManyAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class MediaExtension extends EntityExtension
{
    public function extendFields(FieldCollection $collection): void
    {
        $collection->add((new OneToManyAssociationField('productOverviewVideo', ProductOverviewVideoDefinition::class, 'media_id', 'id'))->addFlags(new CascadeDelete(), new Inherited()));
    }

    public function getDefinitionClass(): string
    {
        return MediaDefinition::class;
    }
}
