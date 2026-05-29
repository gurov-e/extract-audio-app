import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('media')
export class Media {
	@PrimaryGeneratedColumn()
	id!: string;

	@Column({ unique: true })
	slug!: string;

	@Column()
	originalName!: string;

	@Column()
	mimeType!: string;

	@Column({ type: 'bigint' })
	size!: number;

	@Column()
	path!: string;

	@CreateDateColumn()
	createdAt!: Date;
}
