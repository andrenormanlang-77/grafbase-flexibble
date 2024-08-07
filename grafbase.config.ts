// @ts-ignore
import { graph, auth, config } from '@grafbase/sdk';

// Define the standalone graph
const g = graph.Standalone();

// Define the User model
// @ts-ignore
const User = g.model('User', {
  name: g.string().length({ min: 2, max: 20 }),
  email: g.string().unique(),
  avatarUrl: g.url(),
  description: g.string().optional(),
  githubUrl: g.url().optional(),
  linkedinUrl: g.url().optional(),
  // @ts-ignore
  projects: g.relation(() => Project).list().optional(),
  // @ts-ignore
}).auth((rules) => {
  // @ts-ignore
  rules.public().read();
});

// Define the Project model
// @ts-ignore
const Project = g.model('Project', {
  title: g.string().length({ min: 3 }),
  description: g.string(),
  image: g.url(),
  liveSiteUrl: g.url(),
  githubUrl: g.url(),
  category: g.string(),
  // @ts-ignore
  createdBy: g.relation(() => User),
  // @ts-ignore
}).auth((rules) => {
  // @ts-ignore
  rules.public().read();
  // @ts-ignore
  rules.private().create().delete().update();
});

// Define JWT authentication provider
// @ts-ignore
const provider = auth.JWT({
  issuer: g.env('ISSUER_URL'),
  secret: g.env('JWT_SECRET'),
});

// Export the configuration
// @ts-ignore
export default config({
  graph: g,
  auth: {
    providers: [provider],
    // @ts-ignore
    rules: (rules) => {
      rules.private();
    },
  },
});
