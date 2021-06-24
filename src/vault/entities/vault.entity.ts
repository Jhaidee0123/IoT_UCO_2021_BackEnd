import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vault {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ default: false })
  public isOpen: boolean;
}