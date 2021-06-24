import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserRole } from 'src/users/entities/user-role.enum';
import { UpdateVaultDto } from '../dto/UpdateVault.dto';
import { VaultService } from '../services/vault.service';

@Controller('vault')
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  @Roles(UserRole.Manager)
  @Put('open-close-vault')
  @UseGuards(JwtAuthGuard, RoleGuard)
  public async openOrCloseVault(@Body() updateVaultDto: UpdateVaultDto) {
    return this.vaultService.openOrCloseVault(updateVaultDto);
  }

  @Roles(UserRole.Manager)
  @Get('get-state-vault')
  @UseGuards(JwtAuthGuard, RoleGuard)
  public async getStateVault() {
    return this.vaultService.getVault();
  }
}
