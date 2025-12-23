# Contributing to Sysmoon

Thank you for your interest in contributing to Sysmoon! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We're building an inclusive community.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+
- Git
- .NET 8+ (for C# SDK development)

### Setup Development Environment

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/your-username/sysmoon.git
   cd sysmoon
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Setup environment variables**:
   ```bash
   # Copy example files
   cp packages/database/.env.example packages/database/.env
   cp apps/server-api/.env.example apps/server-api/.env.local
   cp apps/dashboard/.env.example apps/dashboard/.env.local
   
   # Edit .env files with your PostgreSQL credentials
   ```

4. **Initialize database**:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Start development servers**:
   ```bash
   pnpm dev
   ```

## Development Workflow

### Branching Strategy

- `main`: Production-ready code
- `develop`: Development branch (if used)
- Feature branches: `feature/your-feature-name`
- Bug fixes: `fix/issue-description`
- Documentation: `docs/what-changed`

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation as needed

3. **Test your changes**:
   ```bash
   pnpm lint
   pnpm build
   # Test manually in browser/application
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add event filtering by date range
fix: resolve WebSocket reconnection issue
docs: update API documentation for new endpoints
refactor: simplify event processor logic
```

### Pull Request Process

1. **Update documentation**:
   - Update README if needed
   - Update API docs for API changes
   - Add inline code comments

2. **Create pull request**:
   - Use a clear title following commit conventions
   - Describe what changed and why
   - Reference related issues
   - Add screenshots for UI changes

3. **PR Template**:
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   Describe how you tested the changes
   
   ## Screenshots (if applicable)
   Add screenshots here
   
   ## Checklist
   - [ ] Code follows project style
   - [ ] Documentation updated
   - [ ] No new warnings
   - [ ] Changes work locally
   ```

4. **Code review**:
   - Address reviewer feedback
   - Keep discussion professional
   - Make requested changes promptly

5. **Merge**:
   - Maintainers will merge when approved
   - Delete your feature branch after merge

## Project Structure

```
sysmoon/
├── apps/
│   ├── dashboard/          # Next.js dashboard UI
│   └── server-api/         # Next.js backend API
├── packages/
│   └── database/           # Prisma schema
├── sdks/
│   ├── js/                 # JavaScript SDK
│   └── csharp/             # C# SDK
├── examples/               # Example applications
└── docs/                   # Documentation
```

## Code Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for type safety
- Use functional components in React
- Prefer `const` over `let`
- Use async/await over promises
- Use meaningful variable names
- Add JSDoc comments for public APIs

Example:
```typescript
/**
 * Process and enrich event data before storage
 * @param eventData - Raw event data from client
 * @returns Processed event with enriched metadata
 */
async function processEvent(eventData: EventData): Promise<ProcessedEvent> {
  const enrichedEvent = {
    ...eventData,
    timestamp: new Date(),
    processed: true,
  };
  
  return enrichedEvent;
}
```

### C#

- Follow Microsoft C# coding conventions
- Use async/await for I/O operations
- Use meaningful names
- Add XML documentation comments

Example:
```csharp
/// <summary>
/// Send a single event to Sysmoon
/// </summary>
/// <param name="eventData">Event data to send</param>
/// <returns>Task representing the async operation</returns>
public async Task SendEventAsync(EventData eventData)
{
    // Implementation
}
```

### React Components

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components focused and small
- Use TypeScript for props

Example:
```typescript
interface EventListProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

export function EventList({ events, onEventClick }: EventListProps) {
  return (
    <div>
      {events.map(event => (
        <EventItem key={event.id} event={event} onClick={onEventClick} />
      ))}
    </div>
  );
}
```

## Testing Guidelines

### Manual Testing

1. **Test all changes locally**:
   - Start development servers
   - Test in browser/application
   - Check console for errors
   - Test edge cases

2. **Test different scenarios**:
   - Happy path
   - Error cases
   - Edge cases
   - Different browsers (for UI)

### Future: Automated Tests

We plan to add:
- Unit tests (Jest)
- Integration tests
- E2E tests (Playwright)

## Adding New Features

### New API Endpoint

1. Create endpoint in `apps/server-api/src/pages/api/`
2. Add validation with Zod
3. Use authentication middleware if needed
4. Update API documentation in `docs/API.md`
5. Test manually with curl/Postman

### New Dashboard Component

1. Create component in `apps/dashboard/src/components/`
2. Use TypeScript for props
3. Follow existing patterns
4. Test in browser
5. Ensure responsive design

### New SDK Feature

1. Add to both JS and C# SDKs
2. Maintain API consistency
3. Update SDK documentation
4. Create example in `examples/`

### New Language SDK

1. Create new directory in `sdks/`
2. Follow existing SDK patterns:
   - Registration
   - Event sending (single & batch)
   - Real-time streaming
3. Add comprehensive README
4. Create examples
5. Update main README

## Documentation

### When to Update Docs

- New features
- API changes
- Configuration changes
- Deployment changes
- Breaking changes

### Documentation Files

- `README.md`: Project overview
- `docs/API.md`: API reference
- `docs/ARCHITECTURE.md`: System architecture
- `docs/DEPLOYMENT.md`: Deployment guide
- SDK `README.md`: SDK usage
- Component READMEs: Package-specific docs

## Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., macOS, Windows, Linux]
- Node version: [e.g., 18.0.0]
- Browser: [e.g., Chrome, Firefox]
- Sysmoon version: [e.g., 1.0.0]

**Additional context**
Any other relevant information
```

## Suggesting Features

### Feature Request Template

```markdown
**Problem/Need**
Describe the problem or need

**Proposed Solution**
How you think it should work

**Alternatives**
Other solutions you've considered

**Additional Context**
Screenshots, mockups, examples
```

## Development Tips

### Useful Commands

```bash
# Run specific package
pnpm --filter @sysmoon/dashboard dev

# Build specific package
pnpm --filter @sysmoon/server-api build

# Lint
pnpm lint

# Database
pnpm db:generate    # Generate Prisma client
pnpm db:migrate     # Run migrations
pnpm db:studio      # Open Prisma Studio
```

### Debugging

1. **API debugging**:
   - Check server logs in terminal
   - Use console.log (remove before commit)
   - Check database with Prisma Studio

2. **Dashboard debugging**:
   - Use browser DevTools
   - Check Network tab for API calls
   - Check Console for errors

3. **WebSocket debugging**:
   - Check browser Console for connection status
   - Monitor Network tab (WS section)
   - Check server logs

### Common Issues

1. **Database connection failed**:
   - Check DATABASE_URL in .env
   - Ensure PostgreSQL is running
   - Verify credentials

2. **Port already in use**:
   - Change PORT in .env.local
   - Kill process using port: `lsof -ti:3001 | xargs kill -9`

3. **Module not found**:
   - Run `pnpm install`
   - Clear node_modules: `rm -rf node_modules && pnpm install`

## Community

### Getting Help

- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: Questions and general discussion
- Documentation: Check docs first

### Recognition

Contributors are recognized in:
- Git commit history
- Release notes
- Contributors section (coming soon)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open a discussion or issue if you have questions about contributing!

---

Thank you for contributing to Sysmoon! 🚀
