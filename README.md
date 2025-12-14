# ifoto - لحظه‌های ماندگار

<div align="center">

**Production-Ready Event Photography Platform with Face Recognition**

[![License](https://img.shields.io/badge/license-Commercial-blue.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-17-red.svg)](https://angular.io/)
[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)

[English](#english) | [فارسی](#فارسی)

</div>

---

## English

### Overview

ifoto is a comprehensive, self-hosted event photography platform designed for B2B event photography services. It enables professional photographers to manage large-scale events (marathons, conferences, weddings) with thousands of photos, while attendees can easily find their photos using advanced face recognition technology.

### Key Features

#### Phase 1 (Current)
- 🎯 **Event-Based Photo Galleries**: Organize photos by events with metadata
- 🔍 **AI-Powered Face Recognition**: Find photos by uploading a selfie
- 📱 **Mobile-First Design**: Responsive UI optimized for all devices
- 🌐 **Persian/RTL Support**: Full right-to-left layout and Persian language
- 🔐 **Flexible Access Control**: Public, password-protected, or JWT-based galleries
- 📤 **Bulk Photo Upload**: Efficient upload of thousands of photos
- 👤 **User Roles**: Admin and photographer management
- 🖼️ **Watermark Support**: Add watermarks and sponsor logos
- ⚡ **High Performance**: Handle 5,000-30,000 photos per event
- 🎨 **Minimal UI**: Clean, simple interface inspired by truephoto.net

### Technology Stack

- **Backend**: Java 17, Spring Boot 3.2, Spring Security, PostgreSQL
- **Face Recognition**: Python 3.11, InsightFace (ArcFace), OpenCV
- **Vector Database**: Qdrant (self-hosted)
- **Object Storage**: Minio (S3-compatible)
- **Frontend**: Angular 17, Angular Material, TypeScript
- **Deployment**: Docker, Docker Compose
- **Architecture**: Microservices, RESTful APIs

### Architecture Highlights

- **Self-Hosted**: No dependency on AWS/GCP/Azure
- **Production-Ready**: Enterprise-grade security and performance
- **CPU-Based with GPU Support**: Runs on CPU, optimized for GPU
- **Microservices**: Separate backend and face recognition services
- **Scalable**: Designed for horizontal scaling
- **High Accuracy**: InsightFace ArcFace model (>99% accuracy on LFW)

### Quick Start

#### Prerequisites
- Docker 24.0+
- Docker Compose 2.20+
- 8GB+ RAM
- 500GB+ storage

#### Installation

```bash
# Clone repository
git clone https://github.com/nim3a/ifoto.git
cd ifoto

# Configure environment
cd docker
cp .env.example .env
nano .env  # Edit configuration

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

#### Access Services
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Minio Console**: http://localhost:9001
- **Qdrant Dashboard**: http://localhost:6333/dashboard

### Documentation

- [Architecture Documentation](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [API Documentation](docs/API.md)
- [Development Guide](docs/DEVELOPMENT.md)

#### 📊 Project Audit (December 2024)

Comprehensive technical audit assessing MVP readiness:

- **[Start Here: Audit Index](AUDIT_INDEX.md)** - Navigation guide for all audit documents
- [Executive Summary](AUDIT_COMPLETE.md) - For product owners (5 min read)
- [Project Management View](AUDIT_SUMMARY.md) - Roadmap & tracking (10 min read)
- [Technical Deep-Dive](PROJECT_AUDIT.md) - For developers (30 min read)

**Quick Findings:** Overall 30-35% MVP ready. Excellent foundation, 6-8 weeks to functional MVP.

### System Requirements

#### Minimum (CPU-only)
- CPU: 4+ cores
- RAM: 8 GB
- Storage: 500 GB SSD
- OS: Linux (Ubuntu 22.04 LTS)

#### Recommended (Production)
- CPU: 8+ cores
- RAM: 16 GB
- Storage: 1 TB+ SSD
- Network: 100 Mbps+

#### Optional (GPU Acceleration)
- NVIDIA GPU with 8GB+ VRAM
- CUDA 11.8+
- nvidia-docker

### Performance

- **Face Detection**: ~100-200ms per image (CPU)
- **Embedding Extraction**: ~50-100ms per face (CPU)
- **Vector Search**: <50ms for 30,000 embeddings
- **Accuracy**: >99% with ArcFace on LFW benchmark
- **Scalability**: Handle 5,000-30,000 photos per event

### Security Features

- JWT-based authentication
- BCrypt password hashing
- Role-based access control (RBAC)
- Gallery access control (public/private/password)
- CORS protection
- SQL injection prevention
- XSS protection
- Secure file uploads

### Project Structure

```
ifoto/
├── backend/           # Spring Boot backend service
├── face-service/      # Python face recognition service
├── frontend/          # Angular frontend application
├── docker/            # Docker compose and configurations
└── docs/              # Documentation
```

### Contributing

This is a commercial product. For collaboration opportunities, please contact us at contact@ifoto.ir

### License

Copyright © 2024 ifoto. All rights reserved.  
This is proprietary software. See [LICENSE](LICENSE) for details.

### Support

- **Website**: https://ifoto.ir
- **Email**: support@ifoto.ir
- **GitHub Issues**: https://github.com/nim3a/ifoto/issues

---

## فارسی

### معرفی

ifoto یک پلتفرم حرفه‌ای و خودمیزبان برای عکاسی رویدادها است که برای خدمات عکاسی B2B طراحی شده است. این پلتفرم به عکاسان حرفه‌ای امکان می‌دهد رویدادهای بزرگ (ماراتن، کنفرانس، عروسی) با هزاران عکس را مدیریت کنند و به شرکت‌کنندگان اجازه می‌دهد با استفاده از تکنولوژی تشخیص چهره عکس‌های خود را پیدا کنند.

### ویژگی‌های کلیدی

#### فاز 1 (فعلی)
- 🎯 **گالری عکس مبتنی بر رویداد**: سازماندهی عکس‌ها بر اساس رویدادها
- 🔍 **تشخیص چهره با هوش مصنوعی**: یافتن عکس‌ها با آپلود سلفی
- 📱 **طراحی موبایل‌محور**: رابط کاربری واکنش‌گرا برای همه دستگاه‌ها
- 🌐 **پشتیبانی کامل از فارسی/RTL**: چیدمان راست به چپ و زبان فارسی
- 🔐 **کنترل دسترسی انعطاف‌پذیر**: گالری‌های عمومی، محافظت شده با رمز یا JWT
- 📤 **آپلود دسته‌ای عکس**: آپلود کارآمد هزاران عکس
- 👤 **نقش‌های کاربری**: مدیریت ادمین و عکاس
- 🖼️ **پشتیبانی از واترمارک**: افزودن واترمارک و لوگوی اسپانسر
- ⚡ **کارایی بالا**: پردازش 5,000 تا 30,000 عکس در هر رویداد
- 🎨 **رابط کاربری مینیمال**: طراحی ساده و تمیز

### پشته فناوری

- **بک‌اند**: Java 17، Spring Boot 3.2، Spring Security، PostgreSQL
- **تشخیص چهره**: Python 3.11، InsightFace (ArcFace)، OpenCV
- **پایگاه داده برداری**: Qdrant (خودمیزبان)
- **ذخیره‌سازی شی**: Minio (سازگار با S3)
- **فرانت‌اند**: Angular 17، Angular Material، TypeScript
- **استقرار**: Docker، Docker Compose
- **معماری**: میکروسرویس‌ها، REST API

### نکات معماری

- **خودمیزبان**: بدون وابستگی به AWS/GCP/Azure
- **آماده تولید**: امنیت و کارایی سطح سازمانی
- **مبتنی بر CPU با پشتیبانی GPU**: اجرا روی CPU، بهینه برای GPU
- **میکروسرویس**: جداسازی سرویس بک‌اند و تشخیص چهره
- **مقیاس‌پذیر**: طراحی شده برای مقیاس‌بندی افقی
- **دقت بالا**: مدل InsightFace ArcFace (دقت بیش از 99٪)

### شروع سریع

#### پیش‌نیازها
- Docker 24.0+
- Docker Compose 2.20+
- RAM 8GB+
- فضای ذخیره‌سازی 500GB+

#### نصب

```bash
# کلون مخزن
git clone https://github.com/nim3a/ifoto.git
cd ifoto

# پیکربندی محیط
cd docker
cp .env.example .env
nano .env  # ویرایش پیکربندی

# شروع سرویس‌ها
docker-compose up -d

# بررسی وضعیت
docker-compose ps
```

#### دسترسی به سرویس‌ها
- **فرانت‌اند**: http://localhost
- **API بک‌اند**: http://localhost:8080
- **کنسول Minio**: http://localhost:9001
- **داشبورد Qdrant**: http://localhost:6333/dashboard

### مستندات

- [مستندات معماری](docs/ARCHITECTURE.md)
- [راهنمای استقرار](docs/DEPLOYMENT.md)
- [مستندات API](docs/API.md)
- [راهنمای توسعه](docs/DEVELOPMENT.md)

### نیازمندی‌های سیستم

#### حداقل (فقط CPU)
- CPU: 4 هسته یا بیشتر
- RAM: 8 گیگابایت
- ذخیره‌سازی: 500 گیگابایت SSD
- سیستم عامل: Linux (Ubuntu 22.04 LTS)

#### توصیه شده (تولید)
- CPU: 8 هسته یا بیشتر
- RAM: 16 گیگابایت
- ذخیره‌سازی: 1 ترابایت+ SSD
- شبکه: 100 Mbps+

#### اختیاری (شتاب GPU)
- GPU NVIDIA با 8GB+ VRAM
- CUDA 11.8+
- nvidia-docker

### عملکرد

- **تشخیص چهره**: ~100-200ms در هر تصویر (CPU)
- **استخراج embedding**: ~50-100ms در هر چهره (CPU)
- **جستجوی برداری**: <50ms برای 30,000 embedding
- **دقت**: بیش از 99٪ با ArcFace
- **مقیاس‌پذیری**: پردازش 5,000 تا 30,000 عکس در هر رویداد

### ویژگی‌های امنیتی

- احراز هویت مبتنی بر JWT
- رمزگذاری رمز عبور با BCrypt
- کنترل دسترسی مبتنی بر نقش (RBAC)
- کنترل دسترسی گالری (عمومی/خصوصی/رمز)
- حفاظت CORS
- جلوگیری از SQL injection
- حفاظت XSS
- آپلود ایمن فایل

### ساختار پروژه

```
ifoto/
├── backend/           # سرویس بک‌اند Spring Boot
├── face-service/      # سرویس تشخیص چهره Python
├── frontend/          # اپلیکیشن فرانت‌اند Angular
├── docker/            # Docker compose و پیکربندی‌ها
└── docs/              # مستندات
```

### مشارکت

این یک محصول تجاری است. برای فرصت‌های همکاری، لطفاً با ما از طریق contact@ifoto.ir تماس بگیرید.

### مجوز

حق نسخه‌برداری © 2024 ifoto. تمام حقوق محفوظ است.  
این نرم‌افزار اختصاصی است. برای جزئیات به [LICENSE](LICENSE) مراجعه کنید.

### پشتیبانی

- **وب‌سایت**: https://ifoto.ir
- **ایمیل**: support@ifoto.ir
- **GitHub Issues**: https://github.com/nim3a/ifoto/issues

---

<div align="center">

**Built with ❤️ for the Persian photography community**

**ساخته شده با ❤️ برای جامعه عکاسی ایران**

</div>
