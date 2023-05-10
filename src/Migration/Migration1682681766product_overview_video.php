<?php declare(strict_types=1);

namespace ICTECHQuickViewProductVideo\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1682681766product_overview_video extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1682681766;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement("CREATE TABLE `product_overview_video` (
    `id` BINARY(16) NOT NULL,
    `media_id` BINARY(16) NOT NULL,
    `product_id` BINARY(16) NOT NULL,
    `product_version_id` BINARY(16) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NULL,
    PRIMARY KEY (`id`),
    KEY `fk.product_overview_video.media_id` (`media_id`),
    KEY `fk.product_overview_video.product_id` (`product_id`,`product_version_id`),
    CONSTRAINT `fk.product_overview_video.media_id` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk.product_overview_video.product_id` FOREIGN KEY (`product_id`,`product_version_id`) REFERENCES `product` (`id`,`version_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
    }

    public function updateDestructive(Connection $connection): void
    {
        // implement update destructive
    }
}
