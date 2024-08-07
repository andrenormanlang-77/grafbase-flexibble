import { graph, auth, config } from "@grafbase/sdk";

// Define the standalone graph
const g = graph.Standalone();

// Define the User model
const User = g.type("User", {
  // @ts-ignore
  name: g.string().length({ min: 2, max: 20 }),
  // @ts-ignore
  email: g.string().unique(),
  avatarUrl: g.url(),
  description: g.string().optional(),
  githubUrl: g.url().optional(),
  linkedinUrl: g.url().optional(),
});

// Define the Project model
const Project = g.type("Project", {
  // @ts-ignore
  title: g.string().length({ min: 3 }),
  description: g.string(),
  image: g.url(),
  liveSiteUrl: g.url(),
  githubUrl: g.url(),
  category: g.string(),
});

// Define the relationships
// @ts-ignore

User.field({
  projects: g.ref(Project).list().optional(),
});

// @ts-ignore

Project.field({
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
