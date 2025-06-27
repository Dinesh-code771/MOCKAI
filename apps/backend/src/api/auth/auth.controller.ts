import { RouteNames } from '@common/route-names';
import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { LoginApiResponse, LoginDto, LoginResponseDto } from '@auth/dto/login.dto';
import { AuthService } from '@auth/auth.service';
import { ResponseUtil } from '@common/helpers/response.utils';
import { CookieService } from '@common/services/cookie.service';
import { Request, Response } from 'express';
import { ApiResponse as apiResponse } from '@common/dto/api-response';
import { User } from '@common/decorators/user.decorator';
import { APP_STRINGS } from '@common/strings';
import { OtpDto } from './dto/otp-input.dto';
import { Auth } from './decorator/auth.decorator';
import { AuthType } from '@common/enums/auth-type.enum';
import { GoogleOAuthGuard } from './strategies/social-auth/google/google.guard';
import { OAuthEnum } from '@common/enums/oauth-providers.enum';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@config/env.config';
import { UserResponseApiResponse } from './dto/user.dto';

@Controller(RouteNames.AUTH)
@ApiTags('Auth')
export class AuthController {
  private frontendUrl: string;

  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {
    this.frontendUrl = this.configService.get('FRONTEND_URL');
  }

  @Post(RouteNames.AUTH_LOGIN)
  @Auth(AuthType.NONE)
  @ApiOperation({ summary: 'API to login' })
  @ApiHeader({
    name: 'x-landing-app-id',
    description:
      'An optional header to specify the landing app. Default value will be student.',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login Successful',
    type: LoginApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid id or password.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<LoginApiResponse> {
    const response = await this.authService.login(loginDto);
    if (response.token) {
      this.cookieService.setAuthCookie(res, response.token);
    }
    return ResponseUtil.success(response, 'Login successful', HttpStatus.OK);
  }

  @Post(RouteNames.AUTH_RESEND_OTP)
  @Auth(AuthType.NONE)
  @ApiOperation({ summary: 'API to resend OTP' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP resent successfully',
    type: apiResponse<null>
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid email or OTP.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async resendOtp(@User('id') userId: string, @User('type') tokenType: 'access' | 'temp'): Promise<LoginApiResponse> {
    if (tokenType === 'access') {
      throw new BadRequestException(APP_STRINGS.common.cannot_access_this_resource);
    }
    await this.authService.resendOtp(userId);
    return ResponseUtil.success(null, 'OTP resent successfully', HttpStatus.OK);
  }

  @Post(RouteNames.AUTH_VERIFY_OTP)
  @Auth(AuthType.JWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'API to verify OTP' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP verified successfully',
    type: LoginApiResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid email or OTP.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  async verifyOtp(@User('id') userId: string, @Body() input: OtpDto, @Res({ passthrough: true }) res: Response): Promise<LoginApiResponse> {
    const response = await this.authService.verifyOtp(userId, input.otp.toString());
    if (response.token) {
      this.cookieService.setAuthCookie(res, response.token);
    }
    return ResponseUtil.success(response, 'OTP verified successfully', HttpStatus.OK);
  }

  @Post(RouteNames.AUTH_LOGOUT)
  @Auth(AuthType.JWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'API to logout' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout successful',
    type: apiResponse<null>
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  async logout(@Res({ passthrough: true }) res: Response): Promise<apiResponse<null>> {
    this.cookieService.deleteAuthCookies(res);
    return ResponseUtil.success(null, 'Logout successful', HttpStatus.OK);
  }

  @Get(RouteNames.AUTH_GOOGLE)
  @Auth(AuthType.NONE)
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Authenticate user with Google' })
  @ApiQuery({ name: 'next_url', type: String, required: false })
  async authenticateWithGoogle(@Req() _req) {}

  @Get(RouteNames.AUTH_GOOGLE_REDIRECT)
  @Auth(AuthType.NONE)
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Authenticate user with Google' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authentication Successful',
    type: LoginApiResponse,
  })
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) res,
    @Query('state') state?: string,
  ) {
    const nextUrl = state?.split('&')?.[1]?.split('=')?.[1] || null;
    const response = await this.authService.socialLogin(req, OAuthEnum.GOOGLE);

    if (response.token) {
      this.cookieService.setAuthCookie(res, response.token);
    }

    let redirectUrl = `${this.frontendUrl}/social-auth`;
    if (nextUrl) {
      redirectUrl += `?next_url=${nextUrl}`;
    }
    return res.redirect(redirectUrl);
  }

  @Get(RouteNames.AUTH_LOGGED_IN_USER)
  @Auth(AuthType.JWT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'API to get logged in user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logged in user',
    type: UserResponseApiResponse,
  })
  async getLoggedInUser(@User('id') userId: string) {
    return this.authService.getLoggedInUser(userId);
  }
}
