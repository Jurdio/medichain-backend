# Swagger Documentation Guide

## Overview

This project includes comprehensive Swagger/OpenAPI documentation for the MediChain backend API. The documentation is automatically generated and provides interactive API testing capabilities.

## Accessing the Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3001/api
```

## Features

### Interactive API Testing
- Test all endpoints directly from the browser
- Authenticate using JWT tokens
- View request/response schemas
- Download OpenAPI specification

### Comprehensive Documentation
- Detailed endpoint descriptions
- Request/response examples
- Authentication requirements
- Error responses
- Data models and schemas

## API Structure

### Health Endpoints
- `GET /` - Main health check
- `GET /health` - Service health status

### Authentication
- `POST /auth/wallet` - Authenticate with wallet signature
- `GET /auth/profile` - Get user profile (requires authentication)
- `GET /auth/test` - Auth service health check

### Certificates
- `POST /certificates` - Create new medical certificate
- `POST /certificates/:id/mint` - Mint NFT for certificate
- `GET /certificates/:id` - Get certificate by ID
- `GET /certificates/patient/:patientId` - Get certificates by patient
- `GET /certificates/doctor/:doctorId` - Get certificates by doctor
- `GET /certificates/:id/verify` - Verify certificate ownership
- `GET /certificates/:id/nft-metadata` - Get NFT metadata
- `GET /certificates/test` - Certificates service health check

## Authentication

Most endpoints require JWT authentication. To authenticate:

1. Use the `/auth/wallet` endpoint with your wallet signature
2. Copy the returned `accessToken`
3. Click the "Authorize" button in Swagger UI
4. Enter the token in the format: `Bearer <your-token>`

## Data Models

### Certificate Types
- `vaccination` - Vaccination certificates
- `medical_examination` - Medical examination reports
- `laboratory_test` - Laboratory test results
- `prescription` - Medical prescriptions
- `surgical_report` - Surgical procedure reports

### Certificate Status
- `pending` - Certificate created but not issued
- `issued` - Certificate issued with NFT
- `expired` - Certificate has expired
- `revoked` - Certificate has been revoked

## Development

### Adding New Endpoints

When adding new endpoints, ensure you include proper Swagger decorators:

```typescript
@ApiOperation({ summary: 'Endpoint description' })
@ApiResponse({ status: 200, description: 'Success response', type: ResponseDto })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 404, description: 'Not found' })
```

### Creating Response DTOs

Create response DTOs for better documentation:

```typescript
export class MyResponseDto {
  @ApiProperty({ description: 'Response field description' })
  field: string;

  @ApiProperty({ description: 'Optional field', required: false })
  optionalField?: string;
}
```

### Authentication Decorators

For protected endpoints:

```typescript
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
```

## Configuration

The Swagger configuration is in `src/main.ts` and includes:

- API title and description
- Version information
- Bearer authentication setup
- Tag organization
- Detailed API description

## Testing

You can test the API directly from the Swagger UI:

1. Start the application: `npm run start:dev`
2. Open `http://localhost:3001/api`
3. Use the interactive interface to test endpoints
4. Authenticate using the Authorize button
5. Test different scenarios and view responses

## Exporting Documentation

You can export the OpenAPI specification:

```bash
# Get the OpenAPI JSON
curl http://localhost:3001/api-json > openapi.json

# Or access it directly in the browser
http://localhost:3001/api-json
```

## Best Practices

1. **Always include proper decorators** for new endpoints
2. **Use descriptive summaries** in `@ApiOperation`
3. **Define response types** using DTOs
4. **Include error responses** for all endpoints
5. **Use proper authentication decorators** for protected routes
6. **Keep documentation up to date** with code changes
7. **Test the documentation** regularly

## Troubleshooting

### Common Issues

1. **Authentication not working**: Ensure you're using the correct Bearer token format
2. **Missing response types**: Check that all DTOs have proper `@ApiProperty` decorators
3. **Swagger not loading**: Verify the application is running and accessible
4. **Missing endpoints**: Ensure controllers have proper `@ApiTags` decorators

### Debugging

- Check the browser console for JavaScript errors
- Verify the API is responding correctly
- Check the application logs for any errors
- Ensure all required dependencies are installed 