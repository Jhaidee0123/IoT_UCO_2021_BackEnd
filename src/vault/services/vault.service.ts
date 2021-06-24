import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateVaultDto } from '../dto/UpdateVault.dto';
import { Vault } from '../entities';

@Injectable()
export class VaultService {
  constructor(
    @InjectRepository(Vault) private userRepository: Repository<Vault>,
  ) {}

  public getVault(): Promise<Vault[]> {
    return this.userRepository.find();
  }

  public async openOrCloseVault(vaultState: UpdateVaultDto): Promise<void> {

    const vault = await this.getVault();
    vault[0].isOpen = vaultState.isOpen;
    await this.userRepository.save(vault);
  }

}
