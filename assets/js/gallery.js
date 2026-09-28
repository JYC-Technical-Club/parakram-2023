var gallery = document.querySelector('.parakram-gallery');

if (gallery) {
    var galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));
    var loadMoreButton = gallery.querySelector('.gallery-load-more');
    var galleryGrid = gallery.querySelector('.gallery-grid');
    var galleryCount = gallery.querySelector('.gallery-count');
    var visibleItemCount = 12;
    var isExpanded = false;

    var photoOrder = [5, 4, 12, 2, 1, 9, 10, 3, 18, 20, 16, 17, 7, 14, 11, 13, 15, 6, 8, 19];
    galleryItems = photoOrder.map(function (position) {
        return galleryItems[position - 1];
    });

    galleryItems.forEach(function (item) {
        item.style.setProperty('--tile-index', galleryItems.indexOf(item));
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', 'Open photo: ' + item.querySelector('img').alt);
        galleryGrid.appendChild(item);
    });

    var viewer = gallery.querySelector('.gallery-viewer');
    var viewerImage = gallery.querySelector('.gallery-viewer-image');
    var viewerCaption = gallery.querySelector('.gallery-viewer-caption');
    var viewerClose = gallery.querySelector('.gallery-viewer-close');
    var viewerPrevious = gallery.querySelector('.gallery-viewer-previous');
    var viewerNext = gallery.querySelector('.gallery-viewer-next');
    var viewerStage = gallery.querySelector('.gallery-viewer-stage');
    var activePhotoIndex = 0;
    var touchStartX = null;

    var showViewerPhoto = function (index) {
        activePhotoIndex = (index + galleryItems.length) % galleryItems.length;
        var photo = galleryItems[activePhotoIndex].querySelector('img');
        viewerImage.src = photo.getAttribute('src');
        viewerImage.alt = photo.alt;
        viewerCaption.textContent = photo.alt + '  /  ' + (activePhotoIndex + 1) + ' of ' + galleryItems.length;
    };

    var openViewer = function (index) {
        showViewerPhoto(index);
        viewer.showModal();
    };

    galleryItems.forEach(function (item, index) {
        item.addEventListener('click', function () {
            openViewer(index);
        });

        item.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openViewer(index);
            }
        });
    });

    viewerClose.addEventListener('click', function () {
        viewer.close();
    });

    viewerPrevious.addEventListener('click', function () {
        showViewerPhoto(activePhotoIndex - 1);
    });

    viewerNext.addEventListener('click', function () {
        showViewerPhoto(activePhotoIndex + 1);
    });

    viewer.addEventListener('click', function (event) {
        if (event.target === viewer) {
            viewer.close();
        }
    });

    viewer.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            viewer.close();
        } else if (event.key === 'ArrowLeft') {
            showViewerPhoto(activePhotoIndex - 1);
        } else if (event.key === 'ArrowRight') {
            showViewerPhoto(activePhotoIndex + 1);
        }
    });

    viewerStage.addEventListener('touchstart', function (event) {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    viewerStage.addEventListener('touchend', function (event) {
        if (touchStartX === null) {
            return;
        }

        var touchDistance = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(touchDistance) > 48) {
            showViewerPhoto(activePhotoIndex + (touchDistance < 0 ? 1 : -1));
        }

        touchStartX = null;
    }, { passive: true });

    viewerStage.addEventListener('touchcancel', function () {
        touchStartX = null;
    });

    var updateGallery = function () {
        galleryItems.forEach(function (item, index) {
            item.hidden = !isExpanded && index >= visibleItemCount;
        });

        loadMoreButton.hidden = galleryItems.length <= visibleItemCount || isExpanded;
        loadMoreButton.setAttribute('aria-expanded', String(isExpanded));
        var visibleCount = isExpanded ? galleryItems.length : Math.min(visibleItemCount, galleryItems.length);
        galleryCount.textContent = 'Showing ' + visibleCount + ' of ' + galleryItems.length + ' photos';
    };

    loadMoreButton.addEventListener('click', function () {
        isExpanded = true;
        updateGallery();
    });

    updateGallery();
}