import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:8000/graphql",
  documents: ["lib/graphql/**/*.ts"],
  generates: {
    "./lib/graphql/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-react-apollo"],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        skipTypename: false,
        avoidOptionals: true,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
