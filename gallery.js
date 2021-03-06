function link($elem, url) {
  const $link = createTag('a', {
    'href': url,
  });
  $elem.parentNode.insertBefore($link, $elem);
  $link.appendChildNode($elem);
}

// wrap thumbnails with links to the full version
const sections = Array.from(document.querySelectorAll('main > div'));
const hasHeader = sections[0].classList.contains('hero');
const $gallerySection = hasHeader ? sections[1] : sections[0];
const $gallery = $gallerySection.querySelector('div');
const pics = Array.from($gallery.querySelectorAll('picture')).forEach(($pic) => {
  const thumbUrl = $pic.firstElementChild.getAttribute('src');
  const fullUrl = thumbUrl.replace('width=374', 'width=2000');
  link($pic, fullUrl);
});
$gallery.classList.add('gallery');
$gallery.querySelectorAll('p:empty').forEach(($p) => $p.remove());
if (hasHeader) {
  // add gallery below title inside header section
  sections[0].appendChild($gallerySection);
}

const $finalSection = sections.pop();
if ($finalSection !== $gallerySection) {
  $finalSection.classList.add('copyright');
}

window.gallery.observer.disconnect();
lightGallery($gallery);
