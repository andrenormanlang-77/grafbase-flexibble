import { auth, config, graph } from '@grafbase/sdk';

// Define the standalone graph using GraphQL SDL
const g = graph.Standalone({
  typeDefs: /* GraphQL */ `
    type User {
      id: ID!
      name: String! @length(min: 2, max: 20)
      email: String! @unique
      avatarUrl: String!
      description: String
      githubUrl: String
      linkedinUrl: String
      projects: [Project]
    }

    type Project {
      id: ID!
      title: String! @length(min: 3)
      description: String!
      image: String!
      liveSiteUrl: String!
      githubUrl: String!
      category: String
      createdBy: User
    }

    extend type Query {
      invoiceByNumber(invoiceNumber: String!): [Invoice!]!
        @resolver(name: "invoice/byNumber")
    }
  `,
});

// Export the configuration

// Define JWT authentication
const jwt = auth.JWT({
  issuer: 'grafbase',
  secret: g.env('NEXTAUTH_SECRET'),
});

// Export the configuration
export default config({
  graph: g,
  auth: {
    providers: [jwt],
    rules: (rules) => rules.private(),
  },
});
