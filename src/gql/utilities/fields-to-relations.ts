// Naive reimplementation of https://github.com/driescroons/graphql-fields-to-relations/blob/master/src/index.ts
// Uses graphql-parse-resolve-info instead of the outdated graphql-fields
// Traverses all nested fields instead of taking depth or ignore options
// Future iterations will include these items

import { EntityMetadata, EntityName, Populate } from '@mikro-orm/core';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { GraphQLResolveInfo } from 'graphql';
import {
  FieldsByTypeName,
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

const fieldsToRelations = <Entity>(
  info: GraphQLResolveInfo,
  entity: EntityName<Entity>,
  em: SqlEntityManager,
): Populate<Entity, string> => {
  const parsedResolveInfo = parseResolveInfo(info);
  const simplifiedInfo = simplifyParsedResolveInfoFragmentWithType(parsedResolveInfo as ResolveTree, info.returnType);
  const { fields } = simplifiedInfo;

  const paths: string[][] = [];

  const traverse = (fieldsByTypeName: FieldsByTypeName, parentPath: string[] = []) => {
    for (const typeName in fieldsByTypeName) {
      const fields = fieldsByTypeName[typeName];

      for (const fieldName in fields) {
        const field = fields[fieldName];
        const newPath = [...parentPath, fieldName];

        if (Object.keys(field.fieldsByTypeName).length > 0) {
          paths.push(newPath);
          traverse(field.fieldsByTypeName, newPath);
        }
      }
    }
  };

  traverse({ fields });

  return paths
    .map((list: string[]) => list.join('.'))
    .filter((p) => {
      return !isValidRelation<Entity>(em, entity, p);
    }) as unknown as Populate<Entity, string>;
};

const isValidRelation = <Entity>(em: SqlEntityManager, entity: EntityName<Entity>, relationPath: string) => {
  const pathParts = relationPath.split('.');
  // We don't necessarily know which entities will be nested, so using 'any'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let metadata: EntityMetadata<any> = em.getMetadata().get(entity);

  for (const part of pathParts) {
    const relation = metadata.relations.find((r) => r.name === part);
    if (!relation) return false;
    metadata = em.getMetadata().get(relation.type);
  }
};

export default fieldsToRelations;
