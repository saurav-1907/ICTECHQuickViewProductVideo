<?php declare(strict_types=1);

namespace ICTECHQuickViewProductVideo;

use Shopware\Core\Framework\Plugin;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;
use ICTECHQuickViewProductVideo\Util\MediaFolder;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface;
use Shopware\Core\Framework\Plugin\Context\InstallContext;
use Shopware\Core\Framework\Plugin\Context\UninstallContext;

class ICTECHQuickViewProductVideo extends Plugin
{
    public function install(InstallContext $installContext): void
    {
        parent::install($installContext);
        $this->getMediaFolder()->installMedia($installContext->getContext());
    }

    /**
     * @param UninstallContext $uninstallContext
     * @return void
     */
    public function uninstall(UninstallContext $uninstallContext): void
    {
        /* Keep UserData? Then do nothing here */
        if ($uninstallContext->keepUserData()) {
            return;
        }

        /**
         * @var Connection $connection
         */
        $connection = $this->container->get(Connection::class);
        try {
            $connection->executeStatement(
                'DELETE FROM system_config WHERE configuration_key LIKE :domain',
                [
                    'domain' => '%ICTECHQuickViewProductVideo.config%',
                ]
            );
            $connection->executeStatement('DROP TABLE IF EXISTS `product_overview_video`');
        } catch (Exception $e) {
        }
        $this->getMediaFolder()->uninstallMedia($uninstallContext->getContext());
    }

    private function getMediaFolder() : Mediafolder
    {
        /* @var EntityRepositoryInterface $mediaFolderReposiry*/
        $mediaFolderRepository = $this->container->get('media_folder.repository');

        /* @var EntityRepositoryInterface $mediaDefaultFolderRepository*/
        $mediaDefaultFolderRepository = $this->container->get('media_default_folder.repository');

        return new Mediafolder(
            $mediaFolderRepository,
            $mediaDefaultFolderRepository
        );
    }
}

