import { Module } from '@nestjs/common';
import { VaultService } from './services/vault.service';
import { VaultController } from './controllers/vault.controller';
import { Vault } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Vault])],
  controllers: [VaultController],
  providers: [VaultService],
  exports: [VaultService]
})
export class VaultModule {}
