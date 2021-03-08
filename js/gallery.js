function link($elem, href, cl) {
  const $link = createTag('a', {
    href,
    class: cl,
    tabindex: 0,
  });
  $elem.parentNode.insertBefore($link, $elem);
  $link.appendChild($elem);
  return $link;
}

window.addEventListener('DOMContentLoaded', () => {
  window.gallery.observer.disconnect();

  const $gallery = document.querySelector('.gallery');
  if (!$gallery) {
    return;
  }

  // wrap thumbnails with links to the full version
  const $gallerySection = $gallery.closest('.section-wrapper');
  $gallery.querySelectorAll('picture').forEach(($pic) => {
    const $img = $pic.querySelector('img');
    const fullUrl = $img.src
      .replace(/\?width\=\d+/, '?width=2000') // increase width to 2000px
      .replace(/\&crop\=\d+:\d+/,''); // remove cropping
    const $thumb = link($img, fullUrl, 'thumb');
    $pic.parentElement.appendChild($thumb);
    $pic.remove();
  });
  
  const sections = Array.from(document.querySelectorAll('.section-wrapper'));
  const hasHeader = sections[0] && sections[0].classList.contains('hero');
  if (hasHeader) {
    // add gallery below title if header section
    sections[0].appendChild($gallery);
  }

  // treat last section as epilog
  const $epilogSection = sections.pop();
  if ($epilogSection !== $gallerySection) {
    $epilogSection.classList.add('epilog');
  }

  // find wall div and initialize lightgallery
  const $wall = $gallery.querySelector('.gallery > div > div');
  $wall.classList.add('gallery-wall');
  lightGallery($wall, {
    thumbnail: true,
  });
});
