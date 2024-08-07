import { graph, auth, config } from "@grafbase/sdk";

// Define the standalone graph
const g = graph.Standalone();

// Define the User model
// @ts-ignore
const User = g.type('User', {
  name: g.string(),
  email: g.email(),
  description: g.string(),
  image: g.url(),
  liveSiteUrl: g.url(),
  githubUrl: g.url(),
  category: g.string(),
  // @ts-ignore
  projects: g.ref(Project).list().optional(),
});

// Define the relationships
// @ts-ignore
const Project = g.type('Project', {
  title: g.string(),
  description: g.string(),
  image: g.url(),
  liveSiteUrl: g.url(),
  githubUrl: g.url(),
  category: g.string(),
  createdBy: g.ref(User),
});


// Define authentication rules


// @ts-ignore

User.auth((rules) => {
  rules.public().read();
});


// @ts-ignore

Project.auth((rules) => {
  rules.public().read();
  rules.private().create().delete().update();
});

// Define JWT authentication provider
const provider = auth.JWT({
  issuer: g.env("ISSUER_URL"),
  secret: g.env("JWT_SECRET"),
});

// Export the configuration
export default config({
  graph: g,
  auth: {
    providers: [provider],
    rules: (rules) => {
      rules.private();
    },
  },
});
