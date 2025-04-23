```mermaid
flowchart TD
    Client[Cliente] -->|HTTP Request| API[API Gateway]
    
    subgraph AWS
        API -->|Proxy| Lambda[AWS Lambda]
        Lambda -->|Query| DB[(RDS PostgreSQL)]
        Lambda -->|Auth| Cognito[Amazon Cognito]
        Lambda -->|Logs| CloudWatch[CloudWatch Logs]
    end
    
    subgraph "API de Drinks"
        Lambda --> Routes[Rotas]
        Routes --> Middleware[Middlewares]
        Middleware --> Controllers[Controllers]
        Controllers --> Services[Services]
        Services --> Repositories[Repositories]
        Repositories --> Prisma[Prisma Client]
        Prisma --> DB
    end
    
    subgraph "Componentes Auxiliares"
        Controllers --> DTOs[DTOs]
        Services --> ErrorHandling[Tratamento de Erros]
        Services --> Interfaces[Interfaces]
    end
