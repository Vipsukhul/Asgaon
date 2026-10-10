# Asgaon — Production-Ready Digital Village Platform

## 1. ROLE

You are a senior full-stack architect and software engineer.

Build a production-ready, scalable, secure, mobile-first **Digital Village Platform** called **Asgaon**.

The platform should digitally connect villagers, farmers, students, local businesses, job seekers, sellers, and village administrators.

The application must be designed as a real product, not a demo or static informational website.

---

# 2. CORE PRODUCT VISION

Asgaon should become the digital information and community platform for a village.

Users should be able to:

* Browse village information
* Discover local businesses and services
* Find local jobs
* Find government schemes
* Discover agricultural information
* Find schools and educational resources
* View village announcements
* Discover events
* Find important places
* View emergency contacts
* Browse marketplace listings
* Report village issues
* Save useful information
* Receive relevant notifications
* Interact with verified local businesses
* Eventually interact with an AI-powered village assistant

The platform must work extremely well even for users who **never create an account**.

---

# 3. IMPORTANT UX PRINCIPLE — LOGIN MUST NOT BE MANDATORY

The website must support:

> **Browse freely → Login only when an action requires an account**

Do NOT force users to log in just to browse public information.

The homepage should provide:

* Continue as Guest
* Login
* Register

Users without an account should be able to access:

* Village information
* Businesses
* Business details
* Jobs
* Government schemes
* Agriculture information
* Schools
* Events
* Announcements
* Emergency contacts
* Important places
* Public marketplace listings
* Public resources
* Search
* SEO landing pages

### Login should unlock additional functionality.

Think of login as an **upgrade**, not a barrier.

---

# 4. LOGIN BENEFITS

Authenticated users should get role-based functionality.

## Citizen

After login, citizens can:

* Save/bookmark businesses
* Save government schemes
* Save jobs
* Save articles/resources
* Apply for jobs
* Create marketplace listings
* Report village issues
* Track complaints
* Manage profile
* Receive personalized notifications
* Subscribe to topics
* Receive important village broadcasts
* Manage saved items

---

## Farmer

Farmers can:

* Save agriculture guides
* Save schemes
* View agriculture resources
* Find agricultural equipment
* Find local agricultural services
* Post farm products
* Browse marketplace
* Receive agriculture-related notifications
* Receive relevant government scheme broadcasts
* Save preferred crops/topics

Future functionality:

* Crop recommendations
* Weather integration
* Market prices
* AI agriculture assistant

---

## Student

Students can:

* Save scholarships
* Save educational resources
* Save jobs
* Save announcements
* Track applications
* Receive scholarship notifications
* Receive education-related broadcasts
* Maintain a student profile

Future functionality:

* Study resources
* Exam notifications
* Scholarship matching
* AI study assistant

---

## Business Owner

Business owners can:

* Add their business
* Claim an existing business
* Edit business information
* Update phone number
* Update opening hours
* Add photos
* Add services
* Add location
* Receive customer enquiries
* Post jobs
* Create offers
* Manage their business profile

Admin approval should be required for verification.

Verified businesses should receive a:

**Verified Business** badge.

---

## Marketplace Seller

Authenticated sellers can:

* Create listings
* Edit listings
* Delete listings
* Upload images
* Set price
* Mark items as sold
* Manage their listings
* Receive enquiries

---

# 5. AUTHENTICATION MODEL

Use:

* Spring Security
* JWT authentication
* Access token
* Refresh token
* Secure password hashing
* Role-based authorization
* Email/mobile verification architecture
* Account status
* Password reset architecture

Roles:

```text
CITIZEN
FARMER
STUDENT
BUSINESS_OWNER
SELLER
ADMIN
SUPER_ADMIN
```

Design the authorization system so additional roles can be added later.

---

# 6. PUBLIC VS PROTECTED API

Public GET APIs should not require authentication.

Example:

```text
GET /api/businesses
GET /api/businesses/{slug}
GET /api/jobs
GET /api/jobs/{slug}
GET /api/schemes
GET /api/schemes/{slug}
GET /api/announcements
GET /api/events
GET /api/schools
GET /api/places
GET /api/marketplace
```

Authenticated APIs:

```text
POST /api/jobs/apply
POST /api/marketplace
POST /api/complaints
POST /api/businesses/claim
POST /api/saved-items
GET /api/me
GET /api/me/notifications
```

Admin APIs:

```text
/api/admin/**
```

must require ADMIN or SUPER_ADMIN authorization.

Never rely only on frontend route protection.

Backend authorization is mandatory.

---

# 7. TECHNOLOGY STACK

## Frontend

Use:

* React
* Vite
* TypeScript
* Tailwind CSS
* React Router
* TanStack Query
* Axios
* React Hook Form
* Zod

Do NOT use Next.js.

The frontend must be a clean Vite SPA.

---

# 8. BACKEND

Use:

* Java 21
* Spring Boot 3.x
* Spring Web
* Spring Security
* Spring Data JPA
* Hibernate
* Bean Validation
* PostgreSQL
* Flyway
* JWT
* Lombok where appropriate
* OpenAPI / Swagger

Architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Use DTOs.

Do not expose JPA entities directly through APIs.

---

# 9. DATABASE

Use PostgreSQL.

Core tables/entities:

```text
users
roles
user_roles
businesses
business_categories
business_claims

jobs
job_applications

marketplace_listings
marketplace_categories

farm_products
agriculture_resources

schemes
schools
students

announcements
events
places

complaints

saved_items

notifications
notification_preferences

broadcasts
broadcast_recipients
broadcast_deliveries

audit_logs
```

Use:

* Proper primary keys
* Foreign keys
* Indexes
* Unique constraints
* Created timestamps
* Updated timestamps
* Soft deletion where appropriate

Use Flyway migrations.

---

# 10. VILLAGE MODULE

Create a village profile containing:

* Village name
* Description
* History
* Population
* Area
* District
* State
* PIN code
* Nearby cities
* Important locations
* Village map
* Government offices
* Important contacts

Create a clean village homepage.

---

# 11. BUSINESS DIRECTORY

Users should be able to discover local:

* Grocery stores
* Medical shops
* Doctors
* Mechanics
* Electricians
* Plumbers
* Carpenters
* Tailors
* Restaurants
* Hotels
* Tuition classes
* Photographers
* Mobile repair shops
* Tractor rental services
* Agricultural equipment services
* Internet/mobile shops
* Other local services

Business page should contain:

* Name
* Category
* Description
* Phone
* WhatsApp
* Address
* Opening hours
* Photos
* Services
* Map/location
* Verification status

Create SEO-friendly URLs:

```text
/businesses/{slug}
```

---

# 12. JOB PORTAL

Local jobs should include:

* Farm workers
* Drivers
* Electricians
* Plumbers
* Computer operators
* Shop workers
* Construction workers
* Teachers
* Delivery workers
* Office assistants
* Local business jobs

Job details:

* Title
* Description
* Employer
* Salary
* Location
* Employment type
* Skills
* Requirements
* Contact/application method
* Expiration date

SEO:

```text
/jobs/{slug}
```

Authenticated users can apply.

---

# 13. GOVERNMENT SCHEMES

Create a structured government scheme directory.

Each scheme should contain:

* Scheme name
* Description
* Eligibility
* Benefits
* Documents required
* Application process
* Official source
* Important dates
* Category

Examples:

* Farmer schemes
* Student scholarships
* Women schemes
* Senior citizen schemes
* Employment schemes
* Housing schemes
* Health schemes

Never invent government information.

Whenever possible, link users to official government sources.

SEO:

```text
/schemes/{slug}
```

---

# 14. AGRICULTURE MODULE

Include:

* Crop guides
* Farming techniques
* Government schemes
* Agricultural equipment
* Local agricultural services
* Farm products
* Useful resources

Future-ready architecture for:

* Weather API
* Mandi prices
* Crop recommendations
* AI agriculture assistant

---

# 15. EDUCATION MODULE

Include:

* Schools
* Colleges nearby
* Tuition classes
* Scholarships
* Educational resources
* Government education schemes
* Student opportunities

SEO-friendly school pages:

```text
/schools/{slug}
```

---

# 16. MARKETPLACE

Create a local marketplace.

Users can browse without logging in.

Login required for creating listings.

Listings can contain:

* Product name
* Description
* Price
* Category
* Condition
* Seller
* Location
* Images
* Contact method
* Created date
* Status

Statuses:

```text
ACTIVE
SOLD
EXPIRED
REMOVED
```

SEO:

```text
/marketplace/{slug}
```

---

# 17. ANNOUNCEMENTS

Create a village announcement system.

Examples:

* Gram Panchayat announcements
* Water supply updates
* Electricity updates
* School announcements
* Village meetings
* Important notices
* Road closures
* Government camps
* Health camps
* Community events

Announcements should support:

* Title
* Description
* Category
* Priority
* Publish date
* Expiry date
* Attachments
* Author
* Status

Public announcements should be accessible without login.

---

# 18. EVENTS

Create an event system.

Examples:

* Village festivals
* Sports events
* Cultural programs
* Government camps
* Health camps
* School events
* Community meetings

Support:

* Event title
* Description
* Date
* Start/end time
* Location
* Organizer
* Images
* Registration if required

SEO:

```text
/events/{slug}
```

---

# 19. EMERGENCY DIRECTORY

Provide quick access to:

* Police
* Ambulance
* Fire department
* Hospitals
* Doctors
* Government offices
* Electricity emergency
* Water emergency
* Important village contacts

Make emergency information accessible without login.

---

# 20. COMPLAINT / ISSUE REPORTING

Anyone should be able to view existing public issue information.

Login should be required to submit and track complaints.

Flow:

```text
Guest
 ↓
Report Issue
 ↓
Login/Register
 ↓
Submit Complaint
 ↓
My Complaints
 ↓
Track Status
```

Complaint statuses:

```text
SUBMITTED
UNDER_REVIEW
IN_PROGRESS
RESOLVED
REJECTED
```

Admin can update status.

Maintain audit history.

---

# 21. SAVED ITEMS

Authenticated users can save:

* Businesses
* Jobs
* Schemes
* Marketplace listings
* Announcements
* Events
* Agriculture resources
* Educational resources

Create:

```text
GET /api/me/saved
POST /api/me/saved
DELETE /api/me/saved/{id}
```

---

# 22. NOTIFICATION SYSTEM

Create a centralized notification architecture.

Notification types:

```text
ANNOUNCEMENT
JOB
SCHEME
AGRICULTURE
EDUCATION
MARKETPLACE
EVENT
COMPLAINT
SYSTEM
BROADCAST
```

Users should have notification preferences.

Example:

```text
Job alerts: ON
Agriculture alerts: ON
Government schemes: ON
Education: ON
Marketplace: OFF
Events: ON
```

Users can control notification preferences.

---

# 23. ADMIN PANEL

Create a professional admin dashboard.

Admin dashboard should show:

* Total users
* Active users
* Businesses
* Pending business claims
* Jobs
* Marketplace listings
* Complaints
* Announcements
* Events
* Schemes
* Notifications
* Broadcasts
* Recent activity

Admin navigation:

```text
Dashboard
Users
Businesses
Business Claims
Jobs
Marketplace
Agriculture
Schemes
Education
Announcements
Events
Complaints
Notifications
Broadcasting
Reports
Audit Logs
Settings
```

---

# 24. ADMIN BROADCASTING SYSTEM

This is a major feature.

Create a dedicated:

## Broadcasting Center

Admin should be able to send important information to users.

Examples:

> Water supply will remain unavailable tomorrow from 10 AM to 3 PM.

> Free health checkup camp at the village community hall on Sunday.

> New government farmer scheme available.

> School scholarship applications are now open.

> Heavy rain warning — farmers are advised to protect crops.

---

# 25. BROADCAST TYPES

Support:

```text
GENERAL
EMERGENCY
ANNOUNCEMENT
AGRICULTURE
EDUCATION
JOBS
GOVERNMENT_SCHEME
EVENT
HEALTH
MARKETPLACE
```

Priority:

```text
LOW
NORMAL
HIGH
URGENT
```

---

# 26. TARGETED BROADCASTING

Admin should be able to target:

### Everyone

Send to all eligible users.

### Role

Examples:

```text
FARMER
STUDENT
BUSINESS_OWNER
CITIZEN
SELLER
```

### Location

Architecture should support future targeting by:

* Village
* District
* State
* Nearby area

### Topic

Users subscribed to:

* Agriculture
* Jobs
* Education
* Government schemes
* Events
* Marketplace

### Custom audience

Admin should eventually be able to select specific users.

---

# 27. BROADCAST CREATION

Admin form:

```text
Title
Message
Broadcast Type
Priority
Target Audience
Target Roles
Target Topics
Publish Now / Schedule
Start Date
Expiry Date
Channels
Attachments
```

Before sending, show:

> Estimated recipients: 1,248

Then require confirmation.

For urgent broadcasts:

> Send Emergency Broadcast

with an additional confirmation step.

---

# 28. SCHEDULED BROADCASTS

Admin should be able to:

* Send immediately
* Schedule for later
* Set expiry
* Cancel scheduled broadcast

Example:

```text
Schedule:
15 October 2026
08:00 AM
```

Use Spring's scheduling infrastructure or a production-ready job scheduler.

Do not create duplicate notifications if a scheduled job executes more than once.

Broadcast sending must be idempotent.

---

# 29. BROADCAST CHANNEL ARCHITECTURE

Design the system to support multiple channels.

Initially implement:

### In-app notifications

Fully implement this.

Future-ready architecture for:

* Email
* SMS
* WhatsApp
* Web Push
* Mobile push notifications

Do not tightly couple the broadcast system to one provider.

Use a channel abstraction such as:

```text
NotificationChannel
```

with implementations such as:

```text
InAppNotificationChannel
EmailNotificationChannel
SmsNotificationChannel
WhatsAppNotificationChannel
PushNotificationChannel
```

Initially, only InApp should need to be implemented if external provider credentials are unavailable.

---

# 30. BROADCAST HISTORY

Admin should see:

```text
Broadcast ID
Title
Type
Priority
Audience
Created By
Created At
Scheduled At
Sent At
Status
Recipients
Delivered
Read
Failed
```

Statuses:

```text
DRAFT
SCHEDULED
PROCESSING
SENT
PARTIALLY_SENT
FAILED
CANCELLED
EXPIRED
```

---

# 31. BROADCAST ANALYTICS

Admin should be able to see:

* Total recipients
* Delivered
* Failed
* Read
* Unread
* Read percentage
* Delivery percentage
* Broadcast performance
* Audience breakdown

Example:

```text
Recipients: 2,500
Delivered: 2,470
Failed: 30
Read: 1,850
Read Rate: 74.9%
```

---

# 32. BROADCAST RECIPIENT MODEL

Do not create thousands of duplicated notification objects unnecessarily if avoidable.

Design scalable models such as:

```text
broadcasts
broadcast_recipients
broadcast_deliveries
notifications
```

Use proper indexes.

Consider batching for large broadcasts.

Never send thousands of notifications in one blocking HTTP request.

Use asynchronous processing for large broadcasts.

---

# 33. ADMIN CONTENT MODERATION

Admins should be able to:

* Approve businesses
* Reject businesses
* Verify businesses
* Moderate marketplace listings
* Remove inappropriate listings
* Approve announcements
* Manage jobs
* Moderate complaints
* Manage events
* Manage schemes
* Manage users
* Suspend users

All important administrative actions should create audit logs.

---

# 34. AUDIT LOGGING

Track:

```text
USER_CREATED
USER_UPDATED
BUSINESS_APPROVED
BUSINESS_REJECTED
LISTING_CREATED
LISTING_REMOVED
COMPLAINT_STATUS_CHANGED
ANNOUNCEMENT_CREATED
BROADCAST_CREATED
BROADCAST_SENT
BROADCAST_CANCELLED
USER_SUSPENDED
ADMIN_LOGIN
```

Store:

* Actor
* Action
* Entity
* Entity ID
* Timestamp
* Relevant metadata

Do not store sensitive information unnecessarily.

---

# 35. SEARCH

Implement global search.

Search across:

* Businesses
* Jobs
* Schemes
* Marketplace
* Announcements
* Events
* Schools
* Places
* Agriculture resources

Search should work for guests.

Future-ready for:

* PostgreSQL full-text search
* Elasticsearch/OpenSearch
* AI semantic search

Do not introduce Elasticsearch unless actually needed.

Start with PostgreSQL.

---

# 36. SEO

SEO is extremely important.

Create scalable SEO architecture.

Every public entity should have:

* Unique title
* Meta description
* Canonical URL
* Open Graph metadata
* Twitter/X metadata
* Structured data
* Breadcrumbs
* Clean slug
* Internal links

Dynamic SEO routes:

```text
/businesses/{slug}
/jobs/{slug}
/schemes/{slug}
/schools/{slug}
/events/{slug}
/places/{slug}
/marketplace/{slug}
/announcements/{slug}
/agriculture/{slug}
```

---

# 37. PROGRAMMATIC SEO

Build scalable SEO pages based on real database content.

Examples:

```text
Best electricians in {village}
Medical shops in {village}
Jobs in {village}
Government schemes for farmers
Agriculture resources for {crop}
Schools near {village}
Local businesses in {village}
```

Do NOT generate thin or fake pages only for SEO.

Every indexed page must provide genuine value.

---

# 38. STRUCTURED DATA

Use appropriate Schema.org JSON-LD.

Potential schemas:

```text
LocalBusiness
JobPosting
Event
Article
FAQPage
BreadcrumbList
Organization
WebSite
```

Only use schema types that accurately represent the content.

---

# 39. SITEMAP

Generate dynamic sitemap.

Include public pages only.

Do not include:

* Admin pages
* User dashboard
* Private profiles
* Login pages
* Private notifications
* Private complaints

Generate:

```text
sitemap.xml
robots.txt
```

Architecture should support multiple sitemaps if the platform grows significantly.

---

# 40. INTERNATIONALIZATION

Build architecture for multilingual support.

Initially:

```text
English
```

Future:

```text
Marathi
Hindi
```

Do not hardcode user-facing strings throughout components.

Use an i18n architecture.

Potential future routes:

```text
/en
/mr
/hi
```

Design database/content architecture so multilingual content can be added later.

---

# 41. MOBILE-FIRST DESIGN

The majority of users may access Asgaon from mobile devices.

Design for:

* Android phones
* Low-end devices
* Slow networks
* Small screens

Prioritize:

* Fast loading
* Large touch targets
* Simple navigation
* Minimal JavaScript
* Optimized images
* Accessible UI

Use responsive Tailwind design.

---

# 42. PWA

Make the frontend PWA-ready.

Support:

* Installable website
* Offline shell
* Cached public resources where appropriate
* Fast repeat visits
* Future push notifications

Do not cache private data insecurely.

---

# 43. SECURITY

Implement:

* Spring Security
* JWT
* Password hashing
* Role-based authorization
* Input validation
* DTO validation
* Rate limiting architecture
* CORS configuration
* Secure HTTP headers
* SQL injection protection through JPA/parameterized queries
* XSS protection
* CSRF strategy appropriate for JWT architecture
* File upload validation
* File size limits
* MIME validation
* Authentication brute-force protection

Never trust frontend authorization.

---

# 44. PRIVACY

Collect only necessary user information.

Provide:

* Privacy Policy
* Terms of Service
* Account deletion architecture
* Data deletion strategy
* Notification preferences

Public users should be able to browse without creating an account.

Do not require unnecessary personal information.

---

# 45. FILE UPLOADS

If users upload:

* Business images
* Marketplace images
* Documents
* Event images

Validate:

* File type
* MIME type
* File size
* Extension
* Image dimensions where applicable

Do not trust file extensions.

Use object storage such as S3-compatible storage when needed.

---

# 46. API DESIGN

Use REST APIs.

Example:

```text
/api/auth
/api/users
/api/businesses
/api/business-categories
/api/jobs
/api/job-applications
/api/marketplace
/api/agriculture
/api/schemes
/api/schools
/api/announcements
/api/events
/api/places
/api/complaints
/api/notifications
/api/broadcasts
/api/admin
```

Use pagination.

Example:

```text
?page=0&size=20
```

Do not return huge datasets.

---

# 47. API ERROR HANDLING

Create global exception handling.

Return consistent responses.

Example:

```json
{
  "success": false,
  "message": "Business not found",
  "code": "BUSINESS_NOT_FOUND",
  "timestamp": "...",
  "path": "/api/businesses/example"
}
```

Do not expose stack traces to users.

---

# 48. FRONTEND ARCHITECTURE

Organize by feature.

Example:

```text
src/
 ├── api/
 ├── components/
 ├── layouts/
 ├── pages/
 ├── features/
 │    ├── auth/
 │    ├── businesses/
 │    ├── jobs/
 │    ├── marketplace/
 │    ├── agriculture/
 │    ├── schemes/
 │    ├── education/
 │    ├── announcements/
 │    ├── events/
 │    ├── complaints/
 │    ├── notifications/
 │    └── broadcasts/
 ├── hooks/
 ├── routes/
 ├── types/
 ├── utils/
 └── lib/
```

---

# 49. ADMIN FRONTEND

Create a dedicated admin layout.

Admin sidebar:

```text
Dashboard
Users
Businesses
Claims
Jobs
Marketplace
Agriculture
Schemes
Education
Announcements
Events
Complaints
Notifications
Broadcasting
Reports
Audit Logs
Settings
```

Admin pages should contain:

* Tables
* Search
* Filters
* Pagination
* Sorting
* Bulk actions where appropriate
* Confirmation dialogs
* Status badges
* Loading states
* Empty states
* Error states

---

# 50. ADMIN BROADCAST UX

Create a professional broadcast composer.

Suggested flow:

```text
Create Broadcast
      ↓
Write Message
      ↓
Select Type
      ↓
Select Priority
      ↓
Select Audience
      ↓
Select Channels
      ↓
Schedule / Send Now
      ↓
Preview
      ↓
Confirm
      ↓
Process
      ↓
Analytics
```

Show a notification preview before sending.

---

# 51. ADMIN DASHBOARD ANALYTICS

Display:

```text
Total Users
Active Users
New Users
Businesses
Jobs
Marketplace Listings
Open Complaints
Unread Notifications
Scheduled Broadcasts
Recent Broadcasts
```

Use charts only where useful.

Avoid meaningless analytics.

---

# 52. AI ASSISTANT — FUTURE READY

Design the architecture for:

## Ask Asgaon

Users could ask:

> Which government schemes are available for farmers?

> Where can I find a tractor rental service?

> What scholarships are available?

> What events are happening this week?

> How do I apply for this scheme?

The assistant should eventually use verified platform data.

Potential future stack:

* Spring AI
* PostgreSQL pgvector
* RAG
* Local/open-source LLMs
* Structured tool calling

The AI must not invent government information.

When information is unavailable, it should clearly say so.

---

# 53. FUTURE NOTIFICATION INTEGRATIONS

Design interfaces so the system can later integrate:

```text
Email
SMS
WhatsApp
Web Push
Android Push
```

Do not hardcode provider-specific logic throughout the application.

Use service interfaces.

---

# 54. PERFORMANCE

Optimize for:

* Fast API response
* Database indexing
* Pagination
* Lazy loading
* Efficient queries
* Avoiding N+1 queries
* Image optimization
* HTTP caching
* Browser caching
* API caching where appropriate

Do not prematurely introduce complex infrastructure.

---

# 55. OBSERVABILITY

Prepare for:

* Structured logging
* Error tracking
* Health checks
* API metrics
* Database monitoring

Use Spring Boot Actuator.

Create:

```text
/actuator/health
```

but configure production exposure securely.

---

# 56. TESTING

Backend:

* JUnit
* Mockito
* Spring Boot tests
* Repository tests
* Controller tests
* Security tests

Frontend:

* Component tests where useful
* API mocking
* Critical user-flow testing

Important flows to test:

```text
Guest browsing
Registration
Login
Role authorization
Business creation
Business approval
Job application
Marketplace listing
Complaint submission
Notification creation
Broadcast creation
Broadcast scheduling
Broadcast cancellation
Admin authorization
```

---

# 57. API DOCUMENTATION

Use OpenAPI / Swagger.

Document:

* Authentication
* Public endpoints
* Protected endpoints
* Admin endpoints
* Request schemas
* Response schemas
* Error responses

---

# 58. DATABASE MIGRATIONS

Use Flyway.

Never manually modify production schema without migrations.

Migration examples:

```text
V1__initial_schema.sql
V2__create_business_tables.sql
V3__create_jobs_tables.sql
V4__create_marketplace_tables.sql
V5__create_notification_tables.sql
V6__create_broadcast_tables.sql
```

---

# 59. ENVIRONMENT VARIABLES

Never hardcode:

* JWT secrets
* Database passwords
* API keys
* Storage credentials
* Email credentials
* SMS credentials
* WhatsApp credentials

Use environment variables.

Provide:

```text
.env.example
```

without real secrets.

---

# 60. DEPLOYMENT

Frontend:

```text
Vercel
```

Backend:

```text
Render
Railway
AWS
```

Database:

```text
PostgreSQL
Neon
Supabase
AWS RDS
```

Choose one practical deployment path for initial development but keep the architecture portable.

---

# 61. PROJECT STRUCTURE

Backend:

```text
backend/
 └── src/main/java/com/digitalgaon/
      ├── auth/
      ├── user/
      ├── business/
      ├── job/
      ├── marketplace/
      ├── agriculture/
      ├── scheme/
      ├── education/
      ├── announcement/
      ├── event/
      ├── place/
      ├── complaint/
      ├── notification/
      ├── broadcast/
      ├── admin/
      ├── audit/
      ├── config/
      ├── exception/
      └── common/
```

Frontend:

```text
frontend/
 └── src/
      ├── api/
      ├── components/
      ├── features/
      ├── layouts/
      ├── pages/
      ├── routes/
      ├── hooks/
      ├── types/
      ├── utils/
      └── lib/
```

---

# 62. DEVELOPMENT PHASES

Do NOT try to implement everything simultaneously.

## Phase 1 — Foundation

Build:

* Vite React TypeScript
* Tailwind
* Java 21
* Spring Boot
* PostgreSQL
* Flyway
* Authentication
* JWT
* Roles
* Base layouts
* Public/private routing
* API structure
* Error handling
* Swagger

---

## Phase 2 — Village Core

Build:

* Village homepage
* Businesses
* Places
* Emergency contacts
* Announcements
* Events

Guest browsing must work.

---

## Phase 3 — Community

Build:

* Jobs
* Marketplace
* Complaints
* Saved items
* User profiles

---

## Phase 4 — Agriculture & Education

Build:

* Agriculture
* Schemes
* Schools
* Scholarships
* Educational resources

---

## Phase 5 — Notifications & Broadcasting

Build:

* Notification system
* Preferences
* Admin broadcasting
* Target audiences
* Scheduled broadcasts
* Broadcast history
* Delivery tracking
* Read tracking
* Broadcast analytics
* In-app notifications

---

## Phase 6 — SEO

Implement:

* Dynamic SEO
* Slugs
* Sitemap
* Robots
* Schema
* Breadcrumbs
* Canonical URLs
* Internal linking
* Programmatic SEO based on real content

---

## Phase 7 — PWA

Implement:

* PWA
* Offline shell
* Push notification architecture
* Performance optimization

---

## Phase 8 — AI

Implement:

* Ask Asgaon
* RAG
* Structured platform search
* AI agriculture assistant
* AI scheme assistant

Only implement AI after the underlying data architecture is reliable.

---

# 63. IMPORTANT PRODUCT PRINCIPLES

Follow these rules throughout development:

### Rule 1

**Guest browsing must always work for public content.**

### Rule 2

**Login is required only for actions involving user identity, ownership, submissions, personalization, or private data.**

### Rule 3

**Never force authentication just for SEO/public information.**

### Rule 4

**Every admin operation must be protected on the backend.**

### Rule 5

**Never trust frontend authorization.**

### Rule 6

**Do not create fake SEO pages.**

### Rule 7

**Do not over-engineer the first version.**

### Rule 8

**Keep architecture scalable.**

### Rule 9

**Use real database-backed functionality instead of mock data wherever implementing a feature.**

### Rule 10

**Keep external integrations behind interfaces.**

### Rule 11

**Do not expose private user information publicly.**

### Rule 12

**Broadcasting must be asynchronous and scalable.**

### Rule 13

**Emergency broadcasts must have stronger confirmation and high priority.**

### Rule 14

**Users must control non-essential notification preferences.**

### Rule 15

**Government and emergency information must be verified before publishing.**

---

# 64. UI/UX DESIGN DIRECTION

The UI should feel:

* Modern
* Clean
* Trustworthy
* Local
* Simple
* Fast
* Accessible

Avoid making it look like a generic corporate SaaS dashboard.

Use familiar concepts for rural users.

Important actions should be obvious.

Examples:

```text
Find a Business
Find a Job
Government Schemes
Agriculture
Marketplace
Announcements
Events
Emergency
```

---

# 65. HOMEPAGE

Homepage should contain:

### Header

```text
Asgaon
Search
Businesses
Jobs
Schemes
Marketplace
Login
```

### Hero

```text
Everything your village needs, in one place.
```

Search:

```text
Search businesses, jobs, schemes, services...
```

### Quick Actions

```text
Businesses
Jobs
Schemes
Agriculture
Marketplace
Events
Emergency
```

### Latest Announcements

### Local Businesses

### Latest Jobs

### Government Schemes

### Upcoming Events

### Marketplace

### Village Information

### Footer

Include:

* About
* Contact
* Privacy
* Terms
* Help
* Report Issue

---

# 66. GUEST USER EXPERIENCE

Guest should never feel like a second-class user.

Guest can:

```text
Search
Browse
Read
Compare
Discover
Navigate
View public information
```

When a protected action is attempted:

Example:

> Save this business

Show:

> Create a free account to save businesses and access them later.

Buttons:

```text
Login
Create Account
Continue Browsing
```

Do not abruptly redirect without explanation.

---

# 67. ACCOUNT EXPERIENCE

After login, provide:

```text
Dashboard
Profile
Saved Items
My Applications
My Listings
My Complaints
Notifications
Notification Preferences
Settings
Logout
```

Dashboard content should depend on role.

---

# 68. ADMIN SECURITY

Admin accounts must have stronger security architecture.

Prepare for:

* MFA
* Login attempt monitoring
* Session management
* Admin audit logs
* IP/device metadata where legally appropriate
* Suspicious login detection

MFA can be implemented later but architecture should support it.

---

# 69. FINAL DEVELOPMENT INSTRUCTION

Before writing large amounts of code:

1. Analyze the entire requirements.
2. Produce the system architecture.
3. Produce the database ER diagram.
4. Define entities.
5. Define relationships.
6. Define REST APIs.
7. Define authentication/authorization flow.
8. Define frontend route structure.
9. Define admin route structure.
10. Define broadcasting architecture.
11. Define notification architecture.
12. Define SEO architecture.
13. Define deployment architecture.
14. Define development phases.

Then begin implementation.

Do not implement the entire platform in one giant step.

Build one production-quality module at a time.

After each major module:

* Verify compilation
* Run tests
* Check API behavior
* Check authorization
* Check mobile responsiveness
* Check error states
* Check database migrations
* Check SEO where applicable

---

# 70. QUALITY BAR

The final product should be:

* Production-ready
* Secure
* Mobile-first
* SEO-friendly
* Accessible
* Fast
* Scalable
* Maintainable
* API-driven
* Properly documented
* Properly tested

Do not create a toy project.

Build Asgaon as a platform that could realistically be deployed for a real village and later expanded to multiple villages.

The architecture should eventually support:

```text
One Village
      ↓
Multiple Villages
      ↓
District
      ↓
State
      ↓
Multi-region Digital Village Platform
```

The first implementation should remain simple enough to develop and deploy, while the underlying architecture should avoid decisions that make future expansion unnecessarily difficult.
