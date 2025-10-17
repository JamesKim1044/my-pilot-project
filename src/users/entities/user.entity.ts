// src/users/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  // 💡 비밀번호 필드 (DB에 해시 값 저장)
  @Column({ select: false }) // 기본적으로 이 필드를 조회에서 제외 (보안)
  password: string;

  // 💡 엔티티가 처음 저장되기 직전에 실행되는 훅
  @BeforeInsert() // 💡 데이터베이스에 삽입되기 전에 자동으로 실행
  async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

  // 비밀번호 검증 메서드 (선택 사항)
  async comparePassword(attempt: string): Promise<boolean> {
      return bcrypt.compare(attempt, this.password);
  }
}