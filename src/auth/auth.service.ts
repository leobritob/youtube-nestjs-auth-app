import { Injectable } from '@nestjs/common';
import { UsersEntity } from '../app/users/users.entity';
import { UsersService } from '../app/users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user) {
    const payload = { sub: user.id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<UsersEntity> {
    try {
      const user = await this.userService.findOneOrFail({ email });
      const isPasswordValid = compareSync(password, user.password);
      if (!isPasswordValid) return null;

      return user;
    } catch (error) {
      return null;
    }
  }
}
