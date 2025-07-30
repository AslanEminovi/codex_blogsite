using BlogAPI.Models;

namespace BlogAPI.Data
{
    public static class SampleBlogs
    {
        public static List<Blog> GetSampleBlogs(int adminUserId)
        {
            return new List<Blog>
            {
                new Blog
                {
                    Id = 1,
                    Title = "The Future of Web Development in 2025",
                    Summary = "Exploring the latest trends, technologies, and paradigms that will shape web development in 2025 and beyond.",
                    Content = @"# The Future of Web Development in 2025

Web development continues to evolve at a rapid pace, and 2025 promises to bring exciting new technologies and paradigms that will reshape how we build applications.

## Key Trends to Watch

### 1. **AI-Powered Development**
Artificial Intelligence is becoming an integral part of the development process:
- **Code Generation**: Tools like GitHub Copilot and ChatGPT are revolutionizing how we write code
- **Automated Testing**: AI can generate comprehensive test suites automatically
- **Bug Detection**: Smart tools that can predict and prevent bugs before they happen

### 2. **WebAssembly (WASM) Goes Mainstream**
```javascript
// WebAssembly integration example
import init, { process_data } from './pkg/wasm_module.js';

async function runWasm() {
    await init();
    const result = process_data(largeDataSet);
    return result;
}
```

### 3. **Edge Computing Revolution**
Edge computing is bringing computation closer to users:
- **Faster Response Times**: Sub-50ms response times globally
- **Better User Experience**: Reduced latency for interactive applications
- **Cost Efficiency**: Lower bandwidth costs and improved performance

## The Rise of New Frameworks

### Server Components
React Server Components and similar technologies are changing how we think about rendering:

> ""The future of web apps is a hybrid of server and client rendering, giving us the best of both worlds.""

### TypeScript Everywhere
TypeScript adoption has reached new heights:
- **Better Developer Experience**: Enhanced autocomplete and error detection
- **Safer Refactoring**: Confident code changes with compile-time checks
- **Team Collaboration**: Clearer interfaces and contracts

## Looking Ahead

The web platform continues to mature, and developers have more powerful tools than ever before. The key is to:

1. **Stay Curious**: Keep learning and experimenting with new technologies
2. **Focus on Fundamentals**: Strong basics never go out of style
3. **User-Centric Approach**: Always prioritize user experience

![Modern Web Development](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80)

The future is bright for web developers, and 2025 will be an exciting year full of innovation and growth! 🚀",
                    UserId = adminUserId,
                    CreatedAt = new DateTime(2025, 1, 15),
                    UpdatedAt = new DateTime(2025, 1, 15)
                },
                new Blog
                {
                    Id = 2,
                    Title = "Building Scalable Applications with Microservices",
                    Summary = "A comprehensive guide to designing and implementing microservices architecture for modern applications.",
                    Content = @"# Building Scalable Applications with Microservices

Microservices architecture has become the gold standard for building scalable, maintainable applications. Let's explore how to implement this pattern effectively.

## What Are Microservices?

Microservices are a software development technique—a variant of the service-oriented architecture (SOA) architectural style that structures an application as a collection of loosely coupled services.

### Key Characteristics:
- **Single Responsibility**: Each service has one business capability
- **Decentralized**: Services manage their own data and business logic
- **Technology Agnostic**: Different services can use different technologies
- **Fault Tolerant**: Failure in one service doesn't bring down the entire system

## Architecture Patterns

### 1. API Gateway Pattern
```yaml
# docker-compose.yml example
version: '3.8'
services:
  api-gateway:
    image: nginx:alpine
    ports:
      - ""80:80""
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
  
  user-service:
    build: ./user-service
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/users
  
  order-service:
    build: ./order-service
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/orders
```

### 2. Event-Driven Communication
Services communicate through events rather than direct API calls:

```csharp
// Event publishing example
public class OrderService
{
    private readonly IEventBus _eventBus;

    public async Task CreateOrder(CreateOrderRequest request)
    {
        var order = new Order(request);
        await _repository.SaveAsync(order);

        // Publish event
        await _eventBus.PublishAsync(new OrderCreatedEvent
        {
            OrderId = order.Id,
            UserId = order.UserId,
            Items = order.Items
        });
    }
}
```

## Benefits vs Challenges

### Benefits ✅
- **Scalability**: Scale individual services based on demand
- **Technology Diversity**: Use the right tool for each job
- **Team Autonomy**: Teams can work independently
- **Resilience**: Better fault isolation

### Challenges ⚠️
- **Complexity**: Distributed systems are inherently complex
- **Network Latency**: Inter-service communication overhead
- **Data Consistency**: Managing distributed transactions
- **Monitoring**: Need sophisticated observability tools

## Best Practices

### 1. Start Small
> ""Don't build a microservices architecture from day one. Start with a monolith and extract services as you identify clear boundaries.""

### 2. Database Per Service
Each microservice should have its own database to ensure loose coupling:

- **User Service** → User Database
- **Order Service** → Order Database
- **Inventory Service** → Inventory Database

### 3. Implement Circuit Breakers
```csharp
public class CircuitBreakerService
{
    private readonly CircuitBreaker _circuitBreaker;

    public async Task<T> ExecuteAsync<T>(Func<Task<T>> operation)
    {
        return await _circuitBreaker.ExecuteAsync(operation);
    }
}
```

## Monitoring and Observability

Essential tools for microservices:
- **Distributed Tracing**: Jaeger, Zipkin
- **Metrics**: Prometheus, Grafana
- **Logging**: ELK Stack, Fluentd
- **Health Checks**: Custom endpoints for service health

## Conclusion

Microservices aren't a silver bullet, but when implemented correctly, they can provide significant benefits for large, complex applications. The key is to understand your requirements and gradually evolve your architecture.

Remember: **Start simple, evolve gradually, and always measure the impact of your architectural decisions.**",
                    UserId = adminUserId,
                    CreatedAt = new DateTime(2025, 1, 20),
                    UpdatedAt = new DateTime(2025, 1, 20)
                },
                new Blog
                {
                    Id = 3,
                    Title = "Mastering React Performance Optimization",
                    Summary = "Learn advanced techniques to optimize React applications for better performance and user experience.",
                    Content = @"# Mastering React Performance Optimization

React is fast by default, but as applications grow, performance can become a concern. Let's explore advanced optimization techniques.

## Understanding React's Rendering

### The Virtual DOM
React uses a virtual representation of the DOM to efficiently update the UI:

```jsx
// React creates a virtual DOM tree
const element = (
  <div className=""container"">
    <h1>Hello, {name}!</h1>
    <p>Welcome to our app</p>
  </div>
);
```

### Reconciliation Process
1. **Diffing**: Compare current and previous virtual DOM trees
2. **Update**: Apply only the necessary changes to the real DOM
3. **Commit**: Flush changes to the browser

## Key Optimization Techniques

### 1. Memoization with React.memo
```jsx
const ExpensiveComponent = React.memo(({ data, onClick }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: expensiveCalculation(item)
    }));
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => onClick(item)}>
          {item.processed}
        </div>
      ))}
    </div>
  );
});
```

### 2. useCallback for Function References
```jsx
const ParentComponent = () => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  // Without useCallback, this creates a new function on every render
  const handleItemClick = useCallback((itemId) => {
    console.log('Item clicked:', itemId);
  }, []); // Empty dependency array since it doesn't depend on any values

  const handleAddItem = useCallback(() => {
    setItems(prev => [...prev, { id: Date.now(), name: `Item ${prev.length}` }]);
  }, []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <button onClick={handleAddItem}>Add Item</button>
      <ItemList items={items} onItemClick={handleItemClick} />
    </div>
  );
};
```

## Performance Monitoring

### React DevTools Profiler
Use the Profiler to identify performance bottlenecks:

1. **Record** a user interaction
2. **Analyze** which components re-rendered
3. **Identify** unnecessary renders
4. **Optimize** using the techniques above

## Conclusion

Performance optimization is an ongoing process. Start by measuring, identify bottlenecks, apply optimizations, and measure again. 

> ""Premature optimization is the root of all evil, but timely optimization is the key to great user experience.""

Remember: **Performance is a feature, not an afterthought!** 🚀",
                    UserId = adminUserId,
                    CreatedAt = new DateTime(2025, 1, 25),
                    UpdatedAt = new DateTime(2025, 1, 25)
                },
                new Blog
                {
                    Id = 4,
                    Title = "DevOps Best Practices for Modern Applications",
                    Summary = "Essential DevOps practices, tools, and strategies for building, deploying, and maintaining modern applications.",
                    Content = @"# DevOps Best Practices for Modern Applications

DevOps has transformed how we build, deploy, and maintain software. Let's explore the essential practices that every modern development team should implement.

## The DevOps Philosophy

DevOps is more than just tools—it's a cultural shift that emphasizes:
- **Collaboration** between development and operations teams
- **Automation** of repetitive tasks
- **Continuous Integration** and deployment
- **Monitoring** and feedback loops

### Core Principles
1. **People over Process over Tools**
2. **Continuous Improvement**
3. **Fail Fast, Learn Faster**
4. **Everything as Code**

## CI/CD Pipeline Essentials

### Continuous Integration
```yaml
# GitHub Actions example
name: CI Pipeline
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Build application
      run: npm run build
```

## Infrastructure as Code (IaC)

### Terraform Example
```hcl
# main.tf
provider ""azurerm"" {
  features {}
}

resource ""azurerm_resource_group"" ""main"" {
  name     = ""rg-${var.project_name}-${var.environment}""
  location = var.location
}
```

## Conclusion

DevOps is a journey, not a destination. Start with:

1. **Automate** your build and deployment process
2. **Monitor** everything that matters
3. **Collaborate** across teams
4. **Iterate** and improve continuously

Remember: **Good DevOps practices lead to faster delivery, higher quality, and happier teams!** 🚀✨",
                    UserId = adminUserId,
                    CreatedAt = new DateTime(2025, 1, 28),
                    UpdatedAt = new DateTime(2025, 1, 28)
                },
                new Blog
                {
                    Id = 5,
                    Title = "The Art of Clean Code: Writing Maintainable Software",
                    Summary = "Discover the principles, practices, and patterns that make code clean, readable, and maintainable for long-term success.",
                    Content = @"# The Art of Clean Code: Writing Maintainable Software

Writing code is easy. Writing **clean** code that stands the test of time is an art form. Let's explore the principles that separate good developers from great ones.

## What is Clean Code?

Clean code is code that is easy to read, understand, and modify. It's code that:
- **Expresses intent clearly**
- **Has minimal dependencies**
- **Is well-tested**
- **Follows consistent conventions**

> ""Any fool can write code that a computer can understand. Good programmers write code that humans can understand."" - Martin Fowler

## Core Principles

### 1. Meaningful Names
Names should reveal intent and be pronounceable and searchable.

#### ❌ Bad Example:
```javascript
// What do these variables represent?
const d = new Date();
const u = users.filter(x => x.a > 21);
const calc = (p, r, t) => p * r * t;
```

#### ✅ Good Example:
```javascript
// Clear, descriptive names
const currentDate = new Date();
const adultUsers = users.filter(user => user.age > 21);
const calculateInterest = (principal, rate, time) => principal * rate * time;
```

### 2. Functions Should Do One Thing
Functions should be small and have a single responsibility.

## SOLID Principles

### S - Single Responsibility Principle
A class should have only one reason to change.

```csharp
// ❌ Bad: Multiple responsibilities
public class User
{
    public string Name { get; set; }
    public string Email { get; set; }
    
    public void Save() { /* Database logic */ }
    public void SendEmail() { /* Email logic */ }
    public string GenerateReport() { /* Reporting logic */ }
}

// ✅ Good: Single responsibility
public class User
{
    public string Name { get; set; }
    public string Email { get; set; }
}

public class UserRepository
{
    public void Save(User user) { /* Database logic */ }
}
```

## Conclusion

Clean code is not about following rules blindly—it's about crafting software that:
- **Survives** the test of time
- **Adapts** to changing requirements  
- **Welcomes** new team members
- **Reduces** maintenance costs

### Key Takeaways
1. **Write code for humans**, not just computers
2. **Refactor continuously**—don't let technical debt accumulate
3. **Test everything**—clean code is testable code
4. **Be consistent**—establish and follow team conventions
5. **Keep learning**—clean code practices evolve with experience

> ""The only way to write clean code is to care about the code you write.""

Remember: **Clean code is not written once—it's maintained every day!** 🧹✨",
                    UserId = adminUserId,
                    CreatedAt = new DateTime(2025, 1, 30),
                    UpdatedAt = new DateTime(2025, 1, 30)
                }
            };
        }
    }
}