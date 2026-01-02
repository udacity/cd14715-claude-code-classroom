# Acme API Documentation

## Overview

The Acme API provides programmatic access to our widget management platform. This RESTful API allows developers to create, read, update, and delete widgets, manage user accounts, and generate analytics reports.

## Authentication

All API requests require authentication using Bearer tokens. Obtain your API key from the developer dashboard at https://acme.example.com/developers.

```
Authorization: Bearer YOUR_API_KEY
```

Tokens expire after 24 hours and must be refreshed using the `/auth/refresh` endpoint.

## Rate Limits

- Free tier: 100 requests per minute
- Pro tier: 1,000 requests per minute
- Enterprise tier: 10,000 requests per minute

Exceeding rate limits returns HTTP 429. Use the `X-RateLimit-Remaining` header to track usage.

## Core Endpoints

### Widgets

**GET /api/v1/widgets** - List all widgets
- Supports pagination via `page` and `limit` query parameters
- Filter by status: `?status=active`

**POST /api/v1/widgets** - Create a new widget
- Required fields: `name`, `type`, `configuration`
- Returns the created widget with assigned ID

**GET /api/v1/widgets/:id** - Get widget details
- Returns full widget object including metadata

**PUT /api/v1/widgets/:id** - Update a widget
- Partial updates supported

**DELETE /api/v1/widgets/:id** - Delete a widget
- Soft delete by default, use `?hard=true` for permanent deletion

### Analytics

**GET /api/v1/analytics/usage** - Get usage statistics
- Date range: `?start=2024-01-01&end=2024-01-31`
- Granularity: `?interval=daily|weekly|monthly`

**GET /api/v1/analytics/performance** - Get performance metrics
- Returns p50, p95, p99 latency percentiles

## Error Handling

All errors return JSON with `error` and `message` fields:

```json
{
  "error": "validation_error",
  "message": "Widget name is required",
  "field": "name"
}
```

Common error codes:
- 400: Bad Request - Invalid parameters
- 401: Unauthorized - Missing or invalid token
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource doesn't exist
- 429: Too Many Requests - Rate limit exceeded
- 500: Internal Server Error - Contact support

## Webhooks

Configure webhooks to receive real-time notifications:

1. Register webhook URL in dashboard
2. Select events to subscribe to
3. Verify signature using shared secret

Supported events: `widget.created`, `widget.updated`, `widget.deleted`, `analytics.ready`

## SDKs

Official SDKs available for:
- JavaScript/TypeScript: `npm install @acme/sdk`
- Python: `pip install acme-sdk`
- Go: `go get github.com/acme/sdk-go`

## Support

- Documentation: https://docs.acme.example.com
- Status page: https://status.acme.example.com
- Email: api-support@acme.example.com
