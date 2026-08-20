## ADDED Requirements

### Requirement: What deploys is verified to carry its content

The deployment SHALL be checked for the rendered content, not only for the
presence of the files. "The build published `dist/`" stopped being the whole
guarantee once the documents' body text became a build product: a deploy can
succeed, serve every file, answer 200 for both entries, and still hand a crawler
an empty root element.

After a deploy that changes the render pass or either entry document, the served
documents SHALL be checked at their public URLs — both of them, each in its own
language. This is the same reasoning that already puts the crawl files under a
repository check rather than trusting the copy step: the failure is invisible from
inside the build.

#### Scenario: The served documents carry the list

- **WHEN** both public entry URLs are fetched after a deploy, without executing
  scripts
- **THEN** each response body contains runeword content in that entry's language

#### Scenario: A deploy that lost the render is caught

- **WHEN** a deployed document is served with an empty root element
- **THEN** the check fails, rather than the loss being noticed weeks later as a
  fall in search impressions
