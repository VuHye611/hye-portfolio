(function () {
  var PROJECT_ID = '8odula8j';
  var DATASET = 'production';
  var CDN = 'https://cdn.sanity.io';
  var API = 'https://' + PROJECT_ID + '.apicdn.sanity.io/v2024-01-01/data/query/' + DATASET;

  function sanityFetch(groqQuery) {
    var url = API + '?query=' + encodeURIComponent(groqQuery);
    return fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (r) { return r.result; });
  }

  function urlFor(image, width) {
    if (!image || !image.asset || !image.asset._ref) return '';
    var match = image.asset._ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
    if (!match) return '';
    var url = CDN + '/images/' + PROJECT_ID + '/' + DATASET + '/' + match[1] + '-' + match[2] + '.' + match[3];
    if (width) url += '?w=' + width + '&fit=max&auto=format';
    return url;
  }

  function esc(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function blocksToHtml(blocks) {
    if (!blocks || !Array.isArray(blocks)) return '';
    return blocks.map(function (block) {
      if (block._type !== 'block') return '';
      var text = (block.children || []).map(function (child) {
        var t = esc(child.text || '');
        if (child.marks && child.marks.indexOf('strong') !== -1) t = '<strong>' + t + '</strong>';
        if (child.marks && child.marks.indexOf('em') !== -1) t = '<em>' + t + '</em>';
        return t;
      }).join('');
      return '<p>' + text + '</p>';
    }).join('');
  }

  function detectPage() {
    var path = location.pathname.toLowerCase();
    if (path.indexOf('portfolio') !== -1) return 'portfolio';
    if (path.indexOf('commission') !== -1) return 'commission';
    if (path.indexOf('about') !== -1) return 'about';
    return 'index';
  }

  // ===== HOMEPAGE =====
  function renderHomepage() {
    return Promise.all([
      sanityFetch('*[_type == "siteSettings"][0]{ heroSubtitle, ctaText }'),
      sanityFetch('*[_type == "artwork" && featured == true] | order(order asc){ title, image }')
    ]).then(function (results) {
      var settings = results[0];
      var artworks = results[1];

      if (settings) {
        var heroDesc = document.querySelector('.hero__desc');
        if (heroDesc && settings.heroSubtitle) heroDesc.textContent = settings.heroSubtitle;

        var ctaP = document.querySelector('.cta-banner p');
        if (ctaP && settings.ctaText) ctaP.textContent = settings.ctaText;
      }

      if (artworks && artworks.length > 0) {
        var grid = document.querySelector('.portfolio-grid');
        if (grid) {
          grid.innerHTML = artworks.slice(0, 4).map(function (a) {
            return '<div class="portfolio-grid__item"><img src="' + urlFor(a.image, 600) + '" alt="' + esc(a.title) + '"></div>';
          }).join('');
        }
      }
    });
  }

  // ===== PORTFOLIO =====
  function renderPortfolio() {
    return sanityFetch(
      '*[_type == "artwork"] | order(order asc){ title, image, style, artType, year, size, description, ratio, categories }'
    ).then(function (artworks) {
      if (!artworks || artworks.length === 0) return;

      var masonry = document.querySelector('.gallery-masonry');
      if (!masonry) return;

      masonry.innerHTML = artworks.map(function (a) {
        var cats = (a.categories || []).join(' ');
        var styleName = a.style === 'bw-doodle' ? 'B&W Doodle' : a.style === 'full-color' ? 'Full Color' : (a.style || '');
        var typeName = a.artType === 'commission' ? 'Commission' : a.artType === 'ca-nhan' ? 'Cá nhân' : (a.artType || '');

        return '<div class="gallery-item" data-category="' + esc(cats) + '" data-ratio="' + esc(a.ratio) + '"'
          + ' data-title="' + esc(a.title) + '" data-style="' + esc(styleName) + '" data-type="' + esc(typeName) + '"'
          + ' data-year="' + (a.year || '') + '" data-size="' + esc(a.size) + '" data-desc="' + esc(a.description) + '">'
          + '<img src="' + urlFor(a.image, 800) + '" alt="' + esc(a.title) + '">'
          + '<div class="gallery-item__overlay">'
          + '<h3>' + esc(a.title) + '</h3>'
          + '<p>' + esc(styleName) + ' · ' + esc(typeName) + '</p>'
          + '</div></div>';
      }).join('');
    });
  }

  // ===== COMMISSION =====
  function renderCommission() {
    return Promise.all([
      sanityFetch('*[_type == "siteSettings"][0]{ commissionOpen, revisionFee, rushMultiplier }'),
      sanityFetch('*[_type == "pricingStyle"] | order(order asc){ name, description, sampleImage, grayscale, badgeColor, prices, extraCharacterRate }')
    ]).then(function (results) {
      var settings = results[0];
      var styles = results[1];

      if (settings) {
        var statusDot = document.querySelector('.commission-status__dot');
        var statusText = document.querySelector('.commission-status span');
        if (statusDot && statusText) {
          if (settings.commissionOpen) {
            statusText.textContent = 'Đang mở nhận commission';
          } else {
            statusDot.style.background = '#C93A2A';
            statusText.textContent = 'Commission hiện đang đóng';
          }
        }
      }

      if (styles && styles.length > 0) {
        var grid = document.querySelector('.pricing-grid');
        if (!grid) return;
        var revisionFee = (settings && settings.revisionFee) || '50k/lần';
        var rushMultiplier = (settings && settings.rushMultiplier) || '×2';

        grid.innerHTML = styles.map(function (s) {
          var imgStyle = s.grayscale ? 'filter:grayscale(1)' : '';
          var badgeClass = s.badgeColor === 'bw' ? 'pricing-card__badge--bw' : 'pricing-card__badge--color';

          var priceRows = (s.prices || []).map(function (p) {
            return '<div class="pricing-row"><span>' + esc(p.frame) + '</span><span>' + esc(p.price) + '</span></div>';
          }).join('');

          var extraChar = s.extraCharacterRate || '+80%/character';

          return '<div class="pricing-card">'
            + '<div class="pricing-card__image">'
            + '<img src="' + urlFor(s.sampleImage, 600) + '" alt="' + esc(s.name) + '" style="' + imgStyle + '">'
            + '<span class="pricing-card__badge ' + badgeClass + '">' + esc(s.name) + '</span>'
            + '</div>'
            + '<div class="pricing-card__body">'
            + '<h3>' + esc(s.name) + '</h3>'
            + '<p>' + esc(s.description) + '</p>'
            + '<div class="pricing-table">'
            + priceRows
            + '<div class="pricing-row"><span>Thêm nhân vật</span><span>' + esc(extraChar) + '</span></div>'
            + '</div>'
            + '<div class="pricing-note"><span>Chỉnh sửa thêm (từ lần 4):</span> <strong style="color:var(--brown)">' + esc(revisionFee) + '</strong> · <span>Cần gấp:</span> <strong style="color:var(--red)">' + esc(rushMultiplier) + '</strong></div>'
            + '</div></div>';
        }).join('');
      }
    });
  }

  // ===== ABOUT =====
  function renderAbout() {
    return Promise.all([
      sanityFetch('*[_type == "siteSettings"][0]{ aboutBio, aboutAvatar, socialLinks }'),
      sanityFetch('*[_type == "testimonial"] | order(order asc){ name, quote, screenshot }')
    ]).then(function (results) {
      var settings = results[0];
      var testimonials = results[1];

      if (settings) {
        if (settings.aboutAvatar) {
          var avatarImg = document.querySelector('.about-hero__image img');
          if (avatarImg) avatarImg.src = urlFor(settings.aboutAvatar, 400);
        }

        if (settings.aboutBio && settings.aboutBio.length > 0) {
          var content = document.querySelector('.about-hero__content');
          if (content) {
            var h1 = content.querySelector('h1');
            var line = content.querySelector('.line');
            var bioHtml = blocksToHtml(settings.aboutBio);
            content.innerHTML = '';
            if (h1) content.appendChild(h1);
            if (line) content.appendChild(line);
            content.insertAdjacentHTML('beforeend', bioHtml);
          }
        }

        if (settings.socialLinks) {
          var links = settings.socialLinks;
          document.querySelectorAll('.contact-item').forEach(function (item) {
            var label = item.querySelector('.contact-item__label');
            var value = item.querySelector('.contact-item__value');
            if (!label || !value) return;
            var key = label.textContent.trim();
            if (key === 'Instagram' && links.instagram) value.textContent = links.instagram;
            if (key === 'TikTok' && links.tiktok) value.textContent = links.tiktok;
            if (key === 'Email' && links.email) value.textContent = links.email;
            if (key === 'Behance' && links.behance) value.textContent = links.behance;
          });
        }
      }

      if (testimonials && testimonials.length > 0) {
        var grid = document.querySelector('.feedback-grid');
        if (grid) {
          grid.innerHTML = testimonials.map(function (t) {
            var screenshotHtml = t.screenshot
              ? '<div class="feedback-card__image"><img src="' + urlFor(t.screenshot, 300) + '" alt="Screenshot"></div>'
              : '<div class="feedback-card__image"><span>Screenshot</span></div>';
            return '<div class="feedback-card">'
              + screenshotHtml
              + '<div><h4>' + esc(t.name) + '</h4>'
              + '<p>"' + esc(t.quote) + '"</p></div></div>';
          }).join('');
        }
      }
    });
  }

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', function () {
    var page = detectPage();
    var renderFn;

    if (page === 'index') renderFn = renderHomepage;
    else if (page === 'portfolio') renderFn = renderPortfolio;
    else if (page === 'commission') renderFn = renderCommission;
    else if (page === 'about') renderFn = renderAbout;

    if (renderFn) {
      renderFn()
        .then(function () {
          if (typeof window.reapplyLanguage === 'function') window.reapplyLanguage();
        })
        .catch(function (err) {
          console.warn('[Sanity] Fetch failed, using fallback content:', err);
        });
    }
  });
})();
