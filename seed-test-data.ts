import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DataSource, In } from 'typeorm';
import { Role } from './src/roles/entities/role.entity';
import { Doctor } from './src/doctors/entities/doctor.entity';
import { Direction } from './src/directions/entities/direction.entity';
import { CertificateType } from './src/certificate-types/entities/certificate-type.entity';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn', 'log'] });
  try {
    const dataSource = app.get(DataSource);
    const roleRepo = dataSource.getRepository(Role);
    const doctorRepo = dataSource.getRepository(Doctor);
    const directionRepo = dataSource.getRepository(Direction);
    const certTypeRepo = dataSource.getRepository(CertificateType);

    // 1) Create or get Admin role with full permissions
    const full: { read: boolean; save: boolean } = { read: true, save: true };
    const permissions = {
      Users: {
        doctors: full,
      },
      Documents: {
        settings: full,
        protect: full,
        history: full,
        verify: full,
        roles: full,
        directions: full,
        certificateTypes: full,
      },
    } as Role['permissions'];

    let adminRole = await roleRepo.findOne({ where: { slug: 'admin' } });
    if (!adminRole) {
      adminRole = roleRepo.create({
        name: 'Administrator',
        slug: 'admin',
        description: 'Admin role with full access',
        permissions,
      });
      adminRole = await roleRepo.save(adminRole);
      console.log('Created role:', adminRole.slug);
    } else {
      adminRole.permissions = permissions;
      await roleRepo.save(adminRole);
      console.log('Updated role permissions for:', adminRole.slug);
    }

    // 2) Create or get test Direction
    let testDirection = await directionRepo.findOne({ where: { slug: 'test-direction' } });
    if (!testDirection) {
      testDirection = directionRepo.create({ name: 'Тестовий напрямок', slug: 'test-direction', description: 'Seeded test direction' });
      testDirection = await directionRepo.save(testDirection);
      console.log('Created direction:', testDirection.slug);
    }

    // 3) Create or get test CertificateType and link to Direction
    let testCertType = await certTypeRepo.findOne({ where: { slug: 'test-certificate-type' }, relations: { directions: true } });
    if (!testCertType) {
      testCertType = certTypeRepo.create({ name: 'Тестовий сертифікат', slug: 'test-certificate-type', description: 'Seeded test certificate type' });
    }
    testCertType.directions = [testDirection];
    testCertType = await certTypeRepo.save(testCertType);
    console.log('Upserted certificate type:', testCertType.slug, 'with directions:', testCertType.directions?.map((d) => d.slug));

    // 4) Assign admin role to doctor with given email (create doctor if missing)
    const targetEmail = 'test-4486@privy.io';
    let doctor = await doctorRepo.findOne({ where: { email: targetEmail } });
    if (!doctor) {
      doctor = doctorRepo.create({
        fullName: 'Test Admin',
        email: targetEmail,
        walletAddress: 'wallet-addr-test-4486-00001',
        phone: '+380000000000',
        specialization: 'Admin',
        active: true,
      });
      doctor = await doctorRepo.save(doctor);
      console.log('Created doctor:', doctor.email);
    }

    doctor.roleId = adminRole.id;
    await doctorRepo.save(doctor);
    console.log('Assigned role to doctor:', { email: doctor.email, role: adminRole.slug });

    console.log('Seeding completed successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await (await NestFactory.createApplicationContext(AppModule)).close();
    // In case of lingering connections
    setTimeout(() => process.exit(process.exitCode ?? 0), 100);
  }
}

run();


