import { Injectable } from '@nestjs/common';
import { Action } from '../../../enums/actions.enum';
import { Despesa } from '../../../../entities/despesa.entity';
import { User } from '../../../../entities/user.entity';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
  ExtractSubjectType,
} from '@casl/ability';

type Subjects = InferSubjects<typeof Despesa | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.isAdmin) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      can(Action.Read, 'all'); // read-only access to everything
    }

    can(Action.Update, Despesa);
    // cannot(Action.Delete, Despesa, { isPublished: true });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
