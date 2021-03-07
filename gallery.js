function link($elem, url) {
  const $link = createTag('a', {
    'href': url,
  });
  $elem.parentNode.insertBefore($link, $elem);
  $link.appendChild($elem);
  return $link;
}

window.addEventListener('DOMContentLoaded', () => {
  window.gallery.observer.disconnect();

  // wrap thumbnails with links to the full version
  const sections = Array.from(document.querySelectorAll('main > div'));
  const hasHeader = sections[0] && sections[0].classList.contains('hero');
  const $gallerySection = hasHeader ? sections[1] : sections[0];
  const $gallery = $gallerySection.querySelector('div') || $gallerySection;
  $gallery.querySelectorAll('picture').forEach(($pic) => {
    const img = $pic.querySelector('img');
    console.log(img.src);
    return;
    const thumbUrl = img.getAttribute('src');
    const fullUrl = thumbUrl.replace('width=374', 'width=2000');
    const thumb = link(img, fullUrl);
    $pic.parentElement.appendChild(thumb);
    $pic.remove();
  });
  $gallery.classList.add('gallery');
  $gallery.querySelectorAll('p:empty').forEach(($p) => $p.remove());
  if (hasHeader) {
    // add gallery below title inside header section
    sections[0].appendChild($gallerySection);
  }

  const $finalSection = sections.pop();
  if ($finalSection !== $gallerySection) {
    $finalSection.classList.add('addendum');
  }

  // lightGallery($gallery, {
  //   thumbnail: true,
  // });
});