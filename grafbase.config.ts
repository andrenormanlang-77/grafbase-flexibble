import { graph, auth, config } from '@grafbase/sdk';

// Define the standalone graph
const g = graph.Standalone();

// Define the User model
const User = g.type('User', {
  name: g.string(),
  email: g.string(),
  avatarUrl: g.url(),
  description: g.string().optional(),
  githubUrl: g.url().optional(),
  linkedinUrl: g.url().optional()
})



// Define the Project model
const Project = g.type('Project', {
  title: g.string(),
  description: g.string(),
  image: g.url(),
  liveSiteUrl: g.url(),
  githubUrl: g.url(),
  category: g.string(),
})

// Define JWT authentication provider
const provider = auth.JWT({
  issuer: 'https://grafbase.io',
  secret: g.env('NEXTAUTH_SECRET'),
});

// Export the configuration
export default config({
  schema: g,
  auth: {
    providers: [provider],
    rules: (rules) => {
      rules.private();
    },
  },
});
