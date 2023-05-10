<?php declare(strict_types=1);

namespace ICTECHQuickViewProductVideo\Util;

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Shopware\Core\Defaults;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\Uuid\Uuid;

class MediaFolder
{
    /**
     * @var EntityRepositoryInterface
     */
    private $mediaFolderRepository;

    /**
     * @var EntityRepositoryInterface
     */
    private $mediaDefaultFolderRepository;

    public function __construct(
        EntityRepositoryInterface $mediaFolderRepository,
        EntityRepositoryInterface $mediaDefaultFolderRepository
    ) {
        $this->mediaFolderRepository = $mediaFolderRepository;
        $this->mediaDefaultFolderRepository = $mediaDefaultFolderRepository;
    }
    public function installMedia(Context $context): void
    {
        $this->createMediaFolderContent($context);
    }

    public function uninstallMedia(Context $context): void
    {
        $this->deleteMediaFolderContent($context);
    }

    private function createMediaFolderContent(Context $context)
    {

        $defaultFolderId = $this->createDefaultGoogleReviewFolder($context);

        $mediaFolderId = Uuid::randomHex();
        $mediaFolder = [
            [
                'id' => $mediaFolderId,
                'name' => 'QuickView Product Videos',
                'defaultFolderId' => $defaultFolderId,
                'child_count' => '0',
                'configuration' => [
                    'id' => Uuid::randomHex(),
                    'createThumbnails' => true,
                    'keepAspectRatio' => true,
                    'thumbnailQuality' => 80,
                ],
                'created_at' => (new \DateTime())->format(Defaults::STORAGE_DATE_TIME_FORMAT)
            ]
        ];

        try {
            $this->mediaFolderRepository->create($mediaFolder, $context);
        } catch (UniqueConstraintViolationException $exception) {
        }
    }

    private function createDefaultGoogleReviewFolder(Context $context)
    {
        $mediaDefaultFolderId = Uuid::randomHex();
        $mediaDefaultFolder = [
            [
                'id' => $mediaDefaultFolderId,
                'associationFields' => ['media'],
                'entity' => 'product_overview_video',
                'created_at' => (new \DateTime())->format(Defaults::STORAGE_DATE_TIME_FORMAT)
            ]
        ];
        try {
            $this->mediaDefaultFolderRepository->create($mediaDefaultFolder, $context);
        } catch (UniqueConstraintViolationException $exception) {
        }
        return $mediaDefaultFolderId;
    }


    private function deleteMediaFolderContent(Context $context)
    {
        $deleteMediaFolderCriteria = new Criteria();
        $deleteMediaFolderCriteria->addFilter(new EqualsFilter('name', 'QuickView Product Videos'));
        $deleteMediaFolderId = $this->mediaFolderRepository->search($deleteMediaFolderCriteria, $context)->getEntities()->first()->getId();
        $deleteDefaultMediaFolderCriteria = new Criteria();
        $deleteDefaultMediaFolderCriteria->addFilter(new EqualsFilter('entity', 'product_overview_video'));
        $deleteDefaultMediaFolderId = $this->mediaDefaultFolderRepository->search($deleteDefaultMediaFolderCriteria, $context)->getEntities()->first()->getId();
        try {
            $this->mediaFolderRepository->delete([['id' => $deleteMediaFolderId]], $context);
            $this->mediaDefaultFolderRepository->delete([['id' => $deleteDefaultMediaFolderId]], $context);
        } catch (UniqueConstraintViolationException $exception) {
        }
    }
}
