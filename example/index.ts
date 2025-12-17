import { VolleyClient } from '../src/client';

async function main() {
  // Get API token from environment variable
  const apiToken = process.env.VOLLEY_API_TOKEN;
  if (!apiToken) {
    console.error('VOLLEY_API_TOKEN environment variable is required');
    process.exit(1);
  }

  // Create a client
  const client = new VolleyClient(apiToken);

  try {
    // Example 1: List organizations
    console.log('=== Listing Organizations ===');
    const orgs = await client.organizations.list();
    if (orgs.length === 0) {
      console.log('  No organizations found');
      return;
    }

    for (const org of orgs) {
      console.log(
        `  - ${org.name} (ID: ${org.id}, Role: ${org.role})`
      );
    }

    // Example 2: Set organization context
    const orgID = orgs[0].id;
    client.setOrganizationId(orgID);
    console.log(
      `\n=== Using Organization: ${orgs[0].name} (ID: ${orgID}) ===`
    );

    // Example 3: List projects
    console.log('\n=== Listing Projects ===');
    const projects = await client.projects.list();
    if (projects.length === 0) {
      console.log('  No projects found');
      return;
    }

    for (const project of projects) {
      console.log(
        `  - ${project.name} (ID: ${project.id}${
          project.is_default ? ', Default' : ''
        })`
      );
    }

    // Example 4: List sources for first project
    const projectID = projects[0].id;
    console.log(
      `\n=== Listing Sources for Project: ${projects[0].name} (ID: ${projectID}) ===`
    );
    const sources = await client.sources.list(projectID);
    if (sources.length === 0) {
      console.log('  No sources found');
    } else {
      for (const source of sources) {
        console.log(
          `  - ${source.slug} (ID: ${source.id}, Ingestion ID: ${source.ingestion_id})`
        );
      }
    }

    // Example 5: List events (if any)
    console.log(
      `\n=== Listing Recent Events for Project: ${projects[0].name} ===`
    );
    const events = await client.events.list(projectID, { limit: 10 });
    console.log(`Total events: ${events.total}`);
    for (let i = 0; i < Math.min(5, events.requests.length); i++) {
      const event = events.requests[i];
      console.log(`  - Event ID: ${event.event_id}, Status: ${event.status}`);
    }
  } catch (error: any) {
    console.error('Error:', error.message);
    if (error.statusCode) {
      console.error(`Status Code: ${error.statusCode}`);
    }
    process.exit(1);
  }
}

main();

