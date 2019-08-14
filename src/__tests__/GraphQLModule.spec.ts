import { GraphQLModule } from '../GraphQLModule';
import * as faker from 'faker';
import { GraphQLResolver } from '../GraphQLResolver';
import randomGraphQLModule from '../__fixtures__/randomGraphQLModule';
import randomGraphQLResolver from '../__fixtures__/randomGraphQLResolver';
process.env.PULUMI_TEST_MODE = 'true';

describe('GraphQLModule', () => {
  it('should construct', async () => {
    const module = new GraphQLModule(faker.random.uuid(), {});
    expect(module).toBeInstanceOf(GraphQLModule);
  });
  it('should export resolvers', async () => {
    const resolver = new GraphQLResolver(faker.random.uuid(), randomGraphQLResolver());

    const module = new GraphQLModule(faker.random.uuid(), {
      ...randomGraphQLModule(),
      resolvers: resolver,
    });

    expect(module.resolvers.length).toBeTruthy();
  });

  it('should combine schema', async () => {
    const resolver = new GraphQLResolver(faker.random.uuid(), randomGraphQLResolver());

    const module = new GraphQLModule(faker.random.uuid(), {
      ...randomGraphQLModule(),
      resolvers: resolver,
      typeDefs: [
        `
        type Test {
          test: string
        }
      `,
        `
        type Test {
          test2: string
        }
      `,
      ],
    });

    expect(module.resolvers.length).toBeTruthy();
  });
  it('should generate schema', () => {
    const resolver = new GraphQLResolver(faker.random.uuid(), {
      ...randomGraphQLResolver(),
      typeDefs: `
        type HelloTwo {
          test: HelloThree
        }
        type HelloThree {
          test2: string
        }
        type Query {
          queryTwo: HelloTwo
        }
      `
    });
    const module = new GraphQLModule(faker.random.uuid(), {
      ...randomGraphQLModule(),
      typeDefs: `
        type HelloOne {
          test: HelloThree
        }
        type HelloThree {
          test1: string
        }
        type Query {
          queryOne: HelloOne
        }
      `,
      resolvers: [resolver],
    });

    expect(module.typeDefs).toMatch(/type HelloOne/);
    expect(module.typeDefs).toMatch(/type HelloThree/);
    expect(module.typeDefs).toMatch(/queryOne: HelloOne/);
    expect(module.typeDefs).toMatch(/queryTwo: HelloTwo/);
    expect(module.typeDefs).toMatch(/type HelloTwo/);
    expect(module.typeDefs).toMatch(/schema/);
  })
});
