# SyncFlow - Multi-Channel Inventory & Order Sync Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/license/EvansOdhams/SyncFlow)](https://github.com/EvansOdhams/SyncFlow)

## 🎯 Project Overview

**SyncFlow** is a cloud-based integration platform that synchronizes inventory and orders across multiple e-commerce platforms in real-time. It solves the critical problem of inventory overselling and manual data entry for businesses selling on multiple channels.

### Problem Statement

Small to medium e-commerce businesses selling on multiple platforms (Shopify, WooCommerce, Amazon, Etsy, eBay) face critical operational challenges:

- **Inventory Overselling**: Stock levels get out of sync across platforms, leading to overselling and customer dissatisfaction
- **Manual Data Entry**: Business owners spend hours manually updating inventory and orders across platforms
- **Lost Revenue**: Delayed order processing and inventory mismatches result in lost sales
- **No Centralized View**: No single dashboard to see all orders, inventory, and sales across channels

### Solution

SyncFlow provides:
- ✅ **Real-time inventory synchronization** across multiple e-commerce platforms
- ✅ **Automatic order processing** from all channels into a unified dashboard
- ✅ **Email/SMS notifications** for low stock and new orders
- ✅ **Google Sheets integration** for data tracking
- ✅ **Comprehensive monitoring** dashboard for integration health
- ✅ **Robust error handling** with retry mechanisms and logging

## 🚀 Features

### Core Features
- **Multi-Platform Integration**: Connect Shopify, WooCommerce, Amazon, Etsy, and more
- **Real-Time Sync**: Bidirectional inventory synchronization with conflict resolution
- **Order Management**: Unified dashboard for orders from all platforms
- **Automated Notifications**: Email and SMS alerts for critical events
- **Google Sheets Sync**: Real-time data export to Google Sheets
- **Monitoring Dashboard**: Track sync status, errors, and performance metrics

### Technical Features
- **OAuth 2.0 Authentication**: Secure platform connections
- **Webhook Processing**: Real-time event handling
- **Error Handling**: Retry mechanisms with exponential backoff
- **Dead Letter Queue**: Failed message handling and recovery
- **Cloud-Based**: Built on AWS serverless architecture
- **Scalable**: Designed for horizontal scaling

## 🛠️ Technology Stack

### Frontend
- **React.js** with TypeScript
- **Material-UI** / **Tailwind CSS** for UI components
- **Recharts** for analytics visualization

### Backend
- **Node.js** with Express.js (or Python Flask)
- **PostgreSQL** for primary database
- **DynamoDB** for real-time inventory state
- **AWS Lambda** for serverless functions
- **AWS API Gateway** for REST API
- **AWS SQS** for message queuing

### Cloud Platform
- **AWS Services**:
  - Lambda (serverless functions)
  - API Gateway (REST API)
  - RDS PostgreSQL (database)
  - S3 (file storage)
  - SQS (message queuing)
  - CloudWatch (monitoring)

### Third-Party Integrations
- **Shopify** (REST Admin API)
- **WooCommerce** (REST API)
- **Google Sheets API**
- **Twilio** (SMS notifications)
- **SendGrid** (Email notifications)
- **Stripe** (Payment processing)

## 📋 Project Requirements

This project fulfills the requirements for:
- **CSC 802 - Systems and Data Integration**
- **Module 9: Cloud-Based Integration**
- **Mini-Project: Real-Time Data Synchronization Using Cloud-Based Integration**

### Requirements Met
- ✅ Cloud-based APIs (AWS services)
- ✅ Real-time synchronization
- ✅ OAuth 2.0 and API key authentication
- ✅ Comprehensive error handling
- ✅ Monitoring dashboard

## 📁 Project Structure

```
syncflow/
├── frontend/          # React application
├── backend/           # Node.js/Express or Python/Flask
├── functions/         # AWS Lambda functions
├── infrastructure/    # CloudFormation/Terraform scripts
├── docs/              # Documentation
│   ├── PROJECT.md
│   ├── PROJECT_PROPOSAL.md
│   └── IMPLEMENTATION_ROADMAP.md
└── tests/             # Test files
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+) or Python (3.10+)
- PostgreSQL database
- AWS Account (Free Tier available)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/EvansOdhams/SyncFlow.git
   cd SyncFlow
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install  # or pip install -r requirements.txt
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   # Run migrations
   npm run migrate  # or python manage.py migrate
   ```

5. **Start development servers**
   ```bash
   # Backend
   cd backend
   npm run dev  # or python app.py
   
   # Frontend (in another terminal)
   cd frontend
   npm start
   ```

## 📚 Documentation

- [Project Requirements](./docs/PROJECT.md)
- [Project Proposal](./docs/PROJECT_PROPOSAL.md)
- [Implementation Roadmap](./docs/IMPLEMENTATION_ROADMAP.md)

## 🗺️ Implementation Roadmap

See [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) for detailed week-by-week implementation plan.

### Phase Overview
- **Phase 0**: Setup & Planning (Week 1)
- **Phase 1**: MVP Core (Weeks 2-4)
- **Phase 2**: Enhanced Features (Weeks 5-7)
- **Phase 3**: Polish & Deploy (Week 8)
- **Phase 4**: Advanced Features (Weeks 9-12, Optional)

## 💰 Monetization Strategy

- **Freemium Model**: Free tier with paid plans ($29-$199/month)
- **Transaction Fees**: Optional per-order processing fees
- **Enterprise Solutions**: Custom integrations and white-label options

## 🤝 Contributing

This is an academic project, but contributions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Evans Odhams**
- GitHub: [@EvansOdhams](https://github.com/EvansOdhams)
- Project Repository: [SyncFlow](https://github.com/EvansOdhams/SyncFlow)

## 🙏 Acknowledgments

- Course: CSC 802 - Systems and Data Integration
- Module: Cloud-Based Integration
- Technologies: AWS, React, Node.js, PostgreSQL

## 📊 Project Status

🚧 **In Development** - Currently in Phase 0 (Setup & Planning)

---

**Note**: This project is being developed as part of an academic course requirement. It demonstrates real-time data synchronization using cloud-based integration services.

