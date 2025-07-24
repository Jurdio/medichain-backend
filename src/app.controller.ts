import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';

class HealthResponseDto {
  @ApiProperty({ description: 'Service status message' })
  message: string;

  @ApiProperty({ description: 'Current timestamp' })
  timestamp: string;

  @ApiProperty({ description: 'API version' })
  version: string;
}

class HealthCheckDto {
  @ApiProperty({ description: 'Service status' })
  status: string;

  @ApiProperty({ description: 'Current timestamp' })
  timestamp: string;
}

@ApiTags('Health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is running', type: HealthResponseDto })
  getHello(): HealthResponseDto {
    return {
      message: 'MediChain Backend is running!',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy', type: HealthCheckDto })
  getHealth(): HealthCheckDto {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
} 