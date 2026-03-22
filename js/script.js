/* ============================================================
   BANU & BARIŞ - DÜĞÜN DAVETİYESİ
   JavaScript - Geri Sayım, Form, Müzik, Animasyonlar
   ============================================================ */

(function () {
    'use strict';

    // ====================
    // YAPILANDIRMA
    // ====================
    const CONFIG = {
        weddingDate: new Date('2026-07-11T19:30:00+03:00'), // Türkiye saati
        venueName: 'Saklı Deniz',
        venueAddress: 'Sahil, Marmara Cd. No 160/A, 34520 Beylikdüzü/İstanbul',
        coupleName: 'Banu & Barış',

        // Google Apps Script Web App URL - BU ADRESI README'DEKİ ADIMLARI TAKİP EDEREK DEĞİŞTİRİN
        googleScriptURL: 'https://script.google.com/macros/s/AKfycbyXeijKDAiKrBlHtqjI9pfVxxkhK1OfVpR7eY6-y5okRUvQ3_sR314ZIoeYEjtM_INI/exec',
    };

    // ====================
    // GERİ SAYIM SAYACI
    // ====================
    function initCountdown() {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        function updateCountdown() {
            const now = new Date();
            const diff = CONFIG.weddingDate - now;

            if (diff <= 0) {
                daysEl.textContent = '0';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            daysEl.textContent = days;
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // ====================
    // MÜZİK OYNATICI
    // ====================
    function initMusic() {
        const btn = document.getElementById('music-toggle');
        const audio = document.getElementById('bg-music');
        const iconOff = btn.querySelector('.music-off');
        const iconOn = btn.querySelector('.music-on');
        let isPlaying = false;
        let hasAutoPlayed = false;

        function setPlayingUI() {
            isPlaying = true;
            btn.classList.add('playing');
            iconOff.style.display = 'none';
            iconOn.style.display = '';
        }

        function setPausedUI() {
            isPlaying = false;
            btn.classList.remove('playing');
            iconOff.style.display = '';
            iconOn.style.display = 'none';
        }

        function startMusic() {
            var playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(function() {
                    setPlayingUI();
                }).catch(function() {
                    // Tarayıcı engelledi - sessiz kal
                });
            }
        }

        // Müzik butonuna tıklayınca aç/kapa
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isPlaying) {
                audio.pause();
                setPausedUI();
            } else {
                startMusic();
            }
        });

        // Kullanıcı sayfayla ilk etkileşimde müziği başlat
        function tryAutoPlay() {
            if (hasAutoPlayed) return;
            hasAutoPlayed = true;
            startMusic();
            // Tüm dinleyicileri temizle
            removeAutoPlayListeners();
        }

        function removeAutoPlayListeners() {
            document.removeEventListener('click', tryAutoPlay, true);
            document.removeEventListener('touchstart', onFirstTouch, true);
            document.removeEventListener('scroll', onFirstScroll, true);
        }

        // Touch için özel handler - iOS'ta touch event user gesture sayılır
        function onFirstTouch() {
            tryAutoPlay();
        }

        // Scroll için - küçük bir gecikme ile dene
        function onFirstScroll() {
            if (hasAutoPlayed) return;
            hasAutoPlayed = true;
            // Scroll user gesture sayılmaz iOS'ta, o yüzden
            // bir sonraki touchstart/click'i bekle
            audio.play().then(function() {
                setPlayingUI();
                removeAutoPlayListeners();
            }).catch(function() {
                // Scroll yetmedi, touch/click bekle
                hasAutoPlayed = false;
            });
        }

        document.addEventListener('click', tryAutoPlay, true);
        document.addEventListener('touchstart', onFirstTouch, true);
        document.addEventListener('scroll', onFirstScroll, true);
    }

    // ====================
    // SCROLL ANİMASYONLARI
    // ====================
    function initScrollAnimations() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        document.querySelectorAll('.fade-in').forEach((el) => {
            observer.observe(el);
        });
    }

    // ====================
    // TAKVİME EKLE
    // ====================
    function initCalendarButtons() {
        const startDate = '20260711T163000Z'; // UTC (19:30 TR = 16:30 UTC)
        const endDate = '20260712T003000Z';   // UTC (03:30 TR ertesi gün = 00:30 UTC)
        const title = encodeURIComponent('Banu & Barış Düğünü');
        const location = encodeURIComponent(CONFIG.venueName + ', ' + CONFIG.venueAddress);
        const details = encodeURIComponent('Banu Solak & Barış Yurtsever\'in düğün töreni ve yemeği.\n\nMekan: ' + CONFIG.venueName + '\nAdres: ' + CONFIG.venueAddress);

        // Google Calendar - doğrudan takvime ekle sayfasına yönlendir
        const googleCalBtn = document.getElementById('google-cal-btn');
        if (googleCalBtn) {
            const googleUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + title + '&dates=' + startDate + '/' + endDate + '&details=' + details + '&location=' + location + '&sf=true&output=xml';
            googleCalBtn.href = googleUrl;
        }

        // Outlook.com Calendar - doğrudan takvime ekle
        const outlookBtn = document.getElementById('outlook-cal-btn');
        if (outlookBtn) {
            var outlookUrl = 'https://outlook.live.com/calendar/0/action/compose?subject=' + title + '&startdt=2026-07-11T16:30:00Z&enddt=2026-07-12T00:30:00Z&location=' + location + '&body=' + details;
            outlookBtn.href = outlookUrl;
        }
    }

    // ====================
    // RSVP FORMU
    // ====================
    function initRSVPForm() {
        const form = document.getElementById('rsvp-form');
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const statusDiv = document.getElementById('form-status');
        const successDiv = document.getElementById('success-message');
        const guestCountGroup = document.getElementById('guest-count-group');
        const guestsInput = document.getElementById('guests');

        // Katılım durumuna göre kişi sayısı alanını göster/gizle
        const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
        attendanceRadios.forEach((radio) => {
            radio.addEventListener('change', function () {
                if (this.value === 'Katılacağım') {
                    guestCountGroup.style.display = 'block';
                    guestsInput.required = true;
                    // Yumuşak animasyon
                    guestCountGroup.style.opacity = '0';
                    guestCountGroup.style.transform = 'translateY(-10px)';
                    guestCountGroup.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    requestAnimationFrame(() => {
                        guestCountGroup.style.opacity = '1';
                        guestCountGroup.style.transform = 'translateY(0)';
                    });
                } else {
                    guestCountGroup.style.display = 'none';
                    guestsInput.required = false;
                    guestsInput.value = '0';
                }
            });
        });

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Doğrulama
            const fullname = document.getElementById('fullname').value.trim();
            const attendance = form.querySelector('input[name="attendance"]:checked');

            if (!fullname) {
                showStatus('Lütfen ad soyad giriniz.', 'error');
                return;
            }
            if (!attendance) {
                showStatus('Lütfen katılım durumunuzu seçiniz.', 'error');
                return;
            }

            const guests = attendance.value === 'Katılacağım' ? guestsInput.value : '0';

            // Gönderim durumu
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            statusDiv.style.display = 'none';

            const formData = {
                fullname: fullname,
                attendance: attendance.value,
                guests: guests,
                timestamp: new Date().toLocaleString('tr-TR'),
            };

            try {
                // Google Apps Script URL kontrolü
                if (CONFIG.googleScriptURL === 'BURAYA_GOOGLE_APPS_SCRIPT_URL_YAPISTIRIN') {
                    // Demo mod - URL henüz ayarlanmadıysa
                    console.log('RSVP verisi (demo):', formData);
                    await new Promise((r) => setTimeout(r, 1000)); // Simülasyon
                } else {
                    // Gerçek gönderim
                    await fetch(CONFIG.googleScriptURL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData),
                    });
                }

                // Başarılı
                form.style.display = 'none';
                successDiv.style.display = 'block';

                // Konfeti efekti
                launchConfetti();
            } catch (err) {
                console.error('Form gönderim hatası:', err);
                showStatus('Bir hata oluştu. Lütfen tekrar deneyiniz.', 'error');
            } finally {
                submitBtn.disabled = false;
                btnText.style.display = '';
                btnLoading.style.display = 'none';
            }
        });

        function showStatus(msg, type) {
            statusDiv.textContent = msg;
            statusDiv.className = 'form-status ' + type;
            statusDiv.style.display = 'block';
        }
    }

    // ====================
    // KONFETİ EFEKTİ
    // ====================
    function launchConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const confettiColors = ['#c9a84c', '#a8d5a2', '#2d5016', '#e2cc7e', '#fdf6e3', '#ff9a9a', '#ffcccb'];
        const confettiCount = 150;
        const confetti = [];

        for (let i = 0; i < confettiCount; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                w: Math.random() * 10 + 5,
                h: Math.random() * 6 + 3,
                color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                speedX: (Math.random() - 0.5) * 3,
                speedY: Math.random() * 3 + 2,
                opacity: 1,
            });
        }

        let frame = 0;
        const maxFrames = 200;

        function animate() {
            if (frame >= maxFrames) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            confetti.forEach((c) => {
                c.x += c.speedX;
                c.y += c.speedY;
                c.rotation += c.rotationSpeed;

                // Fade out son 50 karede
                if (frame > maxFrames - 50) {
                    c.opacity = Math.max(0, 1 - (frame - (maxFrames - 50)) / 50);
                }

                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.rotate((c.rotation * Math.PI) / 180);
                ctx.globalAlpha = c.opacity;
                ctx.fillStyle = c.color;
                ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
                ctx.restore();
            });

            frame++;
            requestAnimationFrame(animate);
        }

        animate();

        // Pencere boyutu değişirse
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // ====================
    // BAŞLAT
    // ====================
    document.addEventListener('DOMContentLoaded', function () {
        initCountdown();
        initMusic();
        initScrollAnimations();
        initCalendarButtons();
        initRSVPForm();
    });
})();
