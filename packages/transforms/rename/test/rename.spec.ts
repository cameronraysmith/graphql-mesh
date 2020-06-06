import RenameTransform from './../src/index';
import { buildSchema, printSchema } from 'graphql';
import { InMemoryLRUCache } from '@graphql-mesh/cache-inmemory-lru';
import { Hooks } from '@graphql-mesh/types';
import { EventEmitter } from 'events';
import { wrapSchema } from '@graphql-tools/wrap';

describe('rename', () => {
  const schema = buildSchema(/* GraphQL */ `
    type Query {
      user: User!
    }

    type User {
      id: ID!
    }
  `);
  let cache: InMemoryLRUCache;
  let hooks: Hooks;
  beforeEach(() => {
    cache = new InMemoryLRUCache();
    hooks = new EventEmitter() as Hooks;
  });

  it('should change the name of a type', () => {
    const newSchema = wrapSchema({
      schema,
      transforms: [
        new RenameTransform({
          config: [
            {
              from: 'User',
              to: 'MyUser',
            },
          ],
          cache,
          hooks,
        }),
      ],
    });

    expect(newSchema.getType('User')).toBeUndefined();
    expect(newSchema.getType('MyUser')).toBeDefined();
    expect(printSchema(newSchema)).toMatchSnapshot();
  });
});
