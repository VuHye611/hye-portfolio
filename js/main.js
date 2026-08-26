document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Portfolio filter tabs — event delegation for dynamic content
  const filterContainer = document.querySelector('.filter-tabs');
  if (filterContainer) {
    filterContainer.addEventListener('click', (e) => {
      const tab = e.target.closest('.filter-tab');
      if (!tab) return;
      filterContainer.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      let visibleCount = 0;
      document.querySelectorAll('.gallery-item').forEach(item => {
        const categories = item.dataset.category || '';
        if (filter === 'all' || categories.includes(filter)) {
          item.style.display = '';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });
      const galleryEmpty = document.querySelector('.gallery-empty');
      if (galleryEmpty) {
        galleryEmpty.style.display = visibleCount === 0 ? 'flex' : 'none';
      }
    });
  }

  // Number input
  const numInput = document.querySelector('.number-input input');
  if (numInput) {
    document.querySelector('.num-up')?.addEventListener('click', () => {
      numInput.value = Math.min(10, parseInt(numInput.value || 1) + 1);
    });
    document.querySelector('.num-down')?.addEventListener('click', () => {
      numInput.value = Math.max(1, parseInt(numInput.value || 1) - 1);
    });
  }

  // Frame selection
  const frameInput = document.querySelector('input[name="frame"]');
  document.querySelectorAll('.frame-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.frame-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      if (frameInput) frameInput.value = opt.dataset.frame;
    });
  });

  // File upload preview
  const fileInput = document.querySelector('.file-upload input[type="file"]');
  const filePreview = document.querySelector('.file-preview');
  const fileText = document.querySelector('.file-upload__text');
  if (fileInput && filePreview) {
    fileInput.addEventListener('change', () => {
      filePreview.innerHTML = '';
      const files = Array.from(fileInput.files).slice(0, 5);
      if (files.length === 0) {
        if (fileText) fileText.textContent = 'Bấm để chọn ảnh — tối đa 5 ảnh';
        return;
      }
      if (fileText) fileText.textContent = files.length + ' ảnh đã chọn';
      files.forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const div = document.createElement('div');
          div.className = 'file-preview__item';
          div.innerHTML = '<img src="' + e.target.result + '" alt="Ảnh ' + (i + 1) + '">'
            + '<button type="button" class="file-preview__remove" title="Xóa">×</button>';
          div.querySelector('.file-preview__remove').addEventListener('click', () => {
            div.remove();
            if (filePreview.children.length === 0) {
              fileInput.value = '';
              if (fileText) fileText.textContent = 'Bấm để chọn ảnh — tối đa 5 ảnh';
            }
          });
          filePreview.appendChild(div);
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Form submission (Formspree)
  const form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('.btn--primary');
      const formData = new FormData(form);
      if (submitBtn) { submitBtn.textContent = 'Đang gửi...'; submitBtn.disabled = true; }
      fetch(form.action, {
        method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (response.ok) {
          if (submitBtn) { submitBtn.textContent = 'Đã gửi thành công!'; submitBtn.style.background = '#22C55E'; }
          form.reset();
          if (filePreview) filePreview.innerHTML = '';
          if (fileText) fileText.textContent = 'Bấm để chọn ảnh — tối đa 5 ảnh';
          document.querySelectorAll('.frame-option').forEach((o, i) => o.classList.toggle('active', i === 0));
          if (frameInput) frameInput.value = 'Headshot';
        } else {
          if (submitBtn) { submitBtn.textContent = 'Gửi thất bại — thử lại'; submitBtn.style.background = '#C93A2A'; }
        }
      }).catch(() => {
        if (submitBtn) { submitBtn.textContent = 'Lỗi mạng — thử lại'; submitBtn.style.background = '#C93A2A'; }
      }).finally(() => {
        setTimeout(() => {
          if (submitBtn) { submitBtn.textContent = 'Gửi yêu cầu đặt commission'; submitBtn.style.background = ''; submitBtn.disabled = false; }
        }, 3000);
      });
    });
  }

  // ========== VN/EN LANGUAGE (persisted across pages) ==========
  const i18n = {
    // Navigation
    'Trang chủ': 'Home',
    'Về Hye': 'About',
    // Index page
    'Tác phẩm': 'Artworks',
    'Xem thêm': 'See more',
    'Bạn muốn một tác phẩm riêng?': 'Want your own artwork?',
    'Xem bảng giá': 'View pricing',
    'Digital artist · B&W Doodle · Full Color': 'Digital artist · B&W Doodle · Full Color',
    'Commission hiện đang mở. B&W Doodle từ 200K, Full Color từ 350K.': 'Commissions are open. B&W Doodle from 200K, Full Color from 350K.',
    // Portfolio page
    'Tổng hợp tác phẩm digital art': 'Digital art collection',
    'Tất cả': 'All',
    'Cá nhân': 'Personal',
    'Hiện tại chưa có tác phẩm nào, bạn ghé qua thể loại khác nhé!': 'No artworks in this category yet — try another one!',
    // Commission page
    'Đang mở nhận commission': 'Commissions are open',
    'Mỗi tác phẩm được vẽ riêng theo ý bạn. Chọn loại hình bên dưới để xem chi tiết và đặt hàng.': 'Each artwork is drawn to your vision. Choose a style below to see details and order.',
    'Quy trình đặt commission': 'Commission process',
    '5 bước từ ý tưởng đến tác phẩm': '5 steps from idea to artwork',
    'Gửi yêu cầu': 'Submit request',
    'Đặt cọc 50%': '50% deposit',
    'Duyệt sketch': 'Review sketch',
    'Duyệt bản hoàn thiện': 'Review final',
    'Nhận file': 'Receive file',
    'Điền form, chọn style + khung hình + mô tả. Hye phản hồi trong 24–48h.': 'Fill form, choose style + frame + description. Hye responds within 24–48h.',
    'Chuyển khoản / MoMo / PayPal. Hye bắt đầu vẽ sau khi nhận cọc.': 'Bank transfer / MoMo / PayPal. Hye starts after deposit.',
    'Tối đa 2 phiên bản. Không phù hợp → hoàn 100% cọc.': 'Max 2 versions. Not satisfied → 100% refund.',
    '3 lần chỉnh miễn phí. Từ lần 4: 50k/lần.': '3 free revisions. From 4th: 50k/each.',
    'Trả nốt 50% → nhận PNG 300dpi. (PSD nếu mua quyền thương mại.)': 'Pay remaining 50% → receive PNG 300dpi. (PSD if commercial rights purchased.)',
    'Nội quy đặt commission': 'Commission rules',
    'Đọc kỹ trước khi đặt — để cả hai vui vẻ': 'Read carefully before ordering — so both sides are happy',
    'Đặt cọc': 'Deposit',
    'Sketch': 'Sketch',
    'Chỉnh sửa': 'Revisions',
    'Thời gian': 'Timeline',
    'Hoàn tiền': 'Refund',
    'Bản quyền': 'Copyright',
    'Hye không nhận đơn khi': 'Hye does not accept orders when',
    'Đặt commission': 'Order commission',
    'Điền form — Hye sẽ phản hồi sớm nhất có thể': 'Fill form — Hye will respond as soon as possible',
    'Gửi yêu cầu đặt commission': 'Submit commission request',
    'Tên / Nickname': 'Name / Nickname',
    'Liên hệ': 'Contact',
    'Style': 'Style',
    'Khung hình': 'Frame type',
    'Tỷ lệ khung hình': 'Aspect ratio',
    'Tùy chỉnh': 'Custom',
    'Số lượng nhân vật': 'Character count',
    'Mô tả yêu cầu': 'Description',
    'Ảnh tham khảo': 'Reference images',
    'Bấm để chọn ảnh — tối đa 5 ảnh': 'Click to choose images — max 5',
    'Lưu ý về deadline cho artist (không bắt buộc)': 'Deadline notes for artist (optional)',
    'Phong cách đen trắng, nét vẽ phóng khoáng, chi tiết cao. Phù hợp cho truyện tranh, minh họa sách.': 'Black & white style, expressive strokes, high detail. Great for comics, book illustration.',
    'Có màu sắc, bảng màu theo yêu cầu. Phù hợp làm ảnh đại diện, poster cá nhân, quà tặng đặc biệt.': 'Full color, palette per request. Great for avatars, personal posters, special gifts.',
    'Headshot': 'Headshot',
    'Waist-up': 'Waist-up',
    'Full body': 'Full body',
    'Thêm nhân vật': 'Extra character',
    // About page
    'Về Hye': 'About Hye',
    'Xin chào! Mình là Hye — Digital artist đến từ Việt Nam, chuyên vẽ commission theo phong cách B&W Doodle và Full Color.': "Hi! I'm Hye — a digital artist from Vietnam, specializing in B&W Doodle and Full Color commissions.",
    'Mình bắt đầu vẽ từ nhỏ, yêu thích manga và nghệ thuật truyền thống. Hiện tại mình nhận commission qua Facebook và website này.': "I've been drawing since childhood, loving manga and traditional art. Currently taking commissions via Facebook and this website.",
    'Feedback': 'Feedback',
    'Khách cũ nói gì về Hye': 'What past clients say about Hye',
    'Liên hệ': 'Contact',
    'Muốn có tác phẩm riêng?': 'Want your own artwork?',
    'Đặt commission ngay': 'Order commission now',
    // Footer
    '© 2026 HYE VU': '© 2026 HYE VU',
  };

  function applyLanguage(lang) {
    const isEn = lang === 'en';
    document.querySelectorAll('.nav__lang').forEach(l => l.textContent = isEn ? 'EN / VN' : 'VN / EN');

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (isEn && i18n[key]) {
        el.textContent = i18n[key];
      } else if (!isEn) {
        el.textContent = key;
      }
    });

    document.querySelectorAll('h1, h2, h3, h4, p, a, span, button, label, summary').forEach(el => {
      if (el.children.length > 0 && !el.classList.contains('form-label')) return;
      if (el.closest('.artwork-popup')) return;
      if (el.classList.contains('nav__lang')) return;
      if (el.tagName === 'A' && el.href) {
        // skip links with only href
      }

      const text = el.childNodes[0]?.nodeValue?.trim() || el.textContent.trim();
      if (!text) return;

      if (isEn) {
        if (i18n[text]) {
          if (el.childNodes[0]?.nodeType === 3) {
            el.childNodes[0].nodeValue = el.childNodes[0].nodeValue.replace(text, i18n[text]);
          } else if (el.children.length === 0) {
            el.textContent = i18n[text];
          }
        }
      } else {
        const viKey = Object.keys(i18n).find(k => i18n[k] === text);
        if (viKey) {
          if (el.childNodes[0]?.nodeType === 3) {
            el.childNodes[0].nodeValue = el.childNodes[0].nodeValue.replace(text, viKey);
          } else if (el.children.length === 0) {
            el.textContent = viKey;
          }
        }
      }
    });
  }

  let currentLang = localStorage.getItem('hye_lang') || 'vi';
  if (currentLang === 'en') applyLanguage('en');

  window.reapplyLanguage = function() {
    const lang = localStorage.getItem('hye_lang') || 'vi';
    if (lang === 'en') applyLanguage('en');
  };

  document.querySelectorAll('.nav__lang').forEach(btn => {
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => {
      currentLang = currentLang === 'vi' ? 'en' : 'vi';
      localStorage.setItem('hye_lang', currentLang);
      applyLanguage(currentLang);
    });
  });

  // ========== PORTFOLIO POPUP (Instagram style) ==========
  const popup = document.querySelector('.artwork-popup');
  const popupImg = document.querySelector('.popup__image img');
  const popupTitle = document.querySelector('.popup__title');
  const popupMetaStyle = document.querySelector('.popup__meta-style');
  const popupMetaType = document.querySelector('.popup__meta-type');
  const popupMetaYear = document.querySelector('.popup__meta-year');
  const popupSize = document.querySelector('.popup__size');
  const popupDesc = document.querySelector('.popup__desc');
  const popupClose = document.querySelector('.popup__close');
  const popupZoomIn = document.querySelector('.popup__zoom-in');
  const popupZoomOut = document.querySelector('.popup__zoom-out');
  const popupZoomLevel = document.querySelector('.popup__zoom-level');
  const popupPrev = document.querySelector('.popup__nav--prev');
  const popupNext = document.querySelector('.popup__nav--next');
  const popupImageContainer = document.querySelector('.popup__image');

  const masonry = document.querySelector('.gallery-masonry');
  if (popup && masonry) {
    let zoomLevel = 1;
    let panX = 0, panY = 0;
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let currentIndex = 0;

    function getVisibleItems() {
      return Array.from(document.querySelectorAll('.gallery-item')).filter(item => item.style.display !== 'none');
    }

    function updatePopupContent(item) {
      const img = item.querySelector('img');
      if (img) popupImg.src = img.src;
      if (popupTitle) popupTitle.textContent = item.dataset.title || '';
      if (popupMetaStyle) popupMetaStyle.textContent = item.dataset.style || '';
      if (popupMetaType) popupMetaType.textContent = item.dataset.type || '';
      if (popupMetaYear) popupMetaYear.textContent = item.dataset.year || '';
      if (popupSize) popupSize.textContent = item.dataset.size || '';
      if (popupDesc) popupDesc.textContent = item.dataset.desc || '';
      resetZoom();
    }

    function resetZoom() {
      zoomLevel = 1;
      panX = 0;
      panY = 0;
      applyTransform();
      if (popupZoomLevel) popupZoomLevel.textContent = '100%';
    }

    function applyTransform() {
      popupImg.style.transform = 'translate(calc(-50% + ' + panX + 'px), calc(-50% + ' + panY + 'px)) scale(' + zoomLevel + ')';
    }

    function openPopup(index) {
      const items = getVisibleItems();
      if (index < 0 || index >= items.length) return;
      currentIndex = index;
      updatePopupContent(items[index]);
      popup.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closePopup() {
      popup.classList.remove('open');
      document.body.style.overflow = '';
      resetZoom();
    }

    function navigate(dir) {
      const items = getVisibleItems();
      currentIndex = (currentIndex + dir + items.length) % items.length;
      updatePopupContent(items[currentIndex]);
    }

    masonry.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      const items = getVisibleItems();
      const idx = items.indexOf(item);
      if (idx !== -1) openPopup(idx);
    });

    if (popupClose) popupClose.addEventListener('click', closePopup);
    if (popupPrev) popupPrev.addEventListener('click', () => navigate(-1));
    if (popupNext) popupNext.addEventListener('click', () => navigate(1));

    popup.addEventListener('click', (e) => {
      if (e.target === popup) closePopup();
    });

    document.addEventListener('keydown', (e) => {
      if (!popup.classList.contains('open')) return;
      if (e.key === 'Escape') closePopup();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });

    if (popupZoomIn) {
      popupZoomIn.addEventListener('click', () => {
        zoomLevel = Math.min(4, zoomLevel + 0.5);
        applyTransform();
        if (popupZoomLevel) popupZoomLevel.textContent = Math.round(zoomLevel * 100) + '%';
      });
    }
    if (popupZoomOut) {
      popupZoomOut.addEventListener('click', () => {
        zoomLevel = Math.max(1, zoomLevel - 0.5);
        if (zoomLevel === 1) { panX = 0; panY = 0; }
        applyTransform();
        if (popupZoomLevel) popupZoomLevel.textContent = Math.round(zoomLevel * 100) + '%';
      });
    }

    // Pan/drag when zoomed
    if (popupImageContainer) {
      popupImageContainer.addEventListener('mousedown', (e) => {
        if (zoomLevel <= 1) return;
        isDragging = true;
        dragStartX = e.clientX - panX;
        dragStartY = e.clientY - panY;
        popupImageContainer.classList.add('dragging');
        e.preventDefault();
      });
      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        panX = e.clientX - dragStartX;
        panY = e.clientY - dragStartY;
        applyTransform();
      });
      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          popupImageContainer.classList.remove('dragging');
        }
      });

      // Touch support for mobile
      let touchStartX = 0, touchStartY = 0;
      popupImageContainer.addEventListener('touchstart', (e) => {
        if (zoomLevel <= 1 || e.touches.length !== 1) return;
        isDragging = true;
        touchStartX = e.touches[0].clientX - panX;
        touchStartY = e.touches[0].clientY - panY;
      }, { passive: true });
      popupImageContainer.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        panX = e.touches[0].clientX - touchStartX;
        panY = e.touches[0].clientY - touchStartY;
        applyTransform();
        e.preventDefault();
      }, { passive: false });
      popupImageContainer.addEventListener('touchend', () => { isDragging = false; });
    }

    popup.addEventListener('contextmenu', (e) => e.preventDefault());
    popup.addEventListener('dragstart', (e) => e.preventDefault());
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
