// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Scroll to upload section
function scrollToUpload() {
    const uploadSection = document.getElementById('upload');
    if (uploadSection) {
        uploadSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// File Upload Functionality
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadContent = document.querySelector('.upload-content');
const uploadPreview = document.getElementById('uploadPreview');
const previewImage = document.getElementById('previewImage');
const fileName = document.getElementById('fileName');
const verifyBtn = document.getElementById('verifyBtn');
const verificationResult = document.getElementById('verificationResult');

// Drag and drop events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => {
        uploadArea.classList.add('drag-over');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => {
        uploadArea.classList.remove('drag-over');
    }, false);
});

uploadArea.addEventListener('drop', handleDrop, false);
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

fileInput.addEventListener('change', function(e) {
    handleFiles(this.files);
});

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            displayPreview(file);
        } else {
            alert('لطفاً یک فایل تصویری انتخاب کنید');
        }
    }
}

function displayPreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        fileName.textContent = file.name;
        uploadContent.style.display = 'none';
        uploadPreview.style.display = 'block';
        verificationResult.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function resetUpload() {
    fileInput.value = '';
    uploadContent.style.display = 'block';
    uploadPreview.style.display = 'none';
    verificationResult.style.display = 'none';
}

// Constants for verification
const AUTHENTICITY_THRESHOLD = 0.2; // 80% chance of being authentic
const MIN_CONFIDENCE_LEVEL = 95;
const CONFIDENCE_RANGE = 5;

// Verify button functionality
if (verifyBtn) {
    verifyBtn.addEventListener('click', verifyImage);
}

function verifyImage() {
    // Show loading state
    verifyBtn.textContent = 'در حال بررسی...';
    verifyBtn.disabled = true;

    // Simulate verification process
    setTimeout(() => {
        showVerificationResult();
        verifyBtn.textContent = 'تأیید اصالت';
        verifyBtn.disabled = false;
    }, 2000);
}

function showVerificationResult() {
    // Simulate verification result (in real app, this would come from backend)
    const isAuthentic = Math.random() > AUTHENTICITY_THRESHOLD;
    
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const resultDetails = document.getElementById('resultDetails');

    if (isAuthentic) {
        resultIcon.innerHTML = `
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#10B981"/>
                <path d="M8 12L11 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        resultTitle.textContent = 'عکس معتبر است';
        resultTitle.style.color = '#10B981';
        resultMessage.textContent = 'عکس شما بررسی شد و اصالت آن تأیید گردید. می‌توانید گواهی اصالت را دریافت کنید.';
        
        // Generate random verification details
        const uploadDate = new Date().toLocaleDateString('fa-IR');
        const verificationId = 'VER-' + Math.random().toString(36).substring(2, 11).toUpperCase();
        const hashCode = generateHash();
        
        resultDetails.innerHTML = `
            <p><strong>شناسه تأیید:</strong> ${verificationId}</p>
            <p><strong>تاریخ بررسی:</strong> ${uploadDate}</p>
            <p><strong>کد هش:</strong> <code style="font-size: 0.875rem; background: #F3F4F6; padding: 0.25rem 0.5rem; border-radius: 0.25rem;">${hashCode}</code></p>
            <p><strong>وضعیت:</strong> <span style="color: #10B981; font-weight: 600;">✓ تأیید شده</span></p>
            <p><strong>سطح اطمینان:</strong> ${Math.floor(Math.random() * CONFIDENCE_RANGE) + MIN_CONFIDENCE_LEVEL}٪</p>
        `;
    } else {
        resultIcon.innerHTML = `
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#EF4444"/>
                <path d="M15 9L9 15M9 9L15 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        resultTitle.textContent = 'عکس قابل تأیید نیست';
        resultTitle.style.color = '#EF4444';
        resultMessage.textContent = 'متأسفانه نتوانستیم اصالت این عکس را تأیید کنیم. ممکن است عکس ویرایش شده یا دستکاری شده باشد.';
        
        resultDetails.innerHTML = `
            <p><strong>علت:</strong> ویرایش یا دستکاری احتمالی</p>
            <p><strong>توضیحات:</strong> متادیتای عکس ناقص یا تغییر یافته است</p>
            <p><strong>پیشنهاد:</strong> عکس اصلی را بدون ویرایش آپلود کنید</p>
        `;
    }

    uploadPreview.style.display = 'none';
    verificationResult.style.display = 'block';
    verificationResult.classList.add('animate-fade-in');
}

function generateHash() {
    return Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
    ).join('');
}

function downloadCertificate() {
    // In a real application, this would generate and download a PDF certificate
    alert('گواهی اصالت در حال دانلود است...\n\nدر نسخه کامل، یک گواهی PDF با جزئیات کامل دریافت خواهید کرد.');
    
    // Simulate certificate generation
    const certData = {
        verificationId: document.getElementById('resultDetails').querySelector('p').textContent,
        date: new Date().toLocaleDateString('fa-IR'),
        status: 'verified'
    };
    
    console.log('Certificate data:', certData);
}

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simulate form submission
        alert(`پیام شما با موفقیت ارسال شد!\n\nنام: ${name}\nایمیل: ${email}\n\nبه زودی با شما تماس خواهیم گرفت.`);
        
        // Reset form
        contactForm.reset();
    });
}

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .step, .pricing-card').forEach(el => {
    observer.observe(el);
});

// Number counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(start));
        }
    }, 16);
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Convert English numbers to Persian
function toPersianNumber(str) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.toString().replace(/\d/g, (digit) => persianDigits[digit]);
}

// Apply Persian numbers to all stat values
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.stat-value, .price, .pricing-period').forEach(el => {
        el.textContent = toPersianNumber(el.textContent);
    });
});

// Initialize tooltips (if needed)
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(el => {
        el.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            tooltip.style.left = rect.left + (rect.width - tooltip.offsetWidth) / 2 + 'px';
        });
        
        el.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Console welcome message
console.log('%c🎉 خوش آمدید به آی‌فوتو!', 'font-size: 20px; color: #4F46E5; font-weight: bold;');
console.log('%cسرویس پیشرفته تأیید و احراز هویت عکس', 'font-size: 14px; color: #6B7280;');
