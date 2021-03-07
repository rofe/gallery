function link($elem, url) {
  const $link = createTag('a', {
    'href': url,
  });
  $elem.parentNode.insertBefore($link, $elem);
  $link.appendChild($elem);
  return $link;
}

window.addEventListener('DOMContentLoaded', () => {
  // window.gallery.observer.disconnect();

  // wrap thumbnails with links to the full version
  const sections = Array.from(document.querySelectorAll('.section-wrapper'));
  const hasHeader = sections[0] && sections[0].classList.contains('hero');
  const $gallery = document.querySelector('.gallery');
  const $gallerySection = $gallery.closest('.section-wrapper');
  $gallery.querySelectorAll('picture').forEach(($pic) => {
    const $img = $pic.querySelector('img');
    const thumbUrl = $img.getAttribute('src');
    const fullUrl = thumbUrl.replace('width=374', 'width=2000');
    const $thumb = link($img, fullUrl);
    $pic.parentElement.appendChild($thumb);
    $pic.remove();
  });
  if (hasHeader) {
    // add gallery below title inside header section
    sections[0].appendChild($gallery);
  }

  const epilog = sections.pop();
  if (epilog !== $gallerySection) {
    epilog.classList.add('epilog');
  }

  // lightGaller($gallery, {
  //   thumbnail: true,
  // });
});