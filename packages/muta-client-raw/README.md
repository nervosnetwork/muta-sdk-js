# muta-client-raw

An auto generated GraphQL API binding with Muta GraphQL

## Customize

When you want to customize the generated sdk, try to edit the follow config files.

- [codegen.yml](./codegen.yml) - a configuration for [graphql-code-generator](https://graphql-code-generator.com/)
- [muta.graphql](./muta.graphql) - all the GraphQL `query` all `mutation` defined, then `query`s and `mutation`s would be generated as reusable TypeScript code

Then run `npm run generate`, the code will be generated under the [src](./src) folder
