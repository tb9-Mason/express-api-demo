import { faker } from '@faker-js/faker';
import { EntityData } from '@mikro-orm/core';
import { Factory } from '@mikro-orm/seeder';

import { Member } from '../../entities';

export class MemberFactory extends Factory<Member> {
  model = Member;

  protected definition(): EntityData<Member> {
    return {
      fullName: faker.person.fullName(),
    };
  }
}
