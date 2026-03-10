// JavaScript for 兒童與全齡共融園區 website - CMS友善版本

// Hero carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    var currentSlide = 0;
    var slides = document.querySelectorAll('#slide-1, #slide-2');
    var dots = document.querySelectorAll('.absolute.bottom-8 button');

    if (slides.length > 0 && dots.length > 0) {
        function showSlide(index) {
            for (var i = 0; i < slides.length; i++) {
                if (i === index) {
                    slides[i].style.opacity = '1';
                    slides[i].style.transition = 'opacity 0.5s ease-in-out';
                } else {
                    slides[i].style.opacity = '0';
                    slides[i].style.transition = 'opacity 0.5s ease-in-out';
                }
            }

            for (var i = 0; i < dots.length; i++) {
                if (i === index) {
                    dots[i].classList.remove('bg-white/50');
                    dots[i].classList.add('bg-white');
                } else {
                    dots[i].classList.remove('bg-white');
                    dots[i].classList.add('bg-white/50');
                }
            }
        }

        // Auto rotate slides every 5 seconds
        setInterval(function () {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);

        // Dot navigation
        for (var i = 0; i < dots.length; i++) {
            dots[i].addEventListener('click', function (index) {
                return function () {
                    currentSlide = index;
                    showSlide(currentSlide);
                };
            }(i));
        }

        // Initialize first slide
        showSlide(0);
    }
});

// Interactive Vision Display - Manual Divider Functionality
document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('vision-container');
    const dividerLine = document.getElementById('divider-line');
    const futureImage = document.getElementById('future-image');

    if (container && dividerLine && futureImage) {
        let isDragging = false;

        // Mouse events
        dividerLine.addEventListener('mousedown', function (e) {
            isDragging = true;
            e.preventDefault();
            container.style.cursor = 'col-resize';
        });

        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;

            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

            // Update divider position
            dividerLine.style.left = percentage + '%';

            // Update clip-path for future image
            futureImage.style.clipPath = `inset(0px ${100 - percentage}% 0px 0px)`;
        });

        document.addEventListener('mouseup', function () {
            isDragging = false;
            container.style.cursor = 'col-resize';
        });

        // Touch events for mobile
        dividerLine.addEventListener('touchstart', function (e) {
            isDragging = true;
            e.preventDefault();
        });

        document.addEventListener('touchmove', function (e) {
            if (!isDragging) return;

            const rect = container.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

            // Update divider position
            dividerLine.style.left = percentage + '%';

            // Update clip-path for future image
            futureImage.style.clipPath = `inset(0px ${100 - percentage}% 0px 0px)`;
        });

        document.addEventListener('touchend', function () {
            isDragging = false;
        });

        // Click on container to move divider
        container.addEventListener('click', function (e) {
            if (isDragging) return; // Don't trigger on drag end

            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

            // Smooth animation to clicked position
            dividerLine.style.transition = 'left 0.3s ease-out';
            futureImage.style.transition = 'clip-path 0.3s ease-out';

            dividerLine.style.left = percentage + '%';
            futureImage.style.clipPath = `inset(0px ${100 - percentage}% 0px 0px)`;

            // Remove transition after animation
            setTimeout(function () {
                dividerLine.style.transition = '';
                futureImage.style.transition = '';
            }, 300);
        });
    }
});

// Counter Animation for Impact Numbers
function animateCounter(element, target, duration = 3000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);

    // Add bounce animation
    element.classList.add('animate');
    setTimeout(() => {
        element.classList.remove('animate');
    }, 600);
}

// Intersection Observer for counter animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach((counter, index) => {
                const target = parseInt(counter.getAttribute('data-target'));
                setTimeout(() => {
                    animateCounter(counter, target);
                }, index * 200); // Stagger animation
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Initialize counter animation when page loads
document.addEventListener('DOMContentLoaded', function () {
    const impactSection = document.querySelector('#support .bg-gradient-to-r');
    if (impactSection) {
        observer.observe(impactSection);
    }

    // Initialize allocation chart with intersection observer
    const allocationSection = document.getElementById('allocation');
    if (allocationSection) {
        const allocationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initializeAllocationChart();
                    allocationObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        allocationObserver.observe(allocationSection);
    }
});


// Allocation Chart - Custom Canvas Implementation
function initializeAllocationChart() {
    const canvas = document.getElementById('allocationChart');
    if (!canvas) return;

    // 響應式尺寸調整
    const containerWidth = canvas.parentElement.clientWidth;
    const size = Math.min(containerWidth, 400);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');

    // 設定高解析度渲染
    const devicePixelRatio = window.devicePixelRatio || 1;
    const displayWidth = size;
    const displayHeight = size;

    canvas.width = displayWidth * devicePixelRatio;
    canvas.height = displayHeight * devicePixelRatio;
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';

    ctx.scale(devicePixelRatio, devicePixelRatio);

    // 設定文字渲染質量
    ctx.textRenderingOptimization = 'optimizeQuality';
    ctx.imageSmoothingEnabled = true;

    const centerX = displayWidth / 2;
    const centerY = displayHeight / 2;
    const radius = (displayWidth * 0.45); // 45% of canvas size
    const innerRadius = radius * 0.5; // Half of outer radius

    // 從HTML的圓點元素讀取顏色
    function getColorFromDot(index) {
        const dot = document.querySelector(`.allocation-dot[data-index="${index}"]`);
        if (dot) {
            // 優先使用 data-color 屬性
            const dataColor = dot.getAttribute('data-color');
            if (dataColor) return dataColor;
            
            // 如果沒有 data-color，從 computed style 讀取背景色
            const computedStyle = window.getComputedStyle(dot);
            const bgColor = computedStyle.backgroundColor;
            if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                // 將 rgb/rgba 轉換為 hex
                const rgb = bgColor.match(/\d+/g);
                if (rgb && rgb.length >= 3) {
                    const r = parseInt(rgb[0]).toString(16).padStart(2, '0');
                    const g = parseInt(rgb[1]).toString(16).padStart(2, '0');
                    const b = parseInt(rgb[2]).toString(16).padStart(2, '0');
                    return `#${r}${g}${b}`;
                }
            }
        }
        // 預設顏色（如果找不到）
        const defaultColors = ['#f59e0b', '#fbbf24', '#fb923c', '#fdba74'];
        return defaultColors[index] || '#f59e0b';
    }

    // 從右側項目列表讀取：每個 .allocation-dot 同列的 h3 為「標題 (XX%)」
    const dots = Array.from(document.querySelectorAll('.allocation-dot')).sort(
        (a, b) => parseInt(a.getAttribute('data-index') || 0, 10) - parseInt(b.getAttribute('data-index') || 0, 10)
    );
    const data = dots.map((dot) => {
        const row = dot.closest('.flex.items-start');
        const h3 = row ? row.querySelector('h3') : null;
        const text = (h3 && h3.textContent) ? h3.textContent.trim() : '';
        const match = text.match(/^(.+?)\s*\((\d+(?:\.\d+)?)\s*%\)\s*$/);
        const label = match ? match[1].trim() : text;
        const value = match ? parseFloat(match[2], 10) : 0;
        const index = parseInt(dot.getAttribute('data-index') || '0', 10);
        return { label, value, color: getColorFromDot(index) };
    }).filter((d) => d.label || d.value > 0);
    const dataTotal = data.length ? data.reduce((s, d) => s + d.value, 0) : 100;

    // Animation variables
    let animationProgress = 0;
    const animationDuration = 1000; // 1 second
    const startTime = Date.now();

    function animateChart() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        animationProgress = Math.min(elapsed / animationDuration, 1);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw inner circle only when animation is complete
        if (animationProgress >= 1) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
            ctx.fillStyle = '#fef3c7'; // amber-50
            ctx.fill();
        }

        // Calculate the total animated angle (from 0 to 2π)
        const totalAnimatedAngle = animationProgress * 2 * Math.PI;
        const startAngle = -Math.PI / 2; // Start from top
        const endAngle = startAngle + totalAnimatedAngle;

        // Draw the entire pie chart as one animated arc
        if (totalAnimatedAngle > 0) {
            let currentAngle = startAngle;

            data.forEach((segment, index) => {
                const segmentAngle = (segment.value / dataTotal) * 2 * Math.PI;
                const segmentEndAngle = currentAngle + segmentAngle;

                // Only draw segment if it's within the animated range
                if (currentAngle < endAngle) {
                    const drawEndAngle = Math.min(segmentEndAngle, endAngle);

                    // Draw outer arc
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, currentAngle, drawEndAngle);
                    ctx.lineTo(centerX, centerY);
                    ctx.fillStyle = segment.color;
                    ctx.fill();
                }

                currentAngle = segmentEndAngle;
            });
        }

        // Add text only when animation is complete
        if (animationProgress >= 1) {
            let textAngle = -Math.PI / 2; // Reset for text positioning

            data.forEach((segment, index) => {
                const segmentAngle = (segment.value / dataTotal) * 2 * Math.PI;
                const textAngleForSegment = textAngle + segmentAngle / 2;
                const textRadius = (radius + innerRadius) * 0.4; // Move text much closer to center
                const textX = centerX + Math.cos(textAngleForSegment) * textRadius;
                const textY = centerY + Math.sin(textAngleForSegment) * textRadius;

                ctx.font = `bold ${Math.max(16, size * 0.067)}px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`; // 響應式字體大小，使用Tailwind預設字型
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Draw percentage with shadow effect
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.fillStyle = '#ffffff'; // white percentage
                ctx.fillText(segment.value + '%', textX, textY - 15);

                // 標籤來自右側列表，過長時縮短以利圓餅內顯示；與百分比相同加上陰影以提升可讀性
                const maxLen = 12;
                const labelText = segment.label.length > maxLen ? segment.label.slice(0, maxLen - 1) + '…' : segment.label;

                ctx.font = `bold ${Math.max(11, size * 0.038)}px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`;

                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.fillStyle = '#f3f4f6';
                ctx.fillText(labelText, textX, textY + 12);
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;

                textAngle += segmentAngle;
            });

            // Center text removed as requested
        }

        // Continue animation if not complete
        if (animationProgress < 1) {
            requestAnimationFrame(animateChart);
        }
    }

    // Start animation
    animateChart();
}

// 更新圓餅圖顏色（當圓點顏色改變時調用）
function updateAllocationChartColors() {
    // 重新初始化圖表以讀取新的顏色
    initializeAllocationChart();
}

// 根據 data-color 設置圓點顏色
function setAllocationDotColors() {
    const dots = document.querySelectorAll('.allocation-dot');
    dots.forEach(dot => {
        const color = dot.getAttribute('data-color');
        if (color) {
            dot.style.backgroundColor = color;
        }
    });
}

// 監聽圓點顏色變化（可選：如果需要即時更新）
document.addEventListener('DOMContentLoaded', function() {
    // 初始化圓點顏色
    setAllocationDotColors();
    
    // 監聽圓點元素的屬性變化
    const dots = document.querySelectorAll('.allocation-dot');
    dots.forEach(dot => {
        // 當 data-color 改變時，更新圓點顏色和圖表
        const updateDotColor = function() {
            const color = dot.getAttribute('data-color');
            if (color) {
                dot.style.backgroundColor = color;
            }
            updateAllocationChartColors();
        };
        
        // 監聽 data-color 屬性變化
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-color') {
                    updateDotColor();
                }
            });
        });
        
        observer.observe(dot, {
            attributes: true,
            attributeFilter: ['data-color', 'class', 'style']
        });
    });
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchorLinks.length; i++) {
        anchorLinks[i].addEventListener('click', function (e) {
            e.preventDefault();
            var href = this.getAttribute('href');
            var target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});

// Interactive Vision Slider - 基於捲頁位置的同步切換
document.addEventListener('DOMContentLoaded', function () {
    var slider = document.querySelector('input[type="range"].slider');
    var afterImageContainer = document.querySelector('.absolute.inset-0.overflow-hidden');
    var sliderHandle = document.querySelector('.absolute.top-0.bottom-0.w-1.bg-white.shadow-lg.z-10');
    var visionSection = document.getElementById('vision-display-section'); // 互動式願景展示的容器

    console.log('元素檢查:');
    console.log('slider:', slider);
    console.log('afterImageContainer:', afterImageContainer);
    console.log('sliderHandle:', sliderHandle);
    console.log('visionSection:', visionSection);

    if (afterImageContainer && sliderHandle && visionSection) {
        // 隱藏滑桿控制元件（但保留切割線）
        if (slider) {
            slider.style.display = 'none';
        }

        // 隱藏滑桿下方的標籤
        var sliderLabels = slider ? slider.parentElement.querySelector('.flex.justify-between') : null;
        if (sliderLabels) {
            sliderLabels.style.display = 'none';
        }

        // 初始化：設置為50%位置，顯示左右各一半
        afterImageContainer.style.clipPath = 'inset(0px 50% 0px 0px)';
        sliderHandle.style.left = '50%';

        // 確保切割線可見
        sliderHandle.style.display = 'block';
        sliderHandle.style.opacity = '1';

        // 監聽捲頁事件
        function updateVisionSlider() {
            var rect = visionSection.getBoundingClientRect();

            //根據裝置類型設定不同倍數：電腦版3倍，手機版2倍
            var isMobile = window.innerWidth <= 768;
            var multiplier = isMobile ? 1.5 : 3;
            var offset = isMobile ? 0.25 : 1;

            rect = {
                top: rect.top - rect.height * offset,
                bottom: rect.bottom + rect.height * offset,
                height: rect.height * multiplier
            };

            var windowHeight = window.innerHeight;

            // 計算捲頁進度
            var scrollProgress = 0;

            // 當區塊進入視窗時開始計算
            if (rect.top <= windowHeight && rect.bottom >= 0) {
                // 計算區塊在視窗中的相對位置
                var sectionTop = rect.top;
                var sectionHeight = rect.height;

                // 當區塊頂部在視窗頂部以上時，開始從0%進度
                if (sectionTop <= 0) {
                    // 計算從區塊頂部到視窗頂部的距離
                    var scrolledDistance = Math.abs(sectionTop);
                    // 計算總可捲動距離（區塊高度減去視窗高度）
                    var totalScrollableDistance = sectionHeight - windowHeight;

                    if (totalScrollableDistance > 0) {
                        scrollProgress = Math.min(scrolledDistance / totalScrollableDistance, 1);
                    } else {
                        scrollProgress = 1; // 如果區塊比視窗小，直接設為100%
                    }
                } else {
                    // 區塊還沒完全進入視窗
                    scrollProgress = 0;
                }
            } else if (rect.top > windowHeight) {
                // 區塊還沒進入視窗
                scrollProgress = 0;
            } else if (rect.bottom < 0) {
                // 區塊已經完全捲過
                scrollProgress = 1;
            }

            // 將捲頁進度轉換為切割線位置 (0% = 左側, 100% = 右側)
            // 使用完整的 0%-100% 範圍
            var sliderPosition = scrollProgress * 100; // 直接使用捲頁進度，範圍 0%-100%
            var percentage = sliderPosition + '%';

            // 更新右邊圖片的顯示範圍 - 切割線右側顯示未來圖片
            afterImageContainer.style.clipPath = 'inset(0px ' + (100 - sliderPosition) + '% 0px 0px)';

            // 更新切割線位置 - 平滑移動
            sliderHandle.style.left = percentage;
            sliderHandle.style.transition = 'left 0.1s ease-out';

            // 除錯資訊
            //console.log('🔄 捲頁進度:', scrollProgress.toFixed(2), '切割線位置:', sliderPosition.toFixed(1) + '%', '範圍: 0%-100%');
        }

        // 綁定捲頁事件
        window.addEventListener('scroll', updateVisionSlider);
        window.addEventListener('resize', updateVisionSlider);

        // 初始化時執行一次
        updateVisionSlider();

        console.log('🎯 新版本互動式願景展示已初始化完成 - 基於捲頁位置同步切換');
        console.log('🔧 測試：請捲動到互動式願景展示區域，應該會看到連續的切割線移動');
    } else {
        console.log('找不到互動式願景展示的元素');
    }
});

// Progress bar animations
function animateProgressBars() {
    var progressBars = document.querySelectorAll('#progress .h-2.bg-blue-500, #progress .h-2.bg-green-500, #progress .h-2.bg-amber-500');
    var progressNumbers = document.querySelectorAll('#progress .text-4xl.font-bold');

    if (progressBars.length > 0) {
        for (var i = 0; i < progressBars.length; i++) {
            var bar = progressBars[i];
            var finalWidth = bar.style.width;
            bar.style.width = '0%';

            setTimeout(function (progressBar, width) {
                return function () {
                    progressBar.style.width = width;
                };
            }(bar, finalWidth), 100);
        }
    }

    if (progressNumbers.length > 0) {
        for (var i = 0; i < progressNumbers.length; i++) {
            var number = progressNumbers[i];
            var text = number.textContent;
            var finalValue = parseInt(text.replace(/[^\d]/g, ''));

            if (finalValue > 0) {
                var currentValue = 0;
                var increment = finalValue / 60; // 3 seconds = 60 frames at 20fps
                var timer = setInterval(function () {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        currentValue = finalValue;
                        clearInterval(timer);
                    }
                    number.textContent = Math.floor(currentValue).toLocaleString();
                }, 50);
            }
        }
    }
}

// Fundraising progress bar animation
function animateFundraisingProgress() {
    var progressBar = document.getElementById('fundraising-progress-bar');
    var progressPercentage = document.getElementById('fundraising-percentage');
    var progressText = document.getElementById('fundraising-text');

    if (progressBar && progressPercentage && progressText) {
        var targetAmount = 2850000; // 目標金額
        var totalAmount = 8000000; // 總目標
        var percentage = (targetAmount / totalAmount) * 100;

        // 重置進度條
        progressBar.style.width = '0%';

        // 動畫進度條
        setTimeout(function () {
            progressBar.style.width = percentage + '%';
        }, 100);

        // 動畫數字
        var currentValue = 0;
        var increment = targetAmount / 60; // 3 seconds = 60 frames at 20fps
        var timer = setInterval(function () {
            currentValue += increment;
            if (currentValue >= targetAmount) {
                currentValue = targetAmount;
                clearInterval(timer);
            }

            var displayValue = Math.floor(currentValue);
            var currentPercentage = ((displayValue / totalAmount) * 100).toFixed(1);

            progressPercentage.textContent = currentPercentage + '%';
            progressText.textContent = displayValue.toLocaleString() + ' / ' + totalAmount.toLocaleString();
        }, 50);
    }
}

// Timeline animation
function animateTimeline() {
    var timelineProgress = document.getElementById('timeline-progress');
    if (timelineProgress) {
        // 重置進度條
        timelineProgress.style.width = '0%';

        // 動畫進度條
        setTimeout(function () {
            timelineProgress.style.width = '60%'; // 基於已完成和進行中的階段計算
        }, 100);
    }
}

// Intersection Observer for progress animation
document.addEventListener('DOMContentLoaded', function() {
    var progressSection = document.querySelector('#progress');
    if (progressSection) {
        var progressObserver = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (entry.isIntersecting) {
                    animateProgressBars();
                    animateFundraisingProgress();
                    animateTimeline(); // Timeline animation
                    progressObserver.unobserve(entry.target);
                }
            }
        }, { threshold: 0.1 });

        progressObserver.observe(progressSection);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    /**
     * 找到 .inside-main-box 及其下的 .col-box 元素，
     * 並修改前兩個元素的類別。
     */
    function modifyColumnClasses() {
        // 1. 找到 .inside-main-box 元素
        const mainBox = document.querySelector('.inside-main-box');

        if (mainBox) {
            // 2. 在 .inside-main-box 的直接子代中找到所有 .col-box 元素
            // 確保只選擇直接子代：:scope > .col-box
            const colBox = mainBox.querySelector('.col-box');

            // 檢查是否有足夠的元素
            if (colBox && colBox.childNodes.length > 1) {

                const col3 = colBox.querySelector('.col-3');

                col3.style.display = 'none';

                //更改為滿版顯示
                const col9 = colBox.querySelector('.col-9');
                if (col9) {
                    col9.classList.remove('col-9');
                    col9.classList.add('col-12');
                    col9.classList.add('md:px-2');
                }
            }
        }
    }

    // 頁面載入完成後，執行函式
    modifyColumnClasses();
});

document.addEventListener('DOMContentLoaded', function () {
    // 分頁切換功能
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            // 移除所有按鈕的 active 狀態
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-amber-600', 'text-white', 'shadow-md');
                btn.classList.add('text-gray-600', 'hover:text-amber-600');
            });

            // 為當前按鈕添加 active 狀態
            this.classList.add('active', 'bg-amber-600', 'text-white', 'shadow-md');
            this.classList.remove('text-gray-600', 'hover:text-amber-600');

            // 隱藏所有分頁內容
            tabContents.forEach(content => {
                content.classList.add('hidden');
                content.classList.remove('active');
            });

            // 顯示目標分頁內容
            const targetContent = document.getElementById(targetTab + '-tab');
            if (targetContent) {
                targetContent.classList.remove('hidden');
                targetContent.classList.add('active');
            }
        });
    });

    // 滑桿互動功能（如果有滑桿的話）
    const slider = document.querySelector('.slider');
    const visionDisplay = document.querySelector('#vision-display-section');

    if (slider && visionDisplay) {
        slider.addEventListener('input', function () {
            const value = this.value;
            const clipPath = `inset(0px ${100 - value}% 0px 0px)`;
            const clipElement = visionDisplay.querySelector('[style*="clip-path"]');
            if (clipElement) {
                clipElement.style.clipPath = clipPath;
            }
        });
    }

    // 圖片輪播功能
    let currentSlide = 1;
    const slides = ['slide-1', 'slide-2'];
    const dots = document.querySelectorAll('.absolute.bottom-8 button');

    function showSlide(index) {
        slides.forEach((slideId, i) => {
            const slide = document.getElementById(slideId);
            if (slide) {
                if (i === index) {
                    slide.style.opacity = '1';
                } else {
                    slide.style.opacity = '0';
                }
            }
        });

        // 更新圓點狀態
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.remove('bg-white/50');
                dot.classList.add('bg-white');
            } else {
                dot.classList.remove('bg-white');
                dot.classList.add('bg-white/50');
            }
        });
    }

    // 自動輪播
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);

    // 圓點點擊事件
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // 進度條動畫
    function animateProgressBars() {
        // 從HTML的data屬性讀取募資數據
        const raisedAmountEl = document.getElementById('raised-amount');
        const targetAmountEl = document.getElementById('target-amount');
        const supportersCountEl = document.getElementById('supporters-count');
        const achievementRateEl = document.getElementById('achievement-rate');
        const remainingAmountEl = document.getElementById('remaining-amount');
        const fundraisingBar = document.getElementById('progress-bar');

        if (!raisedAmountEl || !targetAmountEl || !fundraisingBar) return;

        // 從data屬性讀取數值（如果沒有data屬性，則從textContent解析）
        const raisedAmount = parseInt(raisedAmountEl.getAttribute('data-amount')) || 
                            parseInt(raisedAmountEl.textContent.replace(/[^0-9]/g, '')) || 0;
        const targetAmount = parseInt(targetAmountEl.getAttribute('data-target')) || 
                            parseInt(targetAmountEl.textContent.replace(/[^0-9]/g, '')) || 0;
        const supportersCount = parseInt(supportersCountEl.getAttribute('data-count')) || 
                               parseInt(supportersCountEl.textContent.replace(/[^0-9]/g, '')) || 0;

        // 自動計算達成率
        const achievementRate = targetAmount > 0 ? (raisedAmount / targetAmount * 100) : 0;
        
        // 自動計算剩餘金額
        const remainingAmount = Math.max(0, targetAmount - raisedAmount);

        // 更新HTML的data屬性（確保下次讀取時是最新的）
        raisedAmountEl.setAttribute('data-amount', raisedAmount);
        targetAmountEl.setAttribute('data-target', targetAmount);
        supportersCountEl.setAttribute('data-count', supportersCount);

        // 動畫進度條（自動計算寬度百分比）
        fundraisingBar.style.width = '0%';
        const targetWidth = targetAmount > 0 ? (raisedAmount / targetAmount * 100) : 0;
        
        setTimeout(() => {
            fundraisingBar.style.width = targetWidth + '%';
        }, 500);

        // 動畫已募集金額
        animateNumber(raisedAmountEl, 0, raisedAmount, 2000, 'NT$');

        // 動畫達成率
        animateNumber(achievementRateEl, 0, achievementRate, 2000, '%');

        // 動畫支持人數（如果有+號則保留）
        const hasPlus = supportersCountEl.textContent.includes('+');
        animateNumber(supportersCountEl, 0, supportersCount, 2000, hasPlus ? '+' : '');

        // 目標金額不顯示於畫面上，僅用 data-target 供計算使用

        // 更新剩餘金額
        if (remainingAmountEl) {
            remainingAmountEl.textContent = 'NT$' + remainingAmount.toLocaleString();
        }
    }

    // 數字動畫函數
    function animateNumber(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            let current;
            
            if (suffix === '%') {
                current = start + (end - start) * progress;
            } else {
                current = Math.floor(start + (end - start) * progress);
            }

            if (suffix === 'NT$') {
                element.textContent = `NT$${current.toLocaleString()}`;
            } else if (suffix === '%') {
                element.textContent = `${current.toFixed(1)}%`;
            } else if (suffix === '+') {
                element.textContent = current.toLocaleString() + '+';
            } else {
                element.textContent = current.toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        requestAnimationFrame(updateNumber);
    }

    // 當進度區塊進入視窗時觸發動畫
    const progressSection = document.querySelector('#progress');
    if (progressSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgressBars();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(progressSection);
    }

    // FAQ 摺疊功能
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) {
        console.warn('FAQ items not found');
        return;
    }

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        
        if (!question || !answer || !icon) {
            console.warn('FAQ item structure incomplete', item);
            return;
        }

        // 設置初始狀態
        answer.style.maxHeight = '0px';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out';
        answer.style.opacity = '0';
        answer.style.display = 'block'; // 確保元素存在於DOM中

        question.addEventListener('click', () => {
            const isOpen = !answer.classList.contains('hidden');

            if (isOpen) {
                // 關閉當前項目
                answer.style.maxHeight = '0px';
                answer.style.opacity = '0';
                setTimeout(() => {
                    answer.classList.add('hidden');
                }, 300);
                icon.textContent = '+';
                icon.style.transform = 'rotate(0deg)';
            } else {
                // 關閉其他所有項目
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-icon');
                        otherAnswer.style.maxHeight = '0px';
                        otherAnswer.style.opacity = '0';
                        setTimeout(() => {
                            otherAnswer.classList.add('hidden');
                        }, 300);
                        otherIcon.textContent = '+';
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                });

                // 開啟當前項目
                answer.classList.remove('hidden');
                answer.style.opacity = '0';
                setTimeout(() => {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.opacity = '1';
                }, 10);
                icon.textContent = '−';
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
});

// 手機版輪播功能
document.addEventListener('DOMContentLoaded', function () {
    // 強制修復後台系統的響應式顯示問題
    fixResponsiveDisplay();

    // 使命區塊輪播
    initCarousel('mission');

    // 各界人士區塊輪播（手機版）
    initCarousel('team');

    // 各界人士區塊輪播（桌面版）
    initTeamCarouselDesktop();
});

// 修復後台系統的響應式顯示問題
function fixResponsiveDisplay() {
    const isMobile = window.innerWidth <= 768;

    // 強制設定桌面版和手機版的顯示狀態
    const desktopGalleries = document.querySelectorAll('.desktop-gallery');
    const mobileGalleries = document.querySelectorAll('.mobile-gallery');

    desktopGalleries.forEach(gallery => {
        if (isMobile) {
            gallery.style.display = 'none';
        } else {
            gallery.style.display = 'block';
        }
    });

    mobileGalleries.forEach(gallery => {
        if (isMobile) {
            gallery.style.display = 'block';
        } else {
            gallery.style.display = 'none';
        }
    });

    // 監聽視窗大小變化
    window.addEventListener('resize', function () {
        const newIsMobile = window.innerWidth <= 768;

        desktopGalleries.forEach(gallery => {
            if (newIsMobile) {
                gallery.style.display = 'none';
            } else {
                gallery.style.display = 'block';
            }
        });

        mobileGalleries.forEach(gallery => {
            if (newIsMobile) {
                gallery.style.display = 'block';
            } else {
                gallery.style.display = 'none';
            }
        });
    });
}

function initCarousel(prefix) {
    const carousel = document.getElementById(prefix + '-carousel');
    const prevBtn = document.getElementById(prefix + '-prev');
    const nextBtn = document.getElementById(prefix + '-next');
    const dots = document.querySelectorAll('#' + prefix + '-dots button');
    const descriptionContainer = document.getElementById(prefix === 'team' ? 'team-description' : null);

    if (!carousel || !prevBtn || !nextBtn || dots.length === 0) return;

    // 團隊成員資料（僅用於team輪播）
    const teamData = prefix === 'team' ? [
        {
            name: '陳毓文 教授',
            title: '臺灣大學社會工作學系暨研究所',
            quote: '「感謝忠義基金會持續的支持，讓我們能夠為孩子們提供更好的教育環境。」'
        },
        {
            name: '方綉媚 董事長',
            title: '財團法人國際蒙特梭利教育基金會',
            quote: '「教育的種子需要長期灌溉，我們一起為孩子們的未來努力。」'
        },
        {
            name: '李天鐸 建築師',
            title: '李天鐸建築師事務所',
            quote: '「把人帶回自然為核心，透過空間讓關懷能自然而然發生。」'
        },
        {
            name: '曾光宗 特聘教授',
            title: '中原大學建築系',
            quote: '「忠義基金會讓我們看到不一樣的台灣，參與其中很有意義。」'
        },
        {
            name: '黄秀惠 律師 (法學博士)',
            title: '詠律科思法律事務所',
            quote: '「每個孩子都值得被愛，我們要為他們創造更美好的未來。」'
        },
        {
            name: '蔡紫君 醫生',
            title: '台北榮民總醫院兒童醫學部',
            quote: '「每個孩子都有無限可能，我們要相信他們，支持他們成長。」'
        },
        {
            name: '洪文惠 老師',
            title: '資深社心臨床督導​',
            quote: '「真正的支持，是在孩子需要的時刻陪伴與理解，讓他們在安全的關係中重新建立對世界的信任。」'
        },
        {
            name: '郭晏汝 心理諮商師​',
            title: '澈心理諮商所​',
            quote: '「當孩子被好好傾聽與理解，內在的力量就會慢慢浮現，這正是陪伴工作的價值所在。」'
        }
    ] : null;

    let currentSlide = 0;
    const totalSlides = dots.length;

    // 更新輪播位置
    function updateCarousel() {
        const translateX = -currentSlide * 100;
        carousel.style.transform = `translateX(${translateX}%)`;

        // 更新導覽點狀態
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.remove('bg-gray-300');
                dot.classList.add('bg-amber-600');
            } else {
                dot.classList.remove('bg-amber-600');
                dot.classList.add('bg-gray-300');
            }
        });

        // 更新文字描述（僅用於team輪播）
        if (prefix === 'team' && descriptionContainer && teamData && teamData[currentSlide]) {
            const data = teamData[currentSlide];
            descriptionContainer.innerHTML = `
                <h3 class="text-xl font-bold text-gray-800 mb-2">${data.name}</h3>
                <p class="text-amber-600 font-semibold mb-3">${data.title}</p>
                <p class="text-gray-600 text-sm leading-relaxed">${data.quote}</p>
            `;
        }
    }

    // 自動播放（可選）
    let autoPlayInterval;

    function startAutoPlay() {
        stopAutoPlay(); // 先清除現有的計時器
        autoPlayInterval = setInterval(nextSlide, 5000); // 每5秒自動切換
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    // 重置自動播放（手動切換時使用）
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // 下一張
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    // 上一張
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // 跳轉到指定頁面
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }

    // 事件監聽器（手動切換時重置自動播放）
    nextBtn.addEventListener('click', function() {
        nextSlide();
        resetAutoPlay();
    });
    prevBtn.addEventListener('click', function() {
        prevSlide();
        resetAutoPlay();
    });

    // 導覽點點擊事件（手動切換時重置自動播放）
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToSlide(index);
            resetAutoPlay();
        });
    });

    // 觸控滑動支援
    let startX = 0;
    let endX = 0;

    carousel.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', function (e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const threshold = 50; // 最小滑動距離
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // 向左滑動，顯示下一張
                nextSlide();
                resetAutoPlay();
            } else {
                // 向右滑動，顯示上一張
                prevSlide();
                resetAutoPlay();
            }
        }
    }

    // 當滑鼠懸停時暫停自動播放
    const carouselContainer = carousel.closest('.relative');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // 初始化
    updateCarousel();
    startAutoPlay();
}

// 桌面版團隊輪播功能（一次顯示三個，每次移動一個，無限循環）
function initTeamCarouselDesktop() {
    const carousel = document.getElementById('team-carousel-desktop');
    const prevBtn = document.getElementById('team-prev-desktop');
    const nextBtn = document.getElementById('team-next-desktop');
    const dots = document.querySelectorAll('#team-dots-desktop button');
    const descriptionContainer = document.getElementById('team-description-desktop');
    const items = document.querySelectorAll('.team-item-desktop');

    if (!carousel || !prevBtn || !nextBtn || dots.length === 0 || items.length === 0) return;

    // 團隊成員資料
    const teamData = [
        {
            name: '陳毓文 教授',
            title: '臺灣大學社會工作學系暨研究所',
            quote: '「感謝忠義基金會持續的支持，讓我們能夠為孩子們提供更好的教育環境。」'
        },
        {
            name: '方綉媚 董事長',
            title: '財團法人國際蒙特梭利教育基金會',
            quote: '「教育的種子需要長期灌溉，我們一起為孩子們的未來努力。」'
        },
        {
            name: '李天鐸 建築師',
            title: '李天鐸建築師事務所',
            quote: '「設計不只是美觀，更要考慮使用者的需求，創造真正的共融空間。」'
        },
        {
            name: '曾光宗 特聘教授',
            title: '中原大學建築系',
            quote: '「忠義基金會讓我們看到不一樣的台灣，參與其中很有意義。」'
        },
        {
            name: '黄秀惠 律師 (法學博士)',
            title: '詠律科思法律事務所',
            quote: '「每個孩子都值得被愛，我們要為他們創造更美好的未來。」'
        },
        {
            name: '蔡紫君 醫生',
            title: '台北榮民總醫院兒童醫學部',
            quote: '「每個孩子都有無限可能，我們要相信他們，支持他們成長。」'
        },
        {
            name: '洪文惠 老師',
            title: '資深社心臨床督導​',
            quote: '「真正的支持，是在孩子需要的時刻陪伴與理解，讓他們在安全的關係中重新建立對世界的信任。」'
        },
        {
            name: '郭晏汝 心理諮商師​',
            title: '澈心理諮商所​',
            quote: '「當孩子被好好傾聽與理解，內在的力量就會慢慢浮現，這正是陪伴工作的價值所在。」'
        }
    ];

    const CLONE_COUNT = 2; // 開頭和結尾各複製2個項目
    const ORIGINAL_COUNT = 8; // 原始項目數量
    const totalItems = items.length; // 總項目數（包含複製的）
    
    // 初始位置：從第一個原始項目開始（跳過開頭的複製項目）
    let currentIndex = CLONE_COUNT;

    // 獲取原始索引（排除複製項目）
    function getOriginalIndex(displayIndex) {
        if (displayIndex < CLONE_COUNT) {
            // 開頭的複製項目，對應最後的原始項目
            return displayIndex + ORIGINAL_COUNT;
        } else if (displayIndex >= CLONE_COUNT + ORIGINAL_COUNT) {
            // 結尾的複製項目，對應開頭的原始項目
            return displayIndex - ORIGINAL_COUNT;
        } else {
            // 原始項目
            return displayIndex - CLONE_COUNT;
        }
    }

    // 更新輪播位置和亮度
    function updateCarousel(withoutTransition = false) {
        
        // 計算translateX值（每次移動一個項目的寬度）
        // 每個項目寬度是30vh，加上gap 20px
        const itemWidthPx = window.innerHeight * 0.3; // 30vh轉換為px
        const gapPx = 20; // 20px
        const translateX = -(currentIndex * (itemWidthPx + gapPx));
        
        // 不需要額外的居中偏移，因為容器已經居中且寬度固定
        const centerOffset = 0;
        
        if (withoutTransition) {
            carousel.style.transition = 'none';
        } else {
            carousel.style.transition = 'transform 0.5s ease-in-out';
        }
        
        carousel.style.transform = `translateX(${translateX + centerOffset}px)`;

        // 更新亮度：所有圖片預設亮度0.5，中間圖片亮度1.0
        // 當前顯示的三個項目索引：currentIndex, currentIndex+1, currentIndex+2
        // 中間項目的索引是 currentIndex + 1
        items.forEach((item, index) => {
            const img = item.querySelector('img');
            if (img) {
                // 計算這個項目在當前顯示的三個項目中的相對位置
                const relativePosition = index - currentIndex;
                
                // 中間項目（相對位置為1）亮度1.0，左右（相對位置為0和2）亮度0.5
                if (relativePosition === 1) {
                    img.style.filter = 'brightness(1)';
                    item.classList.add('center-item');
                } else {
                    img.style.filter = 'brightness(0.5)';
                    item.classList.remove('center-item');
                }
            }
        });

        // 更新導覽點狀態（使用中間項目的原始索引）
        // 因為用戶看到的是中間的項目，所以導覽點應該對應中間項目
        const centerDisplayIndex = currentIndex + 1;
        const centerOriginalIndex = getOriginalIndex(centerDisplayIndex);
        dots.forEach((dot, index) => {
            if (index === centerOriginalIndex) {
                dot.classList.remove('bg-gray-300');
                dot.classList.add('bg-amber-600');
            } else {
                dot.classList.remove('bg-amber-600');
                dot.classList.add('bg-gray-300');
            }
        });

        // 更新文字描述（顯示中間項目的內容）
        // centerDisplayIndex 和 centerOriginalIndex 已經在上面定義了
        if (descriptionContainer && teamData[centerOriginalIndex]) {
            const data = teamData[centerOriginalIndex];
            descriptionContainer.innerHTML = `
                <h3 class="text-xl font-bold text-gray-800 mb-2">${data.name}</h3>
                <p class="text-amber-600 font-semibold mb-3">${data.title}</p>
                <p class="text-gray-600 text-sm leading-relaxed">${data.quote}</p>
            `;
        }
    }

    // 自動播放
    let autoPlayInterval;

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, 5000); // 每5秒自動切換
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // 下一張
    function nextSlide() {
        
        currentIndex++;
        
        // 如果到達結尾，循環回到開頭（讓圖片連續移動）
        // 當 currentIndex >= CLONE_COUNT + ORIGINAL_COUNT - 1 時，已經顯示最後一個原始項目
        // 循環回到第一個原始項目的位置
        if (currentIndex >= CLONE_COUNT + ORIGINAL_COUNT - 1) {
            // 直接循環回到第一個原始項目的位置，保持動畫效果
            currentIndex = CLONE_COUNT - 1;
        }
        
        updateCarousel();
    }

    // 上一張
    function prevSlide() {
        
        currentIndex--;
        
        // 如果到達開頭，循環回到結尾（讓圖片連續移動）
        // 當 currentIndex < CLONE_COUNT 時，已經顯示第一個原始項目
        // 循環回到最後一個原始項目的位置
        if (currentIndex < CLONE_COUNT) {
            // 直接循環回到最後一個原始項目的位置，保持動畫效果
            currentIndex = CLONE_COUNT + ORIGINAL_COUNT - 2;
        }
        
        updateCarousel();
    }

    // 跳轉到指定頁面
    function goToSlide(slideIndex) {
        
        // slideIndex是原始索引（0-5），需要轉換為顯示索引
        // 因為要讓這個項目成為中間項目，所以 currentIndex 應該是 slideIndex + CLONE_COUNT - 1
        // 這樣中間項目（currentIndex + 1）就會是 slideIndex + CLONE_COUNT
        currentIndex = slideIndex + CLONE_COUNT - 1;
        updateCarousel();
    }

    // 事件監聽器
    nextBtn.addEventListener('click', function() {
        nextSlide();
        resetAutoPlay();
    });

    prevBtn.addEventListener('click', function() {
        prevSlide();
        resetAutoPlay();
    });

    // 導覽點點擊事件
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToSlide(index);
            resetAutoPlay();
        });
    });

    // 當滑鼠懸停時暫停自動播放
    const carouselContainer = carousel.closest('.relative');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // 初始化：設置初始位置並更新遮罩（無過渡動畫）
    updateCarousel(true);
    startAutoPlay();
}

// 園區藍圖樓層切換功能
document.addEventListener('DOMContentLoaded', function() {
    const floorButtons = document.querySelectorAll('#floor-selector .floor-btn');
    const floorMap = document.getElementById('floor-map');
    const floorInfoItems = document.querySelectorAll('.floor-info-item');

    // 樓層地圖圖片配置（由上到下依序為B1、3F、2F、1F樓層的平面圖）
    const floorMapImages = {
        'B3': 'https://www.cybaby.org.tw/upload/images/20251216101944.jpg', // B3 地圖（保留原圖）
        'B2': 'https://www.cybaby.org.tw/upload/images/20251216101944.jpg', // B2 地圖（保留原圖）
        'B1': 'https://www.cybaby.org.tw/upload/images/20260123233623.jpg', // B1（第1張）
        '3F': 'https://www.cybaby.org.tw/upload/images/20260123233609.jpg', // 3F（第2張）
        '2F': 'https://www.cybaby.org.tw/upload/images/20260123233551.jpg', // 2F（第3張）
        '1F': 'https://www.cybaby.org.tw/upload/images/20260123233505.jpg', // 1F（第4張）
        '園區內': 'https://www.cybaby.org.tw/upload/images/20260124002724.jpg', // 園區內
        '園區外': 'https://www.cybaby.org.tw/upload/images/20260124002738.jpg'  // 園區外
    };

    function switchFloor(floor) {
        // 更新地圖圖片
        if (floorMap && floorMapImages[floor]) {
            floorMap.src = floorMapImages[floor];
            floorMap.setAttribute('data-floor', floor);
        }

        // 更新按鈕狀態
        floorButtons.forEach(btn => {
            const btnFloor = btn.getAttribute('data-floor');
            if (btnFloor === floor) {
                // 選中的按鈕
                btn.classList.remove('bg-gray-100', 'text-gray-700', 'border-gray-300', 'hover:bg-amber-100', 'hover:border-amber-400');
                btn.classList.add('bg-amber-600', 'text-white', 'border-amber-600');
            } else {
                // 未選中的按鈕
                btn.classList.remove('bg-amber-600', 'text-white', 'border-amber-600');
                btn.classList.add('bg-gray-100', 'text-gray-700', 'border-gray-300', 'hover:bg-amber-100', 'hover:border-amber-400');
            }
        });

        // 更新區域資訊卡片顯示（園區內和園區外不顯示卡片）
        if (floor === '園區內' || floor === '園區外') {
            floorInfoItems.forEach(item => {
                item.classList.add('hidden');
            });
        } else {
            floorInfoItems.forEach(item => {
                const itemFloor = item.getAttribute('data-floor');
                if (itemFloor === floor) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        }
    }

    // 綁定按鈕點擊事件
    floorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const floor = this.getAttribute('data-floor');
            switchFloor(floor);
        });
    });

    // 初始化：顯示 1F（默認樓層）
    switchFloor('1F');
});

// 建設里程碑進度更新功能
document.addEventListener('DOMContentLoaded', function() {
    const currentProgressEl = document.getElementById('current-progress');
    const milestoneItems = document.querySelectorAll('.timeline-item[data-stage]');
    
    if (!currentProgressEl || milestoneItems.length === 0) return;

    // 更新里程碑樣式的函數
    function updateMilestoneStyles(currentStage) {
        const currentStageNum = parseInt(currentStage) || 1;
        
        milestoneItems.forEach(item => {
            const stageNum = parseInt(item.getAttribute('data-stage'));
            const icon = item.querySelector('.milestone-icon');
            const badges = item.querySelectorAll('.milestone-badge');
            
            if (!icon || badges.length === 0) return;
            
            // 清除所有狀態類別
            icon.classList.remove('bg-green-500', 'bg-amber-500', 'bg-gray-300', 'text-white', 'text-gray-600');
            icon.innerHTML = '';
            
            // 更新所有 badge（手機版和桌面版）
            badges.forEach(badge => {
                badge.classList.remove('bg-green-100', 'bg-amber-100', 'bg-gray-100', 'text-green-800', 'text-amber-800', 'text-gray-600');
                
                if (stageNum < currentStageNum) {
                    // 已完成：綠色
                    badge.classList.add('bg-green-100', 'text-green-800');
                } else if (stageNum === currentStageNum) {
                    // 正進行：橘色
                    badge.classList.add('bg-amber-100', 'text-amber-800');
                } else {
                    // 未進行：灰色
                    badge.classList.add('bg-gray-100', 'text-gray-600');
                }
            });
            
            if (stageNum < currentStageNum) {
                // 已完成：綠色打勾
                icon.classList.add('bg-green-500', 'text-white');
                icon.innerHTML = '<i class="ri-check-line text-xs md:text-lg"></i>';
            } else if (stageNum === currentStageNum) {
                // 正進行：時鐘圖示 + 橘色背景
                icon.classList.add('bg-amber-500', 'text-white');
                icon.innerHTML = '<i class="ri-time-line text-xs md:text-lg"></i>';
            } else {
                // 未進行：日曆圖示 + 灰色背景
                icon.classList.add('bg-gray-300', 'text-gray-600');
                icon.innerHTML = '<i class="ri-calendar-line text-xs md:text-lg"></i>';
            }
        });
    }

    // 初始化：根據當前進度更新樣式
    function initMilestoneProgress() {
        const currentStage = currentProgressEl.textContent.trim() || currentProgressEl.getAttribute('data-progress') || '5';
        currentProgressEl.setAttribute('data-progress', currentStage);
        updateMilestoneStyles(currentStage);
    }

    // 監聽進度數字變化
    function setupProgressListener() {
        // 監聽內容變化（contenteditable）
        currentProgressEl.addEventListener('input', function() {
            const newStage = this.textContent.trim();
            if (newStage && !isNaN(newStage) && newStage >= 1 && newStage <= 6) {
                this.setAttribute('data-progress', newStage);
                updateMilestoneStyles(newStage);
            } else {
                // 如果輸入無效，恢復原值
                const validStage = this.getAttribute('data-progress') || '5';
                this.textContent = validStage;
            }
        });

        // 監聽失去焦點事件
        currentProgressEl.addEventListener('blur', function() {
            const stage = this.textContent.trim();
            if (!stage || isNaN(stage) || stage < 1 || stage > 6) {
                const validStage = this.getAttribute('data-progress') || '5';
                this.textContent = validStage;
            }
        });

        // 監聽屬性變化（如果通過其他方式修改data-progress）
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-progress') {
                    const newStage = currentProgressEl.getAttribute('data-progress');
                    currentProgressEl.textContent = newStage;
                    updateMilestoneStyles(newStage);
                }
            });
        });
        
        observer.observe(currentProgressEl, {
            attributes: true,
            attributeFilter: ['data-progress']
        });
    }

    // 初始化
    initMilestoneProgress();
    setupProgressListener();
});

// 確保在 CMS 環境中也能執行（如果 DOMContentLoaded 已經觸發）
if (document.readyState !== 'loading') {
    // 重新觸發里程碑初始化
    const currentProgressEl = document.getElementById('current-progress');
    const milestoneItems = document.querySelectorAll('.timeline-item[data-stage]');
    
    if (currentProgressEl && milestoneItems.length > 0) {
        const currentStage = currentProgressEl.textContent.trim() || currentProgressEl.getAttribute('data-progress') || '5';
        currentProgressEl.setAttribute('data-progress', currentStage);
        
        const currentStageNum = parseInt(currentStage) || 1;
        milestoneItems.forEach(item => {
            const stageNum = parseInt(item.getAttribute('data-stage'));
            const icon = item.querySelector('.milestone-icon');
            const badges = item.querySelectorAll('.milestone-badge');
            
            if (!icon || badges.length === 0) return;
            
            icon.classList.remove('bg-green-500', 'bg-amber-500', 'bg-gray-300', 'text-white', 'text-gray-600');
            icon.innerHTML = '';
            
            badges.forEach(badge => {
                badge.classList.remove('bg-green-100', 'bg-amber-100', 'bg-gray-100', 'text-green-800', 'text-amber-800', 'text-gray-600');
                
                if (stageNum < currentStageNum) {
                    badge.classList.add('bg-green-100', 'text-green-800');
                } else if (stageNum === currentStageNum) {
                    badge.classList.add('bg-amber-100', 'text-amber-800');
                } else {
                    badge.classList.add('bg-gray-100', 'text-gray-600');
                }
            });
            
            if (stageNum < currentStageNum) {
                icon.classList.add('bg-green-500', 'text-white');
                icon.innerHTML = '<i class="ri-check-line text-xs md:text-lg"></i>';
            } else if (stageNum === currentStageNum) {
                icon.classList.add('bg-amber-500', 'text-white');
                icon.innerHTML = '<i class="ri-time-line text-xs md:text-lg"></i>';
            } else {
                icon.classList.add('bg-gray-300', 'text-gray-600');
                icon.innerHTML = '<i class="ri-calendar-line text-xs md:text-lg"></i>';
            }
        });
    }
}
