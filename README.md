<div align="center">

# 📡 Streamify

**Production-grade video streaming & live broadcasting platform**

Full-stack YouTube/Twitch-like platform built to learn distributed systems in depth.
Features VOD upload with adaptive-bitrate HLS transcoding, real-time RTMP live streaming,
event-driven microservices via Kafka, and cloud-native deployment on AWS EKS —
all in a TypeScript + C# Nx monorepo.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRD](https://img.shields.io/badge/PRD-v1.0-blueviolet)](docs/PRD.md)
[![Status](https://img.shields.io/badge/Status-In%20Development-orange)]()
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)]()
[![.NET](https://img.shields.io/badge/.NET_8-512BD4?logo=dotnet&logoColor=white)]()
[![Kafka](https://img.shields.io/badge/Kafka-231F20?logo=apachekafka&logoColor=white)]()
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes&logoColor=white)]()

</div>

---

## What is this?

Streamify is a **learning-by-building** project targeting senior backend and DevOps engineering skills. It is not a tutorial — it is a real, deployable system that solves real engineering problems:

- How do you scale video transcoding without blocking your API?
- How do you deliver HLS video globally with < 2s start time?
- How do you keep microservices decoupled while maintaining data consistency?
- How do you operate a system with 9 services in Kubernetes?

Every architectural decision is intentional and documented. Every service boundary has a reason.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Clients                                │
│              Web App          OBS / RTMP Encoder                │
└──────────────────────┬──────────────────────┬───────────────────┘
                       │                      │
                       ▼                      ▼
              ┌─────────────────┐    ┌─────────────────┐
              │   API Gateway   │    │  Node-Media-Svr  │
              │ NestJS + Redis  │    │   RTMP ingest    │
              └────────┬────────┘    └────────┬─────────┘
                       │                      │
         ┌─────────────┼─────────────┐        │
         ▼             ▼             ▼        ▼
  ┌────────────┐ ┌──────────┐ ┌──────────────────┐
  │    User    │ │  Video   │ │  Stream Service  │
  │  Service   │ │ Service  │ │  NestJS + Redis  │
  │  + PSQL    │ │ +PSQL+S3 │ └────────┬─────────┘
  └────────────┘ └────┬─────┘          │
                      │                │
                      └────────┬───────┘
                               ▼
              ┌────────────────────────────────┐
              │         Apache Kafka           │
              │  video.uploaded · stream.*     │
              │  transcode.done · user.events  │
              └──┬──────────┬──────────┬───────┘
                 ▼          ▼          ▼
         ┌───────────┐ ┌────────┐ ┌──────────┐
         │ Transcode │ │ Search │ │Analytics │
         │  Worker   │ │  Svc   │ │   Svc    │
         │  C# .NET  │ │  + ES  │ │  + PSQL  │
         └───────────┘ └────────┘ └──────────┘
```

### Services

| Service | Stack | Responsibility |
|---|---|---|
| `api-gateway` | NestJS + Redis | JWT validation, rate limiting, request routing |
| `user-service` | NestJS + PostgreSQL | Registration, auth, profiles, stream keys |
| `video-service` | NestJS + PostgreSQL + S3 | Upload, metadata, rendition management |
| `stream-service` | NestJS + Redis | RTMP key validation, viewer counts, live chat |
| `transcode-worker` | **C# .NET 8** + FFmpeg | HLS segment generation (360p / 720p / 1080p) |
| `comment-service` | NestJS + PostgreSQL | Comments and threaded replies |
| `notification-svc` | NestJS + Redis | Push/email notifications via Kafka consumer |
| `analytics-service` | NestJS + PostgreSQL | View counts, watch-time, live metrics |
| `search-service` | NestJS + Elasticsearch | Full-text video and channel search |

### Infrastructure

| Component | Purpose |
|---|---|
| Apache Kafka | Async event bus — decouples upload from transcoding |
| Redis 7 | JWT store, rate limits, viewer counts, pub/sub for chat |
| PostgreSQL 16 | Per-service databases (never shared) |
| MinIO / S3 | Raw uploads, HLS segments (`.ts`), manifests (`.m3u8`) |
| Elasticsearch 8 | Full-text search index |
| CloudFront CDN | HLS delivery — absorbs playback load from S3 origin |

---

## Key Flows

### Video Upload → Playback

```
Client → POST /videos/upload-url
       → S3 presigned PUT (client uploads directly, no Node proxying)
       → video-service emits video.uploaded → Kafka
       → C# transcode-worker picks up event
       → FFmpeg: MP4 → 360p/720p/1080p HLS segments → S3
       → transcode.done → Kafka
       → video-service marks status READY
       → search-service indexes video
       → Client streams via CDN: HLS.js adaptive bitrate
```

### Live Stream

```
OBS → rtmp://ingest.streamify.io/live/{stream_key}
    → Node-Media-Server validates key via webhook → stream-service
    → FFmpeg: RTMP → LL-HLS segments → S3 (target latency: 3s)
    → Viewers: CDN → video.js → HLS.js
    → Viewer count: Redis INCR/DECR → SSE to clients
    → Chat: Redis pub/sub → SSE to clients
    → stream.ended → VOD archived via video-service
```

---

## Tech Stack

**Backend**
- [NestJS](https://nestjs.com/) — TypeScript framework with native microservice support
- [C# .NET 8](https://dotnet.microsoft.com/) — Transcode worker (Worker Service pattern)
- [KafkaJS](https://kafka.js.org/) via `@nestjs/microservices` — event-driven communication
- [Prisma](https://www.prisma.io/) — type-safe database migrations per service
- [Passport.js](http://www.passportjs.org/) — authentication strategies

**Data**
- PostgreSQL 16 — relational data, one DB per service
- Redis 7 — caching, pub/sub, rate limiting, session store
- Elasticsearch 8 — full-text search with autocomplete
- MinIO (local) / AWS S3 (production) — object storage

**Media**
- [Node-Media-Server](https://github.com/illuspas/Node-Media-Server) — RTMP ingest
- [FFmpeg](https://ffmpeg.org/) — transcoding and HLS segmentation
- [Video.js](https://videojs.com/) + [HLS.js](https://github.com/video-dev/hls.js/) — adaptive bitrate player

**DevOps**
- Docker + Docker Compose — local development
- Kubernetes (AWS EKS) — production orchestration
- GitHub Actions — CI/CD pipeline
- Terraform — infrastructure as code
- Prometheus + Grafana — metrics and dashboards
- Jaeger — distributed tracing (OpenTelemetry)
- Sentry — error tracking

---

## Getting Started

### Prerequisites

- Node.js 20+
- .NET 8 SDK
- Docker and Docker Compose
- FFmpeg (for local transcoding)

### Run locally

```bash
# Clone
git clone https://github.com/your-username/streamify.git
cd streamify

# Start all infrastructure (Kafka, Redis, PostgreSQL, MinIO, Elasticsearch)
docker-compose up -d

# Install dependencies
npm install

# Run database migrations (per service)
npx nx run user-service:migrate
npx nx run video-service:migrate

# Start all services
npx nx run-many --target=serve --all

# C# transcode worker
cd apps/transcode-worker
dotnet run
```

### Environment variables

Copy `.env.example` in each service directory and fill in values. Key variables:

```bash
# Shared
KAFKA_BROKERS=localhost:9092
REDIS_URL=redis://localhost:6379

# user-service
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/users
JWT_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# video-service
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/videos
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=streamify
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
```

### Stream locally with OBS

1. In OBS → Settings → Stream → Custom
2. Server: `rtmp://localhost:1935/live`
3. Stream Key: generate one via `POST /users/me/stream-key/regenerate`
4. Start streaming — playback at `http://localhost:3000/live/{channelId}`

---

## Project Structure

```
streamify/
├── apps/
│   ├── api-gateway/          # NestJS — routing, auth, rate limiting
│   ├── user-service/         # NestJS — auth, profiles, stream keys
│   ├── video-service/        # NestJS — upload, metadata, renditions
│   ├── stream-service/       # NestJS — live stream orchestration
│   ├── transcode-worker/     # C# .NET 8 — FFmpeg HLS transcoding
│   ├── comment-service/      # NestJS — comments
│   ├── notification-svc/     # NestJS — push/email notifications
│   ├── analytics-service/    # NestJS — metrics and analytics
│   └── search-service/       # NestJS — Elasticsearch integration
├── libs/
│   └── shared/               # Kafka event types, DTOs, guards
├── infra/
│   ├── docker-compose.yml    # Local dev stack
│   ├── k8s/                  # Kubernetes manifests
│   └── terraform/            # AWS infrastructure (EKS, RDS, MSK, S3)
└── docs/
    └── PRD.md                # Full product requirements document
```

---

## Kafka Event Contracts

Events are the public API between services — treat them as immutable contracts.

| Topic | Producer | Consumers |
|---|---|---|
| `video.uploaded` | video-service | transcode-worker, analytics-service |
| `transcode.done` | transcode-worker | video-service, notification-svc, search-service |
| `transcode.failed` | transcode-worker | video-service, notification-svc |
| `stream.started` | stream-service | notification-svc, analytics-service |
| `stream.ended` | stream-service | analytics-service, video-service (VOD archive) |
| `user.events` | user-service | notification-svc, all services caching user info |

---

## API Reference

Base URL: `https://api.streamify.io/v1`

All authenticated routes require `Authorization: Bearer <access_token>`.

<details>
<summary><strong>Authentication</strong></summary>

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register` | Register. Returns `201` with `userId` |
| `POST` | `/auth/login` | Returns `{ accessToken, refreshToken }` |
| `POST` | `/auth/refresh` | Rotate refresh token |
| `POST` | `/auth/logout` | Revoke refresh token |

</details>

<details>
<summary><strong>Videos</strong></summary>

| Method | Path | Description |
|---|---|---|
| `POST` | `/videos/upload-url` | Returns S3 presigned PUT URL + `videoId` |
| `PATCH` | `/videos/:id/metadata` | Update title, description, tags, visibility |
| `GET` | `/videos/:id` | Video detail + signed rendition URLs |
| `GET` | `/videos` | List public videos (`?page`, `?limit`, `?category`) |
| `DELETE` | `/videos/:id` | Delete video + all S3 assets |
| `GET` | `/videos/:id/status` | Poll transcode status |

</details>

<details>
<summary><strong>Live Streams</strong></summary>

| Method | Path | Description |
|---|---|---|
| `GET` | `/streams` | List active streams |
| `GET` | `/streams/:channelId` | Stream detail + HLS playback URL |
| `GET` | `/streams/:channelId/viewers` | SSE: viewer count updates |
| `GET` | `/streams/:channelId/chat` | SSE: live chat messages |
| `POST` | `/streams/:channelId/chat` | Send chat message |
| `POST` | `/users/me/stream-key/regenerate` | Rotate stream key |

</details>

---

## Non-Functional Targets

| Metric | Target |
|---|---|
| API Gateway p99 latency | < 100ms |
| Video playback start (CDN hit) | < 2s |
| Live stream end-to-end latency | < 5s (LL-HLS) |
| Search p95 response time | < 300ms |
| Concurrent live streams | 50 per NMS instance |

---

## Build Roadmap

- [x] **Phase 1** (Weeks 1–3) — Monorepo setup, user service, API gateway, docker-compose
- [ ] **Phase 2** (Weeks 4–6) — Video service, S3 upload, Kafka, C# transcode worker
- [ ] **Phase 3** (Weeks 7–9) — Live streaming: RTMP ingest, LL-HLS, viewer count, chat
- [ ] **Phase 4** (Weeks 10–12) — Comments, search, analytics, notifications
- [ ] **Phase 5** (Weeks 13–16) — Kubernetes, CI/CD, Prometheus + Grafana, Jaeger
- [ ] **Phase 6** (Weeks 17–20) — Terraform IaC, CloudFront CDN, security hardening
- [ ] **v1.1** — Google OAuth, recommendation engine, mobile PWA

---

## Design Decisions

**Why Kafka instead of direct HTTP calls between services?**
The transcode worker is slow (minutes per video). Kafka decouples the upload request from the transcoding pipeline — the API returns immediately, and the worker processes at its own pace. If the worker goes down, events queue up and nothing is lost.

**Why C# for the transcode worker?**
FFmpeg wrapping and CPU-bound workloads are well-suited to .NET. It also demonstrates polyglot architecture — a real production system rarely uses only one language. The `IHostedService` Worker pattern maps perfectly to a long-running queue consumer.

**Why one database per service?**
Shared databases create invisible coupling between services. When video-service and user-service share a DB, a schema change in one can silently break the other. Separate databases enforce true service boundaries and make each service independently deployable.

**Why presigned S3 URLs for upload?**
Routing gigabytes of video through a Node.js process is wasteful and slow. The client uploads directly to S3, and the API only handles metadata. This keeps the API fast and cheap.

---

## Contributing

This is a learning project — PRs, issues, and architecture discussions are welcome.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m 'feat: add your feature'`
4. Push and open a PR

Please read the [PRD](docs/PRD.md) before contributing to understand service boundaries and event contracts.

---

## License

[MIT](LICENSE)

---

<div align="center">
  <sub>Built to learn. Designed to scale.</sub>
</div>
