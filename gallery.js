/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

function getHeroImage() {
  return document.querySelector('main > div:first-of-type > div > :first-child > picture');
}

function createHeroSection() {
  const $heroImage = getHeroImage();
  if ($heroImage) {
    const src = $heroImage.querySelector('img').getAttribute('data-src');
    const $wrapper = $heroImage.closest('.section-wrapper');
    $wrapper.style.backgroundImage = `url(${src}?width=${window.innerWidth <= 400 ? 800 : 2000}&format=webply&optimize=medium)`;
    $wrapper.classList.add('hero');
    $heroImage.parentNode.remove();
  }
}

function renderThumbs($gallery, pics, offset = 0) {
  let count = 0;
  while (count < 24 && pics[count + offset]) {
    // render 32 thumbnails
    const frame = Player.getFrame({ pics });
    frame.addEventListener('hide', () => $gallery.classList.remove('hidden'));
    const index = count + offset;
    const url = pics[index];
    const $pic = createTag('img', {
      tabindex: 0,
      class: 'thumb',
      id: `pic-${index}`,
      src: `${url}?width=${window.innerWidth <= 400 ? 200 : 400}&format=webply&optimize=medium`,
    });
    $pic.addEventListener('click', () => {
      frame.show(index);
      $gallery.classList.add('hidden')
    });
    $gallery.appendChild($pic);
    count += 1;
  }
  offset += count;
  // render load more button
  if (pics.length > offset) {
    const $more = createTag('button', {
      tabindex: 0,
      class: 'load-more',
    });
    $more.addEventListener('click', (evt) => {
      renderThumbs($gallery, pics, offset);
      evt.target.remove();
    });
    $gallery.appendChild($more);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // collect picture urls and remove from dom
  const sections = Array.from(document.querySelectorAll('main > div'));
  const hasHeader = sections[0].classList.contains('hero');
  const $gallerySection = hasHeader ? sections[1] : sections[0];
  const $gallery = $gallerySection.querySelector('div');
  const pics = Array.from($gallery.querySelectorAll('img')).map(($pic) => {
    const url = $pic.getAttribute('data-src');
    $pic.parentNode.remove();
    return url;
  });
  $gallery.querySelectorAll('p:empty').forEach(($p) => $p.remove());
  $gallery.classList.add('gallery');
  if (hasHeader) {
    // add gallery below title inside header section
    sections[0].appendChild($gallerySection);
  }

  const $finalSection = sections.pop();
  if ($finalSection !== $gallerySection) {
    $finalSection.classList.add('copyright');
  }

  const $heroImage = getHeroImage();
  if ($heroImage) {
    $heroImage.addEventListener('load', () => {
      observer.disconnect();
      renderThumbs($gallery, pics);
    });
  } else {
    // observer.disconnect();
    renderThumbs($gallery, pics);
  }
});

class Player {
  constructor({
    pics = [],
    delay = 5000,
  }) {
    this._index = 0;
    this._pics = pics;
    this._delay = delay;
    this._frame = createTag('div', {
      id: 'frame',
      class: 'hidden',
    });

    if (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0)) {
      // detect swipes
      document.addEventListener('touchstart', (evt) => {
        const firstTouch = evt.touches[0];
        this._xDown = firstTouch.clientX;
        this._yDown = firstTouch.clientY;
      }, false);
      document.addEventListener('touchmove', (evt) => {
        
        if (!this._xDown || !this._yDown) {
          // no swipe
          return;
        }
        const xUp = evt.touches[0].clientX;
        const yUp = evt.touches[0].clientY;
        const xDiff = xDown - xUp;
        const yDiff = yDown - yUp;
        alert(xUp, xDiff, yup, yDiff);
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
          // horizontal swipe
          if (xDiff > 0) {
            this.next();
          } else {
            this.previous();
          }                       
        } else {
          // vertical swipe
          this.hide();
        }
        this._xDown = null;
        this._yDown = null;
      }, false);
    } else {
      document.addEventListener('keyup', ({ key }) => {
        if (!this._frame.classList.contains('hidden')) {
          if (key === 'ArrowLeft') {
            this.previous();
          }
          if (key === 'ArrowRight') {
            this.next();
          }
          if (key === 'ArrowUp'
            || key === 'ArowDown'
            || key === 'Escape') {
            this.hide();
          }
        }
      });
      this._previousBtn = createTag('div', { class: 'ctrl previous' });
      this._previousBtn.addEventListener('click', () => this.previous());
      this._nextBtn = createTag('div', { class: 'ctrl next' });
      this._nextBtn.addEventListener('click', () => this.next());
      this._frame.appendChild(this._previousBtn);
      this._frame.appendChild(this._nextBtn);
    }
    this._playBtn = createTag('div', { class: 'ctrl play' });
    this._playBtn.addEventListener('click', () => this.play());
    this._hideBtn = createTag('div', { class: 'ctrl hide' });
    this._hideBtn.addEventListener('click', () => this.hide());
    this._frame.appendChild(this._playBtn);
    this._frame.appendChild(this._hideBtn);
    document.body.appendChild(this._frame);
  }

  show(index) {
    this._index = index;
    this._frame.classList.remove('hidden');
    this._frame.style.backgroundImage = `url(${this._pics[index]}?width=${window.innerWidth <= 400 ? 800 : 2000}&format=webply&optimize=medium)`;
  }

  hide() {
    this._frame.classList.add('hidden');
    this.stop();
    this._frame.dispatchEvent(new Event('hide'));
  }

  next() {
    if (this._pics[this._index + 1]) {
      this.show(this._index + 1);
    } else {
      this.hide();
    }
  }

  previous() {
    if (this._pics[this._index - 1]) {
      this.show(this._index - 1);
    } else {
      this.hide();
    }
  }

  preloadNext() {
    if (this._pics[this._index + 1]) {
      fetch(this._pics[this._index + 1]);
    }
  }

  play() {
    this._frame.classList.add('playing');
    if (!this._player) {
      this.preloadNext();
      this._player = setInterval(() => {
        if (this._frame.classList.contains('playing')) {
          this.next();
          this.preloadNext();
        } else {
          this.stop();
        }
      }, this._delay);
    } else {
      this.stop();
    }
  }

  stop() {
    this._frame.classList.remove('playing');
    if (this._player) {
      clearInterval(this._player);
      this._player = undefined;
    }
  }

  addEventListener(name, callback) {
    this._frame.addEventListener(name, callback);
  }

  static getFrame(opts) {
    window._galleryFrame = window._galleryFrame || new Player(opts);
    return window._galleryFrame;
  }
}
